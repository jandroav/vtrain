# vtrain

12-week training plan generator following [Jack Daniels'](https://en.wikipedia.org/wiki/Jack_Daniels_(coach)) VDOT methodology — for 10k, half-marathon, marathon, and general training.

🔗 **[vtrain.jandroav.net](https://vtrain.jandroav.net)**

## Features

- **Daniels methodology**, 12 weeks across the four phases:
  - **Phase I — Foundation** (s1–s3): easy running + strides
  - **Phase II — Early Quality** (s4–s6): repetition (R) work
  - **Phase III — Transition Quality** (s7–s9): intervals (I) + threshold (T)
  - **Phase IV — Final Quality** (s10–s11) + taper (s12)
- **Daniels' volume caps respected**: T ≤ 10%, I ≤ 8%, R ≤ 5% of weekly km, single I-rep ≤ ~1.2 km (~5 min ceiling)
- **Any race weekday**: rhythm anchors to your race — long run on race weekday, Q1 four days before, Q2 the day before
- **Bilingual UI**: English ↔ Spanish toggle, persistent
- **km ↔ miles toggle**: paces, distances, weekly totals, mileage chart, and calendar export all convert (track meter reps `1000 I`, `400 R` etc. stay metric — track is universal)
- **Export**:
  - **PDF** via browser print (A4, page-break aware, phase color accents preserved)
  - **`.ics`** calendar file (84 events covering every training day) for Google Calendar / Apple Calendar / Outlook
- **No backend**: pure HTML + vanilla JavaScript, runs entirely in the browser

## How it works

Enter your distance, race date (any weekday), and goal time. vtrain computes your VDOT from the time-distance combination, derives the five Daniels training paces (Easy, Marathon, Threshold, Interval, Repetition), and generates a phase-progressed 12-week plan with quality sessions on days 3 and 6 of each week and the long run / race on day 7.

More on the methodology in [Daniels' Running Formula](https://www.amazon.com/Daniels-Running-Formula-Jack-Tupper/dp/1450431836).

## Development

No build step — plain HTML + vanilla JS. Serve locally:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000`.

Run tests (Node 18+, no dependencies):

```bash
node --test tests/vtrain.test.mjs
```

Tests run on every push and pull request via [GitHub Actions](.github/workflows/test.yml).
