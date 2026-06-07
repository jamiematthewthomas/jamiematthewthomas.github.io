# jamiematthewthomas.github.io

Personal GitHub Pages site. `index.html` is a landing page linking to projects.

---

## Santander Cycles (`santandercycles.html`)

A minimal web app that shows you the nearest Santander Cycles docking stations based on your current location.

### What it shows

Cards are ordered: nearest bike, nearest free space, nearest e-bike (hidden if none available).

Each card contains:
- Station name and distance
- Counts of standard bikes, e-bikes, and free spaces (stacked vertically)
- A capacity bar across the full card width (standard bikes / e-bikes / empty spaces / in use)
- A map of the dock's location taking up half the card width — tap to open Google Maps, searching for the dock by name

### How it works

1. Requests your location via the browser Geolocation API
2. Fetches all ~800 docking stations from the [TfL BikePoint API](https://api.tfl.gov.uk/BikePoint) (no API key required)
3. Ranks stations by straight-line distance using the Haversine formula

### Tech

Single `santandercycles.html` file — no framework, no build step.

**Dependencies (CDN):**
- [Leaflet](https://leafletjs.com/) — map rendering, using OpenStreetMap tiles in light mode and CartoDB Dark Matter tiles in dark mode

### UI

- Dark mode support via `prefers-color-scheme`
- Skeleton loading cards while location and dock data are fetched
- Safe area insets for iPhone notch / Dynamic Island / home indicator
- Tap feedback on cards

---

## Deployment

Hosted on GitHub Pages. Any push to `main` goes live automatically.
