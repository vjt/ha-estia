// Parsing the mode sensor and the timeline arithmetic. No DOM, no Lit.

import {
  MODES,
  type Entities,
  type HassEntity,
  type HomeAssistant,
  type Mode,
  type Profile,
  type Schedule,
  type Slot,
  type Traveller,
  WEEKDAYS,
} from "./types";

export const DAY = 24 * 60;
export const SNAP = 15; // minutes: drag and new-slot granularity

class ScheduleError extends Error {}

function field(attributes: Record<string, unknown>, key: string): unknown {
  if (!(key in attributes)) {
    throw new ScheduleError(`missing attribute ${key}`);
  }
  return attributes[key];
}

function asString(value: unknown, what: string): string {
  if (typeof value !== "string") throw new ScheduleError(`${what} is not a string`);
  return value;
}

function asNumber(value: unknown, what: string): number {
  if (typeof value !== "number") throw new ScheduleError(`${what} is not a number`);
  return value;
}

function asNullableString(value: unknown, what: string): string | null {
  return value === null ? null : asString(value, what);
}

function asArray(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) throw new ScheduleError(`${what} is not a list`);
  return value;
}

function asRecord(value: unknown, what: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ScheduleError(`${what} is not a mapping`);
  }
  return value as Record<string, unknown>;
}

