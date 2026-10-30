# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.4.0 — 2026-10-30

### Changed

- **The heating bands include the inertia**: once the target is reached the
  radiators stay hot and the room keeps rising. The chart now shades that too:
  right after heating, while the room has risen by 0.3 °C/h or more over the
  last hour (about 40° on the phone's 24 h chart). A rise with no heating
  before it (sun, oven) is not shaded.

## 0.3.1 — 2026-10-28

### Fixed

- **No more "heating lowered" on arrival.** Proximity reports *arrived* in
  the same instant as a distance of 0, while a presence sensor built as a
  template on the person entities turns on a moment later. In between the
  house looked empty with nobody heading home: Estia went away for about
  two seconds and the away notification fired. Arrived now counts as coming
  back, like heading home.

## 0.3.0 — 2026-10-27

### Breaking

- **Slot services require `profile_id`** (`set_slot`, `add_slot`,
  `remove_slot`): automations and scripts calling them must add it. A
  migrated entry's only profile is `default`.
- **The mode sensor's `slots` attribute is gone**: templates reading it move
  to `profiles` / `today_profile`.
- **No way back without a backup**: once migrated (entry 1.3), 0.2.x can no
  longer load the entry. To downgrade, restore a Home Assistant backup taken
  before upgrading.

### Added

- **Day profiles**: slots now live in named profiles, and each weekday uses
  one, so the weekend can differ from the weekdays. The card shows profile
  chips and a weekday row, and adds, renames and deletes profiles in edit
  mode. New services `add_profile`, `rename_profile`, `remove_profile` and
  `assign_day`.

### Changed

- The mode sensor reports `profiles` (each with its sorted slots), `week` and
  `today_profile`, which turns over at midnight.
- A day before its first slot, or without slots, keeps the last slot of the
  most recent earlier day, and a manual hold ends at the next slot start
  across the following days.
- Existing schedules are migrated (entry 1.3) to one *Every day* profile used
  all week: behaviour is unchanged. Its name follows Home Assistant's language,
  like a new entry's.
- The card's profile name field takes the focus when it opens; Enter saves,
  Escape cancels.

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
