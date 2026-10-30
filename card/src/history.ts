// The thermostat's history as chart data. No DOM, no Lit.

export interface HistoryState {
  s: string;
  a?: Record<string, unknown>;
  lu: number; // seconds since the epoch
}

export interface Sample {
  t: number; // milliseconds since the epoch
  current: number | null;
  target: number | null;
  heat: boolean; // hvac mode heat (not "the boiler is firing": unknown)
}

export interface Band {
  from: number;
  to: number;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** Samples in time order. Attributes the recorder left out of a state carry
 * over from the previous one, as in the compressed history format. */
export function samples(states: HistoryState[]): Sample[] {
  let current: number | null = null;
  let target: number | null = null;
  return states.map((state) => {
    if (state.a !== undefined) {
      current = num(state.a.current_temperature) ?? (("current_temperature" in state.a) ? null : current);
      target = num(state.a.temperature) ?? (("temperature" in state.a) ? null : target);
    }
    return { t: state.lu * 1000, current, target, heat: state.s === "heat" };
  });
}

/** Once the target is reached the radiators stay hot: the room still rising
 * by this much over the last hour, right after heating, counts as heating.
 * From the tado X's history: its sensor moves in 0.1 °C steps about every
 * 10 minutes (up to 0.2 °C/h of noise); after reaching the target the room
 * kept rising at 0.3-0.8 °C/h for 45-60 minutes. */
export const HEATING_RISE_C_PER_H = 0.3;
export const RISE_WINDOW_MS = 60 * 60_000;

/** The latest sample not after `time`, or null before the first.
 * `points` must be in time order. */
export function sampleAt(points: Sample[], time: number): Sample | null {
  let low = 0;
  let high = points.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (points[mid].t <= time) low = mid + 1;
    else high = mid;
  }
  return low === 0 ? null : points[low - 1];
}

/** How fast the room rose over the hour before `time`, in °C/h; null without
 * a room temperature then or an hour earlier. */
export function riseRate(points: Sample[], time: number): number | null {
  const now = sampleAt(points, time);
  const before = sampleAt(points, time - RISE_WINDOW_MS);
  if (now?.current == null || before?.current == null) return null;
  // Rounded to the hundredth: 19.6 - 19.3 is 0.3000000000000007, 19.3 - 19.0
  // would be 0.29999…; temperatures come in tenths.
  const rise = Math.round((now.current - before.current) * 100) / 100;
  return rise / (RISE_WINDOW_MS / 3_600_000);
}

/** The stretches of time, between `start` and `end`, estimated as heating:
 * in heat mode with the target above the room, or the room still rising at
 * HEATING_RISE_C_PER_H or more right after that (inertia; a rise with no
 * heating before it is the sun or the oven). An estimate: the thermostat does
 * not report when it actually calls for heat. */
export function heatingBands(points: Sample[], start: number, end: number): Band[] {
  // The estimate only changes at a sample, or an hour after one (when it
  // leaves the rise window): between those instants it is constant.
  const instants = [...new Set(points.flatMap((p) => [p.t, p.t + RISE_WINDOW_MS]))]
    .filter((t) => t < end)
    .sort((a, b) => a - b);
  const bands: Band[] = [];
  let heating = false;
  instants.forEach((t, index) => {
    const sample = sampleAt(points, t);
    if (sample === null || !sample.heat || sample.current === null || sample.target === null) {
      heating = false;
      return;
    }
    const rate = riseRate(points, t);
    heating = sample.target > sample.current || (heating && rate !== null && rate >= HEATING_RISE_C_PER_H);
    if (!heating) return;
    const from = Math.max(t, start);
    const to = Math.min(index + 1 < instants.length ? instants[index + 1] : end, end);
    if (to <= from) return;
    const last = bands[bands.length - 1];
    if (last !== undefined && last.to === from) last.to = to;
    else bands.push({ from, to });
  });
  return bands;
}

/** Nice tick values covering [low, high]. */
export function ticks(low: number, high: number, count: number): number[] {
  const raw = (high - low) / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const result: number[] = [];
  for (let value = Math.ceil(low / step) * step; value <= high + 1e-9; value += step) {
    result.push(Math.round(value * 100) / 100);
  }
  return result;
}
