// The slice of Home Assistant's frontend API the card uses.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
}

export interface HassEntityRegistryEntry {
  entity_id: string;
  platform: string;
  device_id: string | null;
  translation_key: string | null;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  entities: Record<string, HassEntityRegistryEntry | undefined>;
  language: string;
  callService(domain: string, service: string, data: Record<string, unknown>): Promise<unknown>;
}

export interface CardConfig {
  type: string;
  entity: string;
  title?: string;
}

export type Mode = "home" | "away" | "preheat" | "manual" | "boost" | "paused" | "off";
export const MODES: readonly Mode[] = ["home", "away", "preheat", "manual", "boost", "paused", "off"];

export interface Slot {
  id: string;
  start: number; // minutes after midnight
  setpoint: number;
}

export interface Traveller {
  distance: string;
  direction: string;
}

/** The schedule's other entities, found by device and translation key so
 * that renaming them does not break the card. Null when not registered. */
export interface Entities {
  schedule: string | null;
  boost: string | null;
  preheat: string | null;
  away_setpoint: string | null;
  away_delay: string | null;
  preheat_radius: string | null;
  resume: string | null;
  all_off: string | null;
}

/** The mode sensor, parsed. Anything malformed throws: the card shows the error. */
export interface Schedule {
  mode: Mode | null;
  slots: Slot[];
  activeSlot: string | null;
  holdUntil: Date | null;
  boostUntil: Date | null;
  target: number | null;
  configEntryId: string;
  climate: string;
  proximity: Traveller[];
  setpointMin: number;
  setpointMax: number;
  setpointStep: number;
}
