"""Table tests for the pure scheduler: the whole behaviour lives here."""

from __future__ import annotations

from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

import pytest
from pydantic import ValidationError

from custom_components.estia.const import Direction, Mode
from custom_components.estia.scheduler import (
    Decision,
    Profile,
    Slot,
    Snapshot,
    Traveller,
    active_slot,
    decide,
    hold_until_after,
    next_wakeup,
)

TZ = ZoneInfo("Europe/Rome")


def at(hh: int, mm: int, ss: int = 0, day: int = 26) -> datetime:
    return datetime(2026, 10, day, hh, mm, ss, tzinfo=TZ)


MORNING = Slot(id="a", start=time(6, 30), setpoint=20.0)
DAY = Slot(id="b", start=time(9, 0), setpoint=18.0)
EVENING = Slot(id="c", start=time(17, 0), setpoint=21.0)
NIGHT = Slot(id="d", start=time(22, 30), setpoint=17.0)
SLOTS = (EVENING, MORNING, NIGHT, DAY)  # deliberately unsorted

NEAR_TOWARDS = Traveller(distance_m=5_000.0, direction=Direction.TOWARDS)
NEAR_STATIONARY = Traveller(distance_m=5_000.0, direction=Direction.STATIONARY)
FAR_TOWARDS = Traveller(distance_m=50_000.0, direction=Direction.TOWARDS)
# Proximity on arrival: distance 0 and direction arrived in the same tick.
ARRIVED = Traveller(distance_m=0.0, direction=Direction.ARRIVED)
UNKNOWN = Traveller(distance_m=None, direction=None)


def every_day(slots: tuple[Slot, ...]) -> tuple[tuple[Profile, ...], tuple[str, ...]]:
    """One profile used all week: the schedule before day profiles."""
    return (Profile(id="all", name="Every day", slots=slots),), ("all",) * 7


def snapshot(
    *,
    schedule_enabled: bool = True,
    hvac_off: bool = False,
    plan: tuple[tuple[Profile, ...], tuple[str, ...]] = every_day(SLOTS),
    empty_since: datetime | None = None,
    preheat_enabled: bool = True,
    travellers: tuple[Traveller, ...] = (),
    hold_until: datetime | None = None,
    boost_until: datetime | None = None,
    max_setpoint: float | None = 25.0,
) -> Snapshot:
    return Snapshot(
        schedule_enabled=schedule_enabled,
        hvac_off=hvac_off,
        profiles=plan[0],
        week=plan[1],
        away_setpoint=15.5,
        away_delay=timedelta(minutes=10),
        preheat_enabled=preheat_enabled,
        preheat_radius_km=20.0,
        empty_since=empty_since,
        travellers=travellers,
        hold_until=hold_until,
        boost_until=boost_until,
        max_setpoint=max_setpoint,
    )


@pytest.mark.parametrize(
    ("now", "expected"),
    [
        (at(0, 0), NIGHT),  # before the first start: last slot of yesterday
        (at(6, 29, 59), NIGHT),
        (at(6, 30), MORNING),  # start is inclusive
        (at(8, 59), MORNING),
        (at(9, 0), DAY),
        (at(16, 59, 59), DAY),
        (at(17, 0), EVENING),
        (at(22, 30), NIGHT),
        (at(23, 59, 59), NIGHT),
    ],
)
def test_active_slot(now: datetime, expected: Slot) -> None:
    assert active_slot(*every_day(SLOTS), now) == expected


def test_active_slot_single_slot_applies_all_day() -> None:
    assert active_slot(*every_day((DAY,)), at(3, 0)) == DAY
    assert active_slot(*every_day((DAY,)), at(12, 0)) == DAY


def test_active_slot_none_without_slots() -> None:
    assert active_slot(*every_day(()), at(12, 0)) is None


