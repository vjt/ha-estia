"""The heating schedule as pure functions of a state snapshot and the current time.

No Home Assistant imports: the runtime parses entity states into a `Snapshot`,
asks `decide` what to do and `next_wakeup` when to ask again.

Slot start times are local wall-clock times; `now` must be an aware datetime in
the local time zone, so that `now.time()` and `now.date()` are local too.

A schedule is a set of day profiles (named lists of slots) and a week: the id
of the profile each weekday uses, Monday first (`date.weekday()`).
"""

from __future__ import annotations

from datetime import date, datetime, time, timedelta

from pydantic import BaseModel, ConfigDict, model_validator

from .const import DAYS_PER_WEEK, Direction, Mode


class Slot(BaseModel):
    """One daily slot: from `start` until the next slot's start, heat to `setpoint`."""

    model_config = ConfigDict(frozen=True)

    id: str
    start: time
    setpoint: float


class Profile(BaseModel):
    """A named day: the slots of the days that use it. Start times are unique."""

    model_config = ConfigDict(frozen=True)

    id: str
    name: str
    slots: tuple[Slot, ...]

    @model_validator(mode="after")
    def _unique_starts(self) -> Profile:
        starts = [slot.start for slot in self.slots]
        if len(set(starts)) != len(starts):
            raise ValueError(f"profile {self.id} has two slots starting at the same time")
        return self


def check_week(profiles: tuple[Profile, ...], week: tuple[str, ...]) -> None:
    """Raises ValueError unless there is at least one profile, profile ids are
    unique, and `week` names an existing profile for each of the 7 weekdays."""
    if not profiles:
        raise ValueError("at least one profile is required")
    ids = [profile.id for profile in profiles]
    if len(set(ids)) != len(ids):
        raise ValueError("profile ids must be unique")
    if len(week) != DAYS_PER_WEEK:
        raise ValueError(f"the week needs {DAYS_PER_WEEK} profile ids, got {len(week)}")
    unknown = sorted(set(week) - set(ids))
    if unknown:
        raise ValueError(f"the week uses unknown profiles: {', '.join(unknown)}")


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
    profiles: tuple[Profile, ...]
    week: tuple[str, ...]
    away_setpoint: float
    away_delay: timedelta
    preheat_enabled: bool
    preheat_radius_km: float
    # When the presence sensor went off; None while it is anything but off.
    empty_since: datetime | None
    travellers: tuple[Traveller, ...]
    hold_until: datetime | None
    boost_until: datetime | None
    # The thermostat's max_temp; None while it is unavailable.
    max_setpoint: float | None

    @model_validator(mode="after")
    def _valid_week(self) -> Snapshot:
        check_week(self.profiles, self.week)
        return self


class Decision(BaseModel):
    """What the thermostat should do now.

    `target` None means leave the setpoint alone. `hold_until` is the manual
    hold to keep: an expired hold, or one overridden by the house going empty,
    comes back as None. `boost_until` likewise: None once the boost is over.
    """

    model_config = ConfigDict(frozen=True)

    mode: Mode
    target: float | None
    hold_until: datetime | None
    boost_until: datetime | None


def sorted_slots(slots: tuple[Slot, ...]) -> tuple[Slot, ...]:
    """Slots in start order."""
    return tuple(sorted(slots, key=lambda slot: slot.start))


def day_slots(profiles: tuple[Profile, ...], week: tuple[str, ...], day: date) -> tuple[Slot, ...]:
    """The slots of `day`, in start order: those of the profile its weekday
    uses. Raises KeyError if `week` names a profile that does not exist."""
    by_id = {profile.id: profile for profile in profiles}
    return sorted_slots(by_id[week[day.weekday()]].slots)


def active_slot(
    profiles: tuple[Profile, ...], week: tuple[str, ...], now: datetime
) -> Slot | None:
    """The slot with the latest start not after now among today's; before
    today's first start (or on a day without slots), the last slot of the most
    recent earlier day that has any, up to a week back. None without slots."""
    today = day_slots(profiles, week, now.date())
    started = [slot for slot in today if slot.start <= now.time()]
    if started:
        return started[-1]
    for back in range(1, DAYS_PER_WEEK + 1):
        earlier = day_slots(profiles, week, now.date() - timedelta(days=back))
        if earlier:
            return earlier[-1]
    return None


