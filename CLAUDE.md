# jamiematthewthomas.github.io — project notes for Claude

## What this is

A personal GitHub Pages site hosting a small collection of single-page web apps, with a landing page at the repo root in `index.html`. See the root `README.md` for a project index. Each project lives in its own folder with its own `README.md`:

- **`santandercycles/`** — Bike and Dock Finder, covered below.
- **`flagpicker/`** — Flag Picker, covered below.

Across all projects: no build step, no package manager, no other framework — each app's HTML, CSS, and JS are inline in its `index.html`, with CDN dependencies where needed.

# Bike and Dock Finder

## What this is

A single-file web app ("Bike and Dock Finder") that shows the nearest Santander Cycles docking stations to the user's current location.

## Architecture

The Santander Cycles app lives in `santandercycles/index.html` — HTML, CSS, and JS are all inline. Leaflet and Material Symbols Outlined are loaded from CDN. Related files (`manifest.json`, `sw.js`, `icon.svg`) sit alongside it in the same folder.

## Key APIs

### TfL BikePoint
- Endpoint: `https://api.tfl.gov.uk/BikePoint`
- No API key required.
- Returns all ~800 Santander Cycles docking stations in London.
- Each station's properties are returned as an array of `{key, value}` objects under `additionalProperties`, not as a plain object — the `prop()` helper handles this.

Relevant property keys:
| Key | Meaning |
|---|---|
| `NbStandardBikes` | Standard bikes currently docked |
| `NbEBikes` | E-bikes currently docked |
| `NbEmptyDocks` | Empty dock spaces |
| `NbDocks` | Total dock capacity |

`NbBikes` (total bikes) is intentionally not used — standard and e-bike counts are fetched directly so they can be displayed separately.

### Geolocation API
Standard browser `navigator.geolocation.getCurrentPosition`. No timeout is set (default `Infinity`) — this is intentional so that the browser's permission prompt doesn't race against a timeout. Error code `1` (permission denied) and code `2` (position unavailable) are handled with distinct messages.

The geolocation request and TfL fetch are fired simultaneously at the start of `init()` and awaited together with `Promise.allSettled` — neither blocks the other. Errors are checked sequentially (geo first) so the right message is always shown.

## Cards

Card order: nearest bike → nearest free space → nearest e-bike (omitted entirely if no e-bikes available).

Three card types, each with a distinct accent colour defined as a CSS custom property in `:root`:

| Type | CSS class | CSS variable | Colour | Shows |
|---|---|---|---|---|
| Nearest bike | `bike` | `--color-bike` | Red `#e31837` | Closest dock with a standard bike available |
| Nearest free space | `space` | `--color-space` | Blue `#1a6fc4` | Closest dock with an empty space |
| Nearest e-bike | `ebike` | `--color-ebike` | Green `#16a34a` | Closest dock with an e-bike |

The accent colours are consumed in CSS (card headers, counter row) and in JS via `getComputedStyle` (Leaflet dot markers). Hardcoded hex values for these colours should not appear anywhere else.

The page background (`--page-bg`) is the same red as `--color-bike` in light mode, and a darker maroon (`#8b0f20`) in dark mode. Elements rendered directly on the page background (h1, status message, refresh row, retry button text) use `--text-on-bg` — a semi-transparent white — rather than `--text-muted` or `--text-label`, which are reserved for text inside cards.

## Swipeable pager

Each card type shows up to 3 stations (nearest, 2nd nearest, 3rd nearest) as horizontally swipeable pages, via `.card > .card-scroll > .card-page`:

- **`.card`** — plain flex-column layout wrapper, no visual styling
- **`.card-scroll`** — horizontal `overflow-x: auto` scroller with `scroll-snap-type: x mandatory`; `::before`/`::after` pseudo-element spacers (16px) let the first/last page scroll to a centred position
- **`.card-page`** — the visual card (background, border-radius, box-shadow, padding). Sized `calc(100% - 32px)` with `scroll-snap-align: center`, so the focused page is centred with the previous/next page peeking in on either side — a visual cue that the card is swipeable

The ordinal prefix for each page's `.card-label` comes from the `ORDINAL` constant (`Nearest`, `2nd nearest`, `3rd nearest`).

`.cards` bleeds past the body's horizontal safe-area padding (negative margins sized from `--inset-l`/`--inset-r`) so the pages and their peeks run edge-to-edge.

Maps for page 0 of each card are initialised immediately; maps for later pages are lazily initialised via `IntersectionObserver` (tracked in `mapObservers[]`) the first time their page scrolls into view, since they're off-screen until the user swipes.

## Card layout

