"""Config flow: pick the thermostat, the presence sensor and the travellers."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import time
from typing import Any

import voluptuous as vol
from homeassistant.components.binary_sensor import DOMAIN as BINARY_SENSOR_DOMAIN
from homeassistant.components.climate.const import DOMAIN as CLIMATE_DOMAIN
from homeassistant.components.proximity.const import (
    ATTR_DIR_OF_TRAVEL,
    ATTR_DIST_TO,
)
from homeassistant.components.proximity.const import (
    DOMAIN as PROXIMITY_DOMAIN,
)
from homeassistant.components.sensor import DOMAIN as SENSOR_DOMAIN
from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import CONF_NAME
from homeassistant.helpers import entity_registry as er

# HA's Selector base class annotates CONFIG_SCHEMA as a bare `Callable`, so
# pyright strict sees every selector class as partially unknown.
from homeassistant.helpers.selector import (
    EntitySelector,  # pyright: ignore[reportUnknownVariableType]
    EntitySelectorConfig,
    NumberSelector,  # pyright: ignore[reportUnknownVariableType]
    NumberSelectorConfig,
    NumberSelectorMode,
    TextSelector,  # pyright: ignore[reportUnknownVariableType]
)

from .const import (
    DOMAIN,
    INITIAL_AWAY_DELAY_MIN,
    INITIAL_AWAY_SETPOINT,
    INITIAL_PREHEAT_RADIUS_KM,
    INITIAL_SLOT_COUNT,
    INITIAL_SLOT_SETPOINT,
    Field,
)
from .models import StoredState, TravellerSensors, Wiring
from .scheduler import Slot

DEFAULT_NAME = "Heating"
MAX_INITIAL_SLOTS = 24


class ProximityPairError(Exception):
    """A selected distance sensor has no proximity direction sensor beside it."""


def initial_slots(count: int) -> tuple[Slot, ...]:
    """`count` slots spread evenly over the day, from midnight."""
    slots: list[Slot] = []
    for index in range(count):
        minutes = index * 24 * 60 // count
        slots.append(
            Slot(
                id=f"slot{index + 1}",
                start=time(minutes // 60, minutes % 60),
                setpoint=INITIAL_SLOT_SETPOINT,
            )
        )
    return tuple(slots)


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
        entry = registry.async_get(distance_id)
        suffix = f"_{ATTR_DIST_TO}"
        if (
            entry is None
            or entry.platform != PROXIMITY_DOMAIN
            or not entry.unique_id.endswith(suffix)
        ):
            raise ProximityPairError(distance_id)
        direction_uid = entry.unique_id.removesuffix(suffix) + f"_{ATTR_DIR_OF_TRAVEL}"
        direction_id = registry.async_get_entity_id(SENSOR_DOMAIN, PROXIMITY_DOMAIN, direction_uid)
        if direction_id is None:
            raise ProximityPairError(distance_id)
        pairs.append(TravellerSensors(distance=distance_id, direction=direction_id))
    return tuple(pairs)


def _wiring_schema(defaults: Mapping[str, Any]) -> dict[vol.Marker, Any]:
    return {
        vol.Required(Field.PRESENCE.value, default=defaults[Field.PRESENCE]): EntitySelector(
            EntitySelectorConfig(domain=BINARY_SENSOR_DOMAIN)
        ),
        vol.Optional(Field.PROXIMITY.value, default=defaults[Field.PROXIMITY]): EntitySelector(
            EntitySelectorConfig(
                domain=SENSOR_DOMAIN,
                integration=PROXIMITY_DOMAIN,
                device_class=SensorDeviceClass.DISTANCE,
                multiple=True,
            )
        ),
    }


class EstiaConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            await self.async_set_unique_id(user_input[Field.CLIMATE])
            self._abort_if_unique_id_configured()
            try:
                proximity = resolve_proximity(er.async_get(self.hass), user_input[Field.PROXIMITY])
            except ProximityPairError:
                errors[Field.PROXIMITY] = "no_direction"
            else:
                wiring = Wiring(
                    climate=user_input[Field.CLIMATE],
                    presence=user_input[Field.PRESENCE],
                    proximity=proximity,
                )
                state = StoredState(
                    slots=initial_slots(int(user_input[Field.SLOT_COUNT])),
                    schedule_enabled=True,
                    preheat_enabled=bool(proximity),
                    away_setpoint=INITIAL_AWAY_SETPOINT,
                    away_delay_min=INITIAL_AWAY_DELAY_MIN,
                    preheat_radius_km=INITIAL_PREHEAT_RADIUS_KM,
                    hold_until=None,
                    mode=None,
                )
                return self.async_create_entry(
                    title=user_input[CONF_NAME],
                    data=wiring.model_dump(mode="json"),
                    options=state.model_dump(mode="json"),
                )

        defaults: Mapping[str, Any] = user_input or {
            CONF_NAME: DEFAULT_NAME,
            Field.PRESENCE: vol.UNDEFINED,
            Field.PROXIMITY: [],
            Field.SLOT_COUNT: INITIAL_SLOT_COUNT,
        }
        schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default=defaults[CONF_NAME]): TextSelector(),
                vol.Required(Field.CLIMATE.value): EntitySelector(
                    EntitySelectorConfig(domain=CLIMATE_DOMAIN)
                ),
                **_wiring_schema(defaults),
                vol.Required(
                    Field.SLOT_COUNT.value, default=defaults[Field.SLOT_COUNT]
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=1, max=MAX_INITIAL_SLOTS, step=1, mode=NumberSelectorMode.BOX
                    )
                ),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Change the presence and proximity sensors; the thermostat is the
        entry's identity and stays."""
        entry = self._get_reconfigure_entry()
        wiring = Wiring.model_validate(entry.data)
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                proximity = resolve_proximity(er.async_get(self.hass), user_input[Field.PROXIMITY])
            except ProximityPairError:
                errors[Field.PROXIMITY] = "no_direction"
            else:
                updated = wiring.model_copy(
                    update={"presence": user_input[Field.PRESENCE], "proximity": proximity}
                )
                return self.async_update_reload_and_abort(
                    entry, data=updated.model_dump(mode="json")
                )

        defaults: Mapping[str, Any] = user_input or {
            Field.PRESENCE: wiring.presence,
            Field.PROXIMITY: [pair.distance for pair in wiring.proximity],
        }
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=vol.Schema(_wiring_schema(defaults)),
            errors=errors,
        )
