# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
