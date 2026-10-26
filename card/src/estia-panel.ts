// estia-panel: the sidebar page of one schedule — the card, full page.

import { LitElement, css, html, nothing, type TemplateResult } from "lit";

import { strings } from "./i18n";
import type { CardConfig, HomeAssistant } from "./types";

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

export class EstiaPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { attribute: false },
    panel: { attribute: false },
  };

  declare hass: HomeAssistant | undefined;
  declare narrow: boolean;
  declare panel: PanelInfo | undefined;

  private _card: CardElement | null = null;
  private _entity: string | null = null;

  constructor() {
    super();
    this.hass = undefined;
    this.narrow = false;
    this.panel = undefined;
  }

  private _cardFor(entity: string): CardElement {
    if (this._card === null || this._entity !== entity) {
      this._card = document.createElement("estia-card") as CardElement;
      this._card.setConfig({ type: "custom:estia-card", entity });
      this._entity = entity;
    }
    this._card.hass = this.hass;
    return this._card;
  }

  protected render(): TemplateResult | typeof nothing {
    if (this.hass === undefined || this.panel === undefined) return nothing;
    const entity = modeSensor(this.hass, this.panel.config.config_entry_id);
    return html`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">${this.panel.title ?? "Estia"}</div>
      </div>
      <div class="content">
        ${entity === null
          ? html`<div class="message">${strings(this.hass.language).unavailable}</div>`
          : this._cardFor(entity)}
      </div>
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
    .content {
      max-width: 720px;
      margin: 0 auto;
      padding: 16px;
    }
    .message {
      padding: 16px;
    }
  `;
}

if (customElements.get("estia-panel") === undefined) {
  customElements.define("estia-panel", EstiaPanel);
}
