// Home Assistant's own Lovelace cards (thermostat, history graph, entities),
// created through the frontend's card helpers so they look and behave exactly
// like the rest of the UI. Outside Home Assistant there are no helpers and
// nothing is rendered.

import type { HomeAssistant } from "./types";

export interface LovelaceCard extends HTMLElement {
  hass: HomeAssistant | undefined;
}

interface CardHelpers {
  createCardElement(config: Record<string, unknown>): LovelaceCard;
}

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<CardHelpers>;
  }
}

/** Creates native cards on demand and caches them by configuration.
 * `onReady` is called when a card that was requested becomes available. */
export class NativeCards {
  private readonly cards = new Map<string, LovelaceCard>();
  private helpers: CardHelpers | null = null;
  private loading = false;

  constructor(private readonly onReady: () => void) {}

  get(config: Record<string, unknown>, hass: HomeAssistant): LovelaceCard | null {
    const key = JSON.stringify(config);
    const cached = this.cards.get(key);
    if (cached !== undefined) {
      cached.hass = hass;
      return cached;
    }
    if (this.helpers === null) {
      this.load();
      return null;
    }
    const card = this.helpers.createCardElement(config);
    card.hass = hass;
    this.cards.set(key, card);
    return card;
  }

  private load(): void {
    if (this.loading) return;
    this.loading = true;
    void cardHelpers().then((helpers) => {
      if (helpers === null) return;
      this.helpers = helpers;
      this.onReady();
    });
  }
}

interface PanelResolver extends HTMLElement {
  hass: { panels: { url_path: string; component_name: string }[] };
  _updateRoutes(): void;
  routerOptions: { routes: Record<string, { load(): Promise<unknown> }> };
}

/** The frontend's card helpers. They exist only once the Lovelace panel code
 * has been loaded, which is not the case when the browser lands straight on
 * our sidebar panel: load it the way the frontend's router would. Null
 * outside Home Assistant. */
async function cardHelpers(): Promise<CardHelpers | null> {
  if (window.loadCardHelpers === undefined) {
    if (customElements.get("partial-panel-resolver") === undefined) return null;
    const resolver = document.createElement("partial-panel-resolver") as PanelResolver;
    resolver.hass = { panels: [{ url_path: "estia-lovelace", component_name: "lovelace" }] };
    resolver._updateRoutes();
    await resolver.routerOptions.routes["estia-lovelace"].load();
  }
  return window.loadCardHelpers === undefined ? null : window.loadCardHelpers();
}
