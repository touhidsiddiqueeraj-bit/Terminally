"use client";

import { useMemo, useState } from "react";
import { getLessonRef, nextLessonRef, lessonsOf } from "@/lib/content";
import { useAcademy, type CompleteResult } from "@/lib/store";
import { BADGE_BY_ID, levelTitle } from "@/lib/gamify";
import type { View } from "@/lib/nav";
import { courseColor, Icon } from "@/components/term-ui";
import { LessonBlocks } from "@/components/blocks";
import { QuizSection } from "@/components/quiz";
import { CodeExercise } from "@/components/code-exercise";
import { BossBattle } from "@/components/boss-battle";
import { ArrowLeft, Clock, Zap, Check, Lock, ChevronLeft, ChevronRight, Trophy, Flame, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

export function LessonView({ lessonId, go }: { lessonId: string; go: (v: View) => void }) {
  const ref = getLessonRef(lessonId);
  const lessons = useAcademy((s) => s.lessons);
  const completeLesson = useAcademy((s) => s.completeLesson);

  const [quizDone, setQuizDone] = useState(false);
  const [quizPerfect, setQuizPerfect] = useState(false);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [result, setResult] = useState<CompleteResult | null>(null);

  // NOTE: no reset-on-id effect needed — the app shell remounts this view
  // (keyed by lesson id) whenever the learner navigates between lessons.

  const record = lessons[lessonId];
  const isBoss = !!ref?.lesson.boss;

  const siblings = useMemo(() => (ref ? lessonsOf(ref.course.id) : []), [ref]);
  const next = useMemo(() => nextLessonRef(lessonId), [lessonId]);
  const prev = useMemo(() => {
    if (!ref) return null;
    return ref.index > 0 ? siblings[ref.index - 1] : null;
  }, [ref, siblings, lessonId]);

  if (!ref) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="font-mono text-sm text-muted-foreground">lesson not found: {lessonId}</p>
        <button
          type="button"
          onClick={() => go({ name: "dashboard" })}
          className="mt-4 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary term-focus hover:bg-primary/20"
        >
          back to base
        </button>
      </div>
    );
  }

  const c = courseColor(ref.course.id);
  const hasQuiz = ref.lesson.quiz.length > 0;
  const hasExercise = !!ref.lesson.exercise;
  const requirementsMet = (!hasQuiz || quizDone) && (!hasExercise || exerciseDone);
  const canComplete = requirementsMet && (quizDone || exerciseDone || isBoss);

  function handleComplete() {
    if (!canComplete || record) return;
    const r = completeLesson(lessonId, {
      quizPerfect,
      exerciseDone,
    });
    if (r) setResult(r);
  }

  return (
    <div className="space-y-8 pb-28">
      {/* header */}
      <div>
        <button
          type="button"
          onClick={() => go({ name: "course", courseId: ref.course.id })}
          className="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground term-focus hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {ref.course.title}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {isBoss ? (
            <span className="rounded border border-red-500/40 bg-red-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-red-400">
              boss battle
            </span>
          ) : null}
          {hasExercise ? (
            <span className="rounded border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-sky-300">
              coding drill
            </span>
          ) : null}
          {record ? (
            <span className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              cleared
            </span>
          ) : null}
          <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span>
              node {ref.index + 1}/{siblings.length}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {ref.lesson.minutes}m
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Zap className="h-3 w-3" aria-hidden />
              {ref.lesson.xp} xp
            </span>
          </span>
        </div>

        <h1
          className={cn(
            "font-display mt-2 text-3xl uppercase leading-tight sm:text-4xl",
            isBoss ? "text-red-300 glow-red" : cn(c.text, c.glow),
          )}
        >
          {ref.lesson.title}
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {ref.chapter.title}
        </p>
      </div>

      {/* boss encounters replace the normal flow */}
      {isBoss ? (
        <>
          <BossBattle
            lesson={ref.lesson}
            colorHex={c.hex}
            onFinish={(flawless) => {
              setQuizPerfect(flawless);
              const r = completeLesson(lessonId, { quizPerfect: flawless, exerciseDone: false });
              if (r) setResult(r);
            }}
          />
          <LessonBlocks blocks={ref.lesson.concept} />
        </>
      ) : (
        <>
          {/* concept */}
          <section aria-label="lesson content">
            <LessonBlocks blocks={ref.lesson.concept} />
          </section>

          {/* quiz */}
          {hasQuiz ? (
            <section aria-label="knowledge check">
              <h2 className="font-display mb-4 flex items-center gap-2 text-2xl uppercase text-amber-400 glow-amber">
                <span className="text-muted-foreground">$</span>knowledge_check
              </h2>
              <QuizSection
                questions={ref.lesson.quiz}
                onFinish={(perfect) => {
                  setQuizDone(true);
                  setQuizPerfect(perfect);
                }}
              />
            </section>
          ) : null}

          {/* exercise */}
          {hasExercise && ref.lesson.exercise ? (
            <section aria-label="coding exercise">
              <h2 className="font-display mb-4 flex items-center gap-2 text-2xl uppercase text-sky-300">
                <span className="text-muted-foreground">$</span>training_grounds
              </h2>
              <CodeExercise
                exercise={ref.lesson.exercise}
                initiallyPassed={record?.exerciseDone}
                onPass={() => setExerciseDone(true)}
              />
            </section>
          ) : null}
        </>
      )}

      {/* prev / next */}
      <nav className="flex items-center justify-between gap-3" aria-label="lesson navigation">
        {prev ? (
          <button
            type="button"
            onClick={() => go({ name: "lesson", lessonId: prev.id })}
            className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-muted-foreground term-focus hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{prev.lesson.title}</span>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => go({ name: "lesson", lessonId: next.id })}
            className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-muted-foreground term-focus hover:text-foreground"
          >
            <span className="truncate">{next.lesson.title}</span>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        ) : (
          <span />
        )}
      </nav>

      {/* sticky complete bar */}
      {!isBoss || record ? (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:bottom-0">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
              <span className={cn("flex items-center gap-1.5", quizDone || isBoss ? "text-primary" : hasQuiz ? "text-muted-foreground" : "text-muted-foreground/40")}>
                {quizDone || isBoss ? <Check className="h-3.5 w-3.5" /> : hasQuiz ? <Lock className="h-3 w-3" /> : null}
                {hasQuiz ? "quiz" : isBoss ? "boss" : "reading"}
              </span>
              {hasExercise ? (
                <span className={cn("flex items-center gap-1.5", exerciseDone || record?.exerciseDone ? "text-primary" : "text-muted-foreground")}>
                  {exerciseDone || record?.exerciseDone ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
                  code
                </span>
              ) : null}
              {record ? (
                <span className="text-primary">replay mode — no extra xp</span>
              ) : null}
            </div>
            {record ? (
              next ? (
                <button
                  type="button"
                  onClick={() => go({ name: "lesson", lessonId: next.id })}
                  className="rounded-md border-2 border-primary/60 bg-primary/15 px-5 py-2.5 font-display text-lg uppercase text-primary term-focus hover:bg-primary/25"
                >
                  next mission →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => go({ name: "course", courseId: ref.course.id })}
                  className="rounded-md border-2 border-primary/60 bg-primary/15 px-5 py-2.5 font-display text-lg uppercase text-primary term-focus hover:bg-primary/25"
                >
                  course map →
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={!canComplete}
                className={cn(
                  "rounded-md border-2 px-5 py-2.5 font-display text-lg uppercase transition-all term-focus",
                  canComplete
                    ? "border-primary bg-primary text-primary-foreground hover:brightness-110 active:translate-y-px animate-pulse-glow"
                    : "cursor-not-allowed border-border bg-secondary text-muted-foreground",
                )}
              >
                complete +{ref.lesson.xp} xp
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* completion overlay */}
      {result ? <CompletionOverlay result={result} next={next ? next.lesson.title : null} onNext={() => { if (next) go({ name: "lesson", lessonId: next.id }); else setResult(null); }} onStay={() => setResult(null)} /> : null}
    </div>
  );
}

function CompletionOverlay({
  result,
  next,
  onNext,
  onStay,
}: {
  result: CompleteResult;
  next: string | null;
  onNext: () => void;
  onStay: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="lesson complete"
    >
      <div className="w-full max-w-md rounded-lg border-2 border-primary/60 bg-card p-6 text-center shadow-[0_0_60px_-10px_rgba(34,227,148,0.4)] sm:p-8 animate-pop">
        <Trophy className="mx-auto h-12 w-12 text-primary" aria-hidden />
        <h3 className="font-display mt-3 text-3xl uppercase text-primary glow-green">
          mission complete
        </h3>

        <p className="mt-3 font-display text-4xl text-primary glow-green">
          +{result.xpGained} XP
        </p>

        {result.newLevel ? (
          <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-mono text-sm text-amber-300">
            LEVEL UP — level {result.newLevel}: {levelTitle(result.newLevel)}
          </p>
        ) : null}

        {result.newBadges.length > 0 ? (
          <div className="mt-3 space-y-1.5">
            {result.newBadges.map((id) => {
              const badge = BADGE_BY_ID.get(id);
              if (!badge) return null;
              return (
                <p
                  key={id}
                  className="flex items-center justify-center gap-2 rounded-md border border-violet-500/40 bg-violet-500/10 px-3 py-2 font-mono text-xs text-violet-300"
                >
                  <Icon name={badge.icon} className="h-4 w-4" aria-hidden />
                  new badge unlocked: {badge.title}
                </p>
              );
            })}
          </div>
        ) : null}

        <p className="mt-3 flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-red-400" aria-hidden />
          streak: {result.streak.count} day{result.streak.count === 1 ? "" : "s"}
          {result.streak.usedFreeze ? (
            <span className="flex items-center gap-1 text-sky-300">
              <Snowflake className="h-3 w-3" aria-hidden /> freeze used
            </span>
          ) : null}
          {result.streak.freezeEarned ? (
            <span className="flex items-center gap-1 text-sky-300">
              <Snowflake className="h-3 w-3" aria-hidden /> +1 freeze earned
            </span>
          ) : null}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {next ? (
            <button
              type="button"
              onClick={onNext}
              className="flex-1 rounded-md border-2 border-primary bg-primary px-4 py-3 font-display text-lg uppercase text-primary-foreground term-focus hover:brightness-110"
            >
              next mission →
            </button>
          ) : null}
          <button
            type="button"
            onClick={onStay}
            className="flex-1 rounded-md border border-border bg-secondary px-4 py-3 font-mono text-sm uppercase text-muted-foreground term-focus hover:text-foreground"
          >
            {next ? "stay here" : "close"}
          </button>
        </div>
      </div>
    </div>
  );
}
