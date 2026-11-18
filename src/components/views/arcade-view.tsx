"use client";

/**
 * The Arcade — four terminal-flavored mini-games.
 *
 *   bit_blitz        flip bits to match targets against the clock
 *   command_rush     60-second rapid-fire trivia from the real course banks
 *   phishing_spotter judge URLs: legitimate or look-alike traps
 *   type_rush        type real terminal commands, measure your WPM
 *
 * High scores persist to localStorage — no XP is awarded here, so the
 * learning progression economy stays exactly as balanced as before.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sfx, useSoundSettings } from "@/lib/sound";
import { useArcade, ARCADE_GAMES, type GameId } from "@/lib/arcade-store";
import { ALL_LESSONS } from "@/lib/content";
import type { QuizQuestion } from "@/data/types";
import { Confetti } from "@/components/fx";
import { SectionHeading, TermWindow } from "@/components/term-ui";
import {
  Gamepad2, Dices, Zap, Trophy, ChevronRight, Heart, Timer as TimerIcon,
  Keyboard, ShieldAlert, CheckCircle2, XCircle, RotateCcw, ArrowLeft,
  Lock, Star, Volume2, VolumeX,
} from "lucide-react";

const GAME_ICONS: Record<GameId, typeof Gamepad2> = {
  "bit-blitz": Dices,
  "command-rush": Zap,
  "phishing-spotter": ShieldAlert,
  "type-rush": Keyboard,
};

/* ---------------- countdown hook ---------------- */