@pytest.mark.parametrize(
    ("snap", "now", "expected"),
    [
        # At home: the active slot.
        (
            snapshot(),
            at(10, 0),
            Decision(mode=Mode.HOME, target=18.0, hold_until=None, boost_until=None),
        ),
        # No slots: nothing to push.
        (
            snapshot(plan=every_day(())),
            at(10, 0),
            Decision(mode=Mode.HOME, target=None, hold_until=None, boost_until=None),
        ),
        # Empty for less than the delay: still home.
        (
            snapshot(empty_since=at(9, 51)),
            at(10, 0),
            Decision(mode=Mode.HOME, target=18.0, hold_until=None, boost_until=None),
        ),
        # Empty for exactly the delay: away.
        (
            snapshot(empty_since=at(9, 50)),
            at(10, 0),
            Decision(mode=Mode.AWAY, target=15.5, hold_until=None, boost_until=None),
        ),
        # Away, someone near and coming home: preheat to the slot.
        (
            snapshot(empty_since=at(8, 0), travellers=(FAR_TOWARDS, NEAR_TOWARDS)),
            at(10, 0),
            Decision(mode=Mode.PREHEAT, target=18.0, hold_until=None, boost_until=None),
        ),
        # Arriving: proximity says arrived before the presence sensor turns on
        # (a template a tick behind); still coming back, not away.
        (
            snapshot(empty_since=at(8, 0), travellers=(ARRIVED,)),
            at(10, 0),
            Decision(mode=Mode.PREHEAT, target=18.0, hold_until=None, boost_until=None),
        ),
        # Near but stationary (a day in town) does not count.
        (
            snapshot(empty_since=at(8, 0), travellers=(NEAR_STATIONARY,)),
            at(10, 0),
            Decision(mode=Mode.AWAY, target=15.5, hold_until=None, boost_until=None),
        ),
        # Heading home but outside the radius.
        (
            snapshot(empty_since=at(8, 0), travellers=(FAR_TOWARDS,)),
            at(10, 0),
            Decision(mode=Mode.AWAY, target=15.5, hold_until=None, boost_until=None),
        ),
        # Distance unknown: not near.
        (
            snapshot(empty_since=at(8, 0), travellers=(UNKNOWN,)),
            at(10, 0),
            Decision(mode=Mode.AWAY, target=15.5, hold_until=None, boost_until=None),
        ),
        # Preheat switched off: away even with someone on the way.
        (
            snapshot(empty_since=at(8, 0), travellers=(NEAR_TOWARDS,), preheat_enabled=False),
            at(10, 0),
            Decision(mode=Mode.AWAY, target=15.5, hold_until=None, boost_until=None),
        ),
        # Hold in force at home: leave the setpoint alone.
        (
            snapshot(hold_until=at(17, 0)),
            at(10, 0),
            Decision(mode=Mode.MANUAL, target=None, hold_until=at(17, 0), boost_until=None),
        ),
        # Hold expired: back to the slot, hold dropped.
        (
            snapshot(hold_until=at(9, 0)),
            at(10, 0),
            Decision(mode=Mode.HOME, target=18.0, hold_until=None, boost_until=None),
        ),
        # Hold ends at its instant (exclusive).
        (
            snapshot(hold_until=at(10, 0)),
            at(10, 0),
            Decision(mode=Mode.HOME, target=18.0, hold_until=None, boost_until=None),
        ),
        # The house going empty overrides the hold and clears it.
        (
            snapshot(hold_until=at(17, 0), empty_since=at(8, 0)),
            at(10, 0),
            Decision(mode=Mode.AWAY, target=15.5, hold_until=None, boost_until=None),
        ),
        # Empty but preheating: the hold still wins over the slots.
        (
            snapshot(hold_until=at(17, 0), empty_since=at(8, 0), travellers=(NEAR_TOWARDS,)),
            at(10, 0),
            Decision(mode=Mode.MANUAL, target=None, hold_until=at(17, 0), boost_until=None),
        ),
        # Schedule off: paused, nothing pushed, hold untouched.
        (
            snapshot(schedule_enabled=False, empty_since=at(8, 0), hold_until=at(17, 0)),
            at(10, 0),
            Decision(mode=Mode.PAUSED, target=None, hold_until=at(17, 0), boost_until=None),
        ),
        # Thermostat off: off wins over everything, nothing pushed.
        (
            snapshot(hvac_off=True, schedule_enabled=False),
            at(10, 0),
            Decision(mode=Mode.OFF, target=None, hold_until=None, boost_until=None),
        ),
        (
            snapshot(hvac_off=True, empty_since=at(8, 0)),
            at(10, 0),
            Decision(mode=Mode.OFF, target=None, hold_until=None, boost_until=None),
        ),
    ],
)
def test_decide(snap: Snapshot, now: datetime, expected: Decision) -> None:
    assert decide(snap, now) == expected


