"use client";

import { useEffect, useState } from "react";
import type { QuizQuestion } from "@/data/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";

type QState = {
  selected: number | null;
  revealed: boolean;
  firstTryCorrect: boolean;
};

export function QuizSection({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (perfect: boolean) => void;
}) {
  const [states, setStates] = useState<QState[]>(
    questions.map(() => ({ selected: null, revealed: false, firstTryCorrect: false })),
  );

  const allCorrect = states.every((s, i) => questions[i] && s.selected === questions[i].answer);

  useEffect(() => {
    if (questions.length && allCorrect) {
      onFinish(states.every((s) => s.firstTryCorrect));
    }
  }, [allCorrect]);

  function pick(qi: number, oi: number) {
    setStates((prev) => {
      const q = questions[qi];
      const cur = prev[qi];
      if (cur.selected === q.answer) return prev; // question already solved
      const next = [...prev];
      next[qi] = {
        selected: oi,
        revealed: true,
        firstTryCorrect: cur.firstTryCorrect || (oi === q.answer && cur.selected === null),
      };
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => {
        const st = states[qi];
        const solved = st.selected === q.answer;
        return (
          <div
            key={qi}
            className="rounded-md border border-border bg-card p-4 sm:p-5"
            role="group"
            aria-label={`Question ${qi + 1}`}
          >
            <p className="mb-3 flex gap-2 text-[15px] font-medium leading-6 text-foreground">
              <span className="font-mono text-primary select-none" aria-hidden>
                {String(qi + 1).padStart(2, "0")}&gt;
              </span>
              <span>{q.q}</span>
            </p>

            {q.code ? (
              <pre className="mb-3 overflow-x-auto rounded border border-border bg-[#050806] p-3 font-mono text-[12.5px] leading-5 text-emerald-100/90">
                <code>{q.code}</code>
              </pre>
            ) : null}

            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = st.selected === oi;
                const isAnswer = q.answer === oi;
                const showState = st.revealed && (isSelected || (solved && isAnswer));
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => pick(qi, oi)}
                    disabled={solved}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm leading-6 transition-colors term-focus",
                      "hover:border-primary/50 hover:bg-secondary/60",
                      showState && isAnswer && "border-emerald-500/60 bg-emerald-500/10",
                      showState && !isAnswer && isSelected && "border-red-500/60 bg-red-500/10",
                      !showState && "border-border bg-secondary/30",
                      solved && "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 font-mono text-xs",
                        showState && isAnswer && "text-emerald-400",
                        showState && !isAnswer && isSelected && "text-red-400",
                        !showState && "text-muted-foreground",
                      )}
                      aria-hidden
                    >
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    <span className="flex-1 text-foreground/90">{opt}</span>
                    {showState && isAnswer ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-label="correct" />
                    ) : null}
                    {showState && !isAnswer && isSelected ? (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-label="wrong" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {st.revealed ? (
              <div
                className={cn(
                  "mt-3 rounded border px-3 py-2 text-sm leading-6 animate-rise",
                  solved ? "border-emerald-500/30 bg-emerald-500/5 text-foreground/85" : "border-red-500/30 bg-red-500/5 text-foreground/85",
                )}
              >
                <span className={cn("font-mono text-xs font-bold uppercase", solved ? "text-emerald-400" : "text-red-400")}>
                  {solved ? "correct — " : "not quite — "}
                </span>
                {q.explain}
              </div>
            ) : null}
          </div>
        );
      })}
      <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        {allCorrect
          ? "knowledge check complete"
          : "answer every question to unlock completion — wrong answers can be retried"}
      </p>
    </div>
  );
}