function useCountdown(active: boolean, seconds: number, onEnd: () => void) {
  const [left, setLeft] = useState(seconds);
  const endRef = useRef(onEnd);

  useEffect(() => {
    endRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (!active) return;
    const started = performance.now();
    let ended = false;
    const id = window.setInterval(() => {
      const rem = Math.max(0, seconds - (performance.now() - started) / 1000);
      setLeft(rem);
      if (rem <= 0 && !ended) {
        ended = true;
        window.clearInterval(id);
        endRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [active, seconds]);

  return left;
}

/* ---------------- game over panel ---------------- */

function GameOverPanel({
  title,
  score,
  unit,
  best,
  isBest,
  lines,
  onReplay,
  onExit,
}: {
  title: string;
  score: number;
  unit: string;
  best: number;
  isBest: boolean;
  lines: string[];
  onReplay: () => void;
  onExit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border-2 border-amber-500/50 bg-amber-500/5 p-6 text-center sm:p-8"
    >
      <Trophy className={cn("mx-auto h-12 w-12", isBest ? "text-amber-400" : "text-muted-foreground")} aria-hidden />
      <h3 className="font-display mt-3 text-3xl uppercase text-amber-300 glow-amber sm:text-4xl">
        {isBest ? "new high score" : "run complete"}
      </h3>
      <p className="mt-2 font-display text-4xl text-primary glow-green">
        {score.toLocaleString()} {unit}
      </p>
      {isBest ? <Confetti fire={1} /> : null}
      <p className="mt-1 font-mono text-xs text-muted-foreground">
        personal best: {best.toLocaleString()} {unit}
      </p>
      <div className="mx-auto mt-4 max-w-sm space-y-1">
        {lines.map((l) => (
          <p key={l} className="font-mono text-[11px] text-muted-foreground">{l}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onReplay}
          className="flex items-center justify-center gap-2 rounded-md border-2 border-primary bg-primary px-5 py-2.5 font-display text-lg uppercase text-primary-foreground term-focus hover:brightness-110"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> replay
        </button>
        <button
          type="button"
          onClick={onExit}
          className="flex items-center justify-center gap-2 rounded-md border border-border bg-secondary px-5 py-2.5 font-mono text-sm uppercase text-muted-foreground term-focus hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> arcade
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- arcade view ---------------- */

export function ArcadeView() {
  const [active, setActive] = useState<GameId | null>(null);
  const notePlay = useArcade((s) => s.notePlay);

  function enter(game: GameId) {
    sfx.roundStart();
    notePlay(game);
    setActive(game);
  }

  return (
    <div className="space-y-6">
      <SectionHeading className="flex items-center gap-2">
        <Gamepad2 className="h-7 w-7" aria-hidden />
        <span>the_arcade</span>
      </SectionHeading>

      {active === null ? <ArcadeMenu onEnter={enter} /> : null}
      {active === "bit-blitz" ? <BitBlitz onExit={() => setActive(null)} /> : null}
      {active === "command-rush" ? <CommandRush onExit={() => setActive(null)} /> : null}
      {active === "phishing-spotter" ? <PhishingSpotter onExit={() => setActive(null)} /> : null}
      {active === "type-rush" ? <TypeRush onExit={() => setActive(null)} /> : null}
    </div>
  );
}

function ArcadeMenu({ onEnter }: { onEnter: (g: GameId) => void }) {
  const bests = useArcade((s) => s.bests);
  const plays = useArcade((s) => s.plays);
  const soundOn = useSoundSettings((s) => s.soundOn);
  const setSoundOn = useSoundSettings((s) => s.setSoundOn);

  return (
    <>
      <TermWindow title="coin_slot — insert nothing, play forever" bodyClassName="p-5 sm:p-6">
        <p className="text-[15px] leading-7 text-foreground/90">
          The training grounds teach. The arcade sharpens. Every game here drills a real
          skill — bit reading, reflex recall, attacker-spotting, terminal muscle memory.
          Nothing to install, nothing to sign, scores live on your device.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-primary" aria-hidden /> {plays} run{plays === 1 ? "" : "s"} logged
          </span>
          <button
            type="button"
            onClick={() => {
              setSoundOn(!soundOn);
              if (!soundOn) sfx.click();
            }}
            className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 py-1 term-focus hover:text-foreground"
            aria-pressed={soundOn}
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5 text-primary" aria-hidden /> : <VolumeX className="h-3.5 w-3.5" aria-hidden />}
            sound: {soundOn ? "on" : "off"}
          </button>
        </div>
      </TermWindow>

      <div className="grid gap-4 sm:grid-cols-2">
        {ARCADE_GAMES.map((g) => {
          const Icon = GAME_ICONS[g.id];
          const best = bests[g.id];
          return (
            <motion.button
              key={g.id}
              type="button"
              onClick={() => onEnter(g.id)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * ARCADE_GAMES.indexOf(g) }}
              whileHover={{ y: -3 }}
              className="group flex items-center gap-4 rounded-lg border-2 border-border bg-card p-5 text-left term-focus hover:border-primary/50 hover:bg-primary/5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl uppercase text-foreground group-hover:text-primary">
                  {g.name}
                </span>
                <span className="block truncate font-mono text-xs text-muted-foreground">{g.tagline}</span>
                <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
                  {best ? (
                    <span className="text-amber-400">
                      best: {best.score.toLocaleString()} {g.unit}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3" aria-hidden /> no score yet
                    </span>
                  )}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- game 1: bit blitz ---------------- */

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

function BitBlitz({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [bits, setBits] = useState<number[]>(Array(8).fill(0));
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);
  const [flash, setFlash] = useState<"none" | "hit" | "miss">("none");

  const recordScore = useArcade((s) => s.recordScore);
  const [result, setResult] = useState<{ score: number; best: number; isBest: boolean; lines: string[] } | null>(null);

  const roundDur = Math.max(5, 12 - (round - 1) * 0.6);
  const value = bits.reduce((sum, b, i) => sum + b * BIT_VALUES[i], 0);

  const newTarget = useCallback(() => {
    setBits(Array(8).fill(0));
    setTarget(1 + Math.floor(Math.random() * 255));
  }, []);

  const onTimeout = useCallback(() => {
    sfx.heartLose();
    setFlash("miss");
    window.setTimeout(() => setFlash("none"), 400);
    setStreak(0);
    const nl = lives - 1;
    setLives(nl);
    if (nl <= 0) {
      sfx.defeat();
      const r = recordScore("bit-blitz", score);
      setResult({ score, ...r, lines: [`rounds cleared: ${round - 1}`, `target: ${target} — never matched`] });
      setPhase("over");
    } else {
      newTarget();
      setRound((r) => r + 1);
    }
  }, [lives, score, round, target, recordScore, newTarget]);

  const timeLeft = useCountdown(phase === "playing", roundDur, onTimeout);

  // flip a bit; if the byte now matches the target, score and advance
  function flip(i: number) {
    if (phase !== "playing") return;
    sfx.tick();
    const next = [...bits];
    next[i] = next[i] ? 0 : 1;
    setBits(next);
    if (target !== 0) {
      const nv = next.reduce((sum, b, j) => sum + b * BIT_VALUES[j], 0);
      if (nv === target) {
        const speedBonus = Math.round(timeLeft * 10);
        const gained = (100 + speedBonus) * Math.max(1, streak);
        sfx.correct();
        setFlash("hit");
        window.setTimeout(() => setFlash("none"), 350);
        setScore((s) => s + gained);
        setStreak((s) => s + 1);
        setRound((r) => r + 1);
        newTarget();
      }
    }
  }

  // keyboard: keys 1-8 flip bits (via a ref so the closure stays fresh)
  const flipRef = useRef(flip);
  useEffect(() => {
    flipRef.current = flip;
  });
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 8) {
        flipRef.current(8 - n);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  function start() {
    setPhase("playing");
    setScore(0);
    setStreak(0);
    setLives(3);
    setRound(1);
    setResult(null);
    newTarget();
    sfx.roundStart();
  }

  if (phase === "ready") {
    return (
      <ReadyPanel
        title="bit_blitz"
        desc="A target number appears. Flip the eight bits until your byte matches it — before the timer drains. Keys 1-8 flip bits left-to-right. Speed feeds score, streaks multiply, timeouts cost a heart."
        onExit={onExit}
        onStart={start}
      />
    );
  }

  if (phase === "over" && result) {
    return (
      <GameOverPanel
        title="bit_blitz"
        score={result.score}
        unit="pts"
        best={result.best}
        isBest={result.isBest}
        lines={result.lines}
        onReplay={start}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* status strip */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          round {round}
        </span>
        <span className="flex items-center gap-1" aria-label={`${lives} lives`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={cn("h-4 w-4", i < lives ? "fill-red-500 text-red-500" : "text-border")} aria-hidden />
          ))}
        </span>
        <span className={cn("font-mono text-xs uppercase tracking-widest", streak > 1 ? "text-primary" : "text-muted-foreground")}>
          streak ×{Math.max(1, streak)}
        </span>
        <span className="ml-auto font-display text-2xl text-primary glow-green">
          {score.toLocaleString()} pts
        </span>
      </div>

      {/* target + timer */}
      <div className={cn("rounded-lg border-2 bg-card p-6 text-center transition-colors", flash === "hit" ? "border-primary" : flash === "miss" ? "border-red-500 animate-shake" : "border-border")}>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">build this number</p>
        <p className="font-display text-5xl sm:text-6xl text-primary glow-green">{target}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          you have: <span className={cn("font-bold", value === target ? "text-primary" : "text-foreground")}>{value}</span>
        </p>
        <div className="mx-auto mt-4 h-2.5 w-full max-w-sm overflow-hidden rounded-sm border border-border bg-secondary">
          <div
            className={cn("h-full transition-[width] duration-100", timeLeft / roundDur > 0.35 ? "bg-primary" : "bg-red-500")}
            style={{ width: `${(timeLeft / roundDur) * 100}%` }}
          />
        </div>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          <TimerIcon className="mr-1 inline h-3 w-3" aria-hidden />
          {timeLeft.toFixed(1)}s — keys 1-8 flip bits
        </p>
      </div>

      {/* bits */}
      <div className="grid grid-cols-8 gap-1.5">
        {bits.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => flip(i)}
            aria-pressed={!!b}
            aria-label={`toggle bit worth ${BIT_VALUES[i]}`}
            className={cn(
              "flex flex-col items-center gap-1 rounded-md border py-3 transition-all term-focus active:translate-y-px",
              b ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-secondary/40 text-muted-foreground/60 hover:border-primary/40",
            )}
          >
            <span className="font-display text-2xl leading-none">{b}</span>
            <span className="font-mono text-[9px] text-muted-foreground">{BIT_VALUES[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- game 2: command rush ---------------- */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type RushQ = { q: QuizQuestion; courseTitle: string; courseId: string };

function CommandRush({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [deck, setDeck] = useState<RushQ[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const recordScore = useArcade((s) => s.recordScore);
  const [result, setResult] = useState<{ score: number; best: number; isBest: boolean; lines: string[] } | null>(null);

  // the full question bank — 237 real questions from the courses
  const bank = useMemo<RushQ[]>(
    () =>
      ALL_LESSONS.flatMap((r) =>
        r.lesson.quiz.map((q) => ({ q, courseTitle: r.course.title, courseId: r.course.id })),
      ),
    [],
  );

  const onEnd = useCallback(() => {
    sfx.defeat();
    const acc = answered === 0 ? 0 : Math.round((correct / answered) * 100);
    const r = recordScore("command-rush", score);
    setResult({
      score,
      best: r.best,
      isBest: r.isBest,
      lines: [
        `answered: ${answered} — correct: ${correct}`,
        `accuracy: ${acc}% — best streak: ${bestStreak}`,
        `the clock always wins. reload and go again.`,
      ],
    });
    setPhase("over");
  }, [answered, correct, score, bestStreak, recordScore]);

  const timeLeft = useCountdown(phase === "playing", 60, onEnd);

  function start() {
    setDeck(shuffle(bank));
    setQi(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setAnswered(0);
    setResult(null);
    setPhase("playing");
    sfx.roundStart();
  }

  function pick(oi: number) {
    if (picked !== null || phase !== "playing") return;
    setPicked(oi);
    const cur = deck[qi];
    const hit = oi === cur.q.answer;
    setAnswered((a) => a + 1);
    if (hit) {
      sfx.correct();
      setCorrect((c) => c + 1);
      const mult = Math.max(1, streak);
      setScore((s) => s + 100 + mult * 10);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      sfx.wrong();
      setStreak(0);
    }
    window.setTimeout(() => {
      setPicked(null);
      setQi((i) => i + 1);
    }, hit ? 650 : 1400);
  }

  if (phase === "ready") {
    return (
      <ReadyPanel
        title="command_rush"
        desc="Sixty seconds. Every multiple-choice question the academy owns — 237 of them — shuffled and fired at you one by one. Correct answers chain into streak multipliers. Wrong answers break the chain but cost nothing but pride."
        onExit={onExit}
        onStart={start}
      />
    );
  }

  if (phase === "over" && result) {
    return (
      <GameOverPanel
        title="command_rush"
        score={result.score}
        unit="pts"
        best={result.best}
        isBest={result.isBest}
        lines={result.lines}
        onReplay={start}
        onExit={onExit}
      />
    );
  }

  const cur = deck[qi];
  if (!cur) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="font-mono text-sm text-muted-foreground">bank exhausted — you animal.</p>
        <button
          type="button"
          onClick={start}
          className="mt-4 rounded-md border-2 border-primary bg-primary px-5 py-2.5 font-display text-lg uppercase text-primary-foreground term-focus"
        >
          reload deck
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {cur.courseTitle}
        </span>
        <span className={cn("font-mono text-xs uppercase tracking-widest", streak > 1 ? "text-primary" : "text-muted-foreground")}>
          streak ×{Math.max(1, streak)}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {correct}/{answered} hit
        </span>
        <span className="ml-auto font-display text-2xl text-primary glow-green">
          {score.toLocaleString()} pts
        </span>
      </div>

      {/* timer */}
      <div className="h-2 w-full overflow-hidden rounded-sm border border-border bg-secondary">
        <div
          className={cn("h-full transition-[width] duration-100", timeLeft > 10 ? "bg-primary" : "bg-red-500")}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
          role="progressbar"
          aria-valuenow={timeLeft}
          aria-label="seconds left"
        />
      </div>
      <p className="text-center font-mono text-[11px] text-muted-foreground">{Math.ceil(timeLeft)}s left</p>

      {/* question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qi}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18 }}
          className="rounded-lg border border-border bg-card p-4 sm:p-6"
        >
          <p className="mb-4 text-[15px] font-medium leading-7 text-foreground">{cur.q.q}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {cur.q.options.map((opt, oi) => {
              const isSelected = picked === oi;
              const isAnswer = cur.q.answer === oi;
              const reveal = picked !== null && (isSelected || isAnswer);
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => pick(oi)}
                  disabled={picked !== null}
                  className={cn(
                    "flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-left text-sm leading-6 transition-colors term-focus",
                    reveal && isAnswer && "border-emerald-500/60 bg-emerald-500/10",
                    reveal && isSelected && !isAnswer && "border-red-500/60 bg-red-500/10",
                    !reveal && "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/60",
                    picked !== null && "cursor-default",
                  )}
                >
                  <span className="mt-0.5 font-mono text-xs text-muted-foreground" aria-hidden>
                    {String.fromCharCode(65 + oi)}.
                  </span>
                  <span className="flex-1 text-foreground/90">{opt}</span>
                  {reveal && isAnswer ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden /> : null}
                  {reveal && isSelected && !isAnswer ? <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
          {picked !== null ? (
            <p className={cn("mt-3 rounded border px-3 py-2 font-mono text-xs animate-rise", picked === cur.q.answer ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" : "border-red-500/30 bg-red-500/5 text-red-300")}>
              {picked === cur.q.answer ? `+${100 + Math.max(1, streak) * 10} — streak ×${Math.max(1, streak)}` : `chain broken — ${cur.q.explain}`}
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- game 3: phishing spotter ---------------- */

type SiteVerdict = { url: string; phish: boolean; why: string };

const SITES: SiteVerdict[] = [
  { url: "https://www.github.com/settings/security", phish: false, why: "Genuine domain: github.com. Paths after the slash belong to the real site." },
  { url: "https://github-secure-login.com/signin", phish: true, why: "The domain is github-secure-login.com — everything before the first single slash is the domain, and it is NOT github.com." },
  { url: "https://paypa1.com/checkout", phish: true, why: "The l in paypal was swapped for the digit 1 — a classic homoglyph." },
  { url: "https://www.paypal.com/uk/signin", phish: false, why: "Real paypal.com — country subfolders are normal on genuine sites." },
  { url: "https://accounts.google.com.oauth-verify.net/gmail", phish: true, why: "Read right-to-left: the true domain is oauth-verify.net. accounts.google.com is only a subdomain decoy." },
  { url: "https://safedom.com@phish-labs.net/login", phish: true, why: "Everything before @ is ignored — the browser goes to phish-labs.net." },
  { url: "https://login.microsoftonline.com/common/oauth2/authorize", phish: false, why: "Microsoft's genuine login domain — long, but the domain part is microsoftonline.com." },
  { url: "https://micros0ft-login.com/verify", phish: true, why: "Homoglyph again: micros0ft with a zero." },
  { url: "https://www.amazon.com/dp/B08N5WRWNW", phish: false, why: "Genuine amazon.com product path." },
  { url: "https://amazon.deals-shop.net/prime", phish: true, why: "The domain is deals-shop.net — amazon is just the subdomain." },
  { url: "https://mail.proton.me/inbox", phish: false, why: "Genuine proton.me mail domain." },
  { url: "https://proton-support.desk-portal.co/ticket", phish: true, why: "Real domain: desk-portal.co. Support portals are the favorite phish costume." },
  { url: "https://xn--pple-43d.com/appleid", phish: true, why: "Punycode: those xn-- prefixes encode look-alike unicode characters. The domain is not apple." },
  { url: "https://www.cloudflare.com/dns/", phish: false, why: "Genuine cloudflare.com." },
  { url: "https://cloudflare-verify.account-renew.info", phish: true, why: "The true domain is account-renew.info at the end." },
  { url: "https://outlook.office365.com/mail", phish: false, why: "Microsoft's genuine office365 domain." },
  { url: "http://192.168.0.1:8080/router-login", phish: false, why: "A private LAN address — your own router. Odd http port, but not a domain spoof." },
  { url: "https://xn--twiter-4va.com/home", phish: true, why: "Punycode again — 'twiter' with one t hidden in unicode." },
];

function PhishingSpotter({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [deck, setDeck] = useState<SiteVerdict[]>([]);
  const [si, setSi] = useState(0);
  const [picked, setPicked] = useState<"legit" | "phish" | null>(null);
  const [missed, setMissed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [round, setRound] = useState(1);

  const recordScore = useArcade((s) => s.recordScore);
  const [result, setResult] = useState<{ score: number; best: number; isBest: boolean; lines: string[] } | null>(null);

  const cur = deck[si];

  const advance = useCallback((hit: boolean) => {
    const nl = hit ? lives : lives - 1;
    const mult = Math.max(1, streak);
    const gained = hit ? 100 + mult * 10 : 0;
    const newScore = score + gained;
    if (hit) {
      setScore(newScore);
      setStreak((s) => s + 1);
    } else {
      sfx.heartLose();
      setStreak(0);
      setLives(nl);
    }
    window.setTimeout(() => {
      setPicked(null);
      setMissed(false);
      setRound((r) => r + 1);
      const next = si + 1;
      if (nl <= 0) {
        const r = recordScore("phishing-spotter", newScore);
        sfx.defeat();
        setResult({
          score: newScore,
          best: r.best,
          isBest: r.isBest,
          lines: [`domains judged: ${round}`, "the phishers got you — read domains right-to-left next run"],
        });
        setPhase("over");
      } else if (next >= deck.length) {
        // survived the whole deck
        const bonus = 500 + nl * 200;
        const total = newScore + bonus;
        const r = recordScore("phishing-spotter", total);
        sfx.victory();
        setResult({
          score: total,
          best: r.best,
          isBest: r.isBest,
          lines: [`cleared the whole deck with ${nl} heart${nl === 1 ? "" : "s"} left`, `deck-clear bonus: +${bonus}`],
        });
        setPhase("over");
      } else {
        setSi(next);
      }
    }, 1700);
  }, [streak, lives, round, si, score, deck.length, recordScore]);

  const onTimeout = useCallback(() => {
    sfx.wrong();
    setMissed(true);
    advance(false);
  }, [advance]);

  const timeLeft = useCountdown(phase === "playing" && picked === null && !missed, 9, onTimeout);

  function start() {
    setDeck(shuffle(SITES));
    setSi(0);
    setPicked(null);
    setMissed(false);
    setScore(0);
    setStreak(0);
    setLives(3);
    setRound(1);
    setResult(null);
    setPhase("playing");
    sfx.roundStart();
  }

  if (phase === "ready") {
    return (
      <ReadyPanel
        title="phishing_spotter"
        desc="A URL flashes on screen. Is it the real site — or a look-alike trap? Judge fast: nine seconds per domain, wrong calls cost a heart. The rule that wins runs: read a domain right-to-left from the last dot."
        onExit={onExit}
        onStart={start}
      />
    );
  }

  if (phase === "over" && result) {
    return (
      <GameOverPanel
        title="phishing_spotter"
        score={result.score}
        unit="pts"
        best={result.best}
        isBest={result.isBest}
        lines={result.lines}
        onReplay={start}
        onExit={onExit}
      />
    );
  }

  const reveal = picked !== null || missed;
  const hit = reveal && !missed && ((picked === "phish") === (cur?.phish ?? false));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">domain {round}/{deck.length}</span>
        <span className="flex items-center gap-1" aria-label={`${lives} lives`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={cn("h-4 w-4", i < lives ? "fill-red-500 text-red-500" : "text-border")} aria-hidden />
          ))}
        </span>
        <span className={cn("font-mono text-xs uppercase tracking-widest", streak > 1 ? "text-primary" : "text-muted-foreground")}>
          streak ×{Math.max(1, streak)}
        </span>
        <span className="ml-auto font-display text-2xl text-primary glow-green">{score.toLocaleString()} pts</span>
      </div>

      {/* the url card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={si}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22 }}
          className={cn(
            "rounded-lg border-2 bg-card p-6 text-center transition-colors",
            !reveal ? "border-border" : hit ? "border-emerald-500/60" : "border-red-500/60 animate-shake",
          )}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {missed ? "too slow — it got away with your click" : !reveal ? "legitimate or phish?" : hit ? "correct call" : "you took the bait"}
          </p>
          <p
            className={cn(
              "mx-auto mt-3 max-w-lg break-all rounded-md border bg-[#050806] px-4 py-3 font-mono text-sm leading-6 sm:text-base",
              !reveal ? "border-border text-foreground" : hit ? "border-emerald-500/40 text-emerald-200" : "border-red-500/40 text-red-200",
            )}
          >
            {cur?.url}
          </p>
          {reveal ? (
            <div className="mt-4">
              <p className="font-display text-2xl uppercase" style={{ color: hit ? "#22e394" : "#ff5468" }}>
                {cur.phish ? "it was a phish" : "it was legitimate"}
              </p>
              <p className="mx-auto mt-2 max-w-md font-mono text-xs leading-5 text-muted-foreground animate-rise">
                {cur?.why}
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded-sm border border-border bg-secondary">
              <div
                className={cn("h-full transition-[width] duration-100", timeLeft > 3 ? "bg-primary" : "bg-red-500")}
                style={{ width: `${(timeLeft / 9) * 100}%` }}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* verdict buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={reveal}
          onClick={() => {
            sfx.click();
            setPicked("legit");
            advance((cur?.phish ?? true) === false);
          }}
          className={cn(
            "rounded-md border-2 px-4 py-3 font-display text-xl uppercase term-focus active:translate-y-px",
            !reveal
              ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
              : picked === "legit"
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                : "border-border bg-secondary text-muted-foreground",
          )}
        >
          ✓ legitimate
        </button>
        <button
          type="button"
          disabled={reveal}
          onClick={() => {
            sfx.click();
            setPicked("phish");
            advance((cur?.phish ?? false) === true);
          }}
          className={cn(
            "rounded-md border-2 px-4 py-3 font-display text-xl uppercase term-focus active:translate-y-px",
            !reveal
              ? "border-red-500/60 bg-red-500/15 text-red-300 hover:bg-red-500/25"
              : picked === "phish"
                ? "border-red-500 bg-red-500/20 text-red-300"
                : "border-border bg-secondary text-muted-foreground",
          )}
        >
          ⚠ phishing
        </button>
      </div>
    </div>
  );
}

/* ---------------- game 4: type rush ---------------- */

const COMMANDS: Array<{ cmd: string; desc: string }> = [
  { cmd: "cd ~/projects && ls -la", desc: "jump to your projects, list everything" },
  { cmd: "grep -rn 'TODO' ./src", desc: "hunt unfinished work recursively" },
  { cmd: "git commit -am \"fix: edge case\"", desc: "stage and commit in one move" },
  { cmd: "chmod +x deploy.sh", desc: "make the deploy script executable" },
  { cmd: "tar -xzvf backup.tar.gz", desc: "unpack a gzip archive verbosely" },
  { cmd: "ps aux | grep node", desc: "find your node processes" },
  { cmd: "kill -9 1337", desc: "terminate without mercy" },
  { cmd: "df -h", desc: "disk free, human readable" },
  { cmd: "du -sh ./*", desc: "who is eating the disk" },
  { cmd: "curl -I https://example.com", desc: "peek at response headers" },
  { cmd: "ping -c 4 1.1.1.1", desc: "check the wire, four packets" },
  { cmd: "man tmux", desc: "read the manual" },
  { cmd: "source venv/bin/activate", desc: "enter the python realm" },
  { cmd: "docker compose up -d", desc: "raise the fleet, detached" },
  { cmd: "npm run build -- --profile", desc: "build with the profiler on" },
  { cmd: "rg 'password' --hidden", desc: "search secrets including dotfiles" },
  { cmd: "ln -s /var/log/syslog system.log", desc: "symlink a log for easy reach" },
  { cmd: "find . -name '*.ts' -mtime -7", desc: "typescript files touched this week" },
  { cmd: "history | tail -20", desc: "your last twenty commands" },
  { cmd: "sudo apt update && sudo apt upgrade", desc: "refresh and upgrade the system" },
];

const ROUNDS = 5;

function TypeRush({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [deck, setDeck] = useState<typeof COMMANDS>([]);
  const [ri, setRi] = useState(0);
  const [typed, setTyped] = useState("");
  const [roundStart, setRoundStart] = useState(0);
  const [totalMs, setTotalMs] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const recordScore = useArcade((s) => s.recordScore);
  const [result, setResult] = useState<{ score: number; best: number; isBest: boolean; lines: string[] } | null>(null);

  const cur = deck[ri];

  function start() {
    setDeck(shuffle(COMMANDS).slice(0, ROUNDS));
    setRi(0);
    setTyped("");
    setTotalMs(0);
    setErrors(0);
    setResult(null);
    setRoundStart(performance.now());
    setPhase("playing");
    sfx.roundStart();
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  function onType(v: string) {
    if (phase !== "playing" || !cur) return;
    if (v.length > typed.length && v[v.length - 1] !== cur.cmd[v.length - 1]) {
      sfx.wrong();
      setErrors((e) => e + 1);
    } else if (v.length > typed.length) {
      sfx.key();
    }
    setTyped(v.slice(0, cur.cmd.length));
    if (v === cur.cmd) {
      const ms = performance.now() - roundStart;
      setTotalMs((t) => t + ms);
      sfx.correct();
      const next = ri + 1;
      window.setTimeout(() => {
        if (next >= ROUNDS) {
          finishRound();
        } else {
          setRi(next);
          setTyped("");
          setRoundStart(performance.now());
        }
      }, 350);
    }
  }

  function finishRound() {
    const minutes = Math.max(totalMs / 60000, 1 / 60000);
    const chars = deck.reduce((s, d) => s + d.cmd.length, 0);
    const wpm = Math.round((chars / 5) / minutes);
    const accuracy = Math.max(0, 100 - Math.round((errors / Math.max(1, chars)) * 100));
    const score = Math.max(1, Math.round(wpm * (accuracy / 100)));
    const r = recordScore("type-rush", score);
    sfx.victory();
    setResult({
      score,
      best: r.best,
      isBest: r.isBest,
      lines: [
        `gross wpm: ${wpm} — accuracy: ${accuracy}%`,
        `commands typed: ${ROUNDS} — typos: ${errors}`,
        `score = wpm × accuracy. typos are expensive.`,
      ],
    });
    setPhase("over");
  }

  if (phase === "ready") {
    return (
      <ReadyPanel
        title="type_rush"
        desc={`Five real terminal commands, one after another. Type them exactly — quotes, flags, dots — and finish all five as fast as you can. Your gross WPM is multiplied by accuracy: typos are expensive.`}
        onExit={onExit}
        onStart={start}
      />
    );
  }

  if (phase === "over" && result) {
    return (
      <GameOverPanel
        title="type_rush"
        score={result.score}
        unit="wpm"
        best={result.best}
        isBest={result.isBest}
        lines={result.lines}
        onReplay={start}
        onExit={onExit}
      />
    );
  }

  // per-char rendering
  const chars = cur ? cur.cmd.split("") : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          command {ri + 1}/{ROUNDS}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          typos: <span className={cn(errors > 0 ? "text-red-400" : "text-muted-foreground")}>{errors}</span>
        </span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {((performance.now() - roundStart) / 1000).toFixed(1)}s this round
        </span>
      </div>

      <div className="rounded-lg border-2 border-border bg-card p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          type this — <span className="text-foreground/80">{cur?.desc}</span>
        </p>
        <div className="mt-3 overflow-x-auto rounded-md border border-border bg-[#050806] px-4 py-3">
          <p className="font-mono text-base leading-7 whitespace-pre" aria-label="command to type">
            {chars.map((ch, i) => {
              const state = i < typed.length ? (typed[i] === ch ? "ok" : "bad") : i === typed.length ? "cur" : "todo";
              return (
                <span
                  key={i}
                  className={cn(
                    state === "ok" && "text-primary",
                    state === "bad" && "bg-red-500/25 text-red-400",
                    state === "todo" && "text-muted-foreground/50",
                  )}
                >
                  {ch}
                </span>
              );
            })}
            {typed.length >= (cur?.cmd.length ?? 0) ? <span className="text-primary"> ✓</span> : null}
          </p>
        </div>
        {/* invisible-real input captures keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={(e) => onType(e.target.value)}
          className="mt-4 w-full rounded-md border border-primary/40 bg-[#050806] px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
          placeholder="type the command here…"
          aria-label="type the command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          progress {typed.length}/{cur?.cmd.length} — accuracy feeds the multiplier
        </p>
      </div>
    </div>
  );
}

/* ---------------- ready panel ---------------- */

function ReadyPanel({
  title,
  desc,
  onStart,
  onExit,
}: {
  title: string;
  desc: string;
  onStart: () => void;
  onExit: () => void;
}) {
  return (
    <div className="rounded-lg border-2 border-primary/40 bg-primary/5 p-6 sm:p-8">
      <h3 className="font-display text-3xl uppercase text-primary glow-green sm:text-4xl">{title}</h3>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-foreground/85">{desc}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onStart}
          className="flex items-center justify-center gap-2 rounded-md border-2 border-primary bg-primary px-6 py-3 font-display text-xl uppercase text-primary-foreground term-focus hover:brightness-110 active:translate-y-px animate-pulse-glow"
        >
          insert coin
        </button>
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onExit();
          }}
          className="rounded-md border border-border bg-secondary px-5 py-3 font-mono text-sm uppercase text-muted-foreground term-focus hover:text-foreground"
        >
          back to arcade
        </button>
      </div>
    </div>
  );
}