@pytest.mark.parametrize(
    ("snap", "now", "expected"),
    [
        # Boost: the thermostat's maximum, over the slots.
        (
            snapshot(boost_until=at(12, 0)),
            at(10, 0),
            Decision(mode=Mode.BOOST, target=25.0, hold_until=None, boost_until=at(12, 0)),
        ),
        # ... over the house being empty (it was switched on on purpose) ...
        (
            snapshot(boost_until=at(12, 0), empty_since=at(8, 0)),
            at(10, 0),
            Decision(mode=Mode.BOOST, target=25.0, hold_until=None, boost_until=at(12, 0)),
        ),
        # ... over a paused schedule, keeping its hold for afterwards.
        (
            snapshot(boost_until=at(12, 0), schedule_enabled=False, hold_until=at(17, 0)),
            at(10, 0),
            Decision(mode=Mode.BOOST, target=25.0, hold_until=at(17, 0), boost_until=at(12, 0)),
        ),
        # Thermostat maximum unknown (unavailable): boost, nothing pushed.
        (
            snapshot(boost_until=at(12, 0), max_setpoint=None),
            at(10, 0),
            Decision(mode=Mode.BOOST, target=None, hold_until=None, boost_until=at(12, 0)),
        ),
        # Expired: back to what was there before, boost dropped.
        (
            snapshot(boost_until=at(10, 0)),
            at(10, 0),
            Decision(mode=Mode.HOME, target=18.0, hold_until=None, boost_until=None),
        ),
        (
            snapshot(boost_until=at(9, 0), schedule_enabled=False),
            at(10, 0),
            Decision(mode=Mode.PAUSED, target=None, hold_until=None, boost_until=None),
        ),
        # Thermostat switched off by hand: off, the boost waits for its end.
        (
            snapshot(boost_until=at(12, 0), hvac_off=True),
            at(10, 0),
            Decision(mode=Mode.OFF, target=None, hold_until=None, boost_until=at(12, 0)),
        ),
    ],
)
def test_decide_boost(snap: Snapshot, now: datetime, expected: Decision) -> None:
    assert decide(snap, now) == expected


@pytest.mark.parametrize(
    ("slots", "now", "expected"),
    [
        # Next start later today.
        (SLOTS, at(10, 0), at(17, 0)),
        # A start equal to now is not "next".
        (SLOTS, at(17, 0), at(22, 30)),
        (SLOTS, at(16, 59, 59), at(17, 0)),
        # After the last start: tomorrow's first.
        (SLOTS, at(23, 0), at(6, 30, day=27)),
        # Before the first start: today's first.
        (SLOTS, at(1, 0), at(6, 30)),
        # No slots: a day from now, on the minute.
        ((), at(10, 15, 42), at(10, 15, day=27)),
    ],
)
def test_hold_until_after(slots: tuple[Slot, ...], now: datetime, expected: datetime) -> None:
    assert hold_until_after(*every_day(slots), now) == expected


@pytest.mark.parametrize(
    ("snap", "now", "expected"),
    [
        # Next slot start.
        (snapshot(), at(10, 0), at(17, 0)),
        (snapshot(), at(23, 0), at(6, 30, day=27)),
        # The hold expires before the next start (hand-moved slots).
        (snapshot(hold_until=at(12, 0)), at(10, 0), at(12, 0)),
        # An expired hold is not a wakeup.
        (snapshot(hold_until=at(9, 0)), at(10, 0), at(17, 0)),
        # The away delay elapses before the next start.
        (snapshot(empty_since=at(9, 55)), at(10, 0), at(10, 5)),
        # Already away: the delay is no longer a wakeup.
        (snapshot(empty_since=at(9, 0)), at(10, 0), at(17, 0)),
        # Nothing scheduled at all.
        (snapshot(plan=every_day(())), at(10, 0), None),
        # The boost ends before the next start.
        (snapshot(boost_until=at(12, 0)), at(10, 0), at(12, 0)),
        # Paused: only the end of a boost.
        (snapshot(schedule_enabled=False, boost_until=at(12, 0)), at(10, 0), at(12, 0)),
        # Paused or off: nothing to wake for.
        (snapshot(schedule_enabled=False), at(10, 0), None),
        (snapshot(hvac_off=True), at(10, 0), None),
    ],
)
def test_next_wakeup(snap: Snapshot, now: datetime, expected: datetime | None) -> None:
    assert next_wakeup(snap, now) == expected


