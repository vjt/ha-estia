// estia-history: room and target temperature over a period, with a band
// where the heating was probably on (heat mode, target above the room, or the
// room still rising right after: see heatingBands).

import { LitElement, css, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";

import { RISE_WINDOW_MS, heatingBands, sampleAt, samples, ticks, type HistoryState, type Sample } from "./history";
import { strings } from "./i18n";
import type { HomeAssistant } from "./types";

const HEIGHT = 240;
const PAD = { left: 36, right: 12, top: 12, bottom: 28 };
const REFRESH_MS = 5 * 60_000;

export class EstiaHistory extends LitElement {
  static properties = {
    hass: { attribute: false },
    entity: { attribute: false },
    hours: { attribute: false },
    _points: { state: true },
    _width: { state: true },
    _hover: { state: true },
    _error: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare entity: string | undefined;
  declare hours: number;
  declare _points: Sample[] | null;
  declare _width: number;
  declare _hover: number | null;
  declare _error: string | null;

  private _timer: number | undefined;
  private _resize: ResizeObserver | null = null;
  private _loaded = "";

  constructor() {
    super();
    this.hass = undefined;
    this.entity = undefined;
    this.hours = 24;
    this._points = null;
    this._width = 0;
    this._hover = null;
    this._error = null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._timer = window.setInterval(() => void this._load(), REFRESH_MS);
    this._resize = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (Math.abs(width - this._width) > 1) this._width = width;
    });
    this._resize.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
    this._resize?.disconnect();
  }

  protected updated(changed: PropertyValues<this>): void {
    const key = `${this.entity ?? ""}:${this.hours}`;
    if ((changed.has("hours") || changed.has("entity") || changed.has("hass")) && key !== this._loaded) {
      this._loaded = key;
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    if (this.hass === undefined || this.entity === undefined) return;
    // An hour more than shown: the heating estimate at the left edge looks back
    // over the rise window.
    const start = new Date(Date.now() - this.hours * 3_600_000 - RISE_WINDOW_MS);
    try {
      const result = await this.hass.callWS<Record<string, HistoryState[]>>({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        entity_ids: [this.entity],
        minimal_response: false,
        no_attributes: false,
        significant_changes_only: false,
      });
      this._points = samples(result[this.entity] ?? []);
      this._error = null;
    } catch (error) {
      // Shown in the chart's place: history unavailable (recorder off, etc.).
      this._error = error instanceof Error ? error.message : String(error);
    }
  }

  protected render(): TemplateResult | typeof nothing {
    if (this.hass === undefined) return nothing;
    const t = strings(this.hass.language);
    if (this._error !== null) return html`<ha-card><div class="message">${this._error}</div></ha-card>`;
    const points = this._points;
    const width = this._width;
    if (points === null || width === 0) return html`<ha-card><div class="placeholder"></div></ha-card>`;

    const end = Date.now();
    const start = end - this.hours * 3_600_000;
    const shown = points.filter((_, index) => index + 1 === points.length || points[index + 1].t > start);
    const values = shown.flatMap((p) => [p.current, p.target]).filter((v): v is number => v !== null);
    const low = Math.floor(Math.min(...values, 18) - 0.5);
    const high = Math.ceil(Math.max(...values, 20) + 0.5);
    const plotW = width - PAD.left - PAD.right;
    const plotH = HEIGHT - PAD.top - PAD.bottom;
    const x = (time: number): number => PAD.left + ((time - start) / (end - start)) * plotW;
    const y = (value: number): number => PAD.top + (1 - (value - low) / (high - low)) * plotH;

    const step = (pick: (p: Sample) => number | null): string => {
      let d = "";
      let previous: number | null = null;
      shown.forEach((p, index) => {
        const value = pick(p);
        const tx = x(Math.max(p.t, start));
        if (value === null) {
          previous = null;
          return;
        }
        d += previous === null ? `M${tx},${y(value)}` : `H${tx}V${y(value)}`;
        previous = value;
        if (index === shown.length - 1) d += `H${x(end)}`;
      });
      return d;
    };

    const bands = heatingBands(points, start, end);
    const xTicks = this._timeTicks(start, end);
    const hoverSample = this._hover === null ? null : sampleAt(points, this._hover);
    const language = this.hass.language;
    const fmt = (v: number | null): string =>
      v === null ? "—" : `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(v)} °C`;

    return html`<ha-card>
      <svg
        width=${width}
        height=${HEIGHT}
        @pointermove=${(event: PointerEvent) => this._onMove(event, start, end, plotW)}
        @pointerleave=${() => (this._hover = null)}
      >
        ${bands.map(
          (band) =>
            svg`<rect class="band" x=${x(band.from)} y=${PAD.top} width=${x(band.to) - x(band.from)} height=${plotH}></rect>`,
        )}
        ${ticks(low, high, 5).map(
          (v) => svg`<line class="grid" x1=${PAD.left} x2=${width - PAD.right} y1=${y(v)} y2=${y(v)}></line>
            <text class="axis" x=${PAD.left - 6} y=${y(v) + 4} text-anchor="end">${v}</text>`,
        )}
        ${xTicks.map(
          (tick) => svg`<text class="axis" x=${x(tick.t)} y=${HEIGHT - 8} text-anchor="middle">${tick.label}</text>`,
        )}
        <path class="target" d=${step((p) => p.target)}></path>
        <path class="current" d=${step((p) => p.current)}></path>
        ${hoverSample === null || this._hover === null
          ? nothing
          : svg`<line class="cursor" x1=${x(this._hover)} x2=${x(this._hover)} y1=${PAD.top} y2=${PAD.top + plotH}></line>`}
      </svg>
      <div class="legend">
        ${hoverSample === null
          ? html`<span><i class="swatch current"></i>${t.roomTemperature}</span>
              <span><i class="swatch target"></i>${t.targetTemperature}</span>
              <span><i class="swatch band"></i>${t.heatingEstimate}</span>`
          : html`<span>${new Date(hoverSample.t).toLocaleString(language, { weekday: "short", hour: "2-digit", minute: "2-digit" })}</span>
              <span><i class="swatch current"></i>${fmt(hoverSample.current)}</span>
              <span><i class="swatch target"></i>${fmt(hoverSample.target)}</span>`}
      </div>
    </ha-card>`;
  }

  private _onMove(event: PointerEvent, start: number, end: number, plotW: number): void {
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const fraction = (event.clientX - rect.left - PAD.left) / plotW;
    this._hover = fraction < 0 || fraction > 1 ? null : start + fraction * (end - start);
  }

  private _timeTicks(start: number, end: number): { t: number; label: string }[] {
    const hours = (end - start) / 3_600_000;
    const language = this.hass?.language ?? "en";
    const stepHours = hours <= 24 ? 4 : hours <= 168 ? 24 : 24 * 7;
    const first = new Date(start);
    first.setMinutes(0, 0, 0);
    if (stepHours >= 24) first.setHours(0);
    const result: { t: number; label: string }[] = [];
    for (let t = first.getTime(); t <= end; t += stepHours * 3_600_000) {
      if (t < start) continue;
      const date = new Date(t);
      const label =
        stepHours < 24
          ? date.toLocaleTimeString(language, { hour: "2-digit", minute: "2-digit" })
          : date.toLocaleDateString(language, { day: "numeric", month: "short" });
      result.push({ t, label });
    }
    return result;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px 8px 8px;
      overflow: hidden;
    }
    svg {
      display: block;
      touch-action: pan-y;
    }
    .band {
      fill: var(--warning-color, #ff9800);
      opacity: 0.18;
    }
    .grid {
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .axis {
      fill: var(--secondary-text-color);
      font-size: 11px;
    }
    path {
      fill: none;
      stroke-width: 2;
      stroke-linejoin: round;
    }
    path.current {
      stroke: var(--info-color, #039be5);
    }
    path.target {
      stroke: var(--warning-color, #ff9800);
      stroke-dasharray: 5 3;
    }
    .cursor {
      stroke: var(--secondary-text-color);
      stroke-width: 1;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px 16px;
      padding: 6px 8px 4px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
      min-height: 1.5em;
    }
    .swatch {
      display: inline-block;
      width: 14px;
      height: 10px;
      margin-right: 6px;
      border-radius: 2px;
      vertical-align: middle;
    }
    .swatch.current {
      background: var(--info-color, #039be5);
    }
    .swatch.target {
      background: var(--warning-color, #ff9800);
    }
    .swatch.band {
      background: var(--warning-color, #ff9800);
      opacity: 0.35;
    }
    .placeholder {
      height: ${HEIGHT}px;
    }
    .message {
      padding: 16px;
      color: var(--error-color, #db4437);
    }
  `;
}

if (customElements.get("estia-history") === undefined) {
  customElements.define("estia-history", EstiaHistory);
}
