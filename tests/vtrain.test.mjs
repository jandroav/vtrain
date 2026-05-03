// Unit tests for vtrain.js. Run with `node --test tests/`.
//
// vtrain.js is a browser script (no module exports) so we evaluate it in a
// minimal mocked-DOM context and pin the symbols we need to globalThis.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_PATH = path.join(__dirname, "..", "vtrain.js");

before(() => {
  globalThis.document = {
    documentElement: { lang: "en" },
    title: "",
    getElementById: () => ({ innerHTML: "" }),
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => ({ click: () => {} }),
    body: { appendChild: () => {}, removeChild: () => {} },
  };
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  globalThis.URL = { createObjectURL: () => "blob:", revokeObjectURL: () => {} };
  globalThis.Blob = class { constructor(parts) { this.parts = parts; } };

  const SRC = readFileSync(SRC_PATH, "utf8");
  // Strip the DOMContentLoaded handler — it would re-call setLanguage on load.
  const stripped = SRC.replace(/document\.addEventListener[\s\S]*$/, "");
  const expose = `
    Object.assign(globalThis, {
      PLAN_CONFIG, I18N,
      HALF_MARATHON_VDOT, MARATHON_VDOT, TEN_K_VDOT,
      PACE_S, PACE_M, PACE_U, PACE_I, PACE_R,
      parseTimeToSeconds, getVDOT, calculatePaces, selectWeek,
      dayKey, parseLocalDate, formatDate, addDays,
      translateWorkout, buildPlan, buildICS, renderPlan,
    });
  `;
  // eslint-disable-next-line no-eval
  (0, eval)(stripped + expose);
});

// ---------- VDOT lookup ----------

describe("VDOT lookup", () => {
  test("marathon 02:28:00 → VDOT 67", () => {
    assert.equal(globalThis.getVDOT(globalThis.parseTimeToSeconds("02:28:00"), 42), 67);
  });
  test("marathon 03:10:49 → VDOT 50 (exact match)", () => {
    assert.equal(globalThis.getVDOT(globalThis.parseTimeToSeconds("03:10:49"), 42), 50);
  });
  test("half-marathon 01:34:53 → VDOT 48", () => {
    assert.equal(globalThis.getVDOT(globalThis.parseTimeToSeconds("01:34:53"), 21), 48);
  });
  test("10k 35:11 → VDOT 50 (regression: was 70 when routed through HALF table)", () => {
    assert.equal(globalThis.getVDOT(globalThis.parseTimeToSeconds("00:35:11"), 10), 50);
  });
  test("general training (distance 0) routes through half-marathon table", () => {
    assert.equal(globalThis.getVDOT(globalThis.parseTimeToSeconds("01:34:53"), 0), 48);
  });
  test("unsupported distance throws", () => {
    assert.throws(() => globalThis.getVDOT(1000, 5));
  });
  test("very fast marathon clamps to highest VDOT in table", () => {
    // 02:00:00 marathon is faster than the table's fastest entry (VDOT 70 = 02:23:10)
    const v = globalThis.getVDOT(globalThis.parseTimeToSeconds("02:00:00"), 42);
    assert.equal(v, 70);
  });
});

// ---------- Pace calculation ----------

describe("Pace calculation", () => {
  test("VDOT 50 returns canonical Daniels paces", () => {
    const p = globalThis.calculatePaces(50);
    assert.equal(p.Easy,       "4:56 - 5:34");
    assert.equal(p.Marathon,   "4:31");
    assert.equal(p.Threshold,  "4:15");
    assert.equal(p.Interval,   "3:55");
    assert.equal(p.Repetition, "1:27");
  });
  test("returns language-neutral keys (regression: was Spanish)", () => {
    const keys = Object.keys(globalThis.calculatePaces(50));
    assert.deepEqual(
      keys.sort(),
      ["Easy", "Interval", "Marathon", "Repetition", "Threshold"],
    );
  });
  test("unknown VDOT returns fallback", () => {
    const p = globalThis.calculatePaces(999);
    assert.equal(p.Easy, "—");
  });
});

// ---------- VDOT / pace table coverage ----------

