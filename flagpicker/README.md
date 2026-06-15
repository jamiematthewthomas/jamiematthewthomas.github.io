# Flag Picker (`flagpicker/`)

A daily, Wordle-style game. Each day shows a flag with one section (a stripe, cross, circle, etc.) missing — you pick a colour with a colour picker and submit a guess for what that section should be.

## How it works

- `puzzles.js` (`PUZZLES_DATA`) is a date-keyed list of puzzles, each naming a flag and which of its shapes is hidden for that day. If there's no entry for today's date, the day's puzzle is chosen by cycling through the list based on days elapsed since the epoch.
- `flags.js` (`FLAGS_DATA`) holds the raw SVG markup for each flag (sourced from [flag-icons](https://github.com/lipis/flag-icons), vendored locally) plus a list of its shapes, each identified by its `fill` colour.
- To render a flag, the hidden shape's elements are found by matching their `fill` attribute and replaced with a checkerboard "missing" pattern (or the player's live colour pick).
- Your guess is scored 0–100 based on the Euclidean distance between your guess and the actual colour in RGB space, using exponential decay so close guesses score highly and wildly wrong guesses drop off quickly.
- Results and streaks are stored in `localStorage` (no cookies) — one play per day, with the streak continuing only if you played the previous day too.

## Tech

No framework, no build step — HTML, CSS, and JS are all inline in `index.html`, with flag and puzzle data in separate `.js` files (loaded via `<script src>` so the page also works over `file://`).
