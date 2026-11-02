/**
 * XP, levels, badges — the game layer.
 * All pure functions so they can run on any device, fully offline.
 */

export const LEVEL_TITLES = [
  "Bit Newbie",
  "Byte Apprentice",
  "Logic Tinkerer",
  "Circuit Runner",
  "Cipher Adept",
  "Hash Wrangler",
  "Key Keeper",
  "Crypto Sage",
  "Security Sentinel",
  "Terminal Legend",
] as const;

/** Cumulative XP required to REACH a level (level 1 starts at 0). */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 20 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp && level < 99) level += 1;
  return level;
}

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];
}

export type LevelInfo = {
  level: number;
  title: string;
  /** xp put into the current level */
  into: number;
  /** xp needed to go from current level to the next */
  span: number;
  pct: number;
  nextAt: number;
  isMax: boolean;
};

export function levelInfo(xp: number): LevelInfo {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base;
  const into = xp - base;
  return {
    level,
    title: levelTitle(level),
    into,
    span,
    pct: Math.min(100, Math.round((into / span) * 100)),
    nextAt: next,
    isMax: level >= 99,
  };
}

/* ---------------- badges ---------------- */

export type BadgeDef = {
  id: string;
  title: string;
  desc: string;
  icon:
    | "sparkles"
    | "flame"
    | "zap"
    | "target"
    | "brain"
    | "code"
    | "terminal"
    | "swords"
    | "crown"
    | "cpu"
    | "key"
    | "shield"
    | "graduation"
    | "trending"
    | "trophy";
};

export const BADGES: BadgeDef[] = [
  { id: "first-steps", title: "Hello, World", desc: "Complete your first lesson", icon: "sparkles" },
  { id: "streak-7", title: "On Fire", desc: "Keep a 7-day streak", icon: "flame" },
  { id: "streak-30", title: "Unstoppable", desc: "Keep a 30-day streak", icon: "zap" },
  { id: "quiz-sniper", title: "Sharpshooter", desc: "Aim true on 10 knowledge checks", icon: "target" },
  { id: "quiz-machine", title: "Flawless Mind", desc: "Aim true on 25 knowledge checks", icon: "brain" },
  { id: "code-runner", title: "Runner", desc: "Pass 5 coding exercises", icon: "code" },
  { id: "code-ninja", title: "Grounds Master", desc: "Pass every coding exercise", icon: "terminal" },
  { id: "boss-slayer", title: "Giant Slayer", desc: "Defeat your first boss", icon: "swords" },
  { id: "boss-master", title: "Bossbreaker", desc: "Defeat every boss", icon: "crown" },
  { id: "foundations-complete", title: "Grounded", desc: "Finish Digital Foundations", icon: "cpu" },
  { id: "crypto-complete", title: "Keybearer", desc: "Finish Cryptography", icon: "key" },
  { id: "security-complete", title: "Sentinel", desc: "Finish Security & Privacy", icon: "shield" },
  { id: "level-5", title: "Rising Star", desc: "Reach level 5", icon: "trending" },
  { id: "level-10", title: "Peak Performer", desc: "Reach level 10", icon: "trophy" },
  { id: "scholar", title: "Terminal Legend", desc: "Complete every course", icon: "graduation" },
];

export const BADGE_BY_ID = new Map(BADGES.map((b) => [b.id, b]));

/* ---------------- streak date helpers (local time) ---------------- */

export function dateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function todayStr(): string {
  return dateStr(new Date());
}

export function addDays(str: string, n: number): string {
  const [y, m, d] = str.split("-").map(Number);
  return dateStr(new Date(y, m - 1, d + n));
}

/** whole days from a to b (b later = positive) */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / 86400000);
}
