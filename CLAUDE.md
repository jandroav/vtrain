# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

vtrain is a single-page static site that generates 12-week running training plans following Jack Daniels' VDOT methodology. Hosted on GitHub Pages at `vtrain.jandroav.net`. User-facing strings are in Spanish; preserve that when editing UI copy.

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
   - `phase` — printed in the week header.
   - `c1-XX` / `c2-XX` per distance — Wednesday Q1 and Saturday Q2 sessions for `42`/`21`/`10`. The `0` (general) variant uses `pre1`/`pre2`.
   - `lun-XX` / `mar-XX` / `jue-XX` / `vie-XX` / `dom-XX` — easy-day volumes per distance. Empty string renders as `Descanso` (rest).
   - `km-XX` — decorative weekly total per distance.
4. **Helpers** — `parseTimeToSeconds`, `getVDOT` (closest-VDOT lookup), `calculatePaces`, `selectWeek` (collapses per-distance fields into a flat per-day object), `parseLocalDate` (avoids `new Date("YYYY-MM-DD")` UTC drift), `isSunday`.
5. **`buildPlan(distance, raceDate, raceTime)`** — walks 12 weeks back from race date, returns `{ weeks, vdot, paces }`.
6. **Render + form wiring** — `renderPlan` builds DOM strings; the `DOMContentLoaded` handler validates inputs (Sunday-only, distance in {0,10,21,42}, time format) and calls `buildPlan`.

The phase mapping `s1-s3 FI / s4-s6 EQ / s7-s9 TQ / s10-s12 FQ` is encoded in the `phase` strings, not enforced in code.

## Editing notes

- **Daniels caps must hold** when changing `PLAN_CONFIG`: T ≤ 10%, I ≤ 8%, R ≤ 5% of the week's `km-XX` total, and any single I-rep ≤ ~1.2 km (~5 min at VDOT 50). Race day is Sunday — the layout (Q1 Wed, Q2 Sat, race Sun) is hardcoded around this.
- **Adding a new race distance** requires: a new VDOT table, a `case` in `getVDOT`, a `case` in `selectWeek`, new `c1-XX`/`c2-XX` and five day fields (`lun-XX`..`dom-XX`) plus `km-XX` in every week of `PLAN_CONFIG`, and a new option in the `<select>` in `index.html`.
- **`km-XX` is decorative**, not derived. If you change daily volumes or Q sessions, update `km-XX` by hand to match.
- **Distance `0` (general training)** routes through `HALF_MARATHON_VDOT` and the `pre1`/`pre2`/`*-pre` field set; the user's goal time is interpreted as a half-marathon-equivalent.
- **Local testing**: `python3 -m http.server 8000` from repo root, then `http://localhost:8000`. Browser file:// also works for everything except service-worker-style features (none here).
- **Deployment**: GitHub Pages serves from `main` branch root. The `CNAME` file at root is what binds the custom domain — don't move it into a subfolder.
