"""The mode sensor: what the schedule is doing, and the card's data source."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import SETPOINT_MAX, SETPOINT_MIN, SETPOINT_STEP, Attr, EntityKey, Mode
from .entity import EstiaEntity, entity_ids
from .runtime import EstiaConfigEntry
from .scheduler import active_slot, sorted_slots


async def async_setup_entry(
    hass: HomeAssistant,
    entry: EstiaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([ModeSensor(entry)])


class ModeSensor(EstiaEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.ENUM

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.MODE)
        self._attr_options = [mode.value for mode in Mode]

    def _refresh(self) -> None:
        runtime = self._runtime
        mode = runtime.state.mode
        # None only before the first decision of a new entry.
        self._attr_native_value = mode.value if mode is not None else None
        self._attr_extra_state_attributes = self._attributes()

    def _attributes(self) -> dict[str, Any]:
        runtime = self._runtime
        state = runtime.state
        active = active_slot(state.slots, dt_util.now())
        decision = runtime.decision
        return {
            Attr.SLOTS: [
                {"id": slot.id, "start": slot.start.strftime("%H:%M"), "setpoint": slot.setpoint}
                for slot in sorted_slots(state.slots)
            ],
            Attr.ACTIVE_SLOT: active.id if active is not None else None,
            Attr.HOLD_UNTIL: state.hold_until.isoformat() if state.hold_until else None,
            Attr.TARGET: decision.target if decision is not None else None,
            Attr.CONFIG_ENTRY_ID: runtime.entry_id,
            Attr.CLIMATE: runtime.wiring.climate,
            Attr.PRESENCE: runtime.wiring.presence,
            Attr.PROXIMITY: [pair.model_dump() for pair in runtime.wiring.proximity],
            Attr.ENTITIES: {
                key.value: entity_id
                for key, entity_id in entity_ids(self.hass, runtime.entry_id).items()
            },
            Attr.SETPOINT_MIN: SETPOINT_MIN,
            Attr.SETPOINT_MAX: SETPOINT_MAX,
            Attr.SETPOINT_STEP: SETPOINT_STEP,
        }
