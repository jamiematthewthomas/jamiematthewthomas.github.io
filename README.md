# jamiematthewthomas.github.io

Personal GitHub Pages site. `index.html` is a landing page linking to the projects below, each shown as a card with its own icon and accent colour.

## Projects

- **[`santandercycles/`](santandercycles/README.md)** — Bike/Dock Finder, a web app showing the nearest Santander Cycles docking stations to your current location.
- **[`flagfill/`](flagfill/README.md)** — Flag Fill, a daily Wordle-style game where you guess the colour of a missing section of a flag.

## Deployment

Hosted on GitHub Pages. Any push to `main` goes live automatically.

Development happens on the `uat` branch. Pushing to `uat` triggers the [Sync UAT](.github/workflows/sync-uat.yml) workflow, which copies the branch contents into a `uat/` directory on `main` — making the in-progress version accessible at `/uat/` on the live site for review before merging to `main`.
