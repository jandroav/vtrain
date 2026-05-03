// vtrain — single-page training plan generator (Daniels' VDOT methodology).
"use strict";

// ---------- VDOT tables (race time per VDOT) ----------
// Values are stored as "h:mm:ss" or "mm:ss" strings; parsed on lookup.

const HALF_MARATHON_VDOT = {
  30: "2:21:04", 31: "2:17:21", 32: "2:13:49", 33: "2:10:27", 34: "2:07:16",
  35: "2:04:13", 36: "2:01:19", 37: "1:58:34", 38: "1:55:55", 39: "1:53:24",
  40: "1:50:59", 41: "1:48:40", 42: "1:46:27", 43: "1:44:20", 44: "1:42:17",
  45: "1:40:20", 46: "1:38:27", 47: "1:36:38", 48: "1:34:53", 49: "1:33:12",
  50: "1:31:35", 51: "1:30:02", 52: "1:28:31", 53: "1:27:04", 54: "1:25:40",
  55: "1:24:18", 56: "1:23:00", 57: "1:21:43", 58: "1:20:30", 59: "1:19:18",
  60: "1:18:09", 61: "1:17:02", 62: "1:15:57", 63: "1:14:54", 64: "1:13:53",
  65: "1:12:53", 66: "1:11:56", 67: "1:11:00", 68: "1:10:05", 69: "1:09:12",
  70: "1:08:21",
};

const MARATHON_VDOT = {
  30: "4:49:17", 31: "4:41:57", 32: "4:34:59", 33: "4:28:22", 34: "4:22:03",
  35: "4:16:03", 36: "4:10:19", 37: "4:04:50", 38: "3:59:35", 39: "3:54:34",
  40: "3:49:45", 41: "3:45:09", 42: "3:40:43", 43: "3:36:28", 44: "3:32:23",
  45: "3:28:26", 46: "3:24:39", 47: "3:21:00", 48: "3:17:29", 49: "3:14:06",
  50: "3:10:49", 51: "3:07:39", 52: "3:04:36", 53: "3:01:39", 54: "2:58:47",
  55: "2:56:01", 56: "2:53:20", 57: "2:50:45", 58: "2:48:14", 59: "2:45:47",
  60: "2:43:25", 61: "2:41:08", 62: "2:38:54", 63: "2:36:44", 64: "2:34:38",
  65: "2:32:35", 66: "2:30:36", 67: "2:28:40", 68: "2:26:47", 69: "2:24:57",
  70: "2:23:10",
};

const TEN_K_VDOT = {
  30: "0:54:00", 31: "0:52:23", 32: "0:50:54", 33: "0:49:30", 34: "0:48:14",
  35: "0:47:04", 36: "0:45:57", 37: "0:44:54", 38: "0:43:55", 39: "0:42:59",
  40: "0:42:06", 41: "0:41:15", 42: "0:40:27", 43: "0:39:41", 44: "0:38:58",
  45: "0:38:16", 46: "0:37:36", 47: "0:36:57", 48: "0:36:20", 49: "0:35:45",
  50: "0:35:11", 51: "0:34:38", 52: "0:34:06", 53: "0:33:35", 54: "0:33:05",
  55: "0:32:36", 56: "0:32:09", 57: "0:31:42", 58: "0:31:17", 59: "0:30:51",
  60: "0:30:26", 61: "0:30:02", 62: "0:29:39", 63: "0:29:16", 64: "0:28:54",
  65: "0:28:33", 66: "0:28:12", 67: "0:27:52", 68: "0:27:32", 69: "0:27:13",
  70: "0:26:54",
};

// ---------- Training-pace tables (min:sec per km, by VDOT) ----------

const PACE_S = {
  30: "7:27 - 8:14", 31: "7:16 - 8:02", 32: "7:05 - 7:52", 33: "6:55 - 7:41", 34: "6:45 - 7:31",
  35: "6:36 - 7:21", 36: "6:27 - 7:11", 37: "6:19 - 7:02", 38: "6:11 - 6:54", 39: "6:03 - 6:46",
  40: "5:56 - 6:38", 41: "5:49 - 6:31", 42: "5:42 - 6:23", 43: "5:35 - 6:16", 44: "5:29 - 6:10",
  45: "5:23 - 6:03", 46: "5:17 - 5:57", 47: "5:12 - 5:51", 48: "5:07 - 5:45", 49: "5:01 - 5:40",
  50: "4:56 - 5:34", 51: "4:52 - 5:29", 52: "4:47 - 5:24", 53: "4:43 - 5:19", 54: "4:38 - 5:14",
  55: "4:34 - 5:10", 56: "4:30 - 5:05", 57: "4:26 - 5:01", 58: "4:22 - 4:57", 59: "4:19 - 4:53",
  60: "4:15 - 4:49", 61: "4:11 - 4:45", 62: "4:08 - 4:41", 63: "4:05 - 4:38", 64: "4:02 - 4:34",
  65: "3:59 - 4:31", 66: "3:56 - 4:28", 67: "3:53 - 4:24", 68: "3:50 - 4:21", 69: "3:47 - 4:18",
  70: "3:44 - 4:15", 71: "3:42 - 4:12", 72: "3:40 - 4:00", 73: "3:37 - 4:07", 74: "3:34 - 4:04",
  75: "3:32 - 4:01", 76: "3:30 - 3:58", 77: "3:28 - 3:56", 78: "3:25 - 3:53", 79: "3:23 - 3:51",
};

