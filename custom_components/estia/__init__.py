"""Estia: a daily heating schedule for any climate entity."""

from __future__ import annotations

from homeassistant.const import Platform
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.typing import ConfigType

from .card import SchedulePanel, async_register_card, card_digest, schedule_device
from .const import DAYS_PER_WEEK, DOMAIN, INITIAL_PROFILE_ID, INITIAL_PROFILE_NAME
from .models import Wiring
from .runtime import EstiaConfigEntry, EstiaRuntime
from .services import async_register_services

PLATFORMS = [Platform.BUTTON, Platform.NUMBER, Platform.SENSOR, Platform.SWITCH]

# HA annotates the returned schema as `Callable[[dict], dict]` (bare dict).
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)  # pyright: ignore[reportUnknownVariableType, reportUnknownMemberType]


async def _digest(hass: HomeAssistant) -> str:
    return await hass.async_add_executor_job(card_digest)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Once per HA start: the card and the services, shared by all entries."""
    await async_register_card(hass, await _digest(hass))
    async_register_services(hass)
    return True


async def async_migrate_entry(hass: HomeAssistant, entry: EstiaConfigEntry) -> bool:
    """1.1 → 1.2: no boost running. 1.2 → 1.3: the slots become one profile
    used every day. Returns False for a version from the future, which HA
    reports as a failed migration."""
    if entry.version > 1:
        return False
    if entry.minor_version < 2:
        hass.config_entries.async_update_entry(
            entry, options={**entry.options, "boost": None}, minor_version=2
        )
    if entry.minor_version < 3:
        options = {key: value for key, value in entry.options.items() if key != "slots"}
        options["profiles"] = [
            {
                "id": INITIAL_PROFILE_ID,
                "name": INITIAL_PROFILE_NAME,
                "slots": entry.options["slots"],
            }
        ]
        options["week"] = [INITIAL_PROFILE_ID] * DAYS_PER_WEEK
        hass.config_entries.async_update_entry(entry, options=options, minor_version=3)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: EstiaConfigEntry) -> bool:
    runtime = EstiaRuntime(hass, entry, Wiring.model_validate(entry.data))
    entry.runtime_data = runtime
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    panel = SchedulePanel(hass, entry, await _digest(hass))
    await panel.async_show()
    entry.async_on_unload(panel.async_hide)
    await runtime.async_start()

    # Renaming the device or the entry retitles the sidebar item. Most entry
    # updates are the runtime writing options: refresh is a no-op for those.
    device = schedule_device(hass, entry.entry_id)

    @callback
    def on_device_update(event: Event[dr.EventDeviceRegistryUpdatedData]) -> None:
        if device is not None and event.data["device_id"] == device.id:
            hass.async_create_task(panel.async_refresh())

    async def on_entry_update(hass: HomeAssistant, updated: EstiaConfigEntry) -> None:
        await panel.async_refresh()

    entry.async_on_unload(
        hass.bus.async_listen(dr.EVENT_DEVICE_REGISTRY_UPDATED, on_device_update)
    )
    entry.async_on_unload(entry.add_update_listener(on_entry_update))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: EstiaConfigEntry) -> bool:
    await entry.runtime_data.async_stop()
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
