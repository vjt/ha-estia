"""Schedule on/off and preheat on/off."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import EntityKey
from .entity import EstiaEntity
from .runtime import EstiaConfigEntry


async def async_setup_entry(
    hass: HomeAssistant,
    entry: EstiaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([ScheduleSwitch(entry), PreheatSwitch(entry)])


class ScheduleSwitch(EstiaEntity, SwitchEntity):
    """Off: the thermostat is left alone. On: back to heat, hold dropped, applied."""

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.SCHEDULE)

    def _refresh(self) -> None:
        self._attr_is_on = self._runtime.state.schedule_enabled

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._runtime.async_set_schedule_enabled(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._runtime.async_set_schedule_enabled(False)


class PreheatSwitch(EstiaEntity, SwitchEntity):
    """Apply the slots with the house empty when someone is heading home."""

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.PREHEAT)

    def _refresh(self) -> None:
        self._attr_is_on = self._runtime.state.preheat_enabled

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._runtime.async_set_preheat_enabled(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._runtime.async_set_preheat_enabled(False)