const PACE_M = {
  30: "7:03", 31: "6:52", 32: "6:40", 33: "6:30", 34: "6:20",
  35: "6:10", 36: "6:01", 37: "5:53", 38: "5:45", 39: "5:37",
  40: "5:29", 41: "5:22", 42: "5:16", 43: "5:09", 44: "5:03",
  45: "4:57", 46: "4:51", 47: "4:46", 48: "4:41", 49: "4:36",
  50: "4:31", 51: "4:27", 52: "4:22", 53: "4:18", 54: "4:14",
  55: "4:10", 56: "4:06", 57: "4:03", 58: "3:59", 59: "3:56",
  60: "3:52", 61: "3:49", 62: "3:46", 63: "3:43", 64: "3:40",
  65: "3:37", 66: "3:34", 67: "3:31", 68: "3:29", 69: "3:26",
  70: "3:24", 71: "3:21", 72: "3:19", 73: "3:17", 74: "3:14",
  75: "3:12", 76: "3:10", 77: "3:08", 78: "3:06", 79: "3:03",
};

const PACE_U = {
  30: "6:24", 31: "6:14", 32: "6:05", 33: "5:56", 34: "5:48",
  35: "5:40", 36: "5:33", 37: "5:26", 38: "5:19", 39: "5:12",
  40: "5:06", 41: "5:00", 42: "4:54", 43: "4:49", 44: "4:43",
  45: "4:38", 46: "4:33", 47: "4:29", 48: "4:24", 49: "4:20",
  50: "4:15", 51: "4:11", 52: "4:07", 53: "4:04", 54: "4:00",
  55: "3:56", 56: "3:53", 57: "3:50", 58: "3:46", 59: "3:43",
  60: "3:40", 61: "3:37", 62: "3:34", 63: "3:32", 64: "3:29",
  65: "3:26", 66: "3:24", 67: "3:21", 68: "3:19", 69: "3:16",
  70: "3:14", 71: "3:12", 72: "3:10", 73: "3:08", 74: "3:06",
  75: "3:04", 76: "3:02", 77: "3:00", 78: "2:58", 79: "2:56",
};

const PACE_I = {
  30: "5:00", 31: "5:00", 32: "5:00", 33: "5:00", 34: "5:00",
  35: "5:00", 36: "5:00", 37: "5:00", 38: "4:54", 39: "4:48",
  40: "4:42", 41: "4:36", 42: "4:31", 43: "4:26", 44: "4:21",
  45: "4:16", 46: "4:12", 47: "4:07", 48: "4:03", 49: "3:59",
  50: "3:55", 51: "3:51", 52: "3:48", 53: "3:44", 54: "3:41",
  55: "3:37", 56: "3:34", 57: "3:31", 58: "3:28", 59: "3:25",
  60: "3:23", 61: "3:20", 62: "3:17", 63: "3:15", 64: "3:12",
  65: "3:10", 66: "3:08", 67: "3:05", 68: "3:03", 69: "3:01",
  70: "2:59", 71: "2:57", 72: "2:55", 73: "2:53", 74: "2:51",
  75: "2:49", 76: "2:48", 77: "2:46", 78: "2:44", 79: "2:42",
};

const PACE_R = {
  30: "2:00", 31: "2:00", 32: "2:00", 33: "2:00", 34: "2:00",
  35: "1:57", 36: "1:54", 37: "1:51", 38: "1:48", 39: "1:46",
  40: "1:44", 41: "1:42", 42: "1:40", 43: "1:38", 44: "1:36",
  45: "1:34", 46: "1:32", 47: "1:30", 48: "1:29", 49: "1:28",
  50: "1:27", 51: "1:26", 52: "1:25", 53: "1:24", 54: "1:22",
  55: "1:21", 56: "1:20", 57: "1:19", 58: "1:17", 59: "1:16",
  60: "1:15", 61: "1:14", 62: "1:13", 63: "1:12", 64: "1:11",
  65: "1:10", 66: "1:09", 67: "1:08", 68: "1:07", 69: "1:06",
  70: "1:05", 71: "1:04", 72: "1:03", 73: "1:03", 74: "1:02",
  75: "1:01", 76: "1:00", 77: "0:59", 78: "0:59", 79: "0:58",
};

// ---------- 12-week plan config (mirrors pkg/common/config.yaml) ----------

