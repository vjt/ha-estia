"""The Home Assistant side of the schedule: reads states, applies decisions."""

from __future__ import annotations

import asyncio
import logging
import uuid
from collections.abc import Callable
from datetime import datetime, time, timedelta

from homeassistant.components.climate.const import (
    ATTR_HVAC_MODE,
    ATTR_MAX_TEMP,
    SERVICE_SET_HVAC_MODE,
    SERVICE_SET_TEMPERATURE,
    HVACMode,
)
from homeassistant.components.climate.const import (
    DOMAIN as CLIMATE_DOMAIN,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    ATTR_ENTITY_ID,
    ATTR_TEMPERATURE,
    ATTR_UNIT_OF_MEASUREMENT,
    STATE_OFF,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
    UnitOfLength,
)
from homeassistant.core import (
    CALLBACK_TYPE,
    Context,
    Event,
    EventStateChangedData,
    HomeAssistant,
    State,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_state_change_event,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.util import dt as dt_util
from homeassistant.util.unit_conversion import DistanceConverter

from .const import BOOST_DURATION_MIN, DOMAIN, HVAC_ON_SETTLE_SECONDS, Direction, Field
from .const import Event as EstiaEvent
from .models import Boost, StoredState, TravellerSensors, Wiring
from .scheduler import (
    Decision,
    Profile,
    Slot,
    Snapshot,
    Traveller,
    decide,
    hold_until_after,
    next_wakeup,
    sorted_slots,
)

_LOGGER = logging.getLogger(__name__)

_MISSING = (STATE_UNAVAILABLE, STATE_UNKNOWN)

type EstiaConfigEntry = ConfigEntry[EstiaRuntime]


def _setpoint_of(state: State) -> float | None:
    """The climate entity's target temperature, None when it has none (off,
    unavailable, or a range-only thermostat)."""
    if ATTR_TEMPERATURE not in state.attributes:
        return None
    value = state.attributes[ATTR_TEMPERATURE]
    if isinstance(value, bool) or not isinstance(value, int | float):
        return None
    return float(value)


def _max_setpoint_of(state: State | None) -> float | None:
    """The thermostat's max_temp; None when it is unavailable (climate
    entities always report it otherwise)."""
    if state is None or state.state in _MISSING:
        return None
    value = state.attributes[ATTR_MAX_TEMP]
    return float(value)


def _parse_traveller(hass: HomeAssistant, sensors: TravellerSensors) -> Traveller:
    """Read a proximity pair. Unknown/unavailable/missing sensors yield None
    fields; any other non-numeric distance or unknown direction raises."""
    distance = hass.states.get(sensors.distance)
    direction = hass.states.get(sensors.direction)
    distance_m: float | None = None
    if distance is not None and distance.state not in _MISSING:
        distance_m = DistanceConverter.convert(
            float(distance.state),
            distance.attributes[ATTR_UNIT_OF_MEASUREMENT],
            UnitOfLength.METERS,
        )
    direction_value: Direction | None = None
    if direction is not None and direction.state not in _MISSING:
        direction_value = Direction(direction.state)
    return Traveller(distance_m=distance_m, direction=direction_value)


class EstiaRuntime:
    """Owns the stored state of one entry and keeps the thermostat on schedule.

    Entities read from it and call its mutators; it notifies them through
    listeners after every change.
    """

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, wiring: Wiring) -> None:
        self._hass = hass
        self._entry = entry
        self.wiring = wiring
        self.state = StoredState.model_validate(entry.options)
        self.decision: Decision | None = None
        self._lock = asyncio.Lock()
        self._listeners: list[CALLBACK_TYPE] = []
        self._unsubs: list[CALLBACK_TYPE] = []
        self._unsub_wakeup: CALLBACK_TYPE | None = None

    @property
    def entry_id(self) -> str:
        return self._entry.entry_id

    # -- lifecycle ---------------------------------------------------------

    async def async_start(self) -> None:
        """Subscribe to every input of the schedule; apply once HA has started."""
        self._unsubs.append(
            async_track_state_change_event(
                self._hass, self.wiring.climate, self._on_climate_change
            )
        )
        inputs = [self.wiring.presence]
        for pair in self.wiring.proximity:
            inputs.extend((pair.distance, pair.direction))
        self._unsubs.append(
            async_track_state_change_event(self._hass, inputs, self._on_input_change)
        )
        self._unsubs.append(async_at_started(self._hass, self._on_started))

    async def async_stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        self._cancel_wakeup()

    @callback
    def async_add_listener(self, listener: CALLBACK_TYPE) -> CALLBACK_TYPE:
        """Call `listener` after every change; returns the unsubscribe."""
        self._listeners.append(listener)

        @callback
        def remove() -> None:
            self._listeners.remove(listener)

        return remove

    # -- reading -----------------------------------------------------------

    def _snapshot(self) -> Snapshot:
        climate = self._hass.states.get(self.wiring.climate)
        presence = self._hass.states.get(self.wiring.presence)
        return Snapshot(
            schedule_enabled=self.state.schedule_enabled,
            hvac_off=climate is not None and climate.state == HVACMode.OFF,
            profiles=self.state.profiles,
            week=self.state.week,
            away_setpoint=self.state.away_setpoint,
            away_delay=timedelta(minutes=self.state.away_delay_min),
            preheat_enabled=self.state.preheat_enabled,
            preheat_radius_km=self.state.preheat_radius_km,
            empty_since=(
                presence.last_changed
                if presence is not None and presence.state == STATE_OFF
                else None
            ),
            travellers=tuple(_parse_traveller(self._hass, pair) for pair in self.wiring.proximity),
            hold_until=self.state.hold_until,
            boost_until=self.state.boost.until if self.state.boost is not None else None,
            max_setpoint=_max_setpoint_of(climate),
        )

    # -- applying ----------------------------------------------------------

    async def async_apply(self, parent: Context | None) -> None:
        """Decide for now, record it, push the target to the thermostat.

        `parent` is the context of what triggered this run; our service calls
        carry a child of it, so their echo is never mistaken for a manual
        change. Raises whatever the climate service raises.
        """
        async with self._lock:
            await self._async_apply_locked(parent)

    async def _async_apply_locked(self, parent: Context | None) -> None:
        now = dt_util.now()
        snapshot = self._snapshot()
        decision = decide(snapshot, now)
        previous = self.state.mode
        ended = self.state.boost if decision.boost_until is None else None
        self.decision = decision
        self._commit(
            self.state.model_copy(
                update={
                    "hold_until": decision.hold_until,
                    "boost": self.state.boost if ended is None else None,
                    "mode": decision.mode,
                }
            )
        )
        self._schedule_wakeup(next_wakeup(snapshot, now))
        if previous is not None and previous != decision.mode:
            payload: dict[str, str | float | None] = {
                Field.CONFIG_ENTRY_ID: self.entry_id,
                Field.MODE: decision.mode,
                Field.PREVIOUS_MODE: previous,
                Field.TARGET: decision.target,
                Field.AWAY_SETPOINT: self.state.away_setpoint,
            }
            self._hass.bus.async_fire(EstiaEvent.MODE_CHANGED, payload)
        if ended is not None and ended.then_off:
            await self._async_set_hvac_mode(HVACMode.OFF)
            return
        target = decision.target
        if target is None and ended is not None:
            target = ended.then_setpoint
        if target is None:
            return
        climate = self._hass.states.get(self.wiring.climate)
        if climate is None or climate.state in _MISSING:
            # Applied again when it comes back (see _on_climate_change).
            return
        if _setpoint_of(climate) == target:
            return
        await self._hass.services.async_call(
            CLIMATE_DOMAIN,
            SERVICE_SET_TEMPERATURE,
            {ATTR_ENTITY_ID: self.wiring.climate, ATTR_TEMPERATURE: target},
            blocking=True,
            context=self._child_context(parent),
        )

    @staticmethod
    def _child_context(parent: Context | None) -> Context:
        return Context(parent_id=(parent if parent is not None else Context()).id)

    def _commit(self, state: StoredState) -> None:
        """Persist `state` in the entry options and notify the entities."""
        if state != self.state:
            self.state = state
            self._hass.config_entries.async_update_entry(
                self._entry, options=state.model_dump(mode="json")
            )
        for listener in list(self._listeners):
            listener()

    def _cancel_wakeup(self) -> None:
        if self._unsub_wakeup is not None:
            self._unsub_wakeup()
            self._unsub_wakeup = None

    def _schedule_wakeup(self, when: datetime | None) -> None:
        self._cancel_wakeup()
        if when is not None:
            self._unsub_wakeup = async_track_point_in_time(self._hass, self._on_wakeup, when)

    # -- triggers ----------------------------------------------------------

    async def _on_started(self, hass: HomeAssistant) -> None:
        await self.async_apply(None)

    @callback
    def _on_wakeup(self, now: datetime) -> None:
        self._unsub_wakeup = None
        self._hass.async_create_task(self.async_apply(None))

    @callback
    def _on_input_change(self, event: Event[EventStateChangedData]) -> None:
        self._hass.async_create_task(self.async_apply(event.context))

    @callback
    def _on_climate_change(self, event: Event[EventStateChangedData]) -> None:
        old = event.data["old_state"]
        new = event.data["new_state"]
        if old is None or new is None:
            return
        if old.state != new.state:
            # Back from unavailable, or hvac switched on/off.
            self._hass.async_create_task(self.async_apply(event.context))
            return
        before, after = _setpoint_of(old), _setpoint_of(new)
        boosting = self.state.boost is not None
        if (
            (self.state.schedule_enabled or boosting)
            and new.context.parent_id is None
            and before is not None
            and after is not None
            and before != after
        ):
            self._hass.async_create_task(self._async_hold(event.context))

    async def _async_hold(self, context: Context) -> None:
        """A setpoint set by hand ends any boost and, with the schedule on,
        holds until the next slot starts (paused, it is kept anyway)."""
        async with self._lock:
            until = (
                hold_until_after(self.state.profiles, self.state.week, dt_util.now())
                if self.state.schedule_enabled
                else None
            )
            _LOGGER.debug("Manual setpoint on %s, holding until %s", self.wiring.climate, until)
            self._commit(self.state.model_copy(update={"hold_until": until, "boost": None}))
            await self._async_apply_locked(context)

    # -- mutators (entities and services) ----------------------------------

    async def _async_mutate(self, change: Callable[[StoredState], StoredState]) -> None:
        """Apply `change` to the stored state under the lock, then the schedule.
        `change` may raise ServiceValidationError; nothing is stored then."""
        async with self._lock:
            self._commit(change(self.state))
            await self._async_apply_locked(None)

    async def _async_update(self, **changes: object) -> None:
        await self._async_mutate(
            lambda state: StoredState.model_validate({**state.model_dump(), **changes})
        )

    async def async_set_preheat_enabled(self, enabled: bool) -> None:
        await self._async_update(preheat_enabled=enabled)

    async def async_set_away_setpoint(self, value: float) -> None:
        await self._async_update(away_setpoint=value)

    async def async_set_away_delay(self, minutes: int) -> None:
        await self._async_update(away_delay_min=minutes)

    async def async_set_preheat_radius(self, km: float) -> None:
        await self._async_update(preheat_radius_km=km)

    async def async_return_to_schedule(self) -> None:
        """Drop the manual hold and apply the schedule now."""
        await self._async_update(hold_until=None)

    async def async_set_schedule_enabled(self, enabled: bool) -> None:
        """Off: leave the thermostat alone. On (from off): switch it back to
        heat if it was off, drop the hold, apply now and announce it."""
        if not enabled:
            await self._async_update(schedule_enabled=False, boost=None)
            return
        if self.state.schedule_enabled:
            # Already on: choosing it again ends a boost, if any.
            await self._async_update(boost=None)
            return
        await self._async_heat_on()
        await self._async_update(schedule_enabled=True, hold_until=None, boost=None)
        climate = self._hass.states.get(self.wiring.climate)
        payload: dict[str, str | float | None] = {
            Field.CONFIG_ENTRY_ID: self.entry_id,
            Field.TARGET: _setpoint_of(climate) if climate is not None else None,
        }
        self._hass.bus.async_fire(EstiaEvent.RESUMED, payload)

    async def async_set_boost(self, enabled: bool) -> None:
        """On: the thermostat at its maximum for BOOST_DURATION_MIN, switched
        to heat if it was off. Off, or at its end: back to what was before
        (thermostat off, the previous setpoint, or the schedule)."""
        if not enabled:
            if self.state.boost is not None:
                # Ends now: the next decision restores, as on expiry.
                ending = self.state.boost.model_copy(update={"until": dt_util.now()})
                await self._async_update(boost=ending)
            return
        if self.state.boost is not None:
            return
        climate = self._hass.states.get(self.wiring.climate)
        was_off = climate is not None and climate.state == HVACMode.OFF
        boost = Boost(
            until=dt_util.now() + timedelta(minutes=BOOST_DURATION_MIN),
            then_off=was_off,
            then_setpoint=None if was_off or climate is None else _setpoint_of(climate),
        )
        await self._async_heat_on()
        await self._async_update(boost=boost)

    async def _async_heat_on(self) -> None:
        if self._climate_state() == HVACMode.OFF:
            await self._async_set_hvac_mode(HVACMode.HEAT)
            await self._async_wait_for_setpoint()

    async def async_all_off(self) -> None:
        """Stop the schedule and any boost, switch the thermostat off."""
        await self._async_update(schedule_enabled=False, boost=None)
        await self._async_set_hvac_mode(HVACMode.OFF)
        payload: dict[str, str] = {Field.CONFIG_ENTRY_ID: self.entry_id}
        self._hass.bus.async_fire(EstiaEvent.OFF, payload)

    def _climate_state(self) -> str | None:
        climate = self._hass.states.get(self.wiring.climate)
        return climate.state if climate is not None else None

    async def _async_set_hvac_mode(self, mode: HVACMode) -> None:
        await self._hass.services.async_call(
            CLIMATE_DOMAIN,
            SERVICE_SET_HVAC_MODE,
            {ATTR_ENTITY_ID: self.wiring.climate, ATTR_HVAC_MODE: mode},
            blocking=True,
            context=self._child_context(None),
        )

    async def _async_wait_for_setpoint(self) -> None:
        """Wait for the thermostat to report a numeric setpoint after being
        switched on, up to HVAC_ON_SETTLE_SECONDS; then carry on regardless,
        as the schedule overwrites it anyway."""
        ready = asyncio.Event()

        @callback
        def check(_event: Event[EventStateChangedData] | None) -> None:
            climate = self._hass.states.get(self.wiring.climate)
            if climate is not None and _setpoint_of(climate) is not None:
                ready.set()

        unsub = async_track_state_change_event(self._hass, self.wiring.climate, check)
        try:
            check(None)
            async with asyncio.timeout(HVAC_ON_SETTLE_SECONDS):
                await ready.wait()
        except TimeoutError:
            _LOGGER.warning(
                "%s reported no setpoint %ss after switching to heat; applying anyway",
                self.wiring.climate,
                HVAC_ON_SETTLE_SECONDS,
            )
        finally:
            unsub()

    # -- slots -------------------------------------------------------------

    @staticmethod
    def _check_free(slots: tuple[Slot, ...], start: time, ignore: str | None) -> None:
        for slot in slots:
            if slot.start == start and slot.id != ignore:
                raise ServiceValidationError(
                    translation_domain=DOMAIN,
                    translation_key="duplicate_start",
                    translation_placeholders={"start": start.strftime("%H:%M")},
                )

    @staticmethod
    def _slot_index(slots: tuple[Slot, ...], slot_id: str) -> int:
        for index, slot in enumerate(slots):
            if slot.id == slot_id:
                return index
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="unknown_slot",
            translation_placeholders={"slot_id": slot_id},
        )

    @staticmethod
    def _profile_index(profiles: tuple[Profile, ...], profile_id: str) -> int:
        for index, profile in enumerate(profiles):
            if profile.id == profile_id:
                return index
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="unknown_profile",
            translation_placeholders={"profile_id": profile_id},
        )

    def _edit_profile(
        self, state: StoredState, profile_id: str, edit: Callable[[Profile], Profile]
    ) -> StoredState:
        """`state` with `edit` applied to one profile. Raises
        ServiceValidationError on an unknown profile id."""
        profiles = list(state.profiles)
        index = self._profile_index(state.profiles, profile_id)
        profiles[index] = edit(profiles[index])
        return state.model_copy(update={"profiles": tuple(profiles)})

    async def async_set_slot(
        self, profile_id: str, slot_id: str, start: time, setpoint: float
    ) -> None:
        """Change a slot of a profile. Raises ServiceValidationError on an
        unknown profile or slot id, or a start time already taken by another
        slot of the profile."""

        def edit(profile: Profile) -> Profile:
            slots = list(profile.slots)
            slots[self._slot_index(profile.slots, slot_id)] = Slot(
                id=slot_id, start=start, setpoint=setpoint
            )
            self._check_free(profile.slots, start, slot_id)
            return profile.model_copy(update={"slots": sorted_slots(tuple(slots))})

        await self._async_mutate(lambda state: self._edit_profile(state, profile_id, edit))

    async def async_add_slot(self, profile_id: str, start: time, setpoint: float) -> Slot:
        """Add a slot to a profile. Raises ServiceValidationError on an unknown
        profile or if `start` is taken."""
        slot = Slot(id=uuid.uuid4().hex[:8], start=start, setpoint=setpoint)

        def edit(profile: Profile) -> Profile:
            self._check_free(profile.slots, start, None)
            return profile.model_copy(update={"slots": sorted_slots((*profile.slots, slot))})

        await self._async_mutate(lambda state: self._edit_profile(state, profile_id, edit))
        return slot

    async def async_remove_slot(self, profile_id: str, slot_id: str) -> None:
        """Remove a slot of a profile. Raises ServiceValidationError on an
        unknown profile or slot id."""

        def edit(profile: Profile) -> Profile:
            slots = list(profile.slots)
            del slots[self._slot_index(profile.slots, slot_id)]
            return profile.model_copy(update={"slots": tuple(slots)})

        await self._async_mutate(lambda state: self._edit_profile(state, profile_id, edit))
