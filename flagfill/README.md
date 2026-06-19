# Flag Fill (`flagfill/`)

A daily, Wordle-style game. Each day shows a flag with one section (a stripe, cross, circle, etc.) missing — you pick a colour with a colour picker and submit a guess for what that section should be.

## How it works

- `puzzles.js` (`PUZZLES_DATA`) is a date-keyed list of puzzles, each naming a flag and which of its shapes is hidden for that day. If there's no entry for today's date, the day's puzzle is chosen by cycling through the list based on days elapsed since the epoch.
- `flags.js` (`FLAGS_DATA`) holds the raw SVG markup for each flag (sourced from [flag-icons](https://github.com/lipis/flag-icons), vendored locally) plus a list of its shapes, each identified by its `fill` colour.
- To render a flag, the hidden shape's elements are found by matching their `fill` attribute and replaced with a checkerboard "missing" pattern, shown until the player picks a colour with the colour picker, after which it tracks their live colour pick.
- After submitting, the picker card is replaced by a single result card showing the flag's name, then the whole flag twice side by side — once with your guessed colour and once with the actual colour — along with your score.
- Your guess is scored 0–100 based on the Euclidean distance between your guess and the actual colour in RGB space, using exponential decay so close guesses score highly and wildly wrong guesses drop off quickly. A one-line caption with an emoji reacts to the score, getting harsher the further off you are.
- Results and streaks are stored in `localStorage` (no cookies) — one play per day, with the streak continuing only if you played the previous day too. The current streak is shown in the footer alongside a "Written by Jamie Thomas" credit.
- A "Share score" button appears in the result card. It uses `navigator.share()` on mobile (native share sheet) and falls back to copying to the clipboard on desktop, with the button label briefly changing to "Copied!" to confirm. The share text includes the date, flag name, score, and a link to `jamiethomas.dev/flagfill/`.

## Tech

No framework, no build step — HTML, CSS, and JS are all inline in `index.html`, with flag and puzzle data in separate `.js` files (loaded via `<script src>` so the page also works over `file://`). The colour picker is [Coloris](https://github.com/mdbassit/Coloris), loaded from CDN and used in inline mode so it's always visible rather than opening as a popup.

Installable as a PWA (`manifest.json`, `sw.js`, and icon files) for adding to a mobile home screen.

## Look

The app's accent colour is navy (`#0f298e`) — used for the page background and the submit button. Text on the navy background (the title and footer) is semi-transparent white; the flag name, subtitles, and other text inside the white cards stays black or grey.

An info button (top right of the title bar) opens a modal explaining the game.