describe("VDOT / pace tables", () => {
  test("all VDOT race-time tables cover 30..70", () => {
    for (let v = 30; v <= 70; v++) {
      assert.ok(globalThis.MARATHON_VDOT[v],       `MARATHON_VDOT[${v}] missing`);
      assert.ok(globalThis.HALF_MARATHON_VDOT[v],  `HALF_MARATHON_VDOT[${v}] missing`);
      assert.ok(globalThis.TEN_K_VDOT[v],          `TEN_K_VDOT[${v}] missing`);
    }
  });
  test("all pace tables cover 30..79", () => {
    for (let v = 30; v <= 79; v++) {
      assert.ok(globalThis.PACE_S[v], `PACE_S[${v}] missing`);
      assert.ok(globalThis.PACE_M[v], `PACE_M[${v}] missing`);
      assert.ok(globalThis.PACE_U[v], `PACE_U[${v}] missing`);
      assert.ok(globalThis.PACE_I[v], `PACE_I[${v}] missing`);
      assert.ok(globalThis.PACE_R[v], `PACE_R[${v}] missing`);
    }
  });
});

// ---------- Workout translation ----------

describe("translateWorkout (ES → EN Daniels notation)", () => {
  const cases = [
    ["8S + 8 A/D + 4S (12k)",                        "8E + 8 ST + 4E (12k)"],
    ["3S + 8 X 200 R C/200 TR + 4S (12k)",           "3E + 8 x 200 R w/200 jog + 4E (12k)"],
    ["6S + 5 X 1000 I C/3 MIN TR + 5S (16k)",        "6E + 5 x 1000 I w/3 min jog + 5E (16k)"],
    ["6S + 5 X 1.5U C/2 MIN S + 5S (19k)",           "6E + 5 x 1.5T w/2 min E + 5E (19k)"],
    ["30S + 6 A/D + 2S (34k)",                       "30E + 6 ST + 2E (34k)"],
    ["3S + 16M + 3S (22k)",                          "3E + 16M + 3E (22k)"],
    ["3S + 4 X 1000 M C/2 MIN S + 3S (10k)",         "3E + 4 x 1000 M w/2 min E + 3E (10k)"],
    ["4S + 7U + 4S (15k)",                           "4E + 7T + 4E (15k)"],
  ];
  for (const [es, en] of cases) {
    test(`"${es}" → "${en}"`, () => {
      assert.equal(globalThis.translateWorkout(es, "en"), en);
    });
  }
  test("Spanish lang is identity", () => {
    const orig = "8S + 5 X 1000 I C/3 MIN TR + 3 X 2U";
    assert.equal(globalThis.translateWorkout(orig, "es"), orig);
  });
  test("M / I / R pace codes stay unchanged", () => {
    assert.equal(globalThis.translateWorkout("16M + 5R + 3I", "en"), "16M + 5R + 3I");
  });
  test("every workout in PLAN_CONFIG translates without leaving Spanish leftovers", () => {
    // Bug class: a workout with new notation we don't translate would leak
    // Spanish-only tokens (S as a digit suffix, U, A/D, etc.) into the EN view.
    const SPANISH_TOKENS = [/\bC\//, /\bTR\b/, /\bMIN\b/, /A\/D/, /\d\s*S\b/, /\d\s*U\b/];
    for (const week of Object.values(globalThis.PLAN_CONFIG)) {
      for (const [k, v] of Object.entries(week)) {
        if (typeof v !== "string" || !v) continue;
        // Only check workout fields (c1-*, c2-*, pre1, pre2, d*-* — skip phase/km labels)
        if (!/^(c[12]-|pre[12]|d[1-7]-)/.test(k)) continue;
        const en = globalThis.translateWorkout(v, "en");
        for (const token of SPANISH_TOKENS) {
          assert.ok(
            !token.test(en),
            `${k}: "${v}" → "${en}" still contains ${token}`,
          );
        }
      }
    }
  });
});

// ---------- Plan structure ----------

describe("buildPlan structure", () => {
  test("returns 12 weeks of 7 days each", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    assert.equal(plan.weeks.length, 12);
    for (const w of plan.weeks) {
      assert.equal(w.schedule.length, 7);
    }
  });
  test("plan exposes distance, raceDate, raceTime (regression: distanceInt was undefined)", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    assert.equal(plan.distance, 42);
    assert.equal(plan.raceDate, "2026-12-13");
    assert.equal(plan.raceTime, "02:28:00");
  });
  test("week 12 day 7 is the race", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    const lastDay = plan.weeks[11].schedule[6];
    assert.equal(lastDay.type, "race");
    assert.equal(lastDay.date, "2026-12-13");
    assert.equal(lastDay.value, null);
  });
  test("non-race weeks: day 7 is long, days 3 and 6 are q1/q2", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    for (let i = 0; i < 11; i++) {
      const sched = plan.weeks[i].schedule;
      assert.equal(sched[2].type, "q1", `week ${i+1} day 3`);
      assert.equal(sched[5].type, "q2", `week ${i+1} day 6`);
      assert.equal(sched[6].type, "long", `week ${i+1} day 7`);
    }
  });
  test("phase keys are restricted to FI/EQ/TQ/FQ/TAPER", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    const valid = new Set(["FI", "EQ", "TQ", "FQ", "TAPER"]);
    for (const w of plan.weeks) {
      assert.ok(valid.has(w.phase), `unknown phase: ${w.phase}`);
    }
  });
  test("every distance produces a complete plan", () => {
    for (const dist of [42, 21, 10, 0]) {
      const plan = globalThis.buildPlan(dist, "2026-12-13", "01:35:00");
      assert.equal(plan.weeks.length, 12);
      for (const w of plan.weeks) {
        assert.ok(w.km, `${dist} week ${w.week} missing km`);
        assert.ok(w.phase);
      }
    }
  });
});

