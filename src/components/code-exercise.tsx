"use client";

import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/data/types";
import { getRunner, type RunResult } from "@/lib/runner";
import { cn } from "@/lib/utils";
import { Play, Lightbulb, RotateCcw, KeyRound, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TermWindow } from "@/components/term-ui";

/**
 * Interactive coding exercise: editor + sandboxed runner + auto-graded checks.
 * The boot.dev-style "Training Grounds".
 */
export function CodeExercise({
  exercise,
  onPass,
  initiallyPassed,
}: {
  exercise: Exercise;
  onPass: () => void;
  initiallyPassed?: boolean;
}) {
  const [code, setCode] = useState(exercise.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [passed, setPassed] = useState(!!initiallyPassed);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(exercise.starter);
    setResult(null);
    setHintsShown(0);
    setShowSolution(false);
    setPassed(!!initiallyPassed);
  }, [exercise, initiallyPassed]);

  async function run() {
    if (running) return;
    setRunning(true);
    try {
      const r = await getRunner().run(code, exercise.tests);
      setResult(r);
      const allPass =
        r.results !== null && r.results.length > 0 && r.results.every((t) => t.pass);
      if (allPass && !passed) {
        setPassed(true);
        onPass();
        toast.success("All checks passed. Training Grounds cleared.", {
          description: "+5 bonus XP on completion",
        });
      }
    } finally {
      setRunning(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = code.slice(0, start) + "  " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void run();
    }
  }

  const passCount = result?.results?.filter((t) => t.pass).length ?? 0;
  const totalCount = exercise.tests.length;

  return (
    <div className="space-y-4">
      {/* prompt */}
      <div className="space-y-3">
        {exercise.prompt.map((p, i) => (
          <p key={i} className="text-[15px] leading-7 text-foreground/90">
            {p}
          </p>
        ))}
      </div>

      {/* editor */}
      <TermWindow
        title="training_grounds.js"
        bodyClassName="p-0"
      >
        <textarea
          ref={taRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Code editor — write your solution here"
          className="block min-h-[240px] w-full resize-y bg-[#050806] p-4 font-mono text-[13px] leading-6 text-emerald-100 caret-emerald-400 outline-none sm:min-h-[200px]"
        />
        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-secondary/40 px-3 py-2.5">
          <button
            type="button"
            onClick={() => void run()}
            disabled={running}
            className={cn(
              "flex items-center gap-2 rounded-md border border-primary/50 bg-primary/15 px-3.5 py-2 font-mono text-sm font-bold text-primary term-focus",
              "hover:bg-primary/25 active:translate-y-px disabled:opacity-50",
              passed && "border-emerald-500/50",
            )}
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
            {running ? "running..." : "run checks"}
          </button>
          {exercise.hints.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                setHintsShown((h) => (h < exercise.hints.length ? h + 1 : h))
              }
              disabled={hintsShown >= exercise.hints.length}
              className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-mono text-xs text-amber-400 term-focus hover:bg-amber-500/20 disabled:opacity-40"
            >
              <Lightbulb className="h-3.5 w-3.5" aria-hidden />
              hint {hintsShown}/{exercise.hints.length}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setCode(exercise.starter);
              setResult(null);
            }}
            className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-2 font-mono text-xs text-muted-foreground term-focus hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            reset
          </button>
          <button
            type="button"
            onClick={() => setShowSolution((s) => !s)}
            className="ml-auto flex items-center gap-2 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 py-2 font-mono text-xs text-violet-400 term-focus hover:bg-violet-500/20"
          >
            <KeyRound className="h-3.5 w-3.5" aria-hidden />
            {showSolution ? "hide" : "peek"} solution
          </button>
        </div>
      </TermWindow>

      {/* hints */}
      {hintsShown > 0 ? (
        <div className="space-y-2 animate-rise">
          {exercise.hints.slice(0, hintsShown).map((h, i) => (
            <div
              key={i}
              className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm leading-6 text-foreground/85"
            >
              <span className="font-mono text-xs font-bold uppercase text-amber-400">
                hint {i + 1} —{" "}
              </span>
              {h}
            </div>
          ))}
        </div>
      ) : null}

      {/* solution */}
      {showSolution ? (
        <div className="animate-rise">
          <TermWindow title="solution.js">
            <pre className="overflow-x-auto font-mono text-[13px] leading-6 text-violet-200/90">
              <code>{exercise.solution}</code>
            </pre>
          </TermWindow>
          <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
            studying a solution is learning too — but typing it yourself makes it stick
          </p>
        </div>
      ) : null}

      {/* output */}
      {result ? (
        <div className="space-y-3 animate-rise">
          {result.error ? (
            <div className="rounded-md border border-red-500/40 bg-red-500/5 p-3">
              <p className="mb-1 font-mono text-xs font-bold uppercase text-red-400">
                runtime error
              </p>
              <pre className="overflow-x-auto font-mono text-[12.5px] leading-5 text-red-200/90">
                <code>{result.error}</code>
              </pre>
            </div>
          ) : null}

          {result.results ? (
            <div className="rounded-md border border-border bg-card p-3 sm:p-4">
              <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                checks — {passCount}/{totalCount} passing
              </p>
              <ul className="space-y-1.5">
                {result.results.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {t.pass ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
                    )}
                    <span className={t.pass ? "text-foreground/85" : "text-foreground/60"}>
                      <span className="font-mono text-xs">{t.name}</span>
                      {!t.pass && t.error ? (
                        <span className="block font-mono text-[11px] text-red-300/70">
                          {t.error}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
              {passCount === totalCount && totalCount > 0 ? (
                <p className="mt-3 rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 font-mono text-sm font-bold text-emerald-400 glow-green">
                  ALL CHECKS PASSED
                </p>
              ) : null}
            </div>
          ) : null}

          {result.logs.length > 0 ? (
            <TermWindow title="console" bodyClassName="p-3">
              <pre className="max-h-56 overflow-y-auto font-mono text-[12.5px] leading-5 text-foreground/80">
                <code>
                  {result.logs.map((l, i) => (
                    <span key={i} className="block">
                      <span className="text-primary select-none" aria-hidden>
                        &raquo;{" "}
                      </span>
                      {l}
                    </span>
                  ))}
                </code>
              </pre>
            </TermWindow>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
