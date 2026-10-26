// estia-card: the Estia heating schedule as a 24 h timeline you can edit.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";

import "./estia-panel";
import { strings } from "./i18n";
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
import type { CardConfig, HassEntity, HomeAssistant, Mode, Schedule, Slot } from "./types";

const LONG_PRESS_MS = 550;
const SETPOINT_DEBOUNCE_MS = 900;
const DOMAIN = "estia";

const MODE_COLORS: Record<Mode, string> = {
  home: "var(--success-color, #43a047)",
  away: "var(--info-color, #039be5)",
  preheat: "var(--warning-color, #ffa600)",
  manual: "var(--accent-color, #ff9800)",
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
  };

  declare hass: HomeAssistant | undefined;
  declare _config: CardConfig | undefined;
  declare _selected: string | null;
  declare _drag: Drag | null;
  declare _pending: PendingSetpoint | null;
  declare _armedDelete: string | null;
  declare _error: string | null;

  private _clock: number | undefined;
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

  private _setSlot(schedule: Schedule, slot: Slot, start: number, setpoint: number): Promise<void> {
    return this._call(DOMAIN, "set_slot", {
      config_entry_id: schedule.configEntryId,
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
    const bounds = dragBounds(schedule.slots, slot.id);
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
    const slot = schedule.slots.find((candidate) => candidate.id === drag.id);
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

  private _step(schedule: Schedule, slot: Slot, direction: 1 | -1): void {
    const current = this._pending?.id === slot.id ? this._pending.value : slot.setpoint;
    const stepped = Math.round((current + direction * schedule.setpointStep) * 10) / 10;
    const value = Math.min(schedule.setpointMax, Math.max(schedule.setpointMin, stepped));
    if (this._pending !== null) window.clearTimeout(this._pending.timer);
    const timer = window.setTimeout(async () => {
      this._pending = null;
      await this._setSlot(schedule, slot, slot.start, value);
    }, SETPOINT_DEBOUNCE_MS);
    this._pending = { id: slot.id, value, timer };
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
      slot_id: slot.id,
    });
  }

  private async _add(schedule: Schedule, climate: HassEntity | undefined): Promise<void> {
    const start = newSlotStart(schedule.slots);
    if (start === null) {
      this._error = strings(this.hass?.language ?? "en").full;
      return;
    }
    const setpoint = numberAttr(climate, "temperature") ?? schedule.target ?? schedule.setpointMin;
    await this._call(DOMAIN, "add_slot", {
      config_entry_id: schedule.configEntryId,
      start: formatTime(start),
      setpoint,
    });
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
    const slots = this._withDrag(schedule.slots);
    const selected = slots.find((slot) => slot.id === this._selected);
    return html`
      <ha-card>
        ${this._renderHeader(schedule, climate, t)} ${this._renderTimeline(schedule, slots, t)}
        ${selected === undefined ? nothing : this._renderEditor(schedule, selected, t)}
        ${this._error === null ? nothing : html`<div class="message error">${this._error}</div>`}
        ${this._renderControls(schedule, t)}
      </ha-card>
    `;
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
    const current = numberAttr(climate, "current_temperature");
    const target = numberAttr(climate, "temperature");
    const mode = schedule.mode;
    return html`
      <div class="header">
        <div class="title">${title}</div>
        ${mode === null
          ? nothing
          : html`<span class="badge" style="background:${MODE_COLORS[mode]}">${t.modes[mode]}</span>`}
      </div>
      <div class="temps">
        <div><span class="label">${t.current}</span><span class="big">${current === null ? "—" : `${current.toFixed(1)}°`}</span></div>
        <div><span class="label">${t.target}</span><span class="big">${target === null ? "—" : `${target.toFixed(1)}°`}</span></div>
      </div>
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
    `;
  }

  private _renderTimeline(schedule: Schedule, slots: Slot[], t: ReturnType<typeof strings>): TemplateResult {
    const now = minutesNow(new Date());
    const low = Math.min(...slots.map((slot) => slot.setpoint), 16);
    const high = Math.max(...slots.map((slot) => slot.setpoint), 23);
    return html`
      <div class="timeline">
        <div class="bar">
          ${slots.length === 0 ? html`<div class="empty">${t.noSlots}</div>` : nothing}
          ${segments(slots).map((segment) => {
            const slot = segment.slot;
            const active = slot.id === schedule.activeSlot;
            const pending = this._pending?.id === slot.id ? this._pending.value : slot.setpoint;
            return html`<div
              class="segment ${active ? "active" : ""} ${slot.id === this._selected ? "selected" : ""}"
              style="left:${percent(segment.from)};width:${percent(segment.to - segment.from)};background:${setpointColor(pending, low, high)}"
              @pointerdown=${() => this._onSegmentDown(slot)}
              @pointerup=${() => this._onSegmentUp(slot)}
              @pointerleave=${() => window.clearTimeout(this._longPress)}
              @contextmenu=${(event: Event) => event.preventDefault()}
            >
              ${segment.to - segment.from >= 120 ? html`<span>${pending.toFixed(1)}°</span>` : nothing}
            </div>`;
          })}
          ${slots.map(
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
          <div class="now" style="left:${percent(now)}"></div>
        </div>
        <div class="ticks">
          ${[0, 6, 12, 18, 24].map((hour) => html`<span style="left:${percent(hour * 60)}">${hour}</span>`)}
        </div>
        <button class="add" title=${t.addSlot} @click=${() => this._add(schedule, this.hass?.states[schedule.climate])}>
          +
        </button>
      </div>
    `;
  }

  private _renderEditor(schedule: Schedule, slot: Slot, t: ReturnType<typeof strings>): TemplateResult {
    const value = this._pending?.id === slot.id ? this._pending.value : slot.setpoint;
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
        <div class="stepper">
          <span class="label">${t.setpoint}</span>
          <button @click=${() => this._step(schedule, slot, -1)}>−</button>
          <span class="big">${value.toFixed(1)}°</span>
          <button @click=${() => this._step(schedule, slot, 1)}>+</button>
        </div>
        <button class="delete ${armed ? "armed" : ""}" @click=${() => this._delete(schedule, slot)}>
          ${armed ? t.confirmDelete : t.deleteSlot}
        </button>
      </div>
    `;
  }

  private _renderControls(schedule: Schedule, t: ReturnType<typeof strings>): TemplateResult {
    if (this.hass === undefined || this._config === undefined) return html``;
    const entities = companions(this.hass, this._config.entity);
    return html`
      <div class="controls">
        <div class="row">
          ${this._renderToggle(entities.schedule, t.schedule)}
          ${entities.all_off === null
            ? nothing
            : html`<button
                class="danger"
                @click=${() => this._call("button", "press", { entity_id: entities.all_off })}
              >
                ${t.allOff}
              </button>`}
        </div>
        <div class="row">${this._renderToggle(entities.preheat, t.preheat)}</div>
        ${this._renderNumber(entities.away_setpoint, t.awaySetpoint)}
        ${this._renderNumber(entities.away_delay, t.awayDelay)}
        ${this._renderNumber(entities.preheat_radius, t.preheatRadius)}
        ${schedule.proximity.map((pair) => this._renderTraveller(pair.distance, pair.direction, t))}
      </div>
    `;
  }

  private _renderToggle(entityId: string | null, label: string): TemplateResult | typeof nothing {
    if (entityId === null || this.hass === undefined) return nothing;
    const on = this.hass.states[entityId]?.state === "on";
    return html`<label class="toggle">
      <input
        type="checkbox"
        role="switch"
        .checked=${on}
        @change=${(event: Event) =>
          this._call("switch", (event.target as HTMLInputElement).checked ? "turn_on" : "turn_off", {
            entity_id: entityId,
          })}
      />
      <span>${label}</span>
    </label>`;
  }

  private _renderNumber(entityId: string | null, label: string): TemplateResult | typeof nothing {
    if (entityId === null || this.hass === undefined) return nothing;
    const entity = this.hass.states[entityId];
    if (entity === undefined) return nothing;
    const unit = stringAttr(entity, "unit_of_measurement") ?? "";
    return html`<label class="number">
      <span>${label}</span>
      <span>
        <input
          type="number"
          .value=${entity.state}
          min=${numberAttr(entity, "min") ?? 0}
          max=${numberAttr(entity, "max") ?? 100}
          step=${numberAttr(entity, "step") ?? 1}
          @change=${(event: Event) =>
            this._call("number", "set_value", {
              entity_id: entityId,
              value: Number((event.target as HTMLInputElement).value),
            })}
        />
        ${unit}
      </span>
    </label>`;
  }

  private _renderTraveller(distanceId: string, directionId: string, t: ReturnType<typeof strings>): TemplateResult {
    const distance = this.hass?.states[distanceId];
    const direction = this.hass?.states[directionId];
    const name = stringAttr(distance, "friendly_name") ?? distanceId;
    const unit = stringAttr(distance, "unit_of_measurement") ?? "";
    const where = direction === undefined ? "" : (t.directions[direction.state] ?? direction.state);
    return html`<div class="traveller">
      <span>${name}</span>
      <span class="secondary">${distance === undefined ? "—" : `${distance.state} ${unit}`} · ${where}</span>
    </div>`;
  }

  static styles = css`
    :host {
      --estia-radius: var(--ha-card-border-radius, 12px);
    }
    ha-card {
      padding: 16px;
      color: var(--primary-text-color);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .title {
      font-size: 1.2em;
      font-weight: 500;
    }
    .badge {
      color: var(--text-primary-color, #fff);
      border-radius: 999px;
      padding: 2px 10px;
      font-size: 0.85em;
      white-space: nowrap;
    }
    .temps {
      display: flex;
      gap: 24px;
      margin: 8px 0;
    }
    .temps div,
    .stepper {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .label,
    .secondary {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .big {
      font-size: 1.5em;
      font-variant-numeric: tabular-nums;
    }
    .hold {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
    }
    .timeline {
      position: relative;
      padding: 18px 40px 4px 0;
    }
    .bar {
      position: relative;
      height: 48px;
      border-radius: 8px;
      background: var(--secondary-background-color);
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
      font-size: 0.85em;
      cursor: pointer;
      opacity: 0.8;
      box-sizing: border-box;
    }
    .segment.active {
      opacity: 1;
      box-shadow: inset 0 0 0 2px var(--primary-text-color);
    }
    .segment.selected {
      box-shadow: inset 0 0 0 3px var(--primary-color);
    }
    .segment:first-of-type {
      border-radius: 8px 0 0 8px;
    }
    .handle {
      position: absolute;
      top: -6px;
      bottom: -6px;
      width: 16px;
      margin-left: -8px;
      cursor: ew-resize;
      z-index: 2;
    }
    .handle::after {
      content: "";
      position: absolute;
      left: 7px;
      top: 0;
      bottom: 0;
      width: 2px;
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
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.8em;
    }
    .now {
      position: absolute;
      top: -4px;
      bottom: -4px;
      width: 2px;
      margin-left: -1px;
      background: var(--error-color, #db4437);
      pointer-events: none;
      z-index: 3;
    }
    .ticks {
      position: relative;
      height: 16px;
      margin-top: 6px;
      color: var(--secondary-text-color);
      font-size: 0.75em;
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
      border: none;
      border-radius: 999px;
      padding: 6px 14px;
      cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button.danger,
    button.delete.armed {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .add {
      position: absolute;
      right: 0;
      top: 18px;
      width: 32px;
      height: 48px;
      padding: 0;
      font-size: 1.4em;
      border-radius: 8px;
    }
    .editor {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 20px;
      margin-top: 12px;
      padding: 12px;
      border-radius: var(--estia-radius);
      background: var(--secondary-background-color);
    }
    .editor label {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .stepper button {
      width: 36px;
      height: 36px;
      padding: 0;
      font-size: 1.2em;
      background: var(--card-background-color);
    }
    input {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 4px 6px;
    }
    input[type="number"] {
      width: 5em;
    }
    .controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color);
    }
    .row,
    .number,
    .traveller {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .toggle input {
      accent-color: var(--primary-color);
      width: 18px;
      height: 18px;
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