// ---------- Race weekday adaptation ----------

describe("Race weekday adaptation", () => {
  test("Sunday race: Q1 Wed, Q2 Sat, race Sun (status quo)", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00"); // Sunday
    const w12 = plan.weeks[11].schedule;
    assert.equal(w12[2].day, "wed");
    assert.equal(w12[5].day, "sat");
    assert.equal(w12[6].day, "sun");
  });
  test("Saturday race: Q1 Tue, Q2 Fri, race Sat", () => {
    const plan = globalThis.buildPlan(42, "2026-12-12", "02:28:00"); // Saturday
    const w12 = plan.weeks[11].schedule;
    assert.equal(w12[2].day, "tue");
    assert.equal(w12[5].day, "fri");
    assert.equal(w12[6].day, "sat");
  });
  test("Wednesday race: Q1 Sat, Q2 Tue, race Wed", () => {
    const plan = globalThis.buildPlan(42, "2026-12-09", "02:28:00"); // Wednesday
    const w12 = plan.weeks[11].schedule;
    assert.equal(w12[2].day, "sat");
    assert.equal(w12[5].day, "tue");
    assert.equal(w12[6].day, "wed");
  });
  test("mileage progression is identical regardless of race weekday", () => {
    // The 7-day rhythm is preserved; only calendar labels shift.
    const sun = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    const sat = globalThis.buildPlan(42, "2026-12-12", "02:28:00");
    const wed = globalThis.buildPlan(42, "2026-12-09", "02:28:00");
    const km = (p) => p.weeks.map(w => w.km).join(",");
    assert.equal(km(sun), km(sat));
    assert.equal(km(sun), km(wed));
  });
});

// ---------- PLAN_CONFIG completeness ----------

describe("PLAN_CONFIG completeness", () => {
  // Bug class: a missing per-distance field would silently render as "Rest".
  const slots = ["d1", "d2", "d4", "d5", "d7"];
  const distances = [
    { suffix: "42",  c1: "c1-42", c2: "c2-42", km: "km-42"  },
    { suffix: "21",  c1: "c1-21", c2: "c2-21", km: "km-21"  },
    { suffix: "10",  c1: "c1-10", c2: "c2-10", km: "km-10"  },
    { suffix: "pre", c1: "pre1",  c2: "pre2",  km: "km-pre" },
  ];
  for (const wKey of Object.keys(globalThis.PLAN_CONFIG ?? {})) {
    for (const d of distances) {
      test(`${wKey} has all ${d.suffix} fields`, () => {
        const week = globalThis.PLAN_CONFIG[wKey];
        assert.ok(week[d.c1],  `${wKey}.${d.c1} missing/empty`);
        assert.ok(week[d.c2],  `${wKey}.${d.c2} missing/empty`);
        assert.ok(week[d.km],  `${wKey}.${d.km} missing/empty`);
        for (const slot of slots) {
          const key = `${slot}-${d.suffix}`;
          assert.ok(key in week, `${wKey}.${key} key missing`);
        }
      });
    }
  }
  test("phase field is present and valid on every week", () => {
    const valid = new Set(["FI", "EQ", "TQ", "FQ", "TAPER"]);
    for (const [wKey, w] of Object.entries(globalThis.PLAN_CONFIG)) {
      assert.ok(w.phase, `${wKey} missing phase`);
      assert.ok(valid.has(w.phase), `${wKey} has invalid phase: ${w.phase}`);
    }
  });
  test("phase mapping: s1-s3 FI, s4-s6 EQ, s7-s9 TQ, s10-s11 FQ, s12 TAPER", () => {
    const expected = {
      s1: "FI", s2: "FI", s3: "FI",
      s4: "EQ", s5: "EQ", s6: "EQ",
      s7: "TQ", s8: "TQ", s9: "TQ",
      s10: "FQ", s11: "FQ", s12: "TAPER",
    };
    for (const [k, v] of Object.entries(expected)) {
      assert.equal(globalThis.PLAN_CONFIG[k].phase, v, `${k} phase`);
    }
  });
});

