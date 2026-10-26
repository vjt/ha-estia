"""Config entry payloads, parsed at the boundary."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from .const import Mode
from .scheduler import Slot


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


class StoredState(BaseModel):
    """Entry options: everything the user and the schedule change at runtime.

    `mode` is the last decided mode, kept so that a restart does not announce
    a mode change that did not happen.
    """

    model_config = ConfigDict(frozen=True)

    slots: tuple[Slot, ...]
    schedule_enabled: bool
    preheat_enabled: bool
    away_setpoint: float
    away_delay_min: int
    preheat_radius_km: float
    hold_until: datetime | None
    mode: Mode | None
