"""Names Estia gives on the user's behalf, in Home Assistant's language."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.translation import async_get_translations

from .const import DOMAIN

# strings.json: selector.profile_name.options.every_day
_EVERY_DAY = f"component.{DOMAIN}.selector.profile_name.options.every_day"


async def async_every_day_name(hass: HomeAssistant) -> str:
    """The first profile's name ("Every day") in the configured language,
    English where it has no translation. Raises KeyError if the string is
    missing from the integration's translations altogether."""
    translations = await async_get_translations(hass, hass.config.language, "selector", {DOMAIN})
    return translations[_EVERY_DAY]
