"""Serve the bundled card, load it on every dashboard, and give each schedule
its own sidebar panel."""

from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Final

from homeassistant.components.frontend import add_extra_js_url, async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN, Attr

CARD_FILE: Final = Path(__file__).parent / "frontend" / "estia-card.js"
CARD_URL: Final = f"/{DOMAIN}/estia-card.js"
PANEL_ELEMENT: Final = "estia-panel"
PANEL_ICON: Final = "mdi:radiator"


def card_digest() -> str:
    """A short hash of the bundle, to bust browser caches whenever it changes.
    Blocking (reads the file): run it in the executor."""
    return hashlib.sha256(CARD_FILE.read_bytes()).hexdigest()[:12]


def module_url(digest: str) -> str:
    """The card bundle's URL. The panel loads the very same URL, so the
    module is evaluated once."""
    return f"{CARD_URL}?v={digest}"


def panel_url_path(entry_id: str) -> str:
    return f"{DOMAIN}-{entry_id.lower()}"


async def async_register_card(hass: HomeAssistant, digest: str) -> None:
    """Serve the bundle and add it to every dashboard."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(CARD_FILE), cache_headers=True)]
    )
    add_extra_js_url(hass, module_url(digest))


def schedule_device(hass: HomeAssistant, entry_id: str) -> dr.DeviceEntry | None:
    """The entry's device; None before its entities are set up."""
    for device in dr.async_entries_for_config_entry(dr.async_get(hass), entry_id):
        if (DOMAIN, entry_id) in device.identifiers:
            return device
    return None


class SchedulePanel:
    """The entry's sidebar item, showing its card full page.

    Titled after the schedule's device as the user named it, else after the
    entry; renaming either retitles it at once.
    """

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, digest: str) -> None:
        self._hass = hass
        self._entry = entry
        self._digest = digest
        self._shown: str | None = None

    def _title(self) -> str:
        device = schedule_device(self._hass, self._entry.entry_id)
        if device is not None and device.name_by_user:
            return device.name_by_user
        return self._entry.title

    async def async_show(self) -> None:
        title = self._title()
        await async_register_panel(
            self._hass,
            frontend_url_path=panel_url_path(self._entry.entry_id),
            webcomponent_name=PANEL_ELEMENT,
            sidebar_title=title,
            sidebar_icon=PANEL_ICON,
            module_url=module_url(self._digest),
            config={Attr.CONFIG_ENTRY_ID.value: self._entry.entry_id},
            require_admin=False,
        )
        self._shown = title

    @callback
    def async_hide(self) -> None:
        if self._shown is not None:
            async_remove_panel(self._hass, panel_url_path(self._entry.entry_id))
            self._shown = None

    async def async_refresh(self) -> None:
        """Re-register under the current title, if it changed."""
        if self._shown is not None and self._title() != self._shown:
            self.async_hide()
            await self.async_show()
