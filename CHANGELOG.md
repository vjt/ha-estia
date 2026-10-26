# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.1 — 2026-10-27

### Added

- **Sidebar panel per schedule.** Each Estia entry adds a sidebar item, titled
  after the entry and with a radiator icon, showing its card full page.
  Renaming the entry renames the panel.

### Fixed

- **The card's controls survive entity renames.** The mode sensor used to
  publish the other entities' ids in an `entities` attribute computed once;
  after renaming the device (which renames every entity) the card's switches
  and numbers pointed at ids that no longer existed. The card now finds them
  from the entity registry by device and translation key, and the attribute
  is gone.

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
