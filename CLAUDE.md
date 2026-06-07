# Santander Cycles — project notes for Claude

## What this is

A single-file web app that shows the nearest Santander Cycles docking stations to the user's current location. Hosted on GitHub Pages at the repo root.

## Architecture

Everything lives in `index.html` — HTML, CSS, and JS are all inline. Leaflet is loaded from CDN. There is no build step, no package manager, and no other framework. Keeping it as a single file is intentional; it makes it trivially deployable and inspectable.

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
Standard browser `navigator.geolocation.getCurrentPosition`. Times out after 10 seconds.

## Cards

Card order: nearest bike → nearest free space → nearest e-bike (omitted entirely if no e-bikes available).

Three card types, each with a distinct accent colour:

| Type | CSS class | Colour | Shows |
|---|---|---|---|
| Nearest bike | `bike` | Red `#e31837` | Closest dock with any bike available |
| Nearest free space | `space` | Blue `#1a6fc4` | Closest dock with an empty space |
| Nearest e-bike | `ebike` | Green `#16a34a` | Closest dock with an e-bike |

## Card layout

Each card is a flex column:
- **`.card-body`** (flex row, `flex: 1`) — fills available height above the capacity bar
  - **`.card-content`** (flex column, `flex: 1`) — station name, distance, then bike/space counters stacked vertically and spread to fill the height
  - **`.card-map`** (Leaflet map, `flex: 1`) — takes up half the card width, full height of `.card-body`; tapping opens Google Maps searching for `Santander Cycles: <name>`
- **`.cap-bar`** — full card width, pinned to the bottom

## Maps

Leaflet 1.9.4 (CDN). All interaction disabled — maps are decorative only. Tile layer switches based on `prefers-color-scheme`:
- Light: OpenStreetMap standard (`tile.openstreetmap.org`)
- Dark: CartoDB Dark Matter (`basemaps.cartocdn.com/dark_all`)

Each map has a coloured dot marker matching the card's accent colour. Map instances are tracked in `activeMaps[]` and torn down before each re-render to prevent Leaflet listener leaks.

## Capacity bar

Three segments — red (standard bikes), green (e-bikes), light grey (empty spaces) — against a dark grey background representing bikes currently out with riders (total docks minus all three segments).

## Distance calculation

Haversine formula, result in metres. Formatted as `Xm away` under 1 km, `X.Xkm away` above.
