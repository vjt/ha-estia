"""Config flow: wiring, proximity pairing, initial slots, reconfigure."""

from __future__ import annotations

from datetime import time
from typing import TYPE_CHECKING

from homeassistant.components.proximity.const import ATTR_DIR_OF_TRAVEL, ATTR_DIST_TO
from homeassistant.config_entries import SOURCE_USER
from homeassistant.const import CONF_NAME
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er

from custom_components.estia.config_flow import initial_slots
from custom_components.estia.const import DOMAIN, INITIAL_SLOT_SETPOINT, Field
from custom_components.estia.models import StoredState, TravellerSensors, Wiring

from .conftest import CLIMATE, PRESENCE, FakeThermostat, make_entry

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant
    from pytest_homeassistant_custom_component.common import MockConfigEntry


def register_proximity(hass: HomeAssistant, person: str, with_direction: bool) -> str:
    """Register a proximity pair the way the proximity integration does;
    returns the distance sensor's entity_id."""
    registry = er.async_get(hass)
    prefix = f"proximity_entry_{person}"
    distance = registry.async_get_or_create(
        "sensor", "proximity", f"{prefix}_{ATTR_DIST_TO}", suggested_object_id=f"{person}_distance"
    )
    if with_direction:
        registry.async_get_or_create(
            "sensor",
            "proximity",
            f"{prefix}_{ATTR_DIR_OF_TRAVEL}",
            suggested_object_id=f"{person}_direction",
        )
    return distance.entity_id


def test_initial_slots_spread_over_the_day() -> None:
    assert [slot.start for slot in initial_slots(3)] == [time(0), time(8), time(16)]
    assert [slot.start for slot in initial_slots(5)] == [
        time(0),
        time(4, 48),
        time(9, 36),
        time(14, 24),
        time(19, 12),
    ]
    assert {slot.setpoint for slot in initial_slots(4)} == {INITIAL_SLOT_SETPOINT}
    assert len({slot.id for slot in initial_slots(7)}) == 7


async def test_user_flow_creates_entry(hass: HomeAssistant, thermostat: FakeThermostat) -> None:
    alice = register_proximity(hass, "alice", with_direction=True)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {
            CONF_NAME: "Living room",
            Field.CLIMATE: CLIMATE,
            Field.PRESENCE: PRESENCE,
            Field.PROXIMITY: [alice],
            Field.SLOT_COUNT: 4,
        },
    )
    await hass.async_block_till_done()
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Living room"
    wiring = Wiring.model_validate(result["data"])
    assert wiring.proximity == (
        TravellerSensors(distance=alice, direction="sensor.alice_direction"),
    )
    state = StoredState.model_validate(result["options"])
    assert state.slots == initial_slots(4)
    assert state.preheat_enabled
    assert state.schedule_enabled


async def test_user_flow_rejects_unpaired_distance(
    hass: HomeAssistant, thermostat: FakeThermostat
) -> None:
    bob = register_proximity(hass, "bob", with_direction=False)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {
            CONF_NAME: "Heating",
            Field.CLIMATE: CLIMATE,
            Field.PRESENCE: PRESENCE,
            Field.PROXIMITY: [bob],
            Field.SLOT_COUNT: 3,
        },
    )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {Field.PROXIMITY: "no_direction"}


async def test_one_schedule_per_thermostat(
    hass: HomeAssistant, thermostat: FakeThermostat
) -> None:
    make_entry(()).add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {
            CONF_NAME: "Heating",
            Field.CLIMATE: CLIMATE,
            Field.PRESENCE: PRESENCE,
            Field.PROXIMITY: [],
            Field.SLOT_COUNT: 3,
        },
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_reconfigure_changes_sensors(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    carol = register_proximity(hass, "carol", with_direction=True)
    result = await entry.start_reconfigure_flow(hass)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {Field.PRESENCE: "binary_sensor.other", Field.PROXIMITY: [carol]},
    )
    await hass.async_block_till_done()
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    wiring = Wiring.model_validate(entry.data)
    assert wiring.presence == "binary_sensor.other"
    assert wiring.proximity == (
        TravellerSensors(distance=carol, direction="sensor.carol_direction"),
    )
    assert wiring.climate == CLIMATE
