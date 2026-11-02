"use client";

import { useRef, useState } from "react";
import type { Lesson } from "@/data/types";
import { cn } from "@/lib/utils";
import { Swords, Heart, Skull, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "intro" | "fighting" | "victory" | "defeat";

const PLAYER_HP = 3;

export function BossBattle({
  lesson,
  onFinish,
  colorHex,
}: {
  lesson: Lesson;
  onFinish: (flawless: boolean) => void;
  colorHex: string;
}) {
  const boss = lesson.boss!;
  const [phase, setPhase] = useState<Phase>("intro");
  const [stage, setStage] = useState(0);
  const [hearts, setHearts] = useState(PLAYER_HP);
  const [picked, setPicked] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  const finishedRef = useRef(false);

  const current = boss.stages[stage];
  const totalStages = boss.stages.length;

  function answer(oi: number) {
    if (picked !== null) return;
    setPicked(oi);
    const correct = oi === current.answer;
    setTimeout(() => {
      if (correct) {
        if (stage + 1 >= totalStages) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            onFinish(hearts === PLAYER_HP);
          }
          setPhase("victory");
        } else {
          setBossHit(true);
          setTimeout(() => setBossHit(false), 500);
          setStage((s) => s + 1);
          setPicked(null);
        }
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        const nextHearts = hearts - 1;
        setHearts(nextHearts);
        if (nextHearts <= 0) {
          setPhase("defeat");
        } else {
          setPicked(null);
        }
      }
    }, 1600);
  }

  function restart() {
    setStage(0);
    setHearts(PLAYER_HP);
    setPicked(null);
    setPhase("fighting");
  }

  const bossHpPct = Math.round(((totalStages - stage) / totalStages) * 100);

  return (
    <div className="space-y-6">
      {/* boss header */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-red-500/40 bg-gradient-to-b from-red-950/40 to-card p-5 sm:p-8 text-center",
          shake && "animate-shake",
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(255,60,80,0.06)_4px)]" aria-hidden />
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-red-400">
          boss encounter
        </p>
        <h2 className="font-display mt-1 text-3xl sm:text-4xl uppercase text-red-300 glow-red">
          {boss.name}
        </h2>

        {/* boss art + hp */}
        <div className={cn("mt-4 inline-block", bossHit && "animate-pop")}>
          {boss.art ? (
            <pre className="font-mono text-[10px] sm:text-[13px] leading-tight text-red-200/90" aria-hidden>
              {boss.art}
            </pre>
          ) : null}
        </div>

        <div className="mx-auto mt-5 max-w-md">
          <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase text-red-400">
            <span>boss integrity</span>
            <span>
              {totalStages - stage}/{totalStages} shields
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-sm border border-red-500/40 bg-black/60">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"
              style={{ width: `${bossHpPct}%` }}
            />
          </div>
        </div>

        {/* player hearts */}
        <div className="mt-4 flex items-center justify-center gap-2" aria-label="your hit points">
          <span className="font-mono text-[11px] uppercase text-muted-foreground mr-1">you</span>
          {Array.from({ length: PLAYER_HP }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "h-5 w-5 transition-all",
                i < hearts ? "fill-red-500 text-red-500" : "text-border",
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-lg border border-border bg-card p-5 sm:p-6"
          >
            <p className="text-[15px] leading-7 text-foreground/90">{boss.intro}</p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              rules of engagement: {totalStages} questions — each correct answer breaks one shield.
              wrong answers cost you a heart. three hearts, no retries mid-fight, defeat just means
              trying again smarter.
            </p>
            <button
              type="button"
              onClick={() => setPhase("fighting")}
              className="mt-5 flex items-center gap-2 rounded-md border-2 border-red-500/60 bg-red-500/15 px-6 py-3 font-display text-xl uppercase text-red-300 term-focus hover:bg-red-500/25 active:translate-y-px animate-pulse-glow"
            >
              <Swords className="h-5 w-5" aria-hidden />
              engage
            </button>
          </motion.div>
        ) : null}

        {phase === "fighting" && current ? (
          <motion.div
            key={`fight-${stage}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="rounded-lg border border-border bg-card p-4 sm:p-6"
          >
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-red-400">
              <Skull className="h-4 w-4" aria-hidden />
              shield {stage + 1} of {totalStages}
            </p>
            <p className="mb-4 text-[15px] font-medium leading-7 text-foreground">{current.question}</p>

            {current.code ? (
              <pre className="mb-4 overflow-x-auto rounded border border-border bg-[#050806] p-3 font-mono text-[12.5px] leading-5 text-emerald-100/90">
                <code>{current.code}</code>
              </pre>
            ) : null}

            <div className="space-y-2">
              {current.options.map((opt, oi) => {
                const isSelected = picked === oi;
                const isAnswer = current.answer === oi;
                const reveal = picked !== null && (isSelected || isAnswer);
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => answer(oi)}
                    disabled={picked !== null}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm leading-6 transition-colors term-focus",
                      "hover:border-red-500/50 hover:bg-secondary/60",
                      reveal && isAnswer && "border-emerald-500/60 bg-emerald-500/10",
                      reveal && isSelected && !isAnswer && "border-red-500/70 bg-red-500/15",
                      !reveal && "border-border bg-secondary/30",
                    )}
                  >
                    <span className="mt-0.5 font-mono text-xs text-muted-foreground" aria-hidden>
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    <span className="flex-1 text-foreground/90">{opt}</span>
                  </button>
                );
              })}
            </div>

            {picked !== null ? (
              <div
                className={cn(
                  "mt-3 rounded border px-3 py-2 text-sm leading-6 animate-rise",
                  picked === current.answer
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-red-500/40 bg-red-500/10",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs font-bold uppercase",
                    picked === current.answer ? "text-emerald-400" : "text-red-400",
                  )}
                >
                  {picked === current.answer ? "shield broken — " : "you take the hit — "}
                </span>
                <span className="text-foreground/85">{current.explain}</span>
              </div>
            ) : null}
          </motion.div>
        ) : null}

        {phase === "victory" ? (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border-2 border-emerald-500/50 bg-emerald-500/5 p-6 text-center sm:p-10"
          >
            <Trophy className="mx-auto h-12 w-12 text-emerald-400" aria-hidden />
            <h3 className="font-display mt-3 text-3xl uppercase text-emerald-400 glow-green sm:text-4xl">
              {boss.name} defeated
            </h3>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              {hearts === PLAYER_HP
                ? "flawless victory — full shield bonus"
                : `cleared with ${hearts} heart${hearts === 1 ? "" : "s"} to spare`}
            </p>
            <p className="mt-4 font-display text-2xl text-primary glow-green">
              +{lesson.xp} XP
            </p>
          </motion.div>
        ) : null}

        {phase === "defeat" ? (
          <motion.div
            key="defeat"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border-2 border-red-500/50 bg-red-500/5 p-6 text-center sm:p-10"
          >
            <Skull className="mx-auto h-12 w-12 text-red-400" aria-hidden />
            <h3 className="font-display mt-3 text-3xl uppercase text-red-400 glow-red sm:text-4xl">
              you blacked out
            </h3>
            <p className="mt-2 text-sm leading-6 text-foreground/80">
              The boss remains standing — but bosses don&apos;t heal, and you keep everything you
              learned. Re-read the chapter, then strike again.
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-6 inline-flex items-center gap-2 rounded-md border-2 border-red-500/60 bg-red-500/15 px-6 py-3 font-display text-xl uppercase text-red-300 term-focus hover:bg-red-500/25 active:translate-y-px"
            >
              <RotateCcw className="h-5 w-5" aria-hidden />
              retry fight
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {phase === "victory" ? (
        <div className="flex justify-center">
          <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            progress banked — use the continue bar below to keep moving
          </p>
        </div>
      ) : null}
    </div>
  );
}