# -- day profiles -----------------------------------------------------------
# 2026-10-26 is a Monday: day=30 is Friday, day=31 Saturday, 2026-11-01 Sunday.

LATE_RISE = Slot(id="e", start=time(8, 30), setpoint=22.0)
LATE_NIGHT = Slot(id="f", start=time(23, 0), setpoint=16.0)
WEEKDAYS = Profile(id="wd", name="Weekdays", slots=SLOTS)
WEEKEND = Profile(id="we", name="Weekend", slots=(LATE_NIGHT, LATE_RISE))
OFF_DAY = Profile(id="off", name="Off", slots=())
WORK_WEEK = ("wd", "wd", "wd", "wd", "wd", "we", "we")
FRIDAY, SATURDAY = 30, 31
SUNDAY = datetime(2026, 11, 1, 10, 0, tzinfo=TZ)


def week_plan(
    profiles: tuple[Profile, ...], week: tuple[str, ...]
) -> tuple[tuple[Profile, ...], tuple[str, ...]]:
    return profiles, week


WORKING = week_plan((WEEKDAYS, WEEKEND), WORK_WEEK)


@pytest.mark.parametrize(
    ("now", "expected"),
    [
        # Weekday profile on a weekday, weekend profile on a weekend.
        (at(10, 0, day=FRIDAY), DAY),
        (at(10, 0, day=FRIDAY - 4), DAY),
        (at(10, 0, day=SATURDAY), LATE_RISE),
        (SUNDAY, LATE_RISE),
        # Saturday before its first start: Friday's last slot carries over.
        (at(0, 0, day=SATURDAY), NIGHT),
        (at(8, 29, 59, day=SATURDAY), NIGHT),
        (at(8, 30, day=SATURDAY), LATE_RISE),
        # Saturday's last slot carries into Sunday before 08:30.
        (at(23, 30, day=SATURDAY), LATE_NIGHT),
        (SUNDAY.replace(hour=7), LATE_NIGHT),
        # Monday before 06:30: Sunday's last slot.
        (datetime(2026, 11, 2, 6, 0, tzinfo=TZ), LATE_NIGHT),
    ],
)
def test_active_slot_by_weekday(now: datetime, expected: Slot) -> None:
    assert active_slot(*WORKING, now) == expected


def test_active_slot_empty_day_carries_over_the_previous_day() -> None:
    plan = week_plan((WEEKDAYS, OFF_DAY), ("wd", "wd", "wd", "wd", "wd", "off", "off"))
    # Saturday and Sunday have no slots: Friday's last one holds all weekend...
    assert active_slot(*plan, at(12, 0, day=SATURDAY)) == NIGHT
    assert active_slot(*plan, SUNDAY) == NIGHT
    # ... until Monday's first start.
    assert active_slot(*plan, datetime(2026, 11, 2, 6, 0, tzinfo=TZ)) == NIGHT
    assert active_slot(*plan, datetime(2026, 11, 2, 6, 30, tzinfo=TZ)) == MORNING


def test_active_slot_only_one_day_has_slots() -> None:
    # The search back covers a whole week: the same weekday last week.
    plan = week_plan((WEEKDAYS, OFF_DAY), ("off", "off", "off", "off", "wd", "off", "off"))
    assert active_slot(*plan, at(3, 0, day=FRIDAY)) == NIGHT
    assert active_slot(*plan, at(12, 0)) == NIGHT  # Monday