const PLAN_CONFIG = {
  s1: {
    phase: "FI",
    "c1-42": "8S + 8 A/D + 4S (12k)", "c2-42": "22S (22k)",
    "d1-42": "12S", "d2-42": "20S", "d4-42": "18S", "d5-42": "12S", "d7-42": "26S",
    "c1-21": "6S + 8 A/D + 2S (10k)", "c2-21": "14S (14k)",
    "d1-21": "7S", "d2-21": "12S", "d4-21": "", "d5-21": "8S", "d7-21": "14S",
    "c1-10": "6S + 6 A/D + 2S (10k)", "c2-10": "12S (12k)",
    "d1-10": "7S", "d2-10": "10S", "d4-10": "", "d5-10": "7S", "d7-10": "12S",
    "pre1": "6S + 8 A/D + 2S (10k)", "pre2": "14S (14k)",
    "d1-pre": "7S", "d2-pre": "12S", "d4-pre": "", "d5-pre": "8S", "d7-pre": "14S",
    "km-pre": "65k", "km-42": "122k", "km-21": "65k", "km-10": "58k",
  },
  s2: {
    phase: "FI",
    "c1-42": "10S + 8 A/D + 4S (14k)", "c2-42": "24S (24k)",
    "d1-42": "12S", "d2-42": "22S", "d4-42": "20S", "d5-42": "14S", "d7-42": "26S",
    "c1-21": "8S + 8 A/D + 2S (12k)", "c2-21": "16S (16k)",
    "d1-21": "8S", "d2-21": "14S", "d4-21": "", "d5-21": "8S", "d7-21": "16S",
    "c1-10": "8S + 8 A/D + 2S (12k)", "c2-10": "14S (14k)",
    "d1-10": "8S", "d2-10": "12S", "d4-10": "", "d5-10": "8S", "d7-10": "14S",
    "pre1": "8S + 8 A/D + 2S (12k)", "pre2": "16S (16k)",
    "d1-pre": "8S", "d2-pre": "14S", "d4-pre": "", "d5-pre": "8S", "d7-pre": "16S",
    "km-pre": "74k", "km-42": "132k", "km-21": "74k", "km-10": "68k",
  },
  s3: {
    phase: "FI",
    "c1-42": "10S + 10 A/D + 4S (14k)", "c2-42": "26S (26k)",
    "d1-42": "14S", "d2-42": "22S", "d4-42": "20S", "d5-42": "14S", "d7-42": "26S",
    "c1-21": "8S + 10 A/D + 2S (12k)", "c2-21": "18S (18k)",
    "d1-21": "8S", "d2-21": "14S", "d4-21": "", "d5-21": "10S", "d7-21": "18S",
    "c1-10": "8S + 10 A/D + 2S (12k)", "c2-10": "16S (16k)",
    "d1-10": "8S", "d2-10": "12S", "d4-10": "", "d5-10": "8S", "d7-10": "16S",
    "pre1": "8S + 10 A/D + 2S (12k)", "pre2": "18S (18k)",
    "d1-pre": "8S", "d2-pre": "14S", "d4-pre": "", "d5-pre": "10S", "d7-pre": "18S",
    "km-pre": "80k", "km-42": "136k", "km-21": "80k", "km-10": "72k",
  },
  s4: {
    phase: "EQ",
    "c1-42": "3S + 8 X 200 R C/200 TR + 4S (12k)", "c2-42": "28S (28k)",
    "d1-42": "14S", "d2-42": "22S", "d4-42": "20S", "d5-42": "14S", "d7-42": "28S",
    "c1-21": "3S + 6 X 200 R C/200 TR + 3S (10k)", "c2-21": "18S (18k)",
    "d1-21": "8S", "d2-21": "16S", "d4-21": "", "d5-21": "10S", "d7-21": "18S",
    "c1-10": "3S + 8 X 200 R C/200 TR + 3S (10k)", "c2-10": "14S (14k)",
    "d1-10": "8S", "d2-10": "14S", "d4-10": "", "d5-10": "8S", "d7-10": "16S",
    "pre1": "3S + 6 X 200 R C/200 TR + 3S (10k)", "pre2": "18S (18k)",
    "d1-pre": "8S", "d2-pre": "16S", "d4-pre": "", "d5-pre": "10S", "d7-pre": "18S",
    "km-pre": "80k", "km-42": "138k", "km-21": "80k", "km-10": "70k",
  },
  s5: {
    phase: "EQ",
    "c1-42": "3S + 6 X 400 R C/400 TR + 4S (14k)", "c2-42": "30S (30k)",
    "d1-42": "14S", "d2-42": "24S", "d4-42": "22S", "d5-42": "14S", "d7-42": "28S",
    "c1-21": "3S + 6 X 400 R C/400 TR + 3S (12k)", "c2-21": "18S (18k)",
    "d1-21": "8S", "d2-21": "16S", "d4-21": "", "d5-21": "10S", "d7-21": "20S",
    "c1-10": "3S + 6 X 400 R C/400 TR + 3S (12k)", "c2-10": "14S (14k)",
    "d1-10": "8S", "d2-10": "14S", "d4-10": "", "d5-10": "8S", "d7-10": "16S",
    "pre1": "3S + 6 X 400 R C/400 TR + 3S (12k)", "pre2": "18S (18k)",
    "d1-pre": "8S", "d2-pre": "16S", "d4-pre": "", "d5-pre": "10S", "d7-pre": "20S",
    "km-pre": "84k", "km-42": "146k", "km-21": "84k", "km-10": "72k",
  },
  s6: {
    phase: "EQ",
    "c1-42": "4S + 8 X 400 R C/400 TR + 4S (16k)", "c2-42": "32S (32k)",
    "d1-42": "16S", "d2-42": "24S", "d4-42": "22S", "d5-42": "16S", "d7-42": "28S",
    "c1-21": "3S + 8 X 400 R C/400 TR + 3S (13k)", "c2-21": "20S (20k)",
    "d1-21": "10S", "d2-21": "16S", "d4-21": "", "d5-21": "10S", "d7-21": "20S",
    "c1-10": "3S + 8 X 400 R C/400 TR + 3S (12k)", "c2-10": "16S (16k)",
    "d1-10": "8S", "d2-10": "14S", "d4-10": "", "d5-10": "10S", "d7-10": "18S",
    "pre1": "3S + 8 X 400 R C/400 TR + 3S (13k)", "pre2": "20S (20k)",
    "d1-pre": "10S", "d2-pre": "16S", "d4-pre": "", "d5-pre": "10S", "d7-pre": "20S",
    "km-pre": "89k", "km-42": "154k", "km-21": "89k", "km-10": "78k",
  },
  s7: {
    phase: "TQ",
    "c1-42": "6S + 5 X 1000 I C/3 MIN TR + 5S (16k)", "c2-42": "6S + 5 X 1.5U C/2 MIN S + 5S (19k)",
    "d1-42": "12S", "d2-42": "28S", "d4-42": "22S", "d5-42": "14S", "d7-42": "26S",
    "c1-21": "3S + 4 X 1000 I C/3 MIN TR + 3S (10k)", "c2-21": "3S + 3 X 1.5U C/2 MIN S + 3S (11k)",
    "d1-21": "8S", "d2-21": "16S", "d4-21": "", "d5-21": "10S", "d7-21": "18S",
    "c1-10": "3S + 5 X 1000 I C/3 MIN TR + 3S (11k)", "c2-10": "3S + 3 X 1.5U C/2 MIN S + 3S (11k)",
    "d1-10": "8S", "d2-10": "14S", "d4-10": "", "d5-10": "10S", "d7-10": "16S",
    "pre1": "3S + 4 X 1000 I C/3 MIN TR + 3S (10k)", "pre2": "3S + 3 X 1.5U C/2 MIN S + 3S (11k)",
    "d1-pre": "8S", "d2-pre": "16S", "d4-pre": "", "d5-pre": "10S", "d7-pre": "18S",
    "km-pre": "73k", "km-42": "137k", "km-21": "73k", "km-10": "70k",
  },
  s8: {
    phase: "TQ",
    "c1-42": "6S + 6 X 1000 I C/3 MIN TR + 5S (17k)", "c2-42": "30S + 6 A/D + 2S (34k)",
    "d1-42": "12S", "d2-42": "28S", "d4-42": "22S", "d5-42": "14S", "d7-42": "26S",
    "c1-21": "3S + 5 X 1000 I C/3 MIN TR + 3S (11k)", "c2-21": "3S + 4 X 1.5U C/2 MIN S + 3S (12k)",
    "d1-21": "8S", "d2-21": "18S", "d4-21": "", "d5-21": "12S", "d7-21": "20S",
    "c1-10": "3S + 5 X 1000 I C/3 MIN TR + 3S (11k)", "c2-10": "3S + 4 X 1.5U C/2 MIN S + 3S (12k)",
    "d1-10": "8S", "d2-10": "14S", "d4-10": "", "d5-10": "10S", "d7-10": "18S",
    "pre1": "3S + 5 X 1000 I C/3 MIN TR + 3S (11k)", "pre2": "3S + 4 X 1.5U C/2 MIN S + 3S (12k)",
    "d1-pre": "8S", "d2-pre": "18S", "d4-pre": "", "d5-pre": "12S", "d7-pre": "20S",
    "km-pre": "81k", "km-42": "153k", "km-21": "81k", "km-10": "73k",
  },
  s9: {
    phase: "TQ",
    "c1-42": "5S + 5 X 1200 I C/3 MIN TR + 5S (16k)", "c2-42": "6S + 4 X 2U C/2 MIN S + 6S (20k)",
    "d1-42": "12S", "d2-42": "28S", "d4-42": "22S", "d5-42": "14S", "d7-42": "26S",
    "c1-21": "3S + 4 X 1200 I C/3 MIN TR + 3S (11k)", "c2-21": "3S + 3 X 2U C/2 MIN S + 3S (12k)",
    "d1-21": "8S", "d2-21": "18S", "d4-21": "", "d5-21": "10S", "d7-21": "20S",
    "c1-10": "3S + 4 X 1200 I C/3 MIN TR + 3S (11k)", "c2-10": "3S + 3 X 2U C/2 MIN S + 3S (12k)",
    "d1-10": "8S", "d2-10": "14S", "d4-10": "", "d5-10": "10S", "d7-10": "18S",
    "pre1": "3S + 4 X 1200 I C/3 MIN TR + 3S (11k)", "pre2": "3S + 3 X 2U C/2 MIN S + 3S (12k)",
    "d1-pre": "8S", "d2-pre": "18S", "d4-pre": "", "d5-pre": "10S", "d7-pre": "20S",
    "km-pre": "79k", "km-42": "138k", "km-21": "79k", "km-10": "73k",
  },
  s10: {
    phase: "FQ",
    "c1-42": "3S + 16M + 3S (22k)", "c2-42": "4S + 5 X 2U C/2 MIN S + 4S (18k)",
    "d1-42": "14S", "d2-42": "26S", "d4-42": "22S", "d5-42": "14S", "d7-42": "24S",
    "c1-21": "3S + 4 X 1.5U C/2 MIN S + 3S (12k)", "c2-21": "16S + 6 A/D + 2S (19k)",
    "d1-21": "8S", "d2-21": "16S", "d4-21": "", "d5-21": "10S", "d7-21": "18S",
    "c1-10": "3S + 5 X 1000 I C/3 MIN TR + 3S (11k)", "c2-10": "4S + 4U + 4S (12k)",
    "d1-10": "8S", "d2-10": "14S", "d4-10": "", "d5-10": "8S", "d7-10": "16S",
    "pre1": "3S + 4 X 1.5U C/2 MIN S + 3S (12k)", "pre2": "16S + 6 A/D + 2S (19k)",
    "d1-pre": "8S", "d2-pre": "16S", "d4-pre": "", "d5-pre": "10S", "d7-pre": "18S",
    "km-pre": "83k", "km-42": "140k", "km-21": "83k", "km-10": "69k",
  },
  s11: {
    phase: "FQ",
    "c1-42": "4S + 22M + 2S (28k)", "c2-42": "4S + 4 X 1.5U C/2 MIN S + 4S (14k)",
    "d1-42": "14S", "d2-42": "24S", "d4-42": "20S", "d5-42": "12S", "d7-42": "22S",
    "c1-21": "4S + 7U + 4S (15k)", "c2-21": "14S (14k)",
    "d1-21": "8S", "d2-21": "14S", "d4-21": "", "d5-21": "8S", "d7-21": "16S",
    "c1-10": "3S + 4 X 1200 I C/3 MIN TR + 3S (11k)", "c2-10": "4S + 5U + 3S (12k)",
    "d1-10": "8S", "d2-10": "12S", "d4-10": "", "d5-10": "8S", "d7-10": "14S",
    "pre1": "4S + 7U + 4S (15k)", "pre2": "14S (14k)",
    "d1-pre": "8S", "d2-pre": "14S", "d4-pre": "", "d5-pre": "8S", "d7-pre": "16S",
    "km-pre": "75k", "km-42": "134k", "km-21": "75k", "km-10": "65k",
  },
  s12: {
    phase: "TAPER",
    "c1-42": "3S + 4 X 1000 M C/2 MIN S + 3S (10k)", "c2-42": "6S (6k)",
    "d1-42": "8S", "d2-42": "10S", "d4-42": "8S", "d5-42": "", "d7-42": "",
    "c1-21": "3S + 4 X 1000 M C/2 MIN S + 3S (10k)", "c2-21": "5S (5k)",
    "d1-21": "6S", "d2-21": "8S", "d4-21": "", "d5-21": "", "d7-21": "",
    "c1-10": "3S + 5 X 600 I C/2 MIN TR + 3S (9k)", "c2-10": "4S + 5 A/D + 1S (5k)",
    "d1-10": "6S", "d2-10": "8S", "d4-10": "", "d5-10": "", "d7-10": "",
    "pre1": "3S + 4 X 1000 M C/2 MIN S + 3S (10k)", "pre2": "5S (5k)",
    "d1-pre": "6S", "d2-pre": "8S", "d4-pre": "", "d5-pre": "", "d7-pre": "",
    "km-pre": "29k", "km-42": "42k", "km-21": "29k", "km-10": "28k",
  },
};

