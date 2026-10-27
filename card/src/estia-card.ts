// estia-card: the Estia heating schedule as a 24 h timeline you can edit.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";

import "./estia-panel";
import { strings } from "./i18n";
import { NativeCards } from "./native";
import {
  DAY,
  companions,
  dragBounds,
  formatTime,
  minutesNow,
  newSlotStart,
  parseSchedule,
  parseTime,
  segments,
  setpointColor,
  snap,
} from "./schedule";
import {
  WEEKDAYS,
  type CardConfig,
  type HassEntity,
  type HomeAssistant,
  type Mode,
  type Profile,
  type Schedule,
  type Slot,
  type Traveller,
} from "./types";

const LONG_PRESS_MS = 550;
const SETPOINT_DEBOUNCE_MS = 900;
// The slider covers the useful heating range; the number box and the
// steppers reach the full setpoint range.
const SLIDER_MIN = 10;
const SLIDER_MAX = 26;
const DOMAIN = "estia";

const MODE_COLORS: Record<Mode, string> = {
  home: "var(--success-color, #43a047)",
  away: "var(--info-color, #039be5)",
  preheat: "var(--warning-color, #ffa600)",
  manual: "var(--accent-color, #ff9800)",
  boost: "var(--error-color, #db4437)",
  paused: "var(--disabled-text-color, #9e9e9e)",
  off: "var(--secondary-text-color, #727272)",
};

interface Drag {
  id: string;
  start: number;
  min: number;
  max: number;
  bar: DOMRect;
}

/** The profile name being typed, for a new profile or a rename. */
interface Naming {
  kind: "add" | "rename";
  value: string;
}

interface PendingSetpoint {
  id: string;
  value: number;
  timer: number;
}

function numberAttr(entity: HassEntity | undefined, key: string): number | null {
  if (entity === undefined) return null;
  const value = entity.attributes[key];
  return typeof value === "number" ? value : null;
}

function stringAttr(entity: HassEntity | undefined, key: string): string | null {
  if (entity === undefined) return null;
  const value = entity.attributes[key];
  return typeof value === "string" ? value : null;
}

/** A proximity distance sensor's value in metres; null when unknown. */
function distanceMeters(entity: HassEntity | undefined): number | null {
  if (entity === undefined) return null;
  const value = Number(entity.state);
  if (entity.state === "" || !Number.isFinite(value)) return null;
  const factor: Record<string, number> = { m: 1, km: 1000, mi: 1609.344, ft: 0.3048, yd: 0.9144 };
  const unit = stringAttr(entity, "unit_of_measurement");
  if (unit === null || !(unit in factor)) return null;
  return value * factor[unit];
}

function percent(minutes: number): string {
  return `${((minutes / DAY) * 100).toFixed(3)}%`;
}

