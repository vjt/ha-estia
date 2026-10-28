# ha-estia — Project Memory

## What This Is
Home Assistant custom integration + Lovelace card for a daily heating
schedule, named after Estia (Hestia), Greek goddess of the hearth.
Drives any `climate` entity: day profiles of slots (start, setpoint), one
per weekday, away
setpoint when the house has been empty for a while, preheat when a
resident is heading home, manual hold until the next slot. Ported
from vjt's `ha-config` YAML (`automations/climate.yaml` + the
`riscaldamento_*` helpers and scripts): that YAML is the spec. **No
new features** beyond what the plan and vjt's rulings below say.

Local checkout lives in `~/code/ha/ha-vesta` (the project was planned
as "Vesta"; renamed because `portbusy/ha-vesta` already owns the
`vesta` domain). Repo: `github.com/vjt/ha-estia`, **public**.

## Architecture
- **Pure scheduler** (`custom_components/estia/scheduler.py`): no HA
  imports. `decide(snapshot, now) -> Decision(mode, target,
  hold_until)`, `hold_until_after(profiles, week, now)`, `next_wakeup(snapshot,
  now)`. All behaviour lives here and is table-tested.
- **Runtime** (`runtime.py`): the HA glue. Reads entity states, parses
  them into a `Snapshot` at the boundary, calls `decide`, persists,
  pushes `climate.set_temperature`, fires events, schedules the next
  wakeup (`async_track_point_in_time`) and listens to state changes
  (`async_track_state_change_event`).
- **Persistence**: everything mutable (profiles and week, schedule/preheat
  switches, away setpoint/delay, preheat radius, hold) is one Pydantic
  model `Settings` stored in the config entry **options**, written with
  `async_update_entry` (no update listener: no reload on change).
  Entry **data** holds the wiring: climate, presence, proximity
  sensors. Parsed into Pydantic models at the boundary.
- **Entities are thin views** on the runtime: switch (schedule,
  preheat), number (away setpoint, away delay, preheat radius), sensor
  (mode, enum; profiles/week/today's profile/active slot/hold/target/wiring
  in attributes), button (resume, all off). No per-slot entities.
- **Services** (`estia.set_slot`, `add_slot`, `remove_slot` with a
  `profile_id`; `add_profile`, `rename_profile`, `remove_profile`,
  `assign_day`; `resume`) take `config_entry_id`; the card calls them.
- **Panel** (`card.py` `SchedulePanel`): one sidebar item per entry, titled
  after the device's user name, else the entry title; shows HA's native
  thermostat card (more-info hidden via adopted stylesheet), the card, and
  `estia-history` (own SVG chart; heating bands are an *estimate*: the tado
  X over Matter never reports `hvac_action`). Native cards come from
  `window.loadCardHelpers`, which only exists after Lovelace code loads:
  `native.ts` loads it through `partial-panel-resolver`.
- **Brand icon**: `brand/icon.svg` → PNGs with `rsvg-convert` (HA 2026.3+
  serves them from the integration).
- **Events**: `estia_mode_changed`, `estia_off`, `estia_resumed`.
  Notifications are the user's automations (README example).