Each `.card-page` is a flex column:
- **`.card-body`** (flex row, `flex: 1`) — fills available height above the counter row and capacity bar
  - **`.card-content`** (flex column, `flex: 1`) — station name, distance, then `.card-meta` pushed to the bottom with `margin-top: auto`
  - **`.card-map`** (Leaflet map, `flex: 1`) — takes up half the card width, stretches to the full height of `.card-body`; tapping opens Google Maps searching for `Santander Cycles: <name>`
- **`.cap-bar`** — full card width, pinned to the bottom

### Counter row (`.card-meta`)

Sits at the bottom of `.card-content` (`margin-top: auto`), so the map always stretches to match its height. Displays three icon+number pairs on a single row: standard bikes (red), e-bikes (green), empty docks (blue). Icons are Material Symbols Outlined, reusing the `ICON` constant. Colours applied via `.card-meta > span:nth-child(n)` CSS rules.

## Icons

Material Symbols Outlined loaded from Google Fonts (`fonts.googleapis.com/css2?family=Material+Symbols+Outlined`). Used in two places:

- **Card headers** — via the `ICON` constant: `directions_bike` (bike), `electric_bike` (e-bike), `bike_dock` (free space)
- **Counter row** — `bikeMeta()` reuses `ICON` directly, so icon names are defined in one place only

Font variation settings pinned to `opsz=20, wght=400, FILL=0, GRAD=0`.

## Maps

Leaflet 1.9.4 (CDN). All interaction disabled — maps are decorative only. Tile layer switches based on `prefers-color-scheme`:
- Light: OpenStreetMap standard (`tile.openstreetmap.org`)
- Dark: CartoDB Dark Matter (`basemaps.cartocdn.com/dark_all`)

Each map has a coloured dot marker matching the card's accent colour. Colours are read at runtime from the CSS custom properties via `getComputedStyle`. Map instances are tracked in `activeMaps[]` and torn down before each re-render to prevent Leaflet listener leaks.

## Capacity bar

Three segments — red (standard bikes), green (e-bikes), blue (empty spaces) — against a dark grey background representing bikes currently out with riders (total docks minus all three segments).

## Distance calculation

Haversine formula, result in metres. Formatted as `Xm away` under 1 km, `X.Xkm away` above.

# Flag Picker

## What this is

A daily, Wordle-style game (`flagpicker/index.html`) showing a flag with one shape (a stripe, cross, circle, etc.) missing. The player picks a colour and is scored 0–100 on how close it is to the actual colour. One play per day, with a localStorage-backed streak (`STORAGE_KEY = 'flagpicker-state'`, no cookies).

## Data files

Flag and puzzle data live in `flags.js`/`puzzles.js` as `const FLAGS_DATA = {...}` / `const PUZZLES_DATA = [...]`, loaded via `<script src>` rather than `fetch()` — `fetch()` of local files is blocked under `file://`, which this avoids so the page also works without a server.

- **`puzzles.js`** — date-keyed list (`{date, flag, shapeId}`). If there's no entry for today, `dayIndexSinceEpoch()` picks a puzzle by cycling through the list based on days since `EPOCH` (2026-06-15, the first curated puzzle).
- **`flags.js`** — per flag, `svg` (raw markup from [flag-icons](https://github.com/lipis/flag-icons) 4x3 SVGs, vendored as inline strings) plus `shapes: [{id, fill}]`. Each shape's `fill` must be unique within that flag's SVG, since rendering finds the hidden shape by matching `fill` attributes rather than by element reference.

## Rendering

`renderFlag()` injects `MISSING_PATTERN` (a checkerboard `<pattern>` def, sized for the flags' `0 0 640 480` viewBox) plus the flag's `svg` markup into `#flagSvg`, then walks `[fill]` elements and replaces the one matching the target shape's fill with either the checkerboard pattern, the player's live colour pick, or (once revealed) the actual fill.

`cssColorToHex()` normalizes any CSS colour value (named colours like `red`, shorthand hex like `#fc0`, etc.) to `#RRGGBB` via an off-screen probe element + `getComputedStyle`, so fill-matching and scoring work regardless of how a colour is expressed in the source SVG.

## Scoring

Euclidean RGB distance, converted to a 0–100 score via exponential decay (`scoreFromDistance`): `100 * exp(-5 * (distance/maxDistance)^2)`. This is deliberately more forgiving for close guesses and harsher for distant ones than a linear scale.

## Notes

- No dark mode.
- Streak date arithmetic derives "yesterday" from the local `Date` object's fields rather than parsing a stored date string (which `new Date(str)` treats as UTC and can be off by a day in negative-UTC-offset timezones).
