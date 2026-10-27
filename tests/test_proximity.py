"""Reading who a proximity distance sensor follows, from the entity registry."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.components.proximity.const import ATTR_DIST_TO
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.estia.proximity import tracked_entity

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def distance_sensor(hass: HomeAssistant, entry: MockConfigEntry, identifier: str) -> str:
    """A distance sensor registered the way proximity registers it."""
    unique_id = (
        f"{entry.entry_id}_{identifier}_{ATTR_DIST_TO}"
        if identifier
        else (f"{entry.entry_id}_{ATTR_DIST_TO}")
    )
    return (
        er.async_get(hass)
        .async_get_or_create("sensor", "proximity", unique_id, config_entry=entry)
        .entity_id
    )


async def test_tracked_entity(hass: HomeAssistant) -> None:
    registry = er.async_get(hass)
    proximity = MockConfigEntry(domain="proximity", title="Home")
    proximity.add_to_hass(hass)
    alice = registry.async_get_or_create("person", "person", "alice", suggested_object_id="alice")

    # A registered person: proximity uses its registry id.
    assert tracked_entity(registry, distance_sensor(hass, proximity, alice.id)) == alice.entity_id
    # An unregistered tracker: proximity uses its entity_id.
    unregistered = distance_sensor(hass, proximity, "device_tracker.bob_phone")
    assert tracked_entity(registry, unregistered) == "device_tracker.bob_phone"
    # The "nearest" sensor follows no one in particular.
    assert tracked_entity(registry, distance_sensor(hass, proximity, "")) is None
    # Not a proximity sensor at all.
    assert tracked_entity(registry, "sensor.something_else") is None
