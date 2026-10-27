# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.2.2 — 2026-10-27

### Added

- **An icon**: a flame on a Greek-key hearth stone, shipped in the
  integration's `brand/` directory, which Home Assistant 2026.3+ serves for
  custom integrations.

## 0.2.1 — 2026-10-27

### Fixed

- **Estia is listed among the integrations**, not the helpers: it was
  declared as a helper, which also hid *Reconfigure* away in the helpers
  page. It is a service.

## 0.2.0 — 2026-10-27

### Added

- **Sidebar panel per schedule**: a full heating page titled after the
  schedule's device (or entry) with a radiator icon. Top to bottom: Home
  Assistant's thermostat card to set the temperature by hand, the three
  actions, the schedule, and the temperature chart; side by side on wide
  screens. Renaming the device or the entry retitles it at once.
- **Boost**: a switch (and an action) that runs the thermostat at its
  maximum for two hours, over the slots, away and a paused schedule, then
  goes back to what was before: the thermostat off, the setpoint it had, or
  the schedule. Turning the dial by hand, choosing Scheduled or All off ends
  it there and then. Entries are migrated (options 1.2: `boost`).
- **Temperature chart with heating bands**: room and target temperature
  over 24 hours, 7 or 30 days, with a cursor, shading the stretches when the
  heating was probably on: heat mode and target above the room. An estimate,
  and labelled so, for thermostats that do not report `hvac_action` (the
  tado Smart Thermostat X over Matter does not).

### Changed

- **Three actions, one choice**: Scheduled, Boost and All off sit side by
  side, and choosing one undoes the others. Turning Scheduled off keeps the
  current temperature with no end: the mode formerly called *Paused* is now
  *Manual (no expiry)*, and the card says so. Off says so too.
- **The schedule as a summary**: the timeline, away and preheat in a line
  each, and who is where ("🏠 Alice is home", "🚗 Alice is 12.4 km away,
  heading home", "🏃 … moving away", "📍 … not moving", named after the
  person Proximity tracks; the mode sensor's `proximity` attribute gains
  `person`). *Edit* unlocks dragging, the slot editor and the settings, so a
  scroll on the phone no longer moves a slot.
- **The settings are Home Assistant's own controls** (switches, number
  boxes) instead of small custom ones; the preheat radius is hidden while
  preheat is off.
- **A slot's setpoint can be set directly**: type it, drag the slider, or
  scroll over it, besides − / +.
- Bigger timeline, handles, buttons and steppers; easier to use on a phone.
- The bundle URL carries a hash of its content, so browsers fetch every new
  build.

### Fixed

- **The card's controls survive entity renames.** The mode sensor published
  the other entities' ids in an `entities` attribute computed once; after
  renaming the device (which renames every entity) the card's switches and
  numbers pointed at ids that no longer existed. The card now finds them in
  the entity registry by device and translation key; the attribute is gone.
- No more deprecated `async_get_device` calls (warned about by HA 2026.9).
- The schedule bar no longer swallows touches outside *Edit*: a finger on it
  scrolls the page.

## 0.1.0 — 2026-10-26

First release.

### Added

- **Daily schedule for any `climate` entity**: N slots (start, setpoint), the
  same every day; the active slot is the latest start not after now, wrapping
  around midnight.
- **Away**: the away setpoint applies once the presence sensor has been off
  for the away delay.
- **Preheat**: with someone from the Proximity integration within the radius
  and heading home, the slots apply even with the house empty.
- **Manual hold**: a setpoint changed by hand holds until the next slot start;
  the house going empty clears it; *Return to schedule* drops it.
- **Schedule switch** (off = *Paused*, back on = heat, drop the hold, apply),
  **All off** button, and mode *Off* while the thermostat is off.
- Mode sensor, switches, numbers and buttons; services `estia.set_slot`,
  `estia.add_slot`, `estia.remove_slot`, `estia.resume`; events
  `estia_mode_changed`, `estia_off`, `estia_resumed`.
- **`estia-card`**: 24 h timeline, drag a slot's start, tap to edit, long-press
  to delete, + to add; mode, temperatures, hold, and the schedule's controls.
  Bundled with the integration and loaded automatically.
- English and Italian translations.
