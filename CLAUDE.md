# jamiematthewthomas.github.io — project notes for Claude

## What this is

A personal GitHub Pages site hosting a small collection of single-page web apps, with a landing page at the repo root in `index.html`. See the root `README.md` for a project index. Each project lives in its own folder with its own `README.md`:

- **`santandercycles/`** — Bike/Dock Finder, covered below.
- **`flagfill/`** — Flag Fill, covered below.

Across all projects: no build step, no package manager, no other framework — each app's HTML, CSS, and JS are inline in its `index.html`, with CDN dependencies where needed.

## Branching and deployment

- **`main`** — production branch, served live by GitHub Pages. Direct commits go live immediately.
- **`uat`** — development branch for in-progress work. Pushing to `uat` triggers `.github/workflows/sync-uat.yml`, which copies the branch contents into a `uat/` directory on `main` (excluding `.git`, `.github`, `CNAME`, `README.md`, and `CLAUDE.md`). This makes the in-progress version accessible at `/uat/` on the live site for review before merging to `main`.

## Landing page

The root `index.html` lists each app as a `.link-card` — an icon (that app's `icon_with_border.svg`) next to a label, title, and description. Each card carries a `red` or `blue` modifier class matching the app's accent colour (`.link-card.red .link-label` is `#e31837` for Bike/Dock Finder, `.link-card.blue .link-label` is `#0f298e` for Flag Fill), so the cards visually match their respective apps.

# Bike/Dock Finder

## What this is

A single-file web app ("Bike/Dock Finder") that shows the nearest Santander Cycles docking stations to the user's current location.

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

## Info modal

A `.info-btn` (the `info` Material Symbol, 22px) sits absolutely positioned to the right inside `.page-header`, which wraps the `h1` and uses `justify-content: center` to keep the title centred. Tapping the button removes `.hidden` from `#infoModal` — a `position: fixed; inset: 0` overlay with a semi-transparent black backdrop. The inner `.info-sheet` uses `var(--card-bg)` and `var(--card-shadow)` so it adapts to dark mode. A `cancel` icon button (`.info-close`) in the top-right of the sheet closes it; tapping the backdrop also closes it (`handleModalClick` checks `e.target === infoModal`).

# Flag Fill

## What this is

A daily, Wordle-style game (`flagfill/index.html`) showing a flag with one shape (a stripe, cross, circle, etc.) missing. The player picks a colour and is scored 0–100 on how close it is to the actual colour. One play per day, with a localStorage-backed streak (`STORAGE_KEY = 'flagpicker-state'`, no cookies).

## Data files

Flag and puzzle data live in `flags.js`/`puzzles.js` as `const FLAGS_DATA = {...}` / `const PUZZLES_DATA = [...]`, loaded via `<script src>` rather than `fetch()` — `fetch()` of local files is blocked under `file://`, which this avoids so the page also works without a server.

- **`puzzles.js`** — date-keyed list (`{date, flag, shapeId}`). If there's no entry for today, `dayIndexSinceEpoch()` picks a puzzle by cycling through the list based on days since `EPOCH` (2026-06-15, the first curated puzzle).
- **`flags.js`** — per flag, `svg` (raw markup from [flag-icons](https://github.com/lipis/flag-icons) 4x3 SVGs, vendored as inline strings) plus `shapes: [{id, fill}]`. Each shape's `fill` must be unique within that flag's SVG, since rendering finds the hidden shape by matching `fill` attributes rather than by element reference.

## Rendering

`renderFlag()` injects `MISSING_PATTERN` (a checkerboard `<pattern>` def, sized for the flags' `0 0 640 480` viewBox) plus the flag's `svg` markup into `#flagSvg`, then walks `[fill]` elements and replaces the one matching the target shape's fill with either the checkerboard pattern, the player's live colour pick, or (once revealed) the actual fill.

A `hasPicked` flag tracks whether the player has interacted with the colour picker yet. Until then, `renderFlag()` always shows the checkerboard pattern. The `coloris:pick` event (dispatched on `document` by the Coloris library; `event.detail.color` holds the picked hex) sets `pickedColor`, calls `markPicked()` (sets `hasPicked = true`, enables the submit button), then re-renders the flag so the live pick replaces the checkerboard.

The checkerboard uses `patternUnits="userSpaceOnUse"`, which measures the tile in the local coordinate system of the element that references it. Some flags (e.g. South Korea) define shapes inside a deeply scaled and rotated group, which makes the 64×64 tile either far too large to see (solid grey) or appear tilted. After applying `url(#missing)`, `renderFlag()` compares the target element's screen CTM against the SVG element's screen CTM to compute the local-to-root scale ratio. If it exceeds 1.5, it sets a `patternTransform` on the pattern element encoding the inverse of the local-to-root 2×2 matrix — undoing both the scale and any rotation so the tiles always appear axis-aligned and consistently sized regardless of the flag's internal coordinate space.

## Colour picker

The colour picker is [Coloris](https://github.com/mdbassit/Coloris) (`mdbassit/Coloris`), loaded from jsDelivr (`cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/`). It's initialised in inline mode (`inline: true`) with `parent: '#pickerRow'`, so it appends `#clr-picker` as a permanent child of the `#pickerRow` div — always visible, no popup. `alpha: false` disables the opacity slider. The picked colour is stored in the `pickedColor` JS variable (not in an input element's value); `pickedColor` starts as `''` and is populated only when the `coloris:pick` event fires. Two CSS overrides on `#clr-picker` remove the popup box-shadow and stretch it to full card width (`width: 100% !important`). `.clr-gradient` height is overridden to `120px` to give a larger colour area than the default. `touch-action: none` is also applied to `.clr-gradient` so that horizontal swipes on mobile are passed straight to JavaScript rather than being claimed as scroll gestures by the browser — without it, horizontal movement in the gradient is suppressed on iOS and the marker is stuck at the left edge. The gradient is a CSS div (not a canvas), so stretching it with CSS correctly updates `colorAreaDims.width` (which reads `offsetWidth`) and click positions scale proportionally.

Swatches cover the main families of colour found in world flags: red (`#CC1A2E`), dark red/maroon (`#8C1C30`), orange (`#F08500`), yellow (`#F5CC00`), green (`#0A9648`), dark green (`#0A7540`), sky blue (`#6AAAD8`), royal blue (`#1042AA`), navy (`#0A3272`). Each is deliberately offset from any known exact flag colour — e.g. away from Argentina's `#74ACDF`, USA's `#002868`, and Ukraine's `#FFD700` — so that clicking a swatch never yields a free perfect score.

Two subtle ordering constraints apply to the initialisation at the bottom of the script:

1. **`init()` must run before `Coloris({...})`** — `init()` unhides `#flagName`, which shifts `#pickerRow` down the page. Coloris calls `updatePickerPosition()` (which records `colorAreaDims`) when the `inline` option is processed; if that happens before the layout settles, the stored gradient coordinates are wrong and all clicks land at the bottom-right corner.

2. **`parent` must come before `inline` in the options object** — Coloris processes options in insertion order. The `inline` case triggers `updatePickerPosition()` immediately; if `parent` hasn't been processed yet, `container` is still null, `offset` defaults to `{x:0, y:0}`, and `colorAreaDims` is computed relative to nothing.

## Result view

After a guess (or on revisiting after already playing today), `#flagCard` (the picker card) is hidden and `#result` is shown — a single card so only one is visible at a time. `#result` repeats the flag name in `#flagNameResult` (since `#flagName` is hidden along with `#flagCard`), then renders the flag twice via `renderFlagInto(el, fillValue)`, which injects `flag.svg` into the given `<svg>` and sets the target shape's fill directly to `fillValue` (no checkerboard pattern, unlike `renderFlag()`): once into `#guessFlagSvg` with the player's guessed colour, and once into `#actualFlagSvg` with the actual colour, side by side via `.flag-pair`/`.flag-col`.

`cssColorToHex()` normalizes any CSS colour value (named colours like `red`, shorthand hex like `#fc0`, etc.) to `#rrggbb` (lowercase) via an off-screen probe element + `getComputedStyle`, so fill-matching and scoring work regardless of how a colour is expressed in the source SVG. Hex values displayed in the result view (`.swatch-hex`) use `text-transform: lowercase` to match the colour picker's output.

## Scoring

Euclidean RGB distance, converted to a 0–100 score via exponential decay (`scoreFromDistance`): `100 * exp(-5 * (distance/maxDistance)^2)`. This is deliberately more forgiving for close guesses and harsher for distant ones than a linear scale.

`feedbackForScore()` maps the score to a one-line caption with an emoji, shown alongside the score: 100 is "Perfect score! 🤯", 95-99 "Incredible work! 😎", 85-94 "Great guess! 👏", 75-84 "Good guess 🙂", then deliberately harsher below that — 60-74 "Not great 😬", 40-59 "Pretty bad 😞", under 40 "Way off! 💀".

## Icons

Material Symbols Outlined loaded from Google Fonts (`fonts.googleapis.com/css2?family=Material+Symbols+Outlined`), with `display=block` (not `display=swap`) to avoid a flash of the icon name as text before the font loads. A `preconnect` hint to `fonts.gstatic.com` is included so the font file connection is established early. Used for the `info` / `cancel` icons for the info modal.

Font variation settings pinned to `opsz=20, wght=400, FILL=0, GRAD=0`.

## Sharing

A "Share score" button (`.share-btn`, `#shareBtn`) sits in `#result` between the score feedback and the "Come back tomorrow" subtitle. `shareScore()` builds the share text from `loadState()` (for `lastScore`) and `current.flag.name`, then:

1. Tries `navigator.share({ title, text, url })` — triggers the native share sheet on mobile.
2. Falls back to `navigator.clipboard.writeText()` on desktop — the button label (`#shareBtnLabel`) switches to "Copied!" for 2 s then resets.

Share text format:
```
Flag Fill · 19 Jun 2026
France — 87/100
Great guess! 👏

https://jamiethomas.dev/flagfill/
```

The URL is hardcoded to `https://jamiethomas.dev/flagfill/`. `formatShareDate()` formats the date as `D Mon YYYY` from the local `Date` object.

## Info modal

Same pattern as Bike/Dock Finder (see above): `.page-header` wraps the `h1` with an absolutely positioned `.info-btn` (`info` icon, 22px) on the right. Opening `#infoModal` shows a white `.info-sheet` with a `cancel` close button (`.info-close`). Tapping the backdrop also closes it. No dark mode, so the sheet is always white rather than using CSS variables.

## Notes

- No dark mode.
- Streak date arithmetic derives "yesterday" from the local `Date` object's fields rather than parsing a stored date string (which `new Date(str)` treats as UTC and can be off by a day in negative-UTC-offset timezones).
- Installable as a PWA, same approach as Bike/Dock Finder (`manifest.json`, `sw.js`, `icon_with_border.svg`/`icon_without_border.svg`).
- The footer shows the current streak and a "Written by Jamie Thomas" credit (`#statsText` + `.byline-link`).
- Page background is the app's navy accent (`#0f298e`), matched by the PWA manifest's `background_color`. Text rendered directly on it (`h1`, `.stats`, `.byline-link`) uses semi-transparent white rather than the greys used for text inside cards.
- The navy accent (`#0f298e`) is also used for `button.primary`, the `theme-color` meta tag, and the manifest's `theme_color`. The flag name (`.flag-name`) stays black (`#111`) inside its white card rather than navy, to avoid the page being all one colour.
- `#flagName` lives inside `#flagCard`, above `#flagSvg`, so it's hidden along with the rest of the picker card once a guess has been made — `#flagNameResult` (inside `#result`) shows the same name afterwards.
