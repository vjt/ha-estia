"""Return to schedule, and all off."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
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
    async_add_entities([ResumeButton(entry), AllOffButton(entry)])


class ResumeButton(EstiaEntity, ButtonEntity):
    """Drop the manual hold and apply the schedule now."""

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.RESUME)

    async def async_press(self) -> None:
        await self._runtime.async_return_to_schedule()


class AllOffButton(EstiaEntity, ButtonEntity):
    """Stop the schedule and switch the thermostat off."""

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.ALL_OFF)

    async def async_press(self) -> None:
        await self._runtime.async_all_off()
