# Bike and Dock Finder — project notes for Claude

## What this is

A single-file web app ("Bike and Dock Finder") that shows the nearest Santander Cycles docking stations to the user's current location. Hosted on GitHub Pages at the repo root.

## Architecture

The Santander Cycles app lives in `santandercycles/index.html` — HTML, CSS, and JS are all inline. Leaflet and Material Symbols Outlined are loaded from CDN. There is no build step, no package manager, and no other framework. Related files (`manifest.json`, `sw.js`, `icon.svg`) sit alongside it in the same folder. The landing page is at the repo root in `index.html`.

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
| Nearest bike | `bike` | `--color-bike` | Red `#e31837` | Closest dock with any bike available |
| Nearest free space | `space` | `--color-space` | Blue `#1a6fc4` | Closest dock with an empty space |
| Nearest e-bike | `ebike` | `--color-ebike` | Green `#16a34a` | Closest dock with an e-bike |

The accent colours are consumed in CSS (card headers, counter row) and in JS via `getComputedStyle` (Leaflet dot markers). Hardcoded hex values for these colours should not appear anywhere else.

## Card layout

Each card is a flex column:
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

Three segments — red (standard bikes), green (e-bikes), light grey (empty spaces) — against a dark grey background representing bikes currently out with riders (total docks minus all three segments).

## Distance calculation

Haversine formula, result in metres. Formatted as `Xm away` under 1 km, `X.Xkm away` above.
