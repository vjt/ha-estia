"""Serve the bundled Lovelace card and load it on every dashboard."""

from __future__ import annotations

from pathlib import Path
from typing import Final

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN

CARD_FILE: Final = Path(__file__).parent / "frontend" / "estia-card.js"
CARD_URL: Final = f"/{DOMAIN}/estia-card.js"


async def async_register_card(hass: HomeAssistant, version: str) -> None:
    """Serve the card and add it to the frontend; `version` busts browser caches."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(CARD_FILE), cache_headers=True)]
    )
    add_extra_js_url(hass, f"{CARD_URL}?v={version}")