- **Card**: Lit + TypeScript sources in `card/src/` (repo root, so they
  are not installed into users' configs), built with esbuild
  (`card/scripts/build.mjs`) to
  `custom_components/estia/frontend/estia-card.js`, **committed** (HACS
  ships the repo as-is; `check.sh` fails on a stale build). Served by
  `card.py` via `async_register_static_paths` + `add_extra_js_url`.

## Behaviour (spec + vjt's rulings, 2026-10-26)
- Active slot: latest start not after now among today's profile; before
  the first start (or on an empty day), the last slot of the most recent
  earlier day that has any. Duplicate start times in a profile rejected.
- Away: presence `off` for `delay` minutes → away setpoint over all.
- Preheat: enabled and any traveller closer than `radius` km **and**
  direction `towards` or `arrived` → slots apply with the house empty.
  `arrived` (vjt 2026-10-28): proximity reports it a tick before the
  presence template turns on, which went away for 2 s and notified. No
  distance-only rule: it would preheat for someone stationary nearby.
- Manual hold: a setpoint change whose context has no `parent_id`,
  schedule on → hold until the next slot start strictly after now
  (the first start of the following days, each with its profile; now + 1
  day if no slots anywhere).
- **Away clears the hold** (ruling; the YAML resumed it on return).
- **hvac off → mode Off, no setpoint pushed**; hvac back on → apply
  now (ruling; the YAML kept pushing).
- **Schedule switch off → mode `paused`** (ruling; the YAML froze the
  last mode), setpoint left alone. Back on → hvac heat if off (wait
  ≤30 s for a numeric setpoint), drop the hold, apply, fire resumed.
- All off → schedule off + hvac off + boost off, fire off.
- **Boost** (vjt 2026-10-27): thermostat `max_temp` for 120 min, wins over
  away/paused/hold (not over hvac off); expiry or switching it off restores
  what was before (`Boost.then_off` / `then_setpoint`); a manual dial
  change, Scheduled or All off end it without restoring.
- **Card actions** Scheduled / Boost / All off are one choice; Scheduled off
  = mode `paused`, labelled "Manual (no expiry)". Settings are read-only
  until *Edit* (no listeners, no touch capture outside edit mode).
- **Multiple thermostats**: one entry each, nothing shared, one sidebar
  item each (README). Not built further until there is a second one.
- Our own `set_temperature` calls carry a child `Context`
  (`parent_id` set), so their echo is never taken as manual.

## Tech Stack
- **Python 3.13** (HA 2026.2.3 is the last release on 3.13; the Pi's
  system Python), async
- **Pydantic** for all models — the integration's **only**
  requirement (`manifest.json`), ruled by vjt: HA core does not
  require it but pins it in `package_constraints.txt`
- **pytest** — `pytest tests/ -x -q`, with
  `pytest-homeassistant-custom-component` (pinned to the HA version)
  for the `hass` fixture
- **pyright** — strict mode, `include` limits to project sources only.
  Do NOT run without `include` — analyzing the full venv
  (homeassistant + deps) takes 30+ min on the Pi.
- **`./scripts/check.sh`** — chains pyright + pytest + ruff check +
  ruff format check + card typecheck/build check. Run before every
  commit.
- **ruff** — linter + formatter (pinned)
- **Card**: Lit + TypeScript + esbuild, local `node_modules` only,
  never installed system-wide. `npm run build` in `card/`.
- Venv: `.venv/` (created with `uv`). Never install system-wide.

## Engineering Standards

### Type System
- **Pydantic models only.** No `@dataclass`. All structured types
  use Pydantic `BaseModel`.
- **Type annotations on all signatures.** No exceptions.
- **Enums over dicts.** Before adding a constant mapping, create a
  StrEnum. Inline dicts drift and duplicate.
- **Type errors are design signals.** When a type constraint blocks
  your approach, the constraint is probably correct — your approach
  is probably wrong.
- **Total consistency or nothing.** Half-typed is worse than untyped.
- Card: TypeScript `strict`, no `any`.

### Error Handling
- **Never swallow exceptions.** Handle explicitly or let crash.
- **No default arguments.** Every parameter explicit. `= None`
  defaults create silent degradation paths. The only acceptable
  defaults are genuine configuration values (e.g. `timeout=30`)
  where the default is the correct production behavior, not a bypass.
- **No `.get()` with fallbacks** on data that must exist. Parse at
  the boundary, crash inside. If a field is missing, that's a bug
  in the data source — surface it, don't paper over it.
- **State the contract.** Signature + failure mode in one sentence
  before implementing: "Returns X or raises Y."
- **Crash loud on unexpected input.** No silent fallthrough. Service
  input errors raise `ServiceValidationError` with a translated
  message. Sensor states that are legitimately `unknown` /
  `unavailable` are modelled explicitly (`None` in the snapshot), not
  defaulted.
- **Explicit state model.** Modes are a closed StrEnum; anything
  outside the model is an error.
- **No "smart" behavior.** Pedantic correctness over convenience.

### Architecture
- **Constructor injection.** No global state, no singletons.
- **No leaky abstractions.** Each layer owns its domain. Return
  domain types, not strings/dicts callers parse.
- **Parse at the boundary.** Entity states, entry data/options and
  service calls get parsed into Pydantic models at the HA layer. If
  parsing fails, blow up there. Inside, types guarantee correctness.
- **One feature, one code path.** Implement once, reuse everywhere.
  Never copy-paste with tweaks.
- **Fix root causes, not examples.** No band-aids, no
  `filterwarnings`, no `# type: ignore` without justification.
- **Entity registry caches attributes.** Changing `entity_category`,
  `entity_registry_visible_default`, etc. in code does NOT update
  existing entities. Must delete + re-register, or update via the
  websocket API (`config/entity_registry/update`).
- **HA 2026.4+ thread safety.** Callbacks from `async_call_later`
  must not call `async_write_ha_state` or `async_update_listeners`
  directly. Dispatch via `hass.async_create_task()`.
- **Never block the event loop.** Async service calls only
  (`await hass.services.async_call(...)`).
- **UTC for calculations, local for display.** Slot start times are
  local wall-clock times by definition; everything else compares
  aware datetimes.

### Code Quality
- **Read before writing.** Grep for what you're about to build.
- **Challenge the spec.** If domain knowledge contradicts the
  requirements, say so before building.
- **Debug with data first.** Read logs, inspect state before
  changing code. NEVER guess. Evidence first.
- **Never fabricate explanations.** "I don't know, let me check"
  beats a confident wrong answer.
- **"Done" means done.** Every caller updated, every test fixed.
  Grep for stale references before declaring complete.
- **Bite-sized commits.** One logical change. Messages explain WHY.
- **Never claim it works without running it.** Say what you ran and
  what it printed.

### Testing
- TDD: the scheduler's table tests first, then the HA glue.
- Assert outcomes, not call sequences.
- Mock at boundaries (the climate / presence / proximity entities),
  real dependencies inside.
- Use production code in tests — never hardcode expected strings.
- Never weaken production code to make tests pass.

### Deploy (vjt's HA, authorized 2026-10-26)
- `tar -C custom_components --exclude=__pycache__ -cf - estia | ssh root@homeassistant -p 22222 "tar -C /mnt/data/supervisor/homeassistant/custom_components -xf - && ha core restart"`,
  then poll `http://homeassistant:8123/api/` (token in `~/code/ha/ha-config/.env`).
- Gate on `./scripts/check.sh` with `set -o pipefail`: piping it into
  `tail` hides a failure.
- Device lookups: `dr.async_entries_for_config_entry`, never
  `async_get_device` (deprecated in HA 2026.9; dev venv is 2026.2.3).

### Public Repo
- Neutral, professional register in code, commits, README, issues.
  Commit messages in English, Conventional Commits.
- Migration to Estia done 2026-10-27 (old YAML, helpers, dashboard removed;
  backups deleted 2026-10-27 at vjt's request). ha-config changes go through
  its own repo and `scripts/push.sh`.

## Release
1. `./scripts/check.sh` green, tree clean, on `main`.
2. Bump `version` in `pyproject.toml` and
   `custom_components/estia/manifest.json` (must match), the card's
   `package.json` version, add the `CHANGELOG.md` entry (Keep a
   Changelog).
3. `git commit -m "chore: bump to X.Y.Z"`,
   `git tag -a vX.Y.Z -m "vX.Y.Z — <summary>"`, push with tags.
4. `gh release create vX.Y.Z --title vX.Y.Z --notes <CHANGELOG section>`.
   HACS picks up the release. Release does NOT deploy.