def hold_until_after(
    profiles: tuple[Profile, ...], week: tuple[str, ...], now: datetime
) -> datetime:
    """The next slot start strictly after now, today or on the following days
    (each with its own profile), up to a week ahead.

    Without slots, a day from now (on the minute).
    """
    for ahead in range(DAYS_PER_WEEK + 1):
        day = now.date() + timedelta(days=ahead)
        for slot in day_slots(profiles, week, day):
            if ahead > 0 or slot.start > now.time():
                return datetime.combine(day, slot.start, tzinfo=now.tzinfo)
    return (now + timedelta(days=1)).replace(second=0, microsecond=0)


def has_slots(profiles: tuple[Profile, ...], week: tuple[str, ...]) -> bool:
    """Whether any day of the week has a slot (profiles no day uses do not count)."""
    return any(profile.slots for profile in profiles if profile.id in week)


def _is_empty(snapshot: Snapshot, now: datetime) -> bool:
    return snapshot.empty_since is not None and now - snapshot.empty_since >= snapshot.away_delay


# Arrived counts as coming back: on arrival proximity reports it in the same
# tick as distance 0, and the presence sensor (often a template on top of
# person entities) can turn on a tick later; in between the house would look
# empty with no one on the way, and go away for a moment.
_COMING_BACK = frozenset({Direction.TOWARDS, Direction.ARRIVED})


def _someone_coming_back(snapshot: Snapshot) -> bool:
    if not snapshot.preheat_enabled:
        return False
    radius_m = snapshot.preheat_radius_km * 1000
    return any(
        traveller.distance_m is not None
        and traveller.distance_m < radius_m
        and traveller.direction in _COMING_BACK
        for traveller in snapshot.travellers
    )


def decide(snapshot: Snapshot, now: datetime) -> Decision:
    """The mode and target for now. Total: every snapshot has a decision.

    Precedence: thermostat off, boost (switched on on purpose: it wins over
    everything the schedule would do), paused, away, manual hold, slots.
    """
    boost = snapshot.boost_until if _active(snapshot.boost_until, now) else None
    if snapshot.hvac_off:
        return Decision(
            mode=Mode.OFF, target=None, hold_until=snapshot.hold_until, boost_until=boost
        )
    if boost is not None:
        return Decision(
            mode=Mode.BOOST,
            target=snapshot.max_setpoint,
            hold_until=snapshot.hold_until,
            boost_until=boost,
        )
    if not snapshot.schedule_enabled:
        return Decision(
            mode=Mode.PAUSED, target=None, hold_until=snapshot.hold_until, boost_until=None
        )

    empty = _is_empty(snapshot, now)
    if empty and not _someone_coming_back(snapshot):
        return Decision(
            mode=Mode.AWAY, target=snapshot.away_setpoint, hold_until=None, boost_until=None
        )

    if _active(snapshot.hold_until, now):
        return Decision(
            mode=Mode.MANUAL, target=None, hold_until=snapshot.hold_until, boost_until=None
        )

    slot = active_slot(snapshot.profiles, snapshot.week, now)
    return Decision(
        mode=Mode.PREHEAT if empty else Mode.HOME,
        target=slot.setpoint if slot is not None else None,
        hold_until=None,
        boost_until=None,
    )


def _active(until: datetime | None, now: datetime) -> bool:
    return until is not None and now < until


def next_wakeup(snapshot: Snapshot, now: datetime) -> datetime | None:
    """The next instant at which `decide` may change its answer without any
    state change: a slot start, the hold expiring, the away delay elapsing.

    None when nothing is scheduled (or the schedule is paused or off).
    """
    if snapshot.hvac_off:
        return None
    candidates: list[datetime] = []
    if snapshot.boost_until is not None and snapshot.boost_until > now:
        candidates.append(snapshot.boost_until)
    if not snapshot.schedule_enabled:
        return min(candidates) if candidates else None
    if has_slots(snapshot.profiles, snapshot.week):
        candidates.append(hold_until_after(snapshot.profiles, snapshot.week, now))
    if snapshot.hold_until is not None and snapshot.hold_until > now:
        candidates.append(snapshot.hold_until)
    if snapshot.empty_since is not None:
        away_at = snapshot.empty_since + snapshot.away_delay
        if away_at > now:
            candidates.append(away_at)
    return min(candidates) if candidates else None
