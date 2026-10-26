"""Constants for Estia. No Home Assistant imports: the scheduler uses these."""

from __future__ import annotations

from enum import StrEnum
from typing import Final

DOMAIN: Final = "estia"


class Mode(StrEnum):
    """Where the current target comes from."""

    HOME = "home"
    AWAY = "away"
    PREHEAT = "preheat"
    MANUAL = "manual"
    BOOST = "boost"
    PAUSED = "paused"
    OFF = "off"


class Direction(StrEnum):
    """Direction of travel, as reported by the proximity integration."""

    ARRIVED = "arrived"
    AWAY_FROM = "away_from"
    STATIONARY = "stationary"
    TOWARDS = "towards"


class Event(StrEnum):
    """Events fired on the bus; notifications are left to the user's automations."""

    MODE_CHANGED = f"{DOMAIN}_mode_changed"
    OFF = f"{DOMAIN}_off"
    RESUMED = f"{DOMAIN}_resumed"


class Service(StrEnum):
    SET_SLOT = "set_slot"
    ADD_SLOT = "add_slot"
    REMOVE_SLOT = "remove_slot"
    RESUME = "resume"


class EntityKey(StrEnum):
    """Unique-id suffixes and translation keys of the entry's entities."""

    MODE = "mode"
    SCHEDULE = "schedule"
    PREHEAT = "preheat"
    BOOST = "boost"
    AWAY_SETPOINT = "away_setpoint"
    AWAY_DELAY = "away_delay"
    PREHEAT_RADIUS = "preheat_radius"
    RESUME = "resume"
    ALL_OFF = "all_off"


class Attr(StrEnum):
    """Attributes of the mode sensor: the card's data source."""

    SLOTS = "slots"
    ACTIVE_SLOT = "active_slot"
    HOLD_UNTIL = "hold_until"
    BOOST_UNTIL = "boost_until"
    TARGET = "target"
    CONFIG_ENTRY_ID = "config_entry_id"
    CLIMATE = "climate_entity"
    PRESENCE = "presence_entity"
    PROXIMITY = "proximity"
    SETPOINT_MIN = "setpoint_min"
    SETPOINT_MAX = "setpoint_max"
    SETPOINT_STEP = "setpoint_step"


class Field(StrEnum):
    """Keys of service calls, config flow forms and event payloads."""

    CONFIG_ENTRY_ID = "config_entry_id"
    SLOT_ID = "slot_id"
    START = "start"
    SETPOINT = "setpoint"
    CLIMATE = "climate"
    PRESENCE = "presence"
    PROXIMITY = "proximity"
    SLOT_COUNT = "slot_count"
    MODE = "mode"
    PREVIOUS_MODE = "previous_mode"
    TARGET = "target"
    AWAY_SETPOINT = "away_setpoint"


# Bounds shared by slot setpoints, the away setpoint and the card's stepper.
SETPOINT_MIN: Final = 5.0
SETPOINT_MAX: Final = 35.0
SETPOINT_STEP: Final = 0.1

AWAY_DELAY_MAX_MIN: Final = 120
PREHEAT_RADIUS_MIN_KM: Final = 1.0
PREHEAT_RADIUS_MAX_KM: Final = 100.0

# Initial values for a new entry (genuine configuration, changed from the UI).
INITIAL_SLOT_COUNT: Final = 3
INITIAL_SLOT_SETPOINT: Final = 20.0
INITIAL_AWAY_SETPOINT: Final = 16.0
INITIAL_AWAY_DELAY_MIN: Final = 10
INITIAL_PREHEAT_RADIUS_KM: Final = 20.0

# How long Boost holds the thermostat at its maximum before it ends by itself.
BOOST_DURATION_MIN: Final = 120

# After switching the thermostat back to heat, how long to wait for it to
# report a numeric setpoint before applying the schedule.
HVAC_ON_SETTLE_SECONDS: Final = 30
