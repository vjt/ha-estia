"""The schedule driving a fake thermostat through Home Assistant."""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING

import pytest
from homeassistant.components.button import DOMAIN as BUTTON_DOMAIN
from homeassistant.components.button import SERVICE_PRESS
from homeassistant.components.climate.const import HVACMode
from homeassistant.components.number import ATTR_VALUE, SERVICE_SET_VALUE
from homeassistant.components.number import DOMAIN as NUMBER_DOMAIN
from homeassistant.components.switch import DOMAIN as SWITCH_DOMAIN
from homeassistant.const import (
    ATTR_ENTITY_ID,
    ATTR_UNIT_OF_MEASUREMENT,
    SERVICE_TURN_OFF,
    SERVICE_TURN_ON,
    STATE_OFF,
    STATE_ON,
    UnitOfLength,
)
from homeassistant.core import Context, Event, HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
    async_fire_time_changed,
)

from custom_components.estia.card import schedule_device
from custom_components.estia.const import (
    DOMAIN,
    INITIAL_AWAY_SETPOINT,
    Attr,
    EntityKey,
    Field,
    Mode,
    Service,
)
from custom_components.estia.const import Event as EstiaEvent
from custom_components.estia.entity import unique_id

from .conftest import (
    DIRECTION,
    DISTANCE,
    PRESENCE,
    FakeThermostat,
    Frontend,
    local,
    make_entry,
)

if TYPE_CHECKING:
    from freezegun.api import FrozenDateTimeFactory

    from custom_components.estia.runtime import EstiaRuntime


PLATFORMS = {
    EntityKey.MODE: "sensor",
    EntityKey.SCHEDULE: "switch",
    EntityKey.PREHEAT: "switch",
    EntityKey.BOOST: "switch",
    EntityKey.AWAY_SETPOINT: "number",
    EntityKey.AWAY_DELAY: "number",
    EntityKey.PREHEAT_RADIUS: "number",
    EntityKey.RESUME: "button",
    EntityKey.ALL_OFF: "button",
}


def runtime(entry: MockConfigEntry) -> EstiaRuntime:
    return entry.runtime_data


def entity(hass: HomeAssistant, entry: MockConfigEntry, key: EntityKey) -> str:
    entity_id = er.async_get(hass).async_get_entity_id(
        PLATFORMS[key], DOMAIN, unique_id(entry.entry_id, key)
    )
    assert entity_id is not None
    return entity_id


