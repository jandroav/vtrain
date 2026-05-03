# vtrain

12-week training plan generator following [Jack Daniels'](https://en.wikipedia.org/wiki/Jack_Daniels_(coach)) VDOT methodology — for 10k, half-marathon, marathon, and general training.

🔗 **[vtrain.jandroav.net](https://vtrain.jandroav.net)**

## How it works

Enter your distance, race date (any weekday), and goal time. The app computes your VDOT and the five Daniels training paces (Easy, Marathon, Threshold, Interval, Repetition), then generates a 12-week plan structured into Daniels' four phases:

- **Phase I — Foundation** (s1–s3): easy running + strides
- **Phase II — Early Quality** (s4–s6): repetition (R) work
- **Phase III — Transition Quality** (s7–s9): intervals (I) + threshold (T)
- **Phase IV — Final Quality** (s10–s12): T + race-specific pace, taper in s12

The training rhythm is anchored to race day: long run lands on the race weekday, Q1 three days earlier, Q2 three days after Q1 (one day before race day in race week). The plan respects Daniels' volume caps (T ≤ 10%, I ≤ 8%, R ≤ 5% of weekly km) and the ~5-min ceiling on I-pace reps.

More on the methodology in [Daniels' Running Formula](https://www.amazon.com/Daniels-Running-Formula-Jack-Tupper/dp/1450431836).

## Development

No build step — plain HTML + vanilla JS. Serve locally with:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000`.

Run tests (Node 18+):

```bash
node --test tests/vtrain.test.mjs
```