export class EstiaCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _selected: { state: true },
    _drag: { state: true },
    _pending: { state: true },
    _armedDelete: { state: true },
    _error: { state: true },
    _editing: { state: true },
    _profile: { state: true },
    _naming: { state: true },
    _armedProfile: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare _config: CardConfig | undefined;
  declare _selected: string | null;
  declare _drag: Drag | null;
  declare _pending: PendingSetpoint | null;
  declare _armedDelete: string | null;
  declare _error: string | null;
  declare _editing: boolean;
  declare _profile: string | null;
  declare _naming: Naming | null;
  declare _armedProfile: boolean;

  private _clock: number | undefined;
  private readonly _native = new NativeCards(() => this.requestUpdate());
  private _longPress: number | undefined;
  private _longPressed = false;

  constructor() {
    super();
    this.hass = undefined;
    this._config = undefined;
    this._selected = null;
    this._drag = null;
    this._pending = null;
    this._armedDelete = null;
    this._error = null;
    this._editing = false;
    this._profile = null;
    this._naming = null;
    this._armedProfile = false;
  }

  setConfig(config: CardConfig): void {
    if (typeof config.entity !== "string" || !config.entity.startsWith("sensor.")) {
      throw new Error("entity: the Estia mode sensor (sensor.…) is required");
    }
    this._config = config;
  }

  getCardSize(): number {
    return 6;
  }

  static getStubConfig(hass: HomeAssistant): Partial<CardConfig> {
    const sensor = Object.values(hass.entities).find(
      (entry) => entry !== undefined && entry.platform === DOMAIN && entry.entity_id.startsWith("sensor."),
    );
    return sensor === undefined ? {} : { entity: sensor.entity_id };
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Move the "now" marker and the active segment along.
    this._clock = window.setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._clock);
    window.clearTimeout(this._longPress);
    if (this._pending !== null) window.clearTimeout(this._pending.timer);
  }

  protected shouldUpdate(changed: PropertyValues<this>): boolean {
    // Don't redraw the timeline under a finger mid-drag for unrelated states.
    return !(this._drag !== null && changed.size === 1 && changed.has("hass"));
  }

  // -- services ------------------------------------------------------------

  private async _call(domain: string, service: string, data: Record<string, unknown>): Promise<void> {
    if (this.hass === undefined) return;
    this._error = null;
    try {
      await this.hass.callService(domain, service, data);
    } catch (error) {
      // Shown in the card: a rejected edit (e.g. a start time already taken).
      this._error = error instanceof Error ? error.message : String(error);
    }
  }

  /** The profile on display: the one picked, else today's. */
  private _shownProfile(schedule: Schedule): Profile {
    const id = this._profile ?? schedule.todayProfile;
    const profile =
      schedule.profiles.find((candidate) => candidate.id === id) ??
      schedule.profiles.find((candidate) => candidate.id === schedule.todayProfile);
    if (profile === undefined) throw new Error(`unknown profile ${schedule.todayProfile}`);
    return profile;
  }

  private _setSlot(schedule: Schedule, slot: Slot, start: number, setpoint: number): Promise<void> {
    return this._call(DOMAIN, "set_slot", {
      config_entry_id: schedule.configEntryId,
      profile_id: this._shownProfile(schedule).id,
      slot_id: slot.id,
      start: formatTime(start),
      setpoint,
    });
  }

  // -- timeline interaction --------------------------------------------------

  private _onHandleDown(event: PointerEvent, schedule: Schedule, slot: Slot): void {
    event.stopPropagation();
    event.preventDefault();
    const bar = (event.currentTarget as HTMLElement).parentElement;
    if (bar === null) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const bounds = dragBounds(this._shownProfile(schedule).slots, slot.id);
    this._drag = { id: slot.id, start: slot.start, ...bounds, bar: bar.getBoundingClientRect() };
    this._selected = slot.id;
  }

  private _onHandleMove(event: PointerEvent): void {
    const drag = this._drag;
    if (drag === null) return;
    const minutes = ((event.clientX - drag.bar.left) / drag.bar.width) * DAY;
    const start = snap(minutes, drag);
    if (start !== drag.start) this._drag = { ...drag, start };
  }

  private async _onHandleUp(schedule: Schedule): Promise<void> {
    const drag = this._drag;
    if (drag === null) return;
    const slot = this._shownProfile(schedule).slots.find((candidate) => candidate.id === drag.id);
    if (slot !== undefined && drag.start !== slot.start) {
      await this._setSlot(schedule, slot, drag.start, slot.setpoint);
    }
    this._drag = null;
  }

  private _onSegmentDown(slot: Slot): void {
    this._longPressed = false;
    window.clearTimeout(this._longPress);
    this._longPress = window.setTimeout(() => {
      this._longPressed = true;
      this._selected = slot.id;
      this._armedDelete = slot.id;
    }, LONG_PRESS_MS);
  }

  private _onSegmentUp(slot: Slot): void {
    window.clearTimeout(this._longPress);
    if (this._longPressed) return;
    this._armedDelete = null;
    this._selected = this._selected === slot.id ? null : slot.id;
  }

  // -- editor ----------------------------------------------------------------

  /** The setpoint shown for a slot: the pending edit, if any. */
  private _shown(slot: Slot): number {
    return this._pending?.id === slot.id ? this._pending.value : slot.setpoint;
  }

  /** Show `value` at once, save it once the user stops changing it. */
  private _setPending(schedule: Schedule, slot: Slot, raw: number): void {
    if (!Number.isFinite(raw)) return;
    const rounded = Math.round(raw * 10) / 10;
    const value = Math.min(schedule.setpointMax, Math.max(schedule.setpointMin, rounded));
    if (this._pending !== null) window.clearTimeout(this._pending.timer);
    const timer = window.setTimeout(async () => {
      this._pending = null;
      await this._setSlot(schedule, slot, slot.start, value);
    }, SETPOINT_DEBOUNCE_MS);
    this._pending = { id: slot.id, value, timer };
  }

  private _step(schedule: Schedule, slot: Slot, direction: 1 | -1): void {
    this._setPending(schedule, slot, this._shown(slot) + direction * schedule.setpointStep);
  }

  private _onWheel(event: WheelEvent, schedule: Schedule, slot: Slot): void {
    event.preventDefault();
    this._step(schedule, slot, event.deltaY < 0 ? 1 : -1);
  }


  private async _onStartInput(event: Event, schedule: Schedule, slot: Slot): Promise<void> {
    const value = (event.target as HTMLInputElement).value;
    if (value === "") return;
    await this._setSlot(schedule, slot, parseTime(value.slice(0, 5)), slot.setpoint);
  }

  private async _delete(schedule: Schedule, slot: Slot): Promise<void> {
    if (this._armedDelete !== slot.id) {
      this._armedDelete = slot.id;
      return;
    }
    this._armedDelete = null;
    this._selected = null;
    await this._call(DOMAIN, "remove_slot", {
      config_entry_id: schedule.configEntryId,
      profile_id: this._shownProfile(schedule).id,
      slot_id: slot.id,
    });
  }

  private async _add(schedule: Schedule, climate: HassEntity | undefined): Promise<void> {
    const start = newSlotStart(this._shownProfile(schedule).slots);
    if (start === null) {
      this._error = strings(this.hass?.language ?? "en").full;
      return;
    }
    const setpoint = numberAttr(climate, "temperature") ?? schedule.target ?? schedule.setpointMin;
    await this._call(DOMAIN, "add_slot", {
      config_entry_id: schedule.configEntryId,
      profile_id: this._shownProfile(schedule).id,
      start: formatTime(start),
      setpoint,
    });
  }

  // -- profiles --------------------------------------------------------------

  private _pickProfile(id: string): void {
    this._profile = id;
    this._selected = null;
    this._armedDelete = null;
    this._armedProfile = false;
    this._naming = null;
  }

  private async _assignDay(schedule: Schedule, day: string): Promise<void> {
    await this._call(DOMAIN, "assign_day", {
      config_entry_id: schedule.configEntryId,
      profile_id: this._shownProfile(schedule).id,
      day,
    });
  }

  private async _saveName(schedule: Schedule, naming: Naming): Promise<void> {
    const name = naming.value.trim();
    if (name === "") return;
    const profile = this._shownProfile(schedule);
    this._naming = null;
    if (naming.kind === "rename") {
      await this._call(DOMAIN, "rename_profile", {
        config_entry_id: schedule.configEntryId,
        profile_id: profile.id,
        name,
      });
      return;
    }
    await this._call(DOMAIN, "add_profile", {
      config_entry_id: schedule.configEntryId,
      name,
      copy_from: profile.id,
    });
  }

  private async _deleteProfile(schedule: Schedule): Promise<void> {
    if (!this._armedProfile) {
      this._armedProfile = true;
      return;
    }
    const id = this._shownProfile(schedule).id;
    this._armedProfile = false;
    this._profile = null;
    this._selected = null;
    await this._call(DOMAIN, "remove_profile", { config_entry_id: schedule.configEntryId, profile_id: id });
  }

  // -- rendering -------------------------------------------------------------

  protected render(): TemplateResult | typeof nothing {
    if (this.hass === undefined || this._config === undefined) return nothing;
    const t = strings(this.hass.language);
    const entity = this.hass.states[this._config.entity];
    if (entity === undefined || entity.state === "unavailable") {
      return html`<ha-card><div class="message">${t.unavailable}: ${this._config.entity}</div></ha-card>`;
    }
    let schedule: Schedule;
    try {
      schedule = parseSchedule(entity);
    } catch (error) {
      return html`<ha-card><div class="message error">${this._config.entity}: ${String(error)}</div></ha-card>`;
    }
    const climate = this.hass.states[schedule.climate];
    const profile = this._shownProfile(schedule);
    const slots = this._withDrag(profile.slots);
    const selected = this._editing ? slots.find((slot) => slot.id === this._selected) : undefined;
    return html`
      <ha-card>
        ${this._renderHeader(schedule, climate, t)} ${this._renderActions(schedule, t)}
        ${this._error === null ? nothing : html`<div class="message error">${this._error}</div>`}
      </ha-card>
      <ha-card>
        <div class="settings-head">
          <span class="section">${t.settings}</span>
          <button class=${this._editing ? "primary" : ""} @click=${() => this._toggleEditing()}>
            ${this._editing ? t.done : t.edit}
          </button>
        </div>
        ${this._renderProfiles(schedule, profile, t)} ${this._renderWeek(schedule, profile, t)}
        ${this._renderTimeline(schedule, slots, profile.id === schedule.todayProfile, t)}
        ${selected === undefined ? nothing : this._renderEditor(schedule, selected, t)}
        ${this._editing ? nothing : this._renderSummary(schedule, t)}
      </ha-card>
      ${this._editing ? this._renderControls(t) : nothing}
    `;
  }

  private _toggleEditing(): void {
    this._editing = !this._editing;
    this._selected = null;
    this._armedDelete = null;
    this._armedProfile = false;
    this._naming = null;
  }

  /** Slots with the one being dragged at its provisional start. */
  private _withDrag(slots: Slot[]): Slot[] {
    const drag = this._drag;
    if (drag === null) return slots;
    return slots.map((slot) => (slot.id === drag.id ? { ...slot, start: drag.start } : slot));
  }

  private _renderHeader(
    schedule: Schedule,
    climate: HassEntity | undefined,
    t: ReturnType<typeof strings>,
  ): TemplateResult {
    const title = this._config?.title ?? stringAttr(climate, "friendly_name") ?? schedule.climate;
    const mode = schedule.mode;
    return html`
      <div class="header">
        <div class="title">${title}</div>
        ${mode === null
          ? nothing
          : html`<span class="badge" style="background:${MODE_COLORS[mode]}">${t.modes[mode]}</span>`}
      </div>
      ${mode === "boost" && schedule.boostUntil !== null
        ? html`<div class="hold"><span>${t.boostUntil(formatTime(minutesNow(schedule.boostUntil)))}</span></div>`
        : nothing}
      ${mode === "manual" && schedule.holdUntil !== null
        ? html`<div class="hold">
            <span>${t.manualUntil(formatTime(minutesNow(schedule.holdUntil)))}</span>
            <button
              class="primary"
              @click=${() => this._call(DOMAIN, "resume", { config_entry_id: schedule.configEntryId })}
            >
              ${t.returnToSchedule}
            </button>
          </div>`
        : nothing}
      ${mode === "paused" ? html`<div class="hold"><span>${t.pausedInfo}</span></div>` : nothing}
      ${mode === "off" ? html`<div class="hold"><span>${t.offInfo}</span></div>` : nothing}
    `;
  }

  /** Scheduled / Boost / Off: one choice, each undoing the others. */
  private _renderActions(schedule: Schedule, t: ReturnType<typeof strings>): TemplateResult | typeof nothing {
    if (this.hass === undefined || this._config === undefined) return nothing;
    const e = companions(this.hass, this._config.entity);
    const mode = schedule.mode;
    const scheduleOn = e.schedule !== null && this.hass.states[e.schedule]?.state === "on";
    const scheduled = scheduleOn && mode !== "boost" && mode !== "off";
    const boosting = mode === "boost";
    const off = mode === "off";
    const action = (
      active: boolean,
      icon: string,
      label: string,
      onClick: () => Promise<void>,
    ): TemplateResult => html`<button class="action ${active ? "active" : ""}" @click=${onClick}>
      <ha-icon .icon=${icon}></ha-icon><span>${label}</span>
    </button>`;
    return html`<div class="actions">
      ${action(scheduled, "mdi:calendar-clock", t.scheduled, async () => {
        if (e.schedule === null) return;
        await this._call("switch", scheduled ? "turn_off" : "turn_on", { entity_id: e.schedule });
      })}
      ${action(boosting, "mdi:fire", t.boost, async () => {
        if (e.boost === null) return;
        await this._call("switch", boosting ? "turn_off" : "turn_on", { entity_id: e.boost });
      })}
      ${action(off, "mdi:power", t.allOff, async () => {
        if (e.all_off === null || off) return;
        await this._call("button", "press", { entity_id: e.all_off });
      })}
    </div>`;
  }

  /** One line per tracked person: home, or how far and which way. */
  private _renderTraveller(pair: Traveller, t: ReturnType<typeof strings>): TemplateResult | typeof nothing {
    const hass = this.hass;
    if (hass === undefined) return nothing;
    const person = pair.person === null ? undefined : hass.states[pair.person];
    const distance = hass.states[pair.distance];
    const direction = hass.states[pair.direction]?.state;
    const name =
      stringAttr(person, "friendly_name") ?? stringAttr(distance, "friendly_name") ?? pair.distance;
    const meters = distanceMeters(distance);
    let icon: string;
    let text: string;
    if (person?.state === "home" || direction === "arrived" || meters === 0) {
      icon = "🏠";
      text = t.travellerHome(name);
    } else if (meters === null) {
      icon = "❔";
      text = t.travellerUnknown(name);
    } else {
      icon = direction === "towards" ? "🚗" : direction === "away_from" ? "🏃" : "📍";
      const km = new Intl.NumberFormat(hass.language, { maximumFractionDigits: 1 }).format(meters / 1000);
      const way = direction === undefined ? "" : (t.directions[direction] ?? direction);
      text = t.travellerAway(name, `${km} km`, way);
    }
    return html`<div class="traveller"><span class="emoji">${icon}</span><span>${text}</span></div>`;
  }

  /** The settings at a glance, while not editing. */
  private _renderSummary(schedule: Schedule, t: ReturnType<typeof strings>): TemplateResult | typeof nothing {
    if (this.hass === undefined || this._config === undefined) return nothing;
    const hass = this.hass;
    const e = companions(hass, this._config.entity);
    const value = (entity: string | null): string =>
      entity === null ? "—" : (hass.states[entity]?.state ?? "—");
    const preheatOn = e.preheat !== null && hass.states[e.preheat]?.state === "on";
    return html`<div class="summary">
      <div>${t.awaySummary(value(e.away_setpoint), value(e.away_delay))}</div>
      <div>${preheatOn ? t.preheatSummary(value(e.preheat_radius)) : t.preheatOff}</div>
      ${preheatOn ? schedule.proximity.map((pair) => this._renderTraveller(pair, t)) : nothing}
    </div>`;
  }

  /** Chips to pick the profile on display; in edit mode, add/rename/delete. */
  private _renderProfiles(schedule: Schedule, shown: Profile, t: ReturnType<typeof strings>): TemplateResult {
    const inUse = schedule.week.includes(shown.id);
    const last = schedule.profiles.length === 1;
    const naming = this._naming;
    return html`
      <div class="chips" role="group" aria-label=${t.profiles}>
        ${schedule.profiles.map(
          (profile) => html`<button
            class="chip ${profile.id === shown.id ? "active" : ""}"
            @click=${() => this._pickProfile(profile.id)}
          >
            ${profile.name}${profile.id === schedule.todayProfile ? html` <span class="dot">●</span>` : nothing}
          </button>`,
        )}
      </div>
      ${this._editing
        ? naming === null
          ? html`<div class="profile-tools">
              <button @click=${() => (this._naming = { kind: "add", value: "" })}>${t.addProfile}</button>
              <button @click=${() => (this._naming = { kind: "rename", value: shown.name })}>
                ${t.renameProfile}
              </button>
              <button
                class="delete ${this._armedProfile ? "armed" : ""}"
                ?disabled=${inUse || last}
                title=${inUse || last ? t.profileInUse : t.deleteProfile}
                @click=${() => this._deleteProfile(schedule)}
              >
                ${this._armedProfile ? t.confirmDelete : t.deleteProfile}
              </button>
            </div>`
          : html`<div class="profile-tools">
              <input
                type="text"
                placeholder=${t.profileName}
                .value=${naming.value}
                @input=${(event: Event) =>
                  (this._naming = { kind: naming.kind, value: (event.target as HTMLInputElement).value })}
              />
              <button class="primary" @click=${() => this._saveName(schedule, naming)}>${t.save}</button>
              <button @click=${() => (this._naming = null)}>${t.cancel}</button>
            </div>`
        : nothing}
    `;
  }

  /** The seven weekdays with the profile each uses; in edit mode, tapping a
   * day gives it the profile on display. */
  private _renderWeek(schedule: Schedule, shown: Profile, t: ReturnType<typeof strings>): TemplateResult {
    const language = this.hass?.language ?? "en";
    const format = new Intl.DateTimeFormat(language, { weekday: "short" });
    const today = (new Date().getDay() + 6) % 7; // Date counts from Sunday
    return html`<div class="chips week" role="group" aria-label=${t.days}>
      ${WEEKDAYS.map((day, index) => {
        const id = schedule.week[index];
        const profile = schedule.profiles.find((candidate) => candidate.id === id);
        if (profile === undefined) throw new Error(`unknown profile ${id}`);
        // 2026-10-26 is a Monday.
        const label = format.format(new Date(2026, 9, 26 + index));
        return html`<button
          class="chip day ${id === shown.id ? "active" : ""} ${index === today ? "today" : ""}"
          ?disabled=${!this._editing}
          title=${index === today ? `${label} (${t.today})` : label}
          @click=${this._editing ? () => this._assignDay(schedule, day) : nothing}
        >
          <span class="day-name">${label}</span>
          <span class="day-profile">${profile.name}</span>
        </button>`;
      })}
    </div>`;
  }

  private _renderTimeline(
    schedule: Schedule,
    slots: Slot[],
    isToday: boolean,
    t: ReturnType<typeof strings>,
  ): TemplateResult {
    // Read-only unless editing: no listeners and no touch capture, so a
    // finger on the bar scrolls the page like anywhere else.
    const editing = this._editing;
    const now = minutesNow(new Date());
    const low = Math.min(...slots.map((slot) => slot.setpoint), 16);
    const high = Math.max(...slots.map((slot) => slot.setpoint), 23);
    return html`
      <div class="timeline ${this._editing ? "editing" : ""}">
        <div class="bar">
          ${slots.length === 0 ? html`<div class="empty">${t.noSlots}</div>` : nothing}
          ${segments(slots).map((segment) => {
            const slot = segment.slot;
            const active = isToday && slot.id === schedule.activeSlot;
            const pending = this._shown(slot);
            return html`<div
              class="segment ${active ? "active" : ""} ${slot.id === this._selected ? "selected" : ""}"
              style="left:${percent(segment.from)};width:${percent(segment.to - segment.from)};background:${setpointColor(pending, low, high)}"
              @pointerdown=${editing ? () => this._onSegmentDown(slot) : nothing}
              @pointerup=${editing ? () => this._onSegmentUp(slot) : nothing}
              @pointerleave=${editing ? () => window.clearTimeout(this._longPress) : nothing}
              @contextmenu=${editing ? (event: Event) => event.preventDefault() : nothing}
            >
              ${segment.to - segment.from >= 100 ? html`<span>${pending.toFixed(1)}°</span>` : nothing}
            </div>`;
          })}
          ${(this._editing ? slots : []).map(
            (slot) => html`<div
              class="handle ${this._drag?.id === slot.id ? "dragging" : ""}"
              style="left:${percent(slot.start)}"
              title=${formatTime(slot.start)}
              @pointerdown=${(event: PointerEvent) => this._onHandleDown(event, schedule, slot)}
              @pointermove=${(event: PointerEvent) => this._onHandleMove(event)}
              @pointerup=${() => this._onHandleUp(schedule)}
              @pointercancel=${() => (this._drag = null)}
            >
              ${this._drag?.id === slot.id ? html`<span class="tip">${formatTime(slot.start)}</span>` : nothing}
            </div>`,
          )}
          ${isToday ? html`<div class="now" style="left:${percent(now)}"></div>` : nothing}
        </div>
        <div class="ticks">
          ${[0, 6, 12, 18, 24].map((hour) => html`<span style="left:${percent(hour * 60)}">${hour}</span>`)}
        </div>
        ${this._editing
          ? html`<button
              class="add"
              title=${t.addSlot}
              @click=${() => this._add(schedule, this.hass?.states[schedule.climate])}
            >
              +
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderEditor(schedule: Schedule, slot: Slot, t: ReturnType<typeof strings>): TemplateResult {
    const value = this._shown(slot);
    const armed = this._armedDelete === slot.id;
    return html`
      <div class="editor">
        <label>
          <span class="label">${t.start}</span>
          <input
            type="time"
            step="900"
            .value=${formatTime(slot.start)}
            @change=${(event: Event) => this._onStartInput(event, schedule, slot)}
          />
        </label>
        <div class="setpoint" @wheel=${(event: WheelEvent) => this._onWheel(event, schedule, slot)}>
          <div class="stepper">
            <span class="label">${t.setpoint}</span>
            <button @click=${() => this._step(schedule, slot, -1)}>−</button>
            <input
              class="value"
              type="number"
              inputmode="decimal"
              min=${schedule.setpointMin}
              max=${schedule.setpointMax}
              step=${schedule.setpointStep}
              .value=${value.toFixed(1)}
              @change=${(event: Event) =>
                this._setPending(schedule, slot, Number((event.target as HTMLInputElement).value))}
            />
            <span class="big">°</span>
            <button @click=${() => this._step(schedule, slot, 1)}>+</button>
          </div>
          <input
            class="slider"
            type="range"
            min=${SLIDER_MIN}
            max=${SLIDER_MAX}
            step=${schedule.setpointStep}
            .value=${String(value)}
            @input=${(event: Event) =>
              this._setPending(schedule, slot, Number((event.target as HTMLInputElement).value))}
          />
        </div>
        <button class="delete ${armed ? "armed" : ""}" @click=${() => this._delete(schedule, slot)}>
          ${armed ? t.confirmDelete : t.deleteSlot}
        </button>
      </div>
    `;
  }

  /** The schedule's knobs as Home Assistant's own entities card: native
   * switches, number boxes and the travellers' proximity sensors. */
  private _renderControls(t: ReturnType<typeof strings>): TemplateResult | typeof nothing {
    if (this.hass === undefined || this._config === undefined) return nothing;
    const e = companions(this.hass, this._config.entity);
    const row = (entity: string | null, name: string): Record<string, unknown>[] =>
      entity === null ? [] : [{ entity, name }];
    const rows: Record<string, unknown>[] = [
      ...row(e.away_setpoint, t.awaySetpoint),
      ...row(e.away_delay, t.awayDelay),
      ...row(e.preheat, t.preheat),
      // The radius only matters while preheat is on.
      ...row(e.preheat_radius, t.preheatRadius).map((preheatRow) =>
        e.preheat === null
          ? preheatRow
          : {
              type: "conditional",
              conditions: [{ condition: "state", entity: e.preheat, state: "on" }],
              row: preheatRow,
            },
      ),
    ];
    const card = this._native.get({ type: "entities", entities: rows }, this.hass);
    return card === null ? nothing : html`<div class="controls">${card}</div>`;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      --estia-radius: var(--ha-card-border-radius, 12px);
    }
    ha-card {
      padding: 20px;
      color: var(--primary-text-color);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .title {
      font-size: 1.4em;
      font-weight: 500;
    }
    .badge {
      color: var(--text-primary-color, #fff);
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 1em;
      font-weight: 500;
      white-space: nowrap;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .label {
      color: var(--secondary-text-color);
      font-size: 0.95em;
    }
    .big {
      font-size: 2em;
      font-variant-numeric: tabular-nums;
    }
    .hold {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      margin-top: 16px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
      font-size: 1.05em;
    }
    .timeline {
      position: relative;
      padding: 24px 0 4px 0;
    }
    .timeline.editing {
      padding-right: 60px;
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 16px;
    }
    .action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-height: 72px;
      border-radius: 14px;
      font-size: 1em;
      font-weight: 500;
      border: 2px solid transparent;
    }
    .action.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .settings-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .section {
      font-size: 1.2em;
      font-weight: 500;
    }
    .summary {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 12px;
      font-size: 1em;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .chip {
      min-height: 40px;
      border: 2px solid transparent;
    }
    .chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .chip .dot {
      font-size: 0.6em;
      vertical-align: middle;
    }
    .week {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 2px;
      border-radius: 12px;
      min-width: 0;
    }
    .day:disabled {
      cursor: default;
      opacity: 1;
    }
    .day.today .day-name {
      text-decoration: underline;
    }
    .day-name {
      font-weight: 500;
    }
    .day-profile {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.8em;
    }
    .profile-tools {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }
    .profile-tools input {
      flex: 1 1 160px;
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .secondary {
      color: var(--secondary-text-color);
    }
    .traveller {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .emoji {
      font-size: 1.3em;
      width: 1.4em;
      text-align: center;
    }
    .bar {
      position: relative;
      height: 72px;
      border-radius: 10px;
      background: var(--secondary-background-color);
    }
    .timeline.editing .bar {
      touch-action: none;
      user-select: none;
    }
    .segment {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.05em;
      font-weight: 500;
      opacity: 0.8;
      box-sizing: border-box;
    }
    .timeline.editing .segment {
      cursor: pointer;
    }
    .segment.active {
      opacity: 1;
      box-shadow: inset 0 0 0 3px var(--primary-text-color);
    }
    .segment.selected {
      box-shadow: inset 0 0 0 4px var(--primary-color);
    }
    .handle {
      position: absolute;
      top: -10px;
      bottom: -10px;
      width: 28px;
      margin-left: -14px;
      cursor: ew-resize;
      z-index: 2;
    }
    .handle::after {
      content: "";
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: 2px;
      background: var(--card-background-color, #fff);
    }
    .handle.dragging::after {
      background: var(--primary-color);
    }
    .tip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      border-radius: 6px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.95em;
      white-space: nowrap;
    }
    .now {
      position: absolute;
      top: -6px;
      bottom: -6px;
      width: 3px;
      margin-left: -1px;
      background: var(--error-color, #db4437);
      pointer-events: none;
      z-index: 3;
    }
    .ticks {
      position: relative;
      height: 20px;
      margin-top: 8px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .ticks span {
      position: absolute;
      transform: translateX(-50%);
    }
    .empty {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }
    button {
      font: inherit;
      min-height: 44px;
      border: none;
      border-radius: 999px;
      padding: 8px 18px;
      cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button.delete.armed {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .add {
      position: absolute;
      right: 0;
      top: 24px;
      width: 48px;
      height: 72px;
      padding: 0;
      font-size: 1.8em;
      border-radius: 10px;
    }
    .editor {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px 28px;
      margin-top: 16px;
      padding: 16px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
    }
    .editor label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .setpoint {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1 1 280px;
    }
    .value {
      width: 4.2em;
      font-size: 1.6em;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .slider {
      width: 100%;
      min-height: 32px;
      padding: 0;
      border: none;
      background: none;
      accent-color: var(--primary-color);
    }
    .stepper button {
      width: 48px;
      height: 48px;
      padding: 0;
      font-size: 1.5em;
      background: var(--card-background-color);
    }
    input {
      font: inherit;
      font-size: 1.15em;
      min-height: 44px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 6px 10px;
    }
    .message {
      padding: 8px 0;
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `;
}

// Guarded: the panel and the dashboards load the same module, and a user may
// also have added it as a resource by hand.
if (customElements.get("estia-card") === undefined) {
  customElements.define("estia-card", EstiaCard);
}

declare global {
  interface Window {
    customCards?: { type: string; name: string; description: string; preview: boolean }[];
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "estia-card",
  name: "Estia",
  description: "Heating schedule: 24 h timeline with drag-to-edit slots",
  preview: false,
});