// ---------- i18n ----------

const I18N = {
  en: {
    htmlLang: "en",
    title: "vtrain — Jack Daniels Training Plans",
    heroTitle: "Build your training plan",
    subtitle: '12-week plans following <a href="https://en.wikipedia.org/wiki/Jack_Daniels_(coach)" target="_blank" rel="noopener">Jack Daniels\' VDOT methodology</a>. Adapts to any race weekday.',
    labelDistance: "Distance",
    labelRaceDate: "Race date",
    labelTargetTime: "Goal time",
    submit: "Generate plan",
    distances: {
      42: "Marathon (42 km)",
      21: "Half marathon (21 km)",
      10: "10 km",
      0:  "General training",
    },
    distancesShort: { 42: "Marathon", 21: "Half", 10: "10K", 0: "General" },
    week: "Week",
    weeksRange: "Weeks",
    rest: "Rest",
    raceDay: "Race day",
    kms: "Total",
    mileageHeading: "Weekly mileage",
    pacesHeading: "Training paces (min/km)",
    paces: {
      Easy: "Easy",
      Marathon: "Marathon",
      Threshold: "Threshold",
      Interval: "Interval",
      Repetition: "Repetition",
    },
    paceDescriptions: {
      Easy:       "Recovery & base — most miles here. 60–79% HRmax.",
      Marathon:   "Marathon goal pace. 80–85% HRmax.",
      Threshold:  "Comfortably hard. 82–88% HRmax. Cap ≈10% weekly km.",
      Interval:   "VO2max work. 97–100% HRmax. Reps ≤ ~5 min.",
      Repetition: "Speed & economy. Short, fast, full recovery.",
    },
    accelDecel: 'Acceleration/Deceleration: 30"/50"',
    days: {
      mon: "Monday", tue: "Tuesday", wed: "Wednesday",
      thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
    },
    daysShort: {
      mon: "Mon", tue: "Tue", wed: "Wed",
      thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
    },
    phases: {
      FI:    "Phase I (Foundation)",
      EQ:    "Phase II (Early Quality)",
      TQ:    "Phase III (Transition Quality)",
      FQ:    "Phase IV (Final Quality)",
      TAPER: "Phase IV (Taper / Race week)",
    },
    phaseShort: {
      FI: "Foundation",
      EQ: "Early Quality",
      TQ: "Transition Quality",
      FQ: "Final Quality",
    },
    dayTypes: { q1: "Q1", q2: "Q2", long: "Long", race: "Race" },
    actionICS: "Download .ics",
    actionPrint: "Print / PDF",
    actionHint: "Import the .ics file in Google Calendar (Settings → Import) or open it in Apple Calendar.",
    errDate: "Invalid race date.",
    errDistance: "Invalid distance. Must be 10, 21, 42, or 0 for general training.",
    errTime: "Invalid goal-time format. Must be hh:mm:ss.",
  },
  es: {
    htmlLang: "es",
    title: "vtrain — Planes de entrenamiento Jack Daniels",
    heroTitle: "Crea tu plan de entrenamiento",
    subtitle: 'Planes de 12 semanas siguiendo la metodología de <a href="https://en.wikipedia.org/wiki/Jack_Daniels_(coach)" target="_blank" rel="noopener">Jack Daniels (VDOT)</a>. Se adapta al día de tu carrera.',
    labelDistance: "Distancia",
    labelRaceDate: "Fecha de la carrera",
    labelTargetTime: "Tiempo objetivo",
    submit: "Generar plan",
    distances: {
      42: "Maratón (42 km)",
      21: "Media maratón (21 km)",
      10: "10 km",
      0:  "Entrenamiento general",
    },
    distancesShort: { 42: "Maratón", 21: "Media", 10: "10K", 0: "General" },
    week: "Semana",
    weeksRange: "Semanas",
    rest: "Descanso",
    raceDay: "Día de la carrera",
    kms: "Total",
    mileageHeading: "Kilometraje semanal",
    pacesHeading: "Ritmos de entrenamiento (min/km)",
    paces: {
      Easy: "Suave",
      Marathon: "Ritmo Maratón",
      Threshold: "Umbral",
      Interval: "Intervalo",
      Repetition: "Repetición",
    },
    paceDescriptions: {
      Easy:       "Recuperación y base — la mayoría de kms. 60–79% FCmax.",
      Marathon:   "Ritmo objetivo de maratón. 80–85% FCmax.",
      Threshold:  "Cómodamente exigente. 82–88% FCmax. Tope ≈10% del km semanal.",
      Interval:   "Trabajo VO2max. 97–100% FCmax. Reps ≤ ~5 min.",
      Repetition: "Velocidad y economía. Corto, rápido, recuperación completa.",
    },
    accelDecel: 'Aceleración/Desaceleración: 30"/50"',
    days: {
      mon: "Lunes", tue: "Martes", wed: "Miércoles",
      thu: "Jueves", fri: "Viernes", sat: "Sábado", sun: "Domingo",
    },
    daysShort: {
      mon: "Lun", tue: "Mar", wed: "Mié",
      thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom",
    },
    phases: {
      FI:    "Fase I (Fundamentos)",
      EQ:    "Fase II (Calidad temprana)",
      TQ:    "Fase III (Calidad de transición)",
      FQ:    "Fase IV (Calidad final)",
      TAPER: "Fase IV (Taper / semana de carrera)",
    },
    phaseShort: {
      FI: "Fundamentos",
      EQ: "Calidad temprana",
      TQ: "Calidad de transición",
      FQ: "Calidad final",
    },
    dayTypes: { q1: "Q1", q2: "Q2", long: "Largo", race: "Carrera" },
    actionICS: "Descargar .ics",
    actionPrint: "Imprimir / PDF",
    actionHint: "Importa el archivo .ics en Google Calendar (Ajustes → Importar) o ábrelo en Calendario de Apple.",
    errDate: "Fecha de la carrera inválida.",
    errDistance: "Distancia inválida. Debe ser 10, 21, 42 o 0 para entrenamiento general.",
    errTime: "Formato de tiempo objetivo inválido. Debe ser hh:mm:ss.",
  },
};