export function parseTime(value: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (match === null) throw new ScheduleError(`bad time ${value}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

export function formatTime(minutes: number): string {
  const hh = Math.floor(minutes / 60) % 24;
  const mm = minutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function parseMode(state: string): Mode | null {
  if (state === "unknown" || state === "unavailable") return null;
  const mode = MODES.find((candidate) => candidate === state);
  if (mode === undefined) throw new ScheduleError(`unknown mode ${state}`);
  return mode;
}

export function parseSchedule(entity: HassEntity): Schedule {
  const a = entity.attributes;
  const profiles: Profile[] = asArray(field(a, "profiles"), "profiles").map((raw, index) => {
    const profile = asRecord(raw, `profile ${index}`);
    const slots: Slot[] = asArray(field(profile, "slots"), `profile ${index} slots`).map((rawSlot) => {
      const slot = asRecord(rawSlot, `profile ${index} slot`);
      return {
        id: asString(field(slot, "id"), "slot id"),
        start: parseTime(asString(field(slot, "start"), "slot start")),
        setpoint: asNumber(field(slot, "setpoint"), "slot setpoint"),
      };
    });
    return {
      id: asString(field(profile, "id"), "profile id"),
      name: asString(field(profile, "name"), "profile name"),
      slots: slots.sort((x, y) => x.start - y.start),
    };
  });
  const week = asArray(field(a, "week"), "week").map((id) => asString(id, "week entry"));
  if (week.length !== WEEKDAYS.length) throw new ScheduleError(`week has ${week.length} days`);
  const todayProfile = asString(field(a, "today_profile"), "today_profile");
  for (const id of [...week, todayProfile]) {
    if (!profiles.some((profile) => profile.id === id)) throw new ScheduleError(`unknown profile ${id}`);
  }
  const proximity: Traveller[] = asArray(field(a, "proximity"), "proximity").map((raw, index) => {
    const pair = asRecord(raw, `proximity ${index}`);
    return {
      distance: asString(field(pair, "distance"), "distance sensor"),
      direction: asString(field(pair, "direction"), "direction sensor"),
      person: asNullableString(field(pair, "person"), "tracked person"),
    };
  });
  const hold = asNullableString(field(a, "hold_until"), "hold_until");
  const boost = asNullableString(field(a, "boost_until"), "boost_until");
  const target = field(a, "target");
  return {
    mode: parseMode(entity.state),
    profiles,
    week,
    todayProfile,
    activeSlot: asNullableString(field(a, "active_slot"), "active_slot"),
    holdUntil: hold === null ? null : new Date(hold),
    boostUntil: boost === null ? null : new Date(boost),
    target: target === null ? null : asNumber(target, "target"),
    configEntryId: asString(field(a, "config_entry_id"), "config_entry_id"),
    climate: asString(field(a, "climate_entity"), "climate_entity"),
    proximity,
    setpointMin: asNumber(field(a, "setpoint_min"), "setpoint_min"),
    setpointMax: asNumber(field(a, "setpoint_max"), "setpoint_max"),
    setpointStep: asNumber(field(a, "setpoint_step"), "setpoint_step"),
  };
}

const ENTITY_KEYS: readonly (keyof Entities)[] = [
  "schedule",
  "boost",
  "preheat",
  "away_setpoint",
  "away_delay",
  "preheat_radius",
  "resume",
  "all_off",
];

/** The mode sensor's sibling entities: same device, Estia platform, keyed by
 * their translation key. */
export function companions(hass: HomeAssistant, modeEntityId: string): Entities {
  const found: Entities = {
    schedule: null,
    boost: null,
    preheat: null,
    away_setpoint: null,
    away_delay: null,
    preheat_radius: null,
    resume: null,
    all_off: null,
  };
  const device = hass.entities[modeEntityId]?.device_id ?? null;
  if (device === null) return found;
  for (const entry of Object.values(hass.entities)) {
    if (entry === undefined || entry.platform !== "estia" || entry.device_id !== device) continue;
    const key = ENTITY_KEYS.find((candidate) => candidate === entry.translation_key);
    if (key !== undefined) found[key] = entry.entity_id;
  }
  return found;
}

export interface Segment {
  slot: Slot;
  from: number; // minutes, inclusive
  to: number; // minutes, exclusive, <= DAY
}

/** The day as coloured segments. The last slot runs past midnight into the
 * first one's start, so it appears twice: at the end and at the start. */
export function segments(slots: Slot[]): Segment[] {
  if (slots.length === 0) return [];
  const sorted = [...slots].sort((x, y) => x.start - y.start);
  const result: Segment[] = [];
  const last = sorted[sorted.length - 1];
  if (sorted[0].start > 0) result.push({ slot: last, from: 0, to: sorted[0].start });
  sorted.forEach((slot, index) => {
    const next = index + 1 < sorted.length ? sorted[index + 1].start : DAY;
    result.push({ slot, from: slot.start, to: next });
  });
  return result.filter((segment) => segment.to > segment.from);
}

/** Where a dragged start may go: strictly between its neighbours, on the grid. */
export function dragBounds(slots: Slot[], id: string): { min: number; max: number } {
  const sorted = [...slots].sort((x, y) => x.start - y.start);
  const index = sorted.findIndex((slot) => slot.id === id);
  if (index < 0) throw new ScheduleError(`no slot ${id}`);
  const min = index > 0 ? sorted[index - 1].start + SNAP : 0;
  const max = index + 1 < sorted.length ? sorted[index + 1].start - SNAP : DAY - SNAP;
  return { min, max };
}

export function snap(minutes: number, bounds: { min: number; max: number }): number {
  const snapped = Math.round(minutes / SNAP) * SNAP;
  return Math.min(bounds.max, Math.max(bounds.min, snapped));
}

/** A start for a new slot: noon if free, else the middle of the longest gap
 * between starts (on the grid). Null when no grid point is free. */
export function newSlotStart(slots: Slot[]): number | null {
  const starts = new Set(slots.map((slot) => slot.start));
  if (!starts.has(12 * 60)) return 12 * 60;
  const sorted = [...starts].sort((x, y) => x - y);
  let bestGap = 0;
  let bestAt: number | null = null;
  for (let index = 0; index < sorted.length; index++) {
    const start = sorted[index];
    const next = index + 1 < sorted.length ? sorted[index + 1] : sorted[0] + DAY;
    const gap = next - start;
    const at = (Math.round((start + gap / 2) / SNAP) * SNAP) % DAY;
    if (gap > SNAP && !starts.has(at) && gap > bestGap) {
      bestGap = gap;
      bestAt = at;
    }
  }
  return bestAt;
}

/** Blue at the low end, through amber, to red at the high end. */
export function setpointColor(setpoint: number, low: number, high: number): string {
  const t = Math.min(1, Math.max(0, (setpoint - low) / (high - low)));
  const hue = 210 - 210 * t; // 210 blue → 0 red
  return `hsl(${hue.toFixed(0)}, 70%, 52%)`;
}

export function minutesNow(now: Date): number {
  return now.getHours() * 60 + now.getMinutes();
}
