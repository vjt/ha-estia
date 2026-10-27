"""What we read from the Proximity integration's entity registry entries."""

from __future__ import annotations

from homeassistant.components.proximity.const import (
    ATTR_DIR_OF_TRAVEL,
    ATTR_DIST_TO,
)
from homeassistant.components.proximity.const import (
    DOMAIN as PROXIMITY_DOMAIN,
)
from homeassistant.components.sensor import DOMAIN as SENSOR_DOMAIN
from homeassistant.helpers import entity_registry as er

from .models import TravellerSensors

_DISTANCE_SUFFIX = f"_{ATTR_DIST_TO}"


class ProximityPairError(Exception):
    """A selected distance sensor has no proximity direction sensor beside it."""


def _distance_entry(registry: er.EntityRegistry, distance_id: str) -> er.RegistryEntry | None:
    entry = registry.async_get(distance_id)
    if (
        entry is None
        or entry.platform != PROXIMITY_DOMAIN
        or not entry.unique_id.endswith(_DISTANCE_SUFFIX)
    ):
        return None
    return entry


def resolve_proximity(
    registry: er.EntityRegistry, distance_ids: list[str]
) -> tuple[TravellerSensors, ...]:
    """Pair each proximity distance sensor with its direction-of-travel sensor.

    The proximity integration gives both the same unique_id prefix. Raises
    ProximityPairError when a sensor is not a proximity distance sensor or its
    direction sensor is missing.
    """
    pairs: list[TravellerSensors] = []
    for distance_id in distance_ids:
        entry = _distance_entry(registry, distance_id)
        if entry is None:
            raise ProximityPairError(distance_id)
        direction_uid = entry.unique_id.removesuffix(_DISTANCE_SUFFIX) + f"_{ATTR_DIR_OF_TRAVEL}"
        direction_id = registry.async_get_entity_id(SENSOR_DOMAIN, PROXIMITY_DOMAIN, direction_uid)
        if direction_id is None:
            raise ProximityPairError(distance_id)
        pairs.append(TravellerSensors(distance=distance_id, direction=direction_id))
    return tuple(pairs)


def tracked_entity(registry: er.EntityRegistry, distance_id: str) -> str | None:
    """The person (or device tracker) a proximity distance sensor follows.

    Proximity's unique_id is `<its entry id>_<tracked entity's registry id,
    or entity_id when unregistered>_dist_to_zone`. None for the "nearest"
    sensor, which follows no one in particular, and for anything that is not
    a proximity distance sensor.
    """
    entry = _distance_entry(registry, distance_id)
    if entry is None or entry.config_entry_id is None:
        return None
    base = entry.unique_id.removesuffix(_DISTANCE_SUFFIX)
    prefix = f"{entry.config_entry_id}_"
    if not base.startswith(prefix):
        # Includes the "nearest" sensor, whose base is the entry id alone.
        return None
    identifier = base.removeprefix(prefix)
    tracked = registry.async_get(identifier)
    return tracked.entity_id if tracked is not None else identifier