// Translate a workout string from Spanish Daniels notation to English.
// Pace codes: S→E (Easy), U→T (Threshold). M, I, R unchanged.
// Notation: A/D→ST, C/→w/, TR→jog, MIN→min, X→x.
function translateWorkout(text, lang) {
  if (lang === "es") return text;
  return text
    // digit+S → digit+E (e.g. "8S" → "8E", "1.5S" → "1.5E")
    .replace(/(\d(?:\.\d+)?)S(?=\b|\s|\+|\(|$)/g, "$1E")
    // "MIN S" → "min E" (rest interval at easy pace) — must run before the standalone MIN replacement
    .replace(/MIN\s+S\b/g, "min E")
    .replace(/\bMIN\b/g, "min")
    // digit (optional space) U → digit T (e.g. "1.5U", "2 U", "7U")
    .replace(/(\d(?:\.\d+)?)\s*U\b/g, "$1T")
    // "-> U" → "-> T"
    .replace(/->\s*U\b/g, "-> T")
    .replace(/A\/D/g, "ST")
    .replace(/C\//g, "w/")
    .replace(/\bTR\b/g, "jog")
    .replace(/\bX\b/g, "x")
    .replace(/KM\s+PROG/g, "km prog")
    .replace(/\bKMS\b/g, "km");
}

// ---------- Helpers ----------

function parseTimeToSeconds(str) {
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return NaN;
}

function getVDOT(targetSeconds, distance) {
  let table;
  switch (distance) {
    case 42: table = MARATHON_VDOT; break;
    case 10: table = TEN_K_VDOT; break;
    case 21:
    case 0:  table = HALF_MARATHON_VDOT; break;
    default: throw new Error(`Distancia no soportada: ${distance}`);
  }
  let bestVdot = 0, minDiff = Infinity;
  for (const [vdot, time] of Object.entries(table)) {
    const diff = Math.abs(parseTimeToSeconds(time) - targetSeconds);
    if (diff < minDiff) { minDiff = diff; bestVdot = Number(vdot); }
  }
  return bestVdot;
}

function calculatePaces(vdot) {
  const fallback = "—";
  return {
    Easy:       PACE_S[vdot] ?? fallback,
    Marathon:   PACE_M[vdot] ?? fallback,
    Threshold:  PACE_U[vdot] ?? fallback,
    Interval:   PACE_I[vdot] ?? fallback,
    Repetition: PACE_R[vdot] ?? fallback,
  };
}

// Resolve a week's per-distance fields into position-indexed slots.
// The schedule rhythm is anchored to race day, not to weekday:
//   d1, d2 = recovery / medium-easy days after the long run
//   c1     = day 3 — Q1 quality session
//   d4, d5 = easy days
//   c2     = day 6 — Q2 quality session
//   d7     = day 7 — long run (or race in week 12)
function selectWeek(weekCfg, distance) {
  const suffix = distance === 0 ? "pre" : String(distance);
  const c1Key = distance === 0 ? "pre1" : `c1-${suffix}`;
  const c2Key = distance === 0 ? "pre2" : `c2-${suffix}`;
  const kmKey = distance === 0 ? "km-pre" : `km-${suffix}`;
  return {
    phase: weekCfg.phase,
    d1: weekCfg[`d1-${suffix}`] ?? "",
    d2: weekCfg[`d2-${suffix}`] ?? "",
    q1: weekCfg[c1Key],
    d4: weekCfg[`d4-${suffix}`] ?? "",
    d5: weekCfg[`d5-${suffix}`] ?? "",
    q2: weekCfg[c2Key],
    d7: weekCfg[`d7-${suffix}`] ?? "",
    km: weekCfg[kmKey] ?? "",
  };
}

// Parse YYYY-MM-DD as a *local* date (avoids the UTC timezone shift that
// `new Date("YYYY-MM-DD")` introduces).
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

// Map JS getDay() (0=Sunday..6=Saturday) to the I18N day-key.
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
function dayKey(date) {
  return DAY_KEYS[date.getDay()];
}

// ---------- Plan generation ----------

function buildPlan(distance, raceDate, raceTime) {
  const targetSeconds = parseTimeToSeconds(raceTime);
  const vdot = getVDOT(targetSeconds, distance);
  const paces = calculatePaces(vdot);

  const startDate = addDays(parseLocalDate(raceDate), -84);
  const weeks = [];
  for (let week = 1; week <= 12; week++) {
    const cfg = PLAN_CONFIG[`s${week}`];
    const days = selectWeek(cfg, distance);
    const dateAt = (offset) => formatDate(addDays(startDate, (week - 1) * 7 + offset));

    // Position-anchored schedule: offset 7 = race-equivalent day; weekday
    // labels are computed from the actual date so the plan adapts to any
    // race weekday.
    const slots = [
      { offset: 1, value: days.d1, type: "easy" },
      { offset: 2, value: days.d2, type: "easy" },
      { offset: 3, value: days.q1, type: "q1" },
      { offset: 4, value: days.d4, type: "easy" },
      { offset: 5, value: days.d5, type: "easy" },
      { offset: 6, value: days.q2, type: "q2" },
      week === 12
        ? { offset: 7, value: null, type: "race" }
        : { offset: 7, value: days.d7, type: "long" },
    ];
    const schedule = slots.map((s) => {
      const date = addDays(startDate, (week - 1) * 7 + s.offset);
      return { day: dayKey(date), date: formatDate(date), value: s.value, type: s.type };
    });
    weeks.push({ week, phase: days.phase, schedule, km: days.km });
  }
  return { weeks, vdot, paces, distance, raceDate, raceTime };
}

// ---------- Render ----------

function renderError(msg) {
  const out = document.getElementById("output");
  out.innerHTML = `<div class="error">${msg}</div>`;
}

function renderHeroStats(plan, t) {
  const paces = Object.entries(plan.paces).map(([k, v]) => `
    <div class="pace-card pace-${k.toLowerCase()}">
      <div class="pace-name">${t.paces[k]}</div>
      <div class="pace-value">${v}</div>
      <div class="pace-desc">${t.paceDescriptions[k]}</div>
    </div>
  `).join("");
  const meta = `${t.distancesShort[plan.distance]} · ${plan.raceTime}`;
  return `
    <div class="vdot-hero">
      <div class="vdot-block">
        <div class="vdot-label">VDOT</div>
        <div class="vdot-value">${plan.vdot}</div>
        <div class="vdot-meta">${meta}</div>
      </div>
      <div class="paces-grid">${paces}</div>
    </div>
  `;
}

function renderPhaseStrip(t) {
  const segments = [
    { key: "FI", weeks: "1–3" },
    { key: "EQ", weeks: "4–6" },
    { key: "TQ", weeks: "7–9" },
    { key: "FQ", weeks: "10–12" },
  ];
  return `
    <div class="phase-strip">
      ${segments.map(s => `
        <div class="phase-segment phase-${s.key}">
          <div class="phase-segment-name">${t.phaseShort[s.key]}</div>
          <div class="phase-segment-weeks">${t.weeksRange} ${s.weeks}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderMileageChart(plan, t) {
  const kms = plan.weeks.map(w => parseInt(w.km, 10) || 0);
  const max = Math.max(...kms, 1);
  const W = 600, H = 110, BAR_W = 36, GAP = 8;
  const startX = (W - 12 * BAR_W - 11 * GAP) / 2;
  const chartTop = 22, chartBottom = H - 16;
  const chartH = chartBottom - chartTop;

  const bars = plan.weeks.map((w, i) => {
    const km = kms[i];
    const h = Math.max(2, (km / max) * chartH);
    const x = startX + i * (BAR_W + GAP);
    const y = chartBottom - h;
    return `
      <g class="bar-group" data-phase="${w.phase}">
        <rect x="${x}" y="${y}" width="${BAR_W}" height="${h}" rx="3"/>
        <text x="${x + BAR_W/2}" y="${y - 5}" class="bar-value">${km}</text>
        <text x="${x + BAR_W/2}" y="${H - 3}" class="bar-label">${i + 1}</text>
      </g>
    `;
  }).join("");

  return `
    <div class="mileage-chart">
      <h3 class="chart-title">${t.mileageHeading}</h3>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t.mileageHeading}">
        ${bars}
      </svg>
    </div>
  `;
}

function renderWeekCard(w, t, lang, idx) {
  const rows = w.schedule.map((d) => {
    let display, badge = "";
    let valueCls = "day-value";
    if (d.type === "race") {
      display = t.raceDay;
      badge = `<span class="day-badge badge-race">${t.dayTypes.race}</span>`;
    } else if (!d.value) {
      display = t.rest;
      valueCls += " is-rest";
    } else {
      display = translateWorkout(d.value, lang);
      if (d.type === "q1") badge = `<span class="day-badge badge-quality">${t.dayTypes.q1}</span>`;
      else if (d.type === "q2") badge = `<span class="day-badge badge-quality">${t.dayTypes.q2}</span>`;
      else if (d.type === "long") badge = `<span class="day-badge badge-long">${t.dayTypes.long}</span>`;
    }
    return `
      <li class="day-row day-${d.type}">
        <span class="day-label">
          <span class="day-name">${t.daysShort[d.day]}</span>
          <span class="day-date">${d.date}</span>
        </span>
        <span class="day-tag">${badge}</span>
        <span class="${valueCls}">${display}</span>
      </li>
    `;
  }).join("");

  return `
    <article class="week-card phase-${w.phase}" style="--i: ${idx}">
      <header class="week-header">
        <div class="week-title">
          <span class="week-num">${t.week} ${w.week}</span>
          <span class="week-phase">${t.phases[w.phase]}</span>
        </div>
        <div class="week-km">${w.km}</div>
      </header>
      <ul class="day-list">${rows}</ul>
    </article>
  `;
}

function renderPlanActions(t) {
  return `
    <div class="plan-actions">
      <button type="button" class="action-btn" data-action="ics" title="${t.actionHint}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8"  y1="2" x2="8"  y2="6"/>
          <line x1="3"  y1="10" x2="21" y2="10"/>
        </svg>
        <span>${t.actionICS}</span>
      </button>
      <button type="button" class="action-btn" data-action="print">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
        <span>${t.actionPrint}</span>
      </button>
    </div>
  `;
}

function renderPlan(plan, lang) {
  const t = I18N[lang];
  const out = document.getElementById("output");
  out.innerHTML = `
    ${renderPlanActions(t)}
    ${renderHeroStats(plan, t)}
    ${renderPhaseStrip(t)}
    ${renderMileageChart(plan, t)}
    <div class="weeks-list">
      ${plan.weeks.map((w, i) => renderWeekCard(w, t, lang, i)).join("")}
    </div>
  `;
}

// ---------- Export: iCalendar (.ics) ----------

function escapeICS(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function dateToICS(dateStr) {
  return dateStr.replace(/-/g, "");
}

function buildICS(plan, lang) {
  const t = I18N[lang];
  const stamp = new Date().toISOString().replace(/[-:]|\.\d+/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//vtrain//Daniels Training Plan//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeICS(`vtrain · ${t.distancesShort[plan.distance]} · ${plan.raceDate}`)}`,
  ];

  for (const w of plan.weeks) {
    for (const d of w.schedule) {
      let summary, description;
      const dayName = t.days[d.day];
      const phaseLabel = t.phases[w.phase];
      const tag = d.type === "q1" ? `[${t.dayTypes.q1}] `
                : d.type === "q2" ? `[${t.dayTypes.q2}] `
                : d.type === "long" ? `[${t.dayTypes.long}] ` : "";

      if (d.type === "race") {
        summary = `${t.raceDay} · ${t.distancesShort[plan.distance]} (${plan.raceTime})`;
        description = `${phaseLabel}\n${t.week} ${w.week} · ${dayName}`;
      } else if (!d.value) {
        summary = t.rest;
        description = `${phaseLabel}\n${t.week} ${w.week} · ${dayName}`;
      } else {
        const workout = translateWorkout(d.value, lang);
        summary = `${tag}${workout}`;
        description = `${phaseLabel}\n${t.week} ${w.week} · ${dayName}\n${workout}`;
      }

      const dt = dateToICS(d.date);
      const nextDay = dateToICS(formatDate(addDays(parseLocalDate(d.date), 1)));
      const uid = `vtrain-w${w.week}-${d.day}-${dt}@vtrain.jandroav.net`;

      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${dt}`,
        `DTEND;VALUE=DATE:${nextDay}`,
        `SUMMARY:${escapeICS(summary)}`,
        `DESCRIPTION:${escapeICS(description)}`,
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
      );
    }
  }
  lines.push("END:VCALENDAR");
  // ICS spec wants CRLF line endings.
  return lines.join("\r\n") + "\r\n";
}

function downloadICS(plan, lang) {
  const ics = buildICS(plan, lang);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const distSlug = plan.distance === 0 ? "general" : `${plan.distance}k`;
  a.href = url;
  a.download = `vtrain-${distSlug}-${plan.raceDate}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- Form wiring ----------

function defaultRaceDate() {
  return formatDate(addDays(new Date(), 84));
}

// Sensible amateur-intermediate goal times per distance.
// (Marathon 03:30 ≈ VDOT 44; half 01:35 ≈ VDOT 48; 10k 00:42 ≈ VDOT 42.)
// These are placeholders the user will adjust to their real goal — the
// important thing is that they're plausible for the distance.
const DEFAULT_GOAL_TIMES = {
  42: "03:30:00",
  21: "01:35:00",
  10: "00:42:00",
  0:  "01:35:00",
};

function syncDefaultGoalTime() {
  const checked = document.querySelector('input[name="distancia"]:checked');
  if (!checked) return;
  const def = DEFAULT_GOAL_TIMES[Number(checked.value)];
  if (def) document.getElementById("tiempoObjetivo").value = def;
}

const LANG_STORAGE_KEY = "vtrain.lang";
const SUPPORTED_LANGS = ["en", "es"];
let currentLang = "en";
let currentPlan = null;

function pickInitialLang() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return SUPPORTED_LANGS.includes(saved) ? saved : "en";
}

function applyStaticI18n(lang) {
  const t = I18N[lang];
  document.documentElement.lang = t.htmlLang;
  document.title = t.title;
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.innerHTML = t[el.dataset.i18n];
  }
  for (const el of document.querySelectorAll("[data-distance-label]")) {
    el.textContent = t.distancesShort[el.dataset.distanceLabel];
  }
  for (const btn of document.querySelectorAll(".lang-toggle button")) {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  }
}

function updateDistanceCards() {
  for (const card of document.querySelectorAll(".distance-card")) {
    const checked = card.querySelector("input")?.checked;
    card.classList.toggle("is-selected", !!checked);
  }
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (_) {}
  applyStaticI18n(lang);
  if (currentPlan) renderPlan(currentPlan, lang);
}

document.addEventListener("DOMContentLoaded", () => {
  setLanguage(pickInitialLang());
  document.getElementById("fechaCarrera").value = defaultRaceDate();
  syncDefaultGoalTime();
  updateDistanceCards();

  for (const btn of document.querySelectorAll(".lang-toggle button")) {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  }
  for (const radio of document.querySelectorAll('input[name="distancia"]')) {
    radio.addEventListener("change", () => {
      updateDistanceCards();
      syncDefaultGoalTime();
    });
  }

  // Delegated handler for export actions (buttons live inside renderPlan output)
  document.getElementById("output").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn || !currentPlan) return;
    if (btn.dataset.action === "ics") downloadICS(currentPlan, currentLang);
    else if (btn.dataset.action === "print") window.print();
  });

  document.getElementById("plan-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const t = I18N[currentLang];
    const checked = document.querySelector('input[name="distancia"]:checked');
    const distance = checked ? Number(checked.value) : NaN;
    const raceDate = document.getElementById("fechaCarrera").value;
    const raceTime = document.getElementById("tiempoObjetivo").value;

    if (!raceDate || isNaN(parseLocalDate(raceDate).getTime())) { renderError(t.errDate); return; }
    if (![0, 10, 21, 42].includes(distance)) { renderError(t.errDistance); return; }
    const seconds = parseTimeToSeconds(raceTime);
    if (!Number.isFinite(seconds) || seconds <= 0) { renderError(t.errTime); return; }

    try {
      currentPlan = buildPlan(distance, raceDate, raceTime);
      renderPlan(currentPlan, currentLang);
      document.getElementById("output").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      renderError(err.message);
    }
  });
});
