# Estia

![Estia](docs/hero.jpg)

A daily heating schedule for Home Assistant that drives any `climate` entity,
with a Lovelace card to edit it. Named after Estia (Hestia), the Greek goddess
of the hearth.

- **Daily slots**: each slot has a start time and a setpoint, the same every
  day. The active slot is the one with the latest start not after now; before
  the first start of the day, the last slot of the day before is still running.
  Add, move and delete slots from the card.
- **Away**: when the presence sensor has been off for the away delay, the away
  setpoint wins over every slot.
- **Preheat**: when someone tracked by the Proximity integration is closer than
  the preheat radius **and** heading home, the slots apply even with the house
  empty. Being near but stationary (a day in town) does not count.
- **Manual hold**: a setpoint changed by hand (the thermostat's own buttons, or
  the Home Assistant UI) is kept until the next slot starts. The house going
  empty overrides and clears it. *Return to schedule* drops it.
- **Schedule switch**: off pauses the schedule (mode *Paused*): Estia leaves
  the thermostat alone, so the temperature is whatever you set by hand, and
  slots, away and preheat are ignored; back on
  switches the thermostat to heat if it was off, drops any hold and applies the
  schedule at once. *All off* stops the schedule and switches the thermostat
  off.
- **Thermostat off**: while the thermostat is off, the schedule does not touch
  it (mode *Off*); when it is switched back on, the schedule applies at once.

Nothing here is specific to one brand of thermostat. The integration has no
dependencies besides Home Assistant (and pydantic, which Home Assistant
already pins).

## Installation

With [HACS](https://hacs.xyz/):

1. HACS → ⋮ → *Custom repositories* → add `https://github.com/vjt/ha-estia`,
   category *Integration*.
2. Install **Estia**, restart Home Assistant.
3. *Settings → Devices & services → Add integration → Estia*.

Manually: copy `custom_components/estia` into your configuration's
`custom_components/` and restart.

Requires Home Assistant 2026.2 or later.

## Configuration

The setup form asks for:

| Field | |
|---|---|
| Name | Name of the schedule's device. |
| Thermostat | The `climate` entity to drive. One schedule per thermostat. |
| Presence sensor | A `binary_sensor` that is on while someone is home (e.g. a group of `person` entities, or your alarm's occupancy sensor). |
| Proximity distance sensors | Optional, one per person: the *distance* sensors created by the [Proximity](https://www.home-assistant.io/integrations/proximity/) integration. Their *direction of travel* sensors are found automatically. Leave empty to disable preheat. |
| Number of daily slots | Slots to start with, spread evenly over the day at 20 °C. Change them from the card afterwards. |

The presence and proximity sensors can be changed later with *Reconfigure*.

### Entities

| Entity | |
|---|---|
| `sensor.<name>_mode` | `home`, `away`, `preheat`, `manual`, `paused` or `off`. Its attributes carry the slots, the active slot, the hold expiry and the target: this is what the card reads. |
| `switch.<name>_schedule` | Schedule on/off. |
| `switch.<name>_preheat_on_the_way_home` | Preheat on/off. |
| `number.<name>_away_setpoint` | Setpoint while the house is empty (default 16 °C). |
| `number.<name>_away_delay` | Minutes the house must be empty before the away setpoint applies (default 10). |
| `number.<name>_preheat_radius` | Preheat radius in km (default 20). |
| `button.<name>_return_to_schedule` | Drop the manual hold. |
| `button.<name>_all_off` | Stop the schedule and switch the thermostat off. |

Entity ids follow the name you gave the schedule and your language.

### Services

All take `config_entry_id` (the schedule; the mode sensor's
`config_entry_id` attribute).

| Service | Fields | |
|---|---|---|
| `estia.set_slot` | `slot_id`, `start`, `setpoint` | Change a slot. |
| `estia.add_slot` | `start`, `setpoint` | Add a slot. |
| `estia.remove_slot` | `slot_id` | Remove a slot. |
| `estia.resume` | | Drop the manual hold and apply the schedule now. |

Two slots cannot start at the same time.

### Events

| Event | Data |
|---|---|
| `estia_mode_changed` | `config_entry_id`, `mode`, `previous_mode`, `target` (the setpoint pushed, or null), `away_setpoint` |
| `estia_off` | `config_entry_id` (after *All off*) |
| `estia_resumed` | `config_entry_id`, `target` (after the schedule switch is turned back on) |

## The panel and the card

Each schedule gets its own **sidebar item**, titled after its device (rename
the device or the entry to rename it): Home Assistant's thermostat card to
set the temperature by hand, the schedule card, and the temperature history
over 24 hours, 7 or 30 days. Nothing to configure.

The card is bundled with the integration and loaded automatically; there is
no separate resource to add. To put it on a dashboard as well:

```yaml
type: custom:estia-card
entity: sensor.heating_mode
# title: Living room   # optional, defaults to the thermostat's name
```

- The 24 h bar shows one segment per slot, coloured by setpoint, with a
  marker for now and the active slot outlined.
- **Drag** the white line at a slot's start to move it (15-minute steps).
- **Tap** a segment to edit its start time and setpoint (− / +).
- **Long-press** a segment, then tap *Delete*, to remove it.
- **+** adds a slot at noon (or in the middle of the longest gap) at the
  current setpoint.
- The header shows the mode, the current and target temperature, and while a
  manual hold is active, its expiry and *Return to schedule*.
- Below: schedule on/off, *All off*, preheat, the away setpoint, delay and
  preheat radius, and each tracked person's distance and direction.

English and Italian; other languages fall back to English.

## Notifications

The integration fires events instead of sending notifications. This
automation sends the four usual ones; replace `notify.notify` with your own
notify service.

```yaml
automation:
  - alias: Heating notifications
    mode: queued
    triggers:
      - trigger: event
        event_type: estia_mode_changed
        event_data:
          mode: away
        id: away
      - trigger: event
        event_type: estia_mode_changed
        event_data:
          mode: preheat
        id: preheat
      - trigger: event
        event_type: estia_off
        id: "off"
      - trigger: event
        event_type: estia_resumed
        id: resumed
    actions:
      - choose:
          - conditions:
              - condition: trigger
                id: away
            sequence:
              - action: notify.notify
                data:
                  title: Heating lowered
                  message: >-
                    Nobody home: {{ trigger.event.data.away_setpoint }} °C
                    until someone is back.
          - conditions:
              - condition: trigger
                id: preheat
            sequence:
              - action: notify.notify
                data:
                  title: Preheat started
                  message: >-
                    Someone is on the way back: heating to the schedule,
                    {{ trigger.event.data.target }} °C.
          - conditions:
              - condition: trigger
                id: "off"
            sequence:
              - action: notify.notify
                data:
                  title: Heating off
                  message: >-
                    Schedule stopped and thermostat off. Turn the schedule
                    switch back on to resume.
          - conditions:
              - condition: trigger
                id: resumed
            sequence:
              - action: notify.notify
                data:
                  title: Heating resumed
                  message: >-
                    Schedule active again, {{ trigger.event.data.target }} °C.
```

## Development

```bash
uv venv .venv && uv pip install -e ".[dev]"   # Python 3.13
(cd card && npm install)
./scripts/check.sh                            # pyright, pytest, ruff, card build
```

The card's sources are in `card/src` (Lit + TypeScript); `npm run build` in
`card/` writes `custom_components/estia/frontend/estia-card.js`, which is
committed because HACS installs the repository as it is. `check.sh` fails if
the committed file is stale.

The scheduling logic is a pure function in
`custom_components/estia/scheduler.py`, table-tested in
`tests/test_scheduler.py`.

## License

MIT
