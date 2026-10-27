# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.2 — 2026-10-27

### Added

- **Boost**: a switch (and a card button) that runs the thermostat at its
  maximum for two hours, over the slots, away and a paused schedule, then
  goes back to what was before: the thermostat off, the setpoint it had, or
  the schedule. Turning the dial by hand, choosing Scheduled or All off ends
  it there and then. Entries are migrated (options 1.2: `boost`).

### Changed

- **Three actions, one choice**: Scheduled, Boost and All off sit side by
  side in the card, and choosing one undoes the others. Turning Scheduled
  off keeps the current temperature with no end: the mode formerly called
  *Paused* is now labelled *Manual (no expiry)*.
- **Settings shown as a summary**: the timeline and a line each for away and
  preheat; *Edit* unlocks dragging, the slot editor and the settings, so a
  scroll on the phone no longer moves a slot.
- **Travellers read like sentences**: "🏠 Alice is home", "🚗 Alice is
  12.4 km away, heading home", "🏃 … moving away", "📍 … not moving", named
  after the person Proximity tracks (resolved from its registry entry; the
  mode sensor's `proximity` attribute gains `person`).
- **The panel is a full heating page**: Home Assistant's thermostat card (to
  set the temperature by hand), the schedule card, and the temperature
  history over 24 hours, 7 days or 30 days, side by side on wide screens.
- **The card's controls are Home Assistant's own entities card**: native
  switches and number boxes instead of the small custom ones, *All off*
  asks for confirmation, and the preheat radius and travellers are hidden
  while preheat is off.
- **A slot's setpoint can be set directly**: type it, drag the slider, or
  scroll the mouse wheel over it, besides − / +.
- **Paused and Off explain themselves**: the card says what the schedule is
  (not) doing and offers *Resume schedule* / *Turn back on*.
- **The sidebar item is titled after the device** as you named it, falling
  back to the entry's title; renaming either retitles it at once, without
  reloading the schedule.
- Bigger timeline, handles, buttons and steppers; easier to use on a phone.
- The panel loads Home Assistant's card helpers itself, so the native cards
  appear even when the browser opens the panel directly.
- No more deprecated `async_get_device` calls (warned about by HA 2026.9).
- The bundle URL carries a hash of its content, so browsers fetch every new
  build without a version bump.

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
