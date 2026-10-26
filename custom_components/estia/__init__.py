"""Estia: a daily heating schedule for any climate entity."""

from __future__ import annotations

from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from .card import async_register_card, async_register_schedule_panel, async_remove_schedule_panel
from .const import DOMAIN
from .models import Wiring
from .runtime import EstiaConfigEntry, EstiaRuntime
from .services import async_register_services

PLATFORMS = [Platform.BUTTON, Platform.NUMBER, Platform.SENSOR, Platform.SWITCH]

# HA annotates the returned schema as `Callable[[dict], dict]` (bare dict).
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)  # pyright: ignore[reportUnknownVariableType, reportUnknownMemberType]


async def _version(hass: HomeAssistant) -> str:
    return str((await async_get_integration(hass, DOMAIN)).version)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Once per HA start: the card and the services, shared by all entries."""
    await async_register_card(hass, await _version(hass))
    async_register_services(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: EstiaConfigEntry) -> bool:
    runtime = EstiaRuntime(hass, entry, Wiring.model_validate(entry.data))
    entry.runtime_data = runtime
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    await async_register_schedule_panel(hass, entry.entry_id, entry.title, await _version(hass))
    await runtime.async_start()

    # The sidebar title follows the entry's title: reload when it is renamed.
    # Other updates (the runtime writing options) leave the entry alone.
    title = entry.title

    async def on_update(hass: HomeAssistant, updated: EstiaConfigEntry) -> None:
        if updated.title != title:
            await hass.config_entries.async_reload(updated.entry_id)

    entry.async_on_unload(entry.add_update_listener(on_update))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: EstiaConfigEntry) -> bool:
    await entry.runtime_data.async_stop()
    async_remove_schedule_panel(hass, entry.entry_id)
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
