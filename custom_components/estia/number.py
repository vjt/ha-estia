"""Away setpoint, away delay and preheat radius."""

from __future__ import annotations

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberMode
from homeassistant.const import EntityCategory, UnitOfLength, UnitOfTemperature, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import (
    AWAY_DELAY_MAX_MIN,
    PREHEAT_RADIUS_MAX_KM,
    PREHEAT_RADIUS_MIN_KM,
    SETPOINT_MAX,
    SETPOINT_MIN,
    SETPOINT_STEP,
    EntityKey,
)
from .entity import EstiaEntity
from .runtime import EstiaConfigEntry


async def async_setup_entry(
    hass: HomeAssistant,
    entry: EstiaConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([AwaySetpoint(entry), AwayDelay(entry), PreheatRadius(entry)])


class AwaySetpoint(EstiaEntity, NumberEntity):
    """Setpoint while the house is empty."""

    _attr_device_class = NumberDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_native_min_value = SETPOINT_MIN
    _attr_native_max_value = SETPOINT_MAX
    _attr_native_step = SETPOINT_STEP
    _attr_mode = NumberMode.BOX
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.AWAY_SETPOINT)

    def _refresh(self) -> None:
        self._attr_native_value = self._runtime.state.away_setpoint

    async def async_set_native_value(self, value: float) -> None:
        await self._runtime.async_set_away_setpoint(value)


class AwayDelay(EstiaEntity, NumberEntity):
    """Minutes the house must be empty before the away setpoint applies."""

    _attr_device_class = NumberDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES
    _attr_native_min_value = 0
    _attr_native_max_value = AWAY_DELAY_MAX_MIN
    _attr_native_step = 1
    _attr_mode = NumberMode.BOX
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.AWAY_DELAY)

    def _refresh(self) -> None:
        self._attr_native_value = self._runtime.state.away_delay_min

    async def async_set_native_value(self, value: float) -> None:
        await self._runtime.async_set_away_delay(int(value))


class PreheatRadius(EstiaEntity, NumberEntity):
    """Preheat when someone heading home is closer than this."""

    _attr_device_class = NumberDeviceClass.DISTANCE
    _attr_native_unit_of_measurement = UnitOfLength.KILOMETERS
    _attr_native_min_value = PREHEAT_RADIUS_MIN_KM
    _attr_native_max_value = PREHEAT_RADIUS_MAX_KM
    _attr_native_step = 1
    _attr_mode = NumberMode.BOX
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, entry: EstiaConfigEntry) -> None:
        super().__init__(entry, EntityKey.PREHEAT_RADIUS)

    def _refresh(self) -> None:
        self._attr_native_value = self._runtime.state.preheat_radius_km

    async def async_set_native_value(self, value: float) -> None:
        await self._runtime.async_set_preheat_radius(value)
