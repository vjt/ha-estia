"""The integration serves the bundled card and adds it to every dashboard."""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest
from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL, UrlManager
from homeassistant.setup import async_setup_component

from custom_components.estia.card import CARD_FILE, CARD_URL, async_register_card, card_digest

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant
    from pytest_homeassistant_custom_component.typing import ClientSessionGenerator


@pytest.fixture
def no_frontend() -> None:
    """Override conftest's: here http is real and the card is registered."""


async def test_card_is_served_and_registered(
    hass: HomeAssistant, hass_client_no_auth: ClientSessionGenerator
) -> None:
    assert await async_setup_component(hass, "http", {})
    # What the frontend integration sets up (its package is not installed here).
    urls = UrlManager(lambda _action, _url: None, [])
    hass.data[DATA_EXTRA_MODULE_URL] = urls

    await async_register_card(hass, card_digest())

    assert urls.urls == frozenset({f"{CARD_URL}?v={card_digest()}"})
    client = await hass_client_no_auth()
    response = await client.get(CARD_URL)
    assert response.status == 200
    assert await response.text() == CARD_FILE.read_text()
