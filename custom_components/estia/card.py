"""Serve the bundled card, load it on every dashboard, and give each schedule
its own sidebar panel."""

from __future__ import annotations

from pathlib import Path
from typing import Final

from homeassistant.components.frontend import add_extra_js_url, async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, Attr

CARD_FILE: Final = Path(__file__).parent / "frontend" / "estia-card.js"
CARD_URL: Final = f"/{DOMAIN}/estia-card.js"
PANEL_ELEMENT: Final = "estia-panel"
PANEL_ICON: Final = "mdi:radiator"


def module_url(version: str) -> str:
    """The card bundle's URL; `version` busts browser caches. The panel loads
    the very same URL, so the module is evaluated once."""
    return f"{CARD_URL}?v={version}"


def panel_url_path(entry_id: str) -> str:
    return f"{DOMAIN}-{entry_id.lower()}"


async def async_register_card(hass: HomeAssistant, version: str) -> None:
    """Serve the bundle and add it to every dashboard."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(CARD_FILE), cache_headers=True)]
    )
    add_extra_js_url(hass, module_url(version))


async def async_register_schedule_panel(
    hass: HomeAssistant, entry_id: str, title: str, version: str
) -> None:
    """A sidebar entry, titled after the schedule, showing its card full page."""
    await async_register_panel(
        hass,
        frontend_url_path=panel_url_path(entry_id),
        webcomponent_name=PANEL_ELEMENT,
        sidebar_title=title,
        sidebar_icon=PANEL_ICON,
        module_url=module_url(version),
        config={Attr.CONFIG_ENTRY_ID.value: entry_id},
        require_admin=False,
    )


@callback
def async_remove_schedule_panel(hass: HomeAssistant, entry_id: str) -> None:
    async_remove_panel(hass, panel_url_path(entry_id))
