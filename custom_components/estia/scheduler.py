"""The heating schedule as pure functions of a state snapshot and the current time.

No Home Assistant imports: the runtime parses entity states into a `Snapshot`,
asks `decide` what to do and `next_wakeup` when to ask again.

Slot start times are local wall-clock times; `now` must be an aware datetime in
the local time zone, so that `now.time()` and `now.date()` are local too.
"""

from __future__ import annotations

from datetime import datetime, time, timedelta

from pydantic import BaseModel, ConfigDict

from .const import Direction, Mode


class Slot(BaseModel):
    """One daily slot: from `start` until the next slot's start, heat to `setpoint`."""

    model_config = ConfigDict(frozen=True)

    id: str
    start: time
    setpoint: float


class Traveller(BaseModel):
    """A tracked person's distance from home and direction of travel.

    `None` when the proximity sensor is unknown or unavailable.
    """

    model_config = ConfigDict(frozen=True)

    distance_m: float | None
    direction: Direction | None


class Snapshot(BaseModel):
    """Everything the schedule depends on, at one instant."""

    model_config = ConfigDict(frozen=True)

    schedule_enabled: bool
    hvac_off: bool
    slots: tuple[Slot, ...]
    away_setpoint: float
    away_delay: timedelta
    preheat_enabled: bool
    preheat_radius_km: float
    # When the presence sensor went off; None while it is anything but off.
    empty_since: datetime | None
    travellers: tuple[Traveller, ...]
    hold_until: datetime | None


class Decision(BaseModel):
    """What the thermostat should do now.

    `target` None means leave the setpoint alone. `hold_until` is the manual
    hold to keep: an expired hold, or one overridden by the house going empty,
    comes back as None.
    """

    model_config = ConfigDict(frozen=True)

    mode: Mode
    target: float | None
    hold_until: datetime | None


def sorted_slots(slots: tuple[Slot, ...]) -> tuple[Slot, ...]:
    """Slots in start order."""
    return tuple(sorted(slots, key=lambda slot: slot.start))


def active_slot(slots: tuple[Slot, ...], now: datetime) -> Slot | None:
    """The slot with the latest start not after now; before the first start of
    the day, the last slot of the day before. None without slots."""
    ordered = sorted_slots(slots)
    if not ordered:
        return None
    started = [slot for slot in ordered if slot.start <= now.time()]
    return started[-1] if started else ordered[-1]


def hold_until_after(slots: tuple[Slot, ...], now: datetime) -> datetime:
    """The next slot start strictly after now, today or tomorrow.

    Without slots, a day from now (on the minute).
    """
    starts = [slot.start for slot in sorted_slots(slots)]
    later = [start for start in starts if start > now.time()]
    if later:
        return datetime.combine(now.date(), later[0], tzinfo=now.tzinfo)
    if starts:
        return datetime.combine(now.date() + timedelta(days=1), starts[0], tzinfo=now.tzinfo)
    return (now + timedelta(days=1)).replace(second=0, microsecond=0)


def _is_empty(snapshot: Snapshot, now: datetime) -> bool:
    return snapshot.empty_since is not None and now - snapshot.empty_since >= snapshot.away_delay


def _someone_coming_back(snapshot: Snapshot) -> bool:
    if not snapshot.preheat_enabled:
        return False
    radius_m = snapshot.preheat_radius_km * 1000
    return any(
        traveller.distance_m is not None
        and traveller.distance_m < radius_m
        and traveller.direction is Direction.TOWARDS
        for traveller in snapshot.travellers
    )


def decide(snapshot: Snapshot, now: datetime) -> Decision:
    """The mode and target for now. Total: every snapshot has a decision."""
    if snapshot.hvac_off:
        return Decision(mode=Mode.OFF, target=None, hold_until=snapshot.hold_until)
    if not snapshot.schedule_enabled:
        return Decision(mode=Mode.PAUSED, target=None, hold_until=snapshot.hold_until)

    empty = _is_empty(snapshot, now)
    if empty and not _someone_coming_back(snapshot):
        return Decision(mode=Mode.AWAY, target=snapshot.away_setpoint, hold_until=None)

    if snapshot.hold_until is not None and now < snapshot.hold_until:
        return Decision(mode=Mode.MANUAL, target=None, hold_until=snapshot.hold_until)

    slot = active_slot(snapshot.slots, now)
    return Decision(
        mode=Mode.PREHEAT if empty else Mode.HOME,
        target=slot.setpoint if slot is not None else None,
        hold_until=None,
    )


def next_wakeup(snapshot: Snapshot, now: datetime) -> datetime | None:
    """The next instant at which `decide` may change its answer without any
    state change: a slot start, the hold expiring, the away delay elapsing.

    None when nothing is scheduled (or the schedule is paused or off).
    """
    if snapshot.hvac_off or not snapshot.schedule_enabled:
        return None
    candidates: list[datetime] = []
    if snapshot.slots:
        candidates.append(hold_until_after(snapshot.slots, now))
    if snapshot.hold_until is not None and snapshot.hold_until > now:
        candidates.append(snapshot.hold_until)
    if snapshot.empty_since is not None:
        away_at = snapshot.empty_since + snapshot.away_delay
        if away_at > now:
            candidates.append(away_at)
    return min(candidates) if candidates else None
