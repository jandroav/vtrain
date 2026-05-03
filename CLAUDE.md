# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

vtrain is a single-page static site that generates 12-week running training plans following Jack Daniels' VDOT methodology. Hosted on GitHub Pages at `vtrain.jandroav.net`. The UI is bilingual (English default, Spanish toggle) — UI copy lives in `I18N` in `vtrain.js`, and the workout strings in `PLAN_CONFIG` are stored in Spanish Daniels notation and translated to English at render time by `translateWorkout`.

## Files

- **`index.html`** — form (distance / race date / goal time) and output container. Inline CSS, dark theme.
- **`vtrain.js`** — all logic and data. No build step, no framework, no dependencies; loaded directly by `index.html`.
- **`CNAME`** — pins GitHub Pages to the custom domain `vtrain.jandroav.net`. Required at repo root for the apex `vtrain.jandroav.net` setup.

There is no toolchain. Edit, save, refresh.

## How `vtrain.js` is organized

Everything lives in one file in this order:

1. **VDOT race-time tables** (`HALF_MARATHON_VDOT`, `MARATHON_VDOT`, `TEN_K_VDOT`) — VDOT → race time at that effort. Sourced from Daniels' Running Formula.
2. **Pace tables** (`PACE_S`, `PACE_M`, `PACE_U`, `PACE_I`, `PACE_R`) — VDOT → min/km for the five Daniels paces (Suave/Easy, Maratón, Umbral/Threshold, Intervalo, Repetición).
3. **`PLAN_CONFIG`** — the 12-week plan content. One object per week (`s1`..`s12`). Each week has:
   - `phase` — language-neutral phase key (`FI` / `EQ` / `TQ` / `FQ` / `TAPER`); rendered via `I18N[lang].phases`.
   - `c1-XX` / `c2-XX` per distance — Wednesday Q1 and Saturday Q2 sessions for `42`/`21`/`10`. The `0` (general) variant uses `pre1`/`pre2`. Stored in Spanish Daniels notation.
   - `lun-XX` / `mar-XX` / `jue-XX` / `vie-XX` / `dom-XX` — easy-day volumes per distance. Empty string renders as the localized "Rest"/"Descanso".
   - `km-XX` — decorative weekly total per distance.
4. **`I18N`** — `{ en, es }` parallel dictionaries with matching keys: page strings, day names, phase labels, pace labels, error messages. Both objects MUST have the same key shape — the renderer assumes a value exists for every key in the active language.
5. **`translateWorkout(text, lang)`** — converts Spanish Daniels notation to English at render time when `lang === "en"` (S→E, U→T, A/D→ST, C/→w/, TR→jog, MIN→min, X→x). Identity for `lang === "es"`. Edits to workout strings in `PLAN_CONFIG` should keep the Spanish form so this translator stays the single source of conversion.
6. **Helpers** — `parseTimeToSeconds`, `getVDOT` (closest-VDOT lookup), `calculatePaces` (returns language-neutral pace keys: `Easy`/`Marathon`/`Threshold`/`Interval`/`Repetition`), `selectWeek` (collapses per-distance fields into a flat per-day object), `parseLocalDate` (avoids `new Date("YYYY-MM-DD")` UTC drift), `isSunday`.
7. **`buildPlan(distance, raceDate, raceTime)`** — walks 12 weeks back from race date. Returns `{ weeks, vdot, paces }`. Schedule entries use day keys (`mon`/`tue`/.../`sun`), not localized names.
8. **Render + form wiring** — `renderPlan(plan, lang)` reads `I18N[lang]` and runs each workout string through `translateWorkout`. `setLanguage(lang)` persists to `localStorage["vtrain.lang"]`, updates `<html lang>`, retranslates all `[data-i18n]` elements, recolors the toggle, and (if a plan is shown) re-renders it without recomputing.

The phase mapping `s1-s3 FI / s4-s6 EQ / s7-s9 TQ / s10-s12 FQ` (s12 is `TAPER`) is encoded in the `phase` field, not enforced in code.

## Editing notes

- **Daniels caps must hold** when changing `PLAN_CONFIG`: T ≤ 10%, I ≤ 8%, R ≤ 5% of the week's `km-XX` total, and any single I-rep ≤ ~1.2 km (~5 min at VDOT 50). Race day is Sunday — the layout (Q1 Wed, Q2 Sat, race Sun) is hardcoded around this.
- **Adding a new race distance** requires: a new VDOT table, a `case` in `getVDOT`, a `case` in `selectWeek`, new `c1-XX`/`c2-XX` and five day fields (`lun-XX`..`dom-XX`) plus `km-XX` in every week of `PLAN_CONFIG`, a new option in the `<select>` in `index.html`, and a label entry in `I18N.en.distances` and `I18N.es.distances`.
- **Adding a new UI string** — add it to *both* `I18N.en` and `I18N.es` (the renderer assumes parity). Static HTML elements use a `data-i18n="key"` attribute; `applyStaticI18n` swaps in `I18N[lang][key]` via `innerHTML`, so values may contain markup.
- **`km-XX` is decorative**, not derived. If you change daily volumes or Q sessions, update `km-XX` by hand to match.
- **Distance `0` (general training)** routes through `HALF_MARATHON_VDOT` and the `pre1`/`pre2`/`*-pre` field set; the user's goal time is interpreted as a half-marathon-equivalent.
- **Local testing**: `python3 -m http.server 8000` from repo root, then `http://localhost:8000`. Browser file:// also works for everything except service-worker-style features (none here).
- **Deployment**: GitHub Pages serves from `main` branch root. The `CNAME` file at root is what binds the custom domain — don't move it into a subfolder.
