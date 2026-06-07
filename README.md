# Santander Cycles

A minimal web app that shows you the nearest Santander Cycles docking stations based on your current location.

## What it shows

- **Nearest bike** — the closest dock that has at least one bike available
- **Nearest e-bike** — the closest dock with an e-bike (hidden if none are available)
- **Nearest free space** — the closest dock with an empty slot for returning a bike

Each card shows a capacity bar (standard bikes / e-bikes / empty spaces / in use) and links to Google Maps for directions.

## How it works

1. Requests your location via the browser Geolocation API
2. Fetches all ~800 docking stations from the [TfL BikePoint API](https://api.tfl.gov.uk/BikePoint) (no API key required)
3. Ranks stations by straight-line distance using the Haversine formula

## Tech

Single `index.html` file — no framework, no build step, no dependencies.

## Deployment

Hosted on GitHub Pages. Any push to `main` goes live automatically.