// ---------- I18N parity ----------

describe("I18N parity", () => {
  test("en and es have identical top-level keys", () => {
    const en = Object.keys(globalThis.I18N.en).sort();
    const es = Object.keys(globalThis.I18N.es).sort();
    assert.deepEqual(es, en);
  });
  const nestedKeys = [
    "distances", "distancesShort",
    "paces", "paceDescriptions",
    "days", "daysShort",
    "phases", "phaseShort",
    "dayTypes",
  ];
  for (const k of nestedKeys) {
    test(`I18N.${k} has identical sub-keys in en and es`, () => {
      assert.deepEqual(
        Object.keys(globalThis.I18N.es[k]).sort(),
        Object.keys(globalThis.I18N.en[k]).sort(),
      );
    });
  }
  test("every translated string is non-empty in both languages", () => {
    for (const lang of ["en", "es"]) {
      const dict = globalThis.I18N[lang];
      for (const [k, v] of Object.entries(dict)) {
        if (typeof v === "string") {
          assert.ok(v.length > 0, `I18N.${lang}.${k} empty`);
        } else if (v && typeof v === "object") {
          for (const [sk, sv] of Object.entries(v)) {
            assert.ok(typeof sv === "string" && sv.length > 0,
              `I18N.${lang}.${k}.${sk} not a non-empty string`);
          }
        }
      }
    }
  });
});

// ---------- Daniels caps ----------

describe("Daniels methodology caps", () => {
  test("no I-pace rep exceeds 1.2 km (~5 min cap at VDOT 50)", () => {
    // Match patterns like "5 X 1000 I", "5 x 1.2 I", "4 X 1200 I"
    const re = /(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)\s*I\b/g;
    for (const week of Object.values(globalThis.PLAN_CONFIG)) {
      for (const [k, v] of Object.entries(week)) {
        if (typeof v !== "string") continue;
        for (const m of v.matchAll(re)) {
          const distRaw = parseFloat(m[2]);
          // Heuristic: values >= 100 are meters, < 100 are kilometers
          const distKm = distRaw >= 100 ? distRaw / 1000 : distRaw;
          assert.ok(distKm <= 1.2,
            `${k}: "${m[0]}" → ${distKm}km exceeds 1.2km I-rep cap`);
        }
      }
    }
  });
});

// ---------- Date helpers ----------

describe("Date helpers", () => {
  test("parseLocalDate avoids UTC drift on YYYY-MM-DD", () => {
    const d = globalThis.parseLocalDate("2026-12-13");
    assert.equal(d.getFullYear(), 2026);
    assert.equal(d.getMonth(), 11); // December
    assert.equal(d.getDate(), 13);
  });
  test("dayKey maps weekdays to lowercase 3-letter keys", () => {
    assert.equal(globalThis.dayKey(new Date(2026, 11, 13)), "sun"); // 13 Dec 2026 = Sun
    assert.equal(globalThis.dayKey(new Date(2026, 11, 12)), "sat");
    assert.equal(globalThis.dayKey(new Date(2026, 11,  9)), "wed");
  });
  test("addDays handles month and year boundaries", () => {
    const d = globalThis.addDays(new Date(2026, 11, 30), 5);
    assert.equal(d.getFullYear(), 2027);
    assert.equal(d.getMonth(), 0);
    assert.equal(d.getDate(), 4);
  });
  test("formatDate outputs YYYY-MM-DD, zero-padded", () => {
    assert.equal(globalThis.formatDate(new Date(2026, 0, 5)), "2026-01-05");
  });
});

// ---------- ICS export ----------

