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

/** Whether the thermostat is probably heating: in heat mode with the target
 * above the room temperature. An estimate: the thermostat does not report
 * when it actually calls for heat. */
export function probablyHeating(sample: Sample): boolean {
  return sample.heat && sample.current !== null && sample.target !== null && sample.target > sample.current;
}

/** The stretches of time, between `start` and `end`, estimated as heating. */
export function heatingBands(points: Sample[], start: number, end: number): Band[] {
  const bands: Band[] = [];
  points.forEach((sample, index) => {
    if (!probablyHeating(sample)) return;
    const from = Math.max(sample.t, start);
    const to = Math.min(index + 1 < points.length ? points[index + 1].t : end, end);
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