def test_active_slot_none_when_every_profile_is_empty() -> None:
    plan = week_plan((OFF_DAY, WEEKDAYS), ("off",) * 7)  # WEEKDAYS unused
    assert active_slot(*plan, at(12, 0)) is None


@pytest.mark.parametrize(
    ("now", "expected"),
    [
        # Friday evening: the next start is Saturday's first, not Monday's.
        (at(23, 0, day=FRIDAY), at(8, 30, day=SATURDAY)),
        (at(22, 30, day=FRIDAY), at(8, 30, day=SATURDAY)),
        (at(22, 29, day=FRIDAY), at(22, 30, day=FRIDAY)),
        # Saturday: the weekend profile's starts, then Sunday's first.
        (at(8, 30, day=SATURDAY), at(23, 0, day=SATURDAY)),
        (at(23, 0, day=SATURDAY), datetime(2026, 11, 1, 8, 30, tzinfo=TZ)),
        # Sunday night crosses into the weekday profile.
        (SUNDAY.replace(hour=23, minute=30), datetime(2026, 11, 2, 6, 30, tzinfo=TZ)),
    ],
)
def test_hold_until_after_crosses_profiles(now: datetime, expected: datetime) -> None:
    assert hold_until_after(*WORKING, now) == expected


def test_hold_until_after_skips_empty_days() -> None:
    plan = week_plan((WEEKDAYS, OFF_DAY), ("wd", "wd", "wd", "wd", "wd", "off", "off"))
    assert hold_until_after(*plan, at(23, 0, day=FRIDAY)) == datetime(
        2026, 11, 2, 6, 30, tzinfo=TZ
    )


def test_hold_until_after_only_slots_are_today_and_already_started() -> None:
    plan = week_plan((WEEKDAYS, OFF_DAY), ("off", "off", "off", "off", "wd", "off", "off"))
    # Friday 23:00: the next start is next Friday's first.
    assert hold_until_after(*plan, at(23, 0, day=FRIDAY)) == datetime(
        2026, 11, 6, 6, 30, tzinfo=TZ
    )


def test_hold_until_after_all_profiles_empty() -> None:
    plan = week_plan((OFF_DAY,), ("off",) * 7)
    assert hold_until_after(*plan, at(10, 15, 42)) == at(10, 15, day=27)


def test_decide_follows_the_day_profile() -> None:
    saturday = decide(snapshot(plan=WORKING), at(10, 0, day=SATURDAY))
    assert saturday == Decision(mode=Mode.HOME, target=22.0, hold_until=None, boost_until=None)
    friday = decide(snapshot(plan=WORKING), at(10, 0, day=FRIDAY))
    assert friday == Decision(mode=Mode.HOME, target=18.0, hold_until=None, boost_until=None)


def test_next_wakeup_crosses_into_the_next_profile() -> None:
    assert next_wakeup(snapshot(plan=WORKING), at(23, 0, day=FRIDAY)) == at(8, 30, day=SATURDAY)


def test_next_wakeup_none_when_every_profile_is_empty() -> None:
    assert next_wakeup(snapshot(plan=week_plan((OFF_DAY,), ("off",) * 7)), at(10, 0)) is None


def test_profile_rejects_two_slots_at_the_same_time() -> None:
    twin = Slot(id="z", start=MORNING.start, setpoint=19.0)
    with pytest.raises(ValidationError, match="same time"):
        Profile(id="p", name="P", slots=(MORNING, twin))


@pytest.mark.parametrize(
    ("profiles", "week", "message"),
    [
        ((), ("wd",) * 7, "at least one profile"),
        ((WEEKDAYS, WEEKDAYS), ("wd",) * 7, "unique"),
        ((WEEKDAYS,), ("wd",) * 6, "7 profile ids"),
        ((WEEKDAYS,), ("wd",) * 8, "7 profile ids"),
        ((WEEKDAYS,), ("wd",) * 6 + ("gone",), "gone"),
    ],
)
def test_snapshot_rejects_an_inconsistent_week(
    profiles: tuple[Profile, ...], week: tuple[str, ...], message: str
) -> None:
    with pytest.raises(ValidationError, match=message):
        snapshot(plan=(profiles, week))