def mode(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    state = hass.states.get(entity(hass, entry, EntityKey.MODE))
    assert state is not None
    return state.state


async def advance(hass: HomeAssistant, freezer: FrozenDateTimeFactory, delta: timedelta) -> None:
    freezer.tick(delta)
    async_fire_time_changed(hass)
    await hass.async_block_till_done()


async def by_hand(hass: HomeAssistant, thermostat: FakeThermostat, setpoint: float) -> None:
    """Someone turns the dial: a state change with no parent context."""
    thermostat.set(thermostat.hvac, setpoint, Context())
    await hass.async_block_till_done()


async def test_applies_active_slot_on_start(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    assert thermostat.setpoint == 20.0
    assert mode(hass, entry) == Mode.HOME


async def test_follows_slot_starts(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    freezer: FrozenDateTimeFactory,
) -> None:
    await advance(hass, freezer, local(16, 0) - local(10, 0))
    assert thermostat.setpoint == 21.0


async def test_own_changes_are_not_manual(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    # The start-up push went through the fake with our context: no hold.
    assert thermostat.calls
    assert runtime(entry).state.hold_until is None
    assert mode(hass, entry) == Mode.HOME


async def test_manual_change_holds_until_next_slot(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    freezer: FrozenDateTimeFactory,
) -> None:
    await by_hand(hass, thermostat, 23.0)
    assert mode(hass, entry) == Mode.MANUAL
    assert thermostat.setpoint == 23.0
    attributes = hass.states.get(entity(hass, entry, EntityKey.MODE))
    assert attributes is not None
    assert attributes.attributes[Attr.HOLD_UNTIL] == local(16, 0).isoformat()

    await advance(hass, freezer, local(16, 0) - local(10, 0))
    assert mode(hass, entry) == Mode.HOME
    assert thermostat.setpoint == 21.0
    assert runtime(entry).state.hold_until is None


async def test_resume_button_drops_the_hold(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    await by_hand(hass, thermostat, 23.0)
    await hass.services.async_call(
        BUTTON_DOMAIN,
        SERVICE_PRESS,
        {ATTR_ENTITY_ID: entity(hass, entry, EntityKey.RESUME)},
        blocking=True,
    )
    assert mode(hass, entry) == Mode.HOME
    assert thermostat.setpoint == 20.0


async def test_away_after_delay_overrides_and_clears_hold(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    freezer: FrozenDateTimeFactory,
) -> None:
    events = async_capture_events(hass, EstiaEvent.MODE_CHANGED)
    await by_hand(hass, thermostat, 23.0)
    hass.states.async_set(PRESENCE, STATE_OFF)
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.MANUAL  # not empty long enough yet

    await advance(hass, freezer, timedelta(minutes=10))
    assert mode(hass, entry) == Mode.AWAY
    assert thermostat.setpoint == INITIAL_AWAY_SETPOINT
    assert runtime(entry).state.hold_until is None

    # Back home: the schedule, not the old hold.
    hass.states.async_set(PRESENCE, STATE_ON)
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.HOME
    assert thermostat.setpoint == 20.0
    assert [(e.data[Field.PREVIOUS_MODE], e.data[Field.MODE]) for e in events] == [
        (Mode.HOME, Mode.MANUAL),
        (Mode.MANUAL, Mode.AWAY),
        (Mode.AWAY, Mode.HOME),
    ]


async def test_preheat_when_heading_home_within_radius(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.states.async_set(PRESENCE, STATE_OFF)
    await advance(hass, freezer, timedelta(minutes=10))
    assert mode(hass, entry) == Mode.AWAY

    # 15 km, reported in km: within the 20 km radius, but stationary.
    hass.states.async_set(DISTANCE, "15", {ATTR_UNIT_OF_MEASUREMENT: UnitOfLength.KILOMETERS})
    hass.states.async_set(DIRECTION, "stationary")
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.AWAY

    hass.states.async_set(DIRECTION, "towards")
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.PREHEAT
    assert thermostat.setpoint == 20.0

    # 25000 m: outside the radius.
    hass.states.async_set(DISTANCE, "25000", {ATTR_UNIT_OF_MEASUREMENT: UnitOfLength.METERS})
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.AWAY


async def test_schedule_off_pauses_and_ignores_manual(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    schedule = entity(hass, entry, EntityKey.SCHEDULE)
    await hass.services.async_call(
        SWITCH_DOMAIN, SERVICE_TURN_OFF, {ATTR_ENTITY_ID: schedule}, blocking=True
    )
    assert mode(hass, entry) == Mode.PAUSED
    await by_hand(hass, thermostat, 23.0)
    assert runtime(entry).state.hold_until is None
    assert thermostat.setpoint == 23.0  # left alone


async def test_all_off_then_schedule_on_resumes(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    off_events = async_capture_events(hass, EstiaEvent.OFF)
    resumed: list[Event] = async_capture_events(hass, EstiaEvent.RESUMED)
    await hass.services.async_call(
        BUTTON_DOMAIN,
        SERVICE_PRESS,
        {ATTR_ENTITY_ID: entity(hass, entry, EntityKey.ALL_OFF)},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert thermostat.hvac == HVACMode.OFF
    assert mode(hass, entry) == Mode.OFF
    schedule = entity(hass, entry, EntityKey.SCHEDULE)
    state = hass.states.get(schedule)
    assert state is not None
    assert state.state == STATE_OFF
    assert len(off_events) == 1

    await hass.services.async_call(
        SWITCH_DOMAIN, SERVICE_TURN_ON, {ATTR_ENTITY_ID: schedule}, blocking=True
    )
    await hass.async_block_till_done()
    assert thermostat.hvac == HVACMode.HEAT
    assert thermostat.setpoint == 20.0
    assert mode(hass, entry) == Mode.HOME
    assert [e.data[Field.TARGET] for e in resumed] == [20.0]


async def test_hvac_off_by_hand_is_left_alone(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    thermostat.set(HVACMode.OFF, None, Context())
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.OFF
    assert thermostat.setpoint is None

    thermostat.set(HVACMode.HEAT, 18.0, Context())
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.HOME
    assert thermostat.setpoint == 20.0


async def test_knobs_apply_at_once(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    freezer: FrozenDateTimeFactory,
) -> None:
    hass.states.async_set(PRESENCE, STATE_OFF)
    await advance(hass, freezer, timedelta(minutes=10))
    await hass.services.async_call(
        NUMBER_DOMAIN,
        SERVICE_SET_VALUE,
        {ATTR_ENTITY_ID: entity(hass, entry, EntityKey.AWAY_SETPOINT), ATTR_VALUE: 14.5},
        blocking=True,
    )
    assert thermostat.setpoint == 14.5
    assert runtime(entry).state.away_setpoint == 14.5
    assert entry.options["away_setpoint"] == 14.5  # persisted


async def test_slot_services(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    base = {Field.CONFIG_ENTRY_ID: entry.entry_id}
    await hass.services.async_call(
        DOMAIN,
        Service.SET_SLOT,
        {**base, Field.SLOT_ID: "day", Field.START: "09:30", Field.SETPOINT: 19.5},
        blocking=True,
    )
    # 10:00 is still in "day", now starting 09:30 at 19.5.
    assert thermostat.setpoint == 19.5

    await hass.services.async_call(
        DOMAIN,
        Service.ADD_SLOT,
        {**base, Field.START: "10:00", Field.SETPOINT: 22.0},
        blocking=True,
    )
    assert thermostat.setpoint == 22.0
    slots = runtime(entry).state.slots
    assert [slot.start.strftime("%H:%M") for slot in slots] == ["00:00", "09:30", "10:00", "16:00"]

    added = slots[2].id
    await hass.services.async_call(
        DOMAIN, Service.REMOVE_SLOT, {**base, Field.SLOT_ID: added}, blocking=True
    )
    assert thermostat.setpoint == 19.5
    assert len(entry.options["slots"]) == 3

    with pytest.raises(ServiceValidationError) as duplicate:
        await hass.services.async_call(
            DOMAIN,
            Service.ADD_SLOT,
            {**base, Field.START: "16:00", Field.SETPOINT: 22.0},
            blocking=True,
        )
    assert duplicate.value.translation_key == "duplicate_start"

    with pytest.raises(ServiceValidationError) as unknown:
        await hass.services.async_call(
            DOMAIN, Service.REMOVE_SLOT, {**base, Field.SLOT_ID: "nope"}, blocking=True
        )
    assert unknown.value.translation_key == "unknown_slot"


async def test_service_rejects_unknown_entry(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    with pytest.raises(ServiceValidationError) as error:
        await hass.services.async_call(
            DOMAIN, Service.RESUME, {Field.CONFIG_ENTRY_ID: "missing"}, blocking=True
        )
    assert error.value.translation_key == "entry_not_loaded"


async def test_mode_survives_restart_without_event(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    events = async_capture_events(hass, EstiaEvent.MODE_CHANGED)
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert mode(hass, entry) == Mode.HOME
    assert events == []


async def test_unload(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    state = hass.states.get(entity(hass, entry, EntityKey.MODE))
    assert state is not None
    assert state.state == "unavailable"


def panel_titles(frontend: Frontend) -> list[str]:
    return [call.kwargs["sidebar_title"] for call in frontend.register_panel.await_args_list]


async def test_sidebar_panel_follows_names(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    no_frontend: Frontend,
) -> None:
    assert panel_titles(no_frontend) == ["Heating"]

    # Options writes (every decision) do not touch the panel.
    await by_hand(hass, thermostat, 23.0)
    assert panel_titles(no_frontend) == ["Heating"]

    # Renaming the device, as users do from its page, retitles the panel.
    registry = dr.async_get(hass)
    device = schedule_device(hass, entry.entry_id)
    assert device is not None
    registry.async_update_device(device.id, name_by_user="Estia")
    await hass.async_block_till_done()
    assert panel_titles(no_frontend) == ["Heating", "Estia"]
    no_frontend.remove_panel.assert_called_once()

    # The device name wins over the entry title; clearing it falls back.
    hass.config_entries.async_update_entry(entry, title="Living room")
    await hass.async_block_till_done()
    assert panel_titles(no_frontend) == ["Heating", "Estia"]
    registry.async_update_device(device.id, name_by_user=None)
    await hass.async_block_till_done()
    assert panel_titles(no_frontend) == ["Heating", "Estia", "Living room"]
    assert mode(hass, entry) == Mode.MANUAL  # no reload: the hold is untouched


async def switch(hass: HomeAssistant, entry: MockConfigEntry, key: EntityKey, on: bool) -> None:
    await hass.services.async_call(
        SWITCH_DOMAIN,
        SERVICE_TURN_ON if on else SERVICE_TURN_OFF,
        {ATTR_ENTITY_ID: entity(hass, entry, key)},
        blocking=True,
    )
    await hass.async_block_till_done()


def is_on(hass: HomeAssistant, entry: MockConfigEntry, key: EntityKey) -> bool:
    state = hass.states.get(entity(hass, entry, key))
    assert state is not None
    return state.state == STATE_ON


async def test_boost_runs_two_hours_then_back_to_schedule(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    freezer: FrozenDateTimeFactory,
) -> None:
    await switch(hass, entry, EntityKey.BOOST, True)
    assert mode(hass, entry) == Mode.BOOST
    assert thermostat.setpoint == 25.0  # the thermostat's max_temp
    assert is_on(hass, entry, EntityKey.BOOST)

    # The house going empty does not stop it.
    hass.states.async_set(PRESENCE, STATE_OFF)
    await advance(hass, freezer, timedelta(minutes=30))
    assert mode(hass, entry) == Mode.BOOST

    hass.states.async_set(PRESENCE, STATE_ON)
    await advance(hass, freezer, timedelta(minutes=90))
    assert mode(hass, entry) == Mode.HOME
    assert thermostat.setpoint == 20.0
    assert not is_on(hass, entry, EntityKey.BOOST)


async def test_boost_from_all_off_goes_back_off(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    await hass.services.async_call(
        BUTTON_DOMAIN,
        SERVICE_PRESS,
        {ATTR_ENTITY_ID: entity(hass, entry, EntityKey.ALL_OFF)},
        blocking=True,
    )
    await hass.async_block_till_done()
    await switch(hass, entry, EntityKey.BOOST, True)
    assert thermostat.hvac == HVACMode.HEAT
    assert thermostat.setpoint == 25.0

    await switch(hass, entry, EntityKey.BOOST, False)
    assert thermostat.hvac == HVACMode.OFF
    assert mode(hass, entry) == Mode.OFF
    assert not is_on(hass, entry, EntityKey.SCHEDULE)


async def test_boost_from_manual_restores_the_setpoint(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    thermostat: FakeThermostat,
    freezer: FrozenDateTimeFactory,
) -> None:
    await switch(hass, entry, EntityKey.SCHEDULE, False)
    await by_hand(hass, thermostat, 22.0)
    await switch(hass, entry, EntityKey.BOOST, True)
    assert thermostat.setpoint == 25.0

    await advance(hass, freezer, timedelta(minutes=120))
    assert mode(hass, entry) == Mode.PAUSED
    assert thermostat.setpoint == 22.0


async def test_manual_change_ends_boost(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    await switch(hass, entry, EntityKey.BOOST, True)
    await by_hand(hass, thermostat, 21.5)
    assert mode(hass, entry) == Mode.MANUAL
    assert thermostat.setpoint == 21.5
    assert not is_on(hass, entry, EntityKey.BOOST)


async def test_schedule_ends_boost(
    hass: HomeAssistant, entry: MockConfigEntry, thermostat: FakeThermostat
) -> None:
    await switch(hass, entry, EntityKey.BOOST, True)
    await switch(hass, entry, EntityKey.SCHEDULE, True)
    assert mode(hass, entry) == Mode.HOME
    assert thermostat.setpoint == 20.0
    assert not is_on(hass, entry, EntityKey.BOOST)


async def test_migrates_entries_without_boost(
    hass: HomeAssistant, thermostat: FakeThermostat, freezer: FrozenDateTimeFactory
) -> None:
    freezer.move_to(local(10, 0))
    old = make_entry(())
    options = {key: value for key, value in old.options.items() if key != "boost"}
    legacy = MockConfigEntry(
        domain=DOMAIN,
        title=old.title,
        unique_id=old.unique_id,
        data=dict(old.data),
        options=options,
        version=1,
        minor_version=1,
    )
    legacy.add_to_hass(hass)
    assert await hass.config_entries.async_setup(legacy.entry_id)
    await hass.async_block_till_done()
    assert legacy.minor_version == 2
    assert legacy.options["boost"] is None
    assert thermostat.setpoint == 20.0
