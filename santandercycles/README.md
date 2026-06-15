# Bike and Dock Finder (`santandercycles/`)

A minimal web app that shows you the nearest Santander Cycles docking stations based on your current location.

## What it shows

Cards are ordered: nearest bike, nearest free space, nearest e-bike (hidden if none available).

Each card is horizontally swipeable, showing the nearest, 2nd nearest, and 3rd nearest station of that type as separate pages — the focused page sits centred with the next/previous page peeking in on either side as a hint that you can swipe.

Each page contains:
- Station name and distance
- Counts of standard bikes, e-bikes, and free spaces in a single row with icons, coloured red/green/blue
- A capacity bar across the full card width (standard bikes / e-bikes / empty spaces / in use)
- A map of the dock's location taking up half the card width — tap to open Google Maps, searching for the dock by name

## How it works

1. Requests your location via the browser Geolocation API and fetches all ~800 docking stations from the [TfL BikePoint API](https://api.tfl.gov.uk/BikePoint) in parallel (no API key required)
2. Ranks stations by straight-line distance using the Haversine formula

## Tech

No framework, no build step — HTML, CSS, and JS are all inline in `index.html`.

**Dependencies (CDN):**
- [Leaflet](https://leafletjs.com/) — map rendering, using OpenStreetMap tiles in light mode and CartoDB Dark Matter tiles in dark mode
- [Material Symbols Outlined](https://fonts.google.com/icons) — icons for card headers and counters

## UI

- Dark mode support via `prefers-color-scheme`
- Skeleton loading cards while location and dock data are fetched
- Safe area insets for iPhone notch / Dynamic Island / home indicator
- Tap feedback on cards
- Swipeable cards, edge-to-edge with a peek of the adjacent page
