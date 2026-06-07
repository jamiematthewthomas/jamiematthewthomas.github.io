# Santander Cycles — project notes for Claude

## What this is

A single-file, dependency-free web app that shows the nearest Santander Cycles docking stations to the user's current location. Hosted on GitHub Pages at the repo root.

## Architecture

Everything lives in `index.html` — HTML, CSS, and JS are all inline. There is no build step, no package manager, and no framework. Keeping it as a single file is intentional; it makes it trivially deployable and inspectable.

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

Three card types, each with a distinct accent colour:

| Type | CSS class | Colour | Shows |
|---|---|---|---|
| Nearest bike | `bike` | Red `#e31837` | Closest dock with any bike available |
| Nearest e-bike | `ebike` | Green `#16a34a` | Closest dock with an e-bike; hidden if none available |
| Nearest free space | `space` | Blue `#1a6fc4` | Closest dock with an empty space |

## Capacity bar

The bar on each card has three segments — red (standard bikes), green (e-bikes), light grey (empty spaces) — against a dark grey background. The background portion represents bikes currently out with riders (total docks minus all three segments).

## Distance calculation

Haversine formula, result in metres. Formatted as `Xm away` under 1 km, `X.Xkm away` above.
