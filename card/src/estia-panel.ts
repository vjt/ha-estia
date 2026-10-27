// estia-panel: the sidebar page of one schedule. Home Assistant's thermostat
// card (setpoint buttons), the schedule card, and the temperature history
// over 24 hours, 7 or 30 days.

import { LitElement, css, html, nothing, type TemplateResult } from "lit";

import "./estia-history";
import { strings } from "./i18n";
import { NativeCards } from "./native";
import type { CardConfig, HomeAssistant } from "./types";

const PERIOD_KEY = "estia-panel-period";

interface PanelInfo {
  title: string | null;
  config: { config_entry_id: string };
}

interface CardElement extends HTMLElement {
  hass: HomeAssistant | undefined;
  setConfig(config: CardConfig): void;
}

/** The schedule's mode sensor: the Estia sensor carrying this entry's id. */
function modeSensor(hass: HomeAssistant, entryId: string): string | null {
  for (const entity of Object.values(hass.states)) {
    if (
      entity !== undefined &&
      entity.entity_id.startsWith("sensor.") &&
      entity.attributes.config_entry_id === entryId &&
      hass.entities[entity.entity_id]?.platform === "estia"
    ) {
      return entity.entity_id;
    }
  }
  return null;
}

/** The remembered history period, a per-viewer convenience: storage may be
 * unavailable (private window), in which case it is 24 hours. */
function storedPeriod(): number {
  try {
    const value = Number(window.localStorage.getItem(PERIOD_KEY));
    return value > 0 ? value : 24;
  } catch {
    return 24;
  }
}

function storePeriod(hours: number): void {
  try {
    window.localStorage.setItem(PERIOD_KEY, String(hours));
  } catch {
    // Not remembered: the next visit starts from 24 hours again.
  }
}

export class EstiaPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { attribute: false },
    panel: { attribute: false },
    _hours: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare narrow: boolean;
  declare panel: PanelInfo | undefined;
  declare _hours: number;

  private _card: CardElement | null = null;
  private _entity: string | null = null;
  private readonly _native = new NativeCards(() => this.requestUpdate());

  constructor() {
    super();
    this.hass = undefined;
    this.narrow = false;
    this.panel = undefined;
    this._hours = storedPeriod();
  }

  private _scheduleCard(entity: string): CardElement {
    if (this._card === null || this._entity !== entity) {
      this._card = document.createElement("estia-card") as CardElement;
      this._card.setConfig({ type: "custom:estia-card", entity });
      this._entity = entity;
    }
    this._card.hass = this.hass;
    return this._card;
  }

  private _setPeriod(hours: number): void {
    this._hours = hours;
    storePeriod(hours);
  }

  protected render(): TemplateResult | typeof nothing {
    const hass = this.hass;
    if (hass === undefined || this.panel === undefined) return nothing;
    const t = strings(hass.language);
    const entity = modeSensor(hass, this.panel.config.config_entry_id);
    const climate = entity === null ? undefined : hass.states[entity]?.attributes.climate_entity;
    const thermostat =
      typeof climate === "string" ? this._native.get({ type: "thermostat", entity: climate }, hass) : null;
    return html`
      <div class="toolbar">
        <ha-menu-button .hass=${hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">${this.panel.title ?? "Estia"}</div>
      </div>
      ${entity === null
        ? html`<div class="message">${t.unavailable}</div>`
        : html`<div class="layout">
            <div class="column">
              ${thermostat === null ? nothing : html`<div class="thermostat">${thermostat}</div>`}
              ${this._scheduleCard(entity)}
            </div>
            <div class="column">
              <div class="periods">
                <span class="heading">${t.history}</span>
                ${t.periods.map(
                  (period) => html`<button
                    class=${period.hours === this._hours ? "selected" : ""}
                    @click=${() => this._setPeriod(period.hours)}
                  >
                    ${period.label}
                  </button>`,
                )}
              </div>
              ${typeof climate === "string"
                ? html`<estia-history .hass=${hass} .entity=${climate} .hours=${this._hours}></estia-history>`
                : nothing}
            </div>
          </div>`}
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
    }
    .toolbar {
      display: flex;
      align-items: center;
      height: var(--header-height, 56px);
      padding: 0 12px;
      gap: 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      font-size: 20px;
    }
    .layout {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
      gap: 16px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      box-sizing: border-box;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    /* The thermostat card sizes its dial to its box, which a plain column
       does not give it: without a height the dial shrinks to a thumbnail. */
    .thermostat {
      height: 400px;
    }
    .thermostat > * {
      height: 100%;
    }
    .periods {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .heading {
      flex: 1;
      font-size: 1.2em;
      font-weight: 500;
    }
    .periods button {
      font: inherit;
      min-height: 40px;
      padding: 8px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 999px;
      cursor: pointer;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .periods button.selected {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .message {
      padding: 16px;
    }
  `;
}

if (customElements.get("estia-panel") === undefined) {
  customElements.define("estia-panel", EstiaPanel);
}
