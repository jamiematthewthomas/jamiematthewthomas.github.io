# Santander Cycles

A minimal web app that shows you the nearest Santander Cycles docking stations based on your current location.

## What it shows

- **Nearest bike** — the closest dock that has at least one bike available
- **Nearest e-bike** — the closest dock with an e-bike (hidden if none are available)
- **Nearest free space** — the closest dock with an empty slot for returning a bike

Each card shows:
- A capacity bar (standard bikes / e-bikes / empty spaces / in use)
- Counts of standard bikes, e-bikes, and free spaces
- Distance from your current location
- A small map of the dock's location — tap to open Google Maps, searching for the dock by name

## How it works

1. Requests your location via the browser Geolocation API
2. Fetches all ~800 docking stations from the [TfL BikePoint API](https://api.tfl.gov.uk/BikePoint) (no API key required)
3. Ranks stations by straight-line distance using the Haversine formula

## Tech

Single `index.html` file — no framework, no build step.

**Dependencies (CDN):**
- [Leaflet](https://leafletjs.com/) — map rendering, using OpenStreetMap tiles in light mode and CartoDB Dark Matter tiles in dark mode

## UI

- Dark mode support via `prefers-color-scheme`
- Skeleton loading cards while location and dock data are fetched
- Safe area insets for iPhone notch / Dynamic Island / home indicator
- Tap feedback on cards

## Deployment

Hosted on GitHub Pages. Any push to `main` goes live automatically.
