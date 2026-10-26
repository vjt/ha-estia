"""Base entity: a thin view on the entry's runtime."""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, EntityKey
from .runtime import EstiaConfigEntry, EstiaRuntime


def unique_id(entry_id: str, key: EntityKey) -> str:
    return f"{entry_id}_{key}"


class EstiaEntity(Entity):
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, entry: EstiaConfigEntry, key: EntityKey) -> None:
        self._runtime: EstiaRuntime = entry.runtime_data
        self._attr_unique_id = unique_id(entry.entry_id, key)
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            entry_type=DeviceEntryType.SERVICE,
        )

    async def async_added_to_hass(self) -> None:
        self._refresh()
        self.async_on_remove(self._runtime.async_add_listener(self._on_runtime_change))

    @callback
    def _on_runtime_change(self) -> None:
        self._refresh()
        self.async_write_ha_state()

    def _refresh(self) -> None:
        """Copy what this entity shows from the runtime into its `_attr_`s.
        Entities without state (buttons) have nothing to copy."""