describe("ICS export (RFC 5545)", () => {
  let plan, ics;
  test("setup", () => {
    plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    ics = globalThis.buildICS(plan, "en");
  });
  test("contains exactly 84 VEVENTs (12 weeks × 7 days)", () => {
    const begins = (ics.match(/BEGIN:VEVENT/g) || []).length;
    const ends   = (ics.match(/END:VEVENT/g)   || []).length;
    assert.equal(begins, 84);
    assert.equal(ends,   84);
  });
  test("uses CRLF line endings", () => {
    assert.ok(ics.includes("\r\n"));
    assert.ok(!/\r(?!\n)|(?<!\r)\n/.test(ics), "found a bare CR or LF");
  });
  test("wraps in VCALENDAR with VERSION 2.0", () => {
    assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\n"));
    assert.ok(ics.includes("VERSION:2.0"));
    assert.ok(ics.includes("PRODID:"));
    assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  });
  test("escapes commas, semicolons, and newlines per spec", () => {
    const lines = ics.split("\r\n");
    const summaries = lines.filter(l => l.startsWith("SUMMARY:"));
    for (const s of summaries) {
      const payload = s.slice("SUMMARY:".length);
      // No unescaped raw commas/semicolons (escaped: \, \;)
      assert.ok(!/(?<!\\),/.test(payload), `unescaped comma: ${s}`);
      assert.ok(!/(?<!\\);/.test(payload), `unescaped semicolon: ${s}`);
    }
  });
  test("UIDs are unique across all events", () => {
    const uids = ics.split("\r\n").filter(l => l.startsWith("UID:"));
    assert.equal(new Set(uids).size, uids.length);
  });
  test("DTSTART uses date-only format and aligns with schedule", () => {
    const dtStarts = ics.split("\r\n").filter(l => l.startsWith("DTSTART;VALUE=DATE:"));
    assert.equal(dtStarts.length, 84);
    for (const line of dtStarts) {
      assert.match(line, /^DTSTART;VALUE=DATE:\d{8}$/);
    }
  });
  test("Spanish locale produces Spanish day names + tags in events", () => {
    const esIcs = globalThis.buildICS(plan, "es");
    assert.ok(esIcs.includes("[Largo]"));   // not [Long]
    assert.ok(esIcs.includes("Día de la carrera"));
  });
});

// ---------- Render output ----------

describe("renderPlan output", () => {
  test("contains every major section + export buttons", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    const out = { innerHTML: "" };
    globalThis.document.getElementById = () => out;
    globalThis.renderPlan(plan, "en");
    for (const cls of ["plan-actions", "vdot-hero", "phase-strip", "mileage-chart", "weeks-list"]) {
      assert.match(out.innerHTML, new RegExp(`class="${cls}`), `missing ${cls}`);
    }
    for (const action of ["ics", "print"]) {
      assert.match(out.innerHTML, new RegExp(`data-action="${action}"`), `missing ${action} button`);
    }
    const weekCards = (out.innerHTML.match(/class="week-card/g) || []).length;
    assert.equal(weekCards, 12);
  });
  test("re-renders cleanly on language change (no leftover Spanish in EN)", () => {
    const plan = globalThis.buildPlan(42, "2026-12-13", "02:28:00");
    const out = { innerHTML: "" };
    globalThis.document.getElementById = () => out;
    globalThis.renderPlan(plan, "en");
    // After translation, no untranslated Spanish words in workouts (check a sample of phrases)
    const en = out.innerHTML;
    assert.ok(!en.includes("Lunes"));
    assert.ok(!en.includes("Miércoles"));
    assert.ok(!/\bDescanso\b/.test(en));
    assert.ok(!/Día de la carrera/.test(en));
  });
});

// ---------- parseTimeToSeconds edge cases ----------

describe("parseTimeToSeconds", () => {
  test("hh:mm:ss", () => {
    assert.equal(globalThis.parseTimeToSeconds("02:28:00"), 8880);
  });
  test("h:mm:ss (single-digit hour, used in VDOT tables)", () => {
    assert.equal(globalThis.parseTimeToSeconds("2:28:00"), 8880);
  });
  test("mm:ss (no hour, used for short paces)", () => {
    assert.equal(globalThis.parseTimeToSeconds("3:55"), 235);
  });
  test("malformed input → NaN", () => {
    assert.ok(Number.isNaN(globalThis.parseTimeToSeconds("garbage")));
  });
});
