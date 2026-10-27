"""Config flow: pick the thermostat, the presence sensor and the travellers."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import time
from typing import Any

import voluptuous as vol
from homeassistant.components.binary_sensor import DOMAIN as BINARY_SENSOR_DOMAIN
from homeassistant.components.climate.const import DOMAIN as CLIMATE_DOMAIN
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
    DAYS_PER_WEEK,
    DOMAIN,
    INITIAL_AWAY_DELAY_MIN,
    INITIAL_AWAY_SETPOINT,
    INITIAL_PREHEAT_RADIUS_KM,
    INITIAL_PROFILE_ID,
    INITIAL_SLOT_COUNT,
    INITIAL_SLOT_SETPOINT,
    Field,
)
from .models import StoredState, Wiring
from .naming import async_every_day_name
from .proximity import ProximityPairError, resolve_proximity
from .scheduler import Profile, Slot

DEFAULT_NAME = "Heating"
MAX_INITIAL_SLOTS = 24


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
    # 1.2: options gained boost (see async_migrate_entry).
    # 1.3: slots became day profiles and a week (see async_migrate_entry).
    MINOR_VERSION = 3

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
                    profiles=(
                        Profile(
                            id=INITIAL_PROFILE_ID,
                            name=await async_every_day_name(self.hass),
                            slots=initial_slots(int(user_input[Field.SLOT_COUNT])),
                        ),
                    ),
                    week=(INITIAL_PROFILE_ID,) * DAYS_PER_WEEK,
                    schedule_enabled=True,
                    preheat_enabled=bool(proximity),
                    away_setpoint=INITIAL_AWAY_SETPOINT,
                    away_delay_min=INITIAL_AWAY_DELAY_MIN,
                    preheat_radius_km=INITIAL_PREHEAT_RADIUS_KM,
                    hold_until=None,
                    boost=None,
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
