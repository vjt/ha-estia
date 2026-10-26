"""Services the card (and automations) use to edit the schedule."""

from __future__ import annotations

from datetime import time

import voluptuous as vol
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN, SETPOINT_MAX, SETPOINT_MIN, Field, Service
from .runtime import EstiaConfigEntry, EstiaRuntime

_ENTRY = {vol.Required(Field.CONFIG_ENTRY_ID.value): cv.string}
_SETPOINT = vol.All(vol.Coerce(float), vol.Range(min=SETPOINT_MIN, max=SETPOINT_MAX))

SET_SLOT_SCHEMA = vol.Schema(
    {
        **_ENTRY,
        vol.Required(Field.SLOT_ID.value): cv.string,
        vol.Required(Field.START.value): cv.time,
        vol.Required(Field.SETPOINT.value): _SETPOINT,
    }
)
ADD_SLOT_SCHEMA = vol.Schema(
    {
        **_ENTRY,
        vol.Required(Field.START.value): cv.time,
        vol.Required(Field.SETPOINT.value): _SETPOINT,
    }
)
REMOVE_SLOT_SCHEMA = vol.Schema({**_ENTRY, vol.Required(Field.SLOT_ID.value): cv.string})
RESUME_SCHEMA = vol.Schema(_ENTRY)


def _runtime(call: ServiceCall) -> EstiaRuntime:
    """The runtime of the entry named in the call; raises ServiceValidationError
    if it is not a loaded Estia entry."""
    entry_id: str = call.data[Field.CONFIG_ENTRY_ID]
    entry: EstiaConfigEntry | None = call.hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN or entry.state is not ConfigEntryState.LOADED:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="entry_not_loaded",
            translation_placeholders={"entry_id": entry_id},
        )
    return entry.runtime_data


async def _set_slot(call: ServiceCall) -> None:
    start: time = call.data[Field.START]
    await _runtime(call).async_set_slot(call.data[Field.SLOT_ID], start, call.data[Field.SETPOINT])


async def _add_slot(call: ServiceCall) -> None:
    start: time = call.data[Field.START]
    await _runtime(call).async_add_slot(start, call.data[Field.SETPOINT])


async def _remove_slot(call: ServiceCall) -> None:
    await _runtime(call).async_remove_slot(call.data[Field.SLOT_ID])


async def _resume(call: ServiceCall) -> None:
    await _runtime(call).async_return_to_schedule()


@callback
def async_register_services(hass: HomeAssistant) -> None:
    hass.services.async_register(DOMAIN, Service.SET_SLOT, _set_slot, SET_SLOT_SCHEMA)
    hass.services.async_register(DOMAIN, Service.ADD_SLOT, _add_slot, ADD_SLOT_SCHEMA)
    hass.services.async_register(DOMAIN, Service.REMOVE_SLOT, _remove_slot, REMOVE_SLOT_SCHEMA)
    hass.services.async_register(DOMAIN, Service.RESUME, _resume, RESUME_SCHEMA)
