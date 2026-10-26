"""Fixtures: a fake thermostat at the climate boundary, and a loaded entry."""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.components.climate.const import (
    ATTR_HVAC_MODE,
    SERVICE_SET_HVAC_MODE,
    SERVICE_SET_TEMPERATURE,
    HVACMode,
)
from homeassistant.components.climate.const import DOMAIN as CLIMATE_DOMAIN
from homeassistant.const import ATTR_TEMPERATURE, STATE_ON
from homeassistant.util import dt as dt_util
from pydantic import BaseModel, ConfigDict
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.estia.config_flow import initial_slots
from custom_components.estia.const import (
    DOMAIN,
    INITIAL_AWAY_DELAY_MIN,
    INITIAL_AWAY_SETPOINT,
    INITIAL_PREHEAT_RADIUS_KM,
)
from custom_components.estia.models import StoredState, TravellerSensors, Wiring
from custom_components.estia.scheduler import Slot

if TYPE_CHECKING:
    from collections.abc import Generator

    from freezegun.api import FrozenDateTimeFactory
    from homeassistant.core import Context, HomeAssistant, ServiceCall

pytest_plugins = "pytest_homeassistant_custom_component"

CLIMATE = "climate.living_room"
PRESENCE = "binary_sensor.anyone_home"
DISTANCE = "sensor.home_alice_distance"
DIRECTION = "sensor.home_alice_direction_of_travel"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let HA load custom_components/estia."""


class Frontend(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, frozen=True)

    register_card: AsyncMock
    register_panel: AsyncMock
    remove_panel: MagicMock


@pytest.fixture(autouse=True)
def no_frontend(hass: HomeAssistant) -> Generator[Frontend]:
    """The card and panel need the real frontend (not installed for tests):
    mark its dependencies loaded and record the registrations instead."""
    hass.config.components.update({"frontend", "http", "panel_custom"})
    with (
        patch("custom_components.estia.async_register_card") as card,
        patch("custom_components.estia.async_register_schedule_panel") as panel,
        patch("custom_components.estia.async_remove_schedule_panel") as remove,
    ):
        yield Frontend(register_card=card, register_panel=panel, remove_panel=remove)


def local(hh: int, mm: int, day: int = 26) -> datetime:
    return datetime(2026, 10, day, hh, mm, tzinfo=dt_util.get_default_time_zone())


class FakeThermostat:
    """A climate entity at the boundary: services write its state with the
    caller's context, like a real entity does."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.calls: list[ServiceCall] = []
        hass.services.async_register(CLIMATE_DOMAIN, SERVICE_SET_TEMPERATURE, self._set_temp)
        hass.services.async_register(CLIMATE_DOMAIN, SERVICE_SET_HVAC_MODE, self._set_mode)

    def set(self, hvac: str, temperature: float | None, context: Context | None) -> None:
        attributes: dict[str, Any] = {ATTR_TEMPERATURE: temperature}
        self.hass.states.async_set(CLIMATE, hvac, attributes, context=context)

    @property
    def setpoint(self) -> float | None:
        state = self.hass.states.get(CLIMATE)
        assert state is not None
        return state.attributes[ATTR_TEMPERATURE]

    @property
    def hvac(self) -> str:
        state = self.hass.states.get(CLIMATE)
        assert state is not None
        return state.state

    async def _set_temp(self, call: ServiceCall) -> None:
        self.calls.append(call)
        self.set(self.hvac, call.data[ATTR_TEMPERATURE], call.context)

    async def _set_mode(self, call: ServiceCall) -> None:
        self.calls.append(call)
        mode = HVACMode(call.data[ATTR_HVAC_MODE])
        # Like most thermostats: no setpoint while off, the last one back on.
        self.set(mode, None if mode is HVACMode.OFF else 19.0, call.context)


@pytest.fixture
def thermostat(hass: HomeAssistant) -> FakeThermostat:
    fake = FakeThermostat(hass)
    fake.set(HVACMode.HEAT, 19.0, None)
    hass.states.async_set(PRESENCE, STATE_ON)
    return fake


SLOTS = initial_slots(3)  # 00:00, 08:00, 16:00 at the initial setpoint
TEST_SLOTS = (
    Slot(id="night", start=SLOTS[0].start, setpoint=17.0),
    Slot(id="day", start=SLOTS[1].start, setpoint=20.0),
    Slot(id="evening", start=SLOTS[2].start, setpoint=21.0),
)


def make_entry(proximity: tuple[TravellerSensors, ...]) -> MockConfigEntry:
    wiring = Wiring(climate=CLIMATE, presence=PRESENCE, proximity=proximity)
    state = StoredState(
        slots=TEST_SLOTS,
        schedule_enabled=True,
        preheat_enabled=bool(proximity),
        away_setpoint=INITIAL_AWAY_SETPOINT,
        away_delay_min=INITIAL_AWAY_DELAY_MIN,
        preheat_radius_km=INITIAL_PREHEAT_RADIUS_KM,
        hold_until=None,
        mode=None,
    )
    return MockConfigEntry(
        domain=DOMAIN,
        title="Heating",
        unique_id=CLIMATE,
        data=wiring.model_dump(mode="json"),
        options=state.model_dump(mode="json"),
    )


@pytest.fixture
async def entry(
    hass: HomeAssistant, thermostat: FakeThermostat, freezer: FrozenDateTimeFactory
) -> MockConfigEntry:
    """A loaded entry with one traveller, at 10:00 (the "day" slot)."""
    freezer.move_to(local(10, 0))
    config_entry = make_entry((TravellerSensors(distance=DISTANCE, direction=DIRECTION),))
    config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(config_entry.entry_id)
    await hass.async_block_till_done()
    return config_entry
