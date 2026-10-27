"""Config entry payloads, parsed at the boundary."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, model_validator

from .const import Mode
from .scheduler import Profile, check_week


class TravellerSensors(BaseModel):
    """A proximity pair: distance from home and direction of travel."""

    model_config = ConfigDict(frozen=True)

    distance: str
    direction: str


class Wiring(BaseModel):
    """Entry data: which entities the schedule reads and drives. Set by the
    config flow, changed only by reconfiguring the entry."""

    model_config = ConfigDict(frozen=True)

    climate: str
    presence: str
    proximity: tuple[TravellerSensors, ...]


class Boost(BaseModel):
    """A running boost, and what to go back to when it ends by itself or is
    switched off: the thermostat off, or the setpoint it had (None when the
    schedule decides it anyway)."""

    model_config = ConfigDict(frozen=True)

    until: datetime
    then_off: bool
    then_setpoint: float | None


class StoredState(BaseModel):
    """Entry options: everything the user and the schedule change at runtime.

    `mode` is the last decided mode, kept so that a restart does not announce
    a mode change that did not happen.
    """

    model_config = ConfigDict(frozen=True)

    profiles: tuple[Profile, ...]
    # The id of the profile each weekday uses, Monday first.
    week: tuple[str, ...]
    schedule_enabled: bool
    preheat_enabled: bool
    away_setpoint: float
    away_delay_min: int
    preheat_radius_km: float
    hold_until: datetime | None
    boost: Boost | None
    mode: Mode | None

    @model_validator(mode="after")
    def _valid_week(self) -> StoredState:
        check_week(self.profiles, self.week)
        return self
