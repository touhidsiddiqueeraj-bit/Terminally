"use client";

import { COURSES } from "@/data/courses";
import { lessonsOf, courseStats, isUnlocked } from "@/lib/content";
import { useAcademy } from "@/lib/store";
import type { View } from "@/lib/nav";
import type { CourseId } from "@/data/types";
import { courseColor, Icon, SectionHeading, XPBar } from "@/components/term-ui";
import { BookOpen, Code2, Swords, Lock, Check, ChevronRight, ArrowLeft, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function CourseView({ courseId, go }: { courseId: CourseId; go: (v: View) => void }) {
  const lessons = useAcademy((s) => s.lessons);
  const course = COURSES.find((c) => c.id === courseId)!;
  const c = courseColor(courseId);
  const completed = new Set(Object.keys(lessons));
  const stats = courseStats(courseId, new Map(Object.entries(lessons)));
  const siblings = lessonsOf(courseId);
  const nextUp = siblings.find((r) => !completed.has(r.id));

  return (
    <div className="space-y-8">
      {/* course header */}
      <div>
        <button
          type="button"
          onClick={() => go({ name: "dashboard" })}
          className="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground term-focus hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          all paths
        </button>

        <div className={cn("rounded-lg border p-5 sm:p-7", c.border, c.bgSoft)}>
          <div className="flex items-start gap-4">
            <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-md border bg-black/30", c.border)}>
              <Icon name={course.icon} className={cn("h-8 w-8", c.text)} />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className={cn("font-display text-3xl uppercase leading-tight sm:text-4xl", c.text, c.glow)}>
                {course.title}
              </h1>
              <p className="mt-1 text-sm leading-6 text-foreground/80">{course.subtitle}</p>
            </div>
          </div>
          <div className="mt-5">
            <XPBar
              pct={stats.pct}
              colorClass={
                courseId === "foundations" ? "bg-emerald-500" : courseId === "crypto" ? "bg-violet-500" : "bg-amber-500"
              }
            />
            <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>
                {stats.done}/{stats.total} nodes — {stats.xpEarned}/{stats.xpTotal} xp
              </span>
              <span>{stats.pct}%</span>
            </div>
          </div>
          {nextUp ? (
            <button
              type="button"
              onClick={() => go({ name: "lesson", lessonId: nextUp.id })}
              className={cn(
                "mt-4 flex w-full items-center justify-between rounded-md border-2 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider term-focus",
                c.border,
                c.text,
                "bg-black/30 hover:bg-black/50",
              )}
            >
              <span>{stats.done === 0 ? "start course" : "resume course"}</span>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <p className="mt-4 rounded-md border border-border bg-black/30 px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-wider text-primary glow-green">
              course complete — replay freely
            </p>
          )}
        </div>
      </div>

      {/* chapter path */}
      {course.chapters.map((chapter, chi) => (
        <section key={chapter.id} aria-label={chapter.title}>
          <SectionHeading className="text-xl sm:text-2xl">
            <span className="text-muted-foreground mr-2">{String(chi + 1).padStart(2, "0")}.</span>
            {chapter.title}
          </SectionHeading>
          <p className="mb-5 mt-1 text-sm leading-6 text-muted-foreground">{chapter.blurb}</p>

          <div className="space-y-0">
            {chapter.lessons.map((lesson, li) => {
              const ref = siblings.find((r) => r.id === lesson.id)!;
              const done = completed.has(lesson.id);
              const unlocked = isUnlocked(ref, completed);
              const isNext = nextUp?.id === lesson.id;
              const isBoss = !!lesson.boss;
              const hasEx = !!lesson.exercise;

              return (
                <div key={lesson.id} className="flex">
                  {/* connector + node marker */}
                  <div className="flex w-10 shrink-0 flex-col items-center sm:w-12">
                    {li > 0 ? <div className="circuit-line h-4 flex-1" aria-hidden /> : <div className="h-5" aria-hidden />}
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border-2 sm:h-12 sm:w-12",
                        done
                          ? "border-primary/60 bg-primary/15 text-primary"
                          : isNext
                            ? cn("animate-pulse-glow", c.border, c.bgSoft, c.text)
                            : unlocked
                              ? "border-border bg-secondary text-muted-foreground"
                              : "border-border/50 bg-secondary/30 text-border",
                      )}
                      aria-hidden
                    >
                      {done ? (
                        <Check className="h-5 w-5" />
                      ) : !unlocked ? (
                        <Lock className="h-4 w-4" />
                      ) : isBoss ? (
                        <Swords className="h-5 w-5" />
                      ) : hasEx ? (
                        <Code2 className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </span>
                    {li < chapter.lessons.length - 1 ? (
                      <div className="circuit-line h-4 flex-1" aria-hidden />
                    ) : null}
                  </div>

                  {/* card */}
                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => go({ name: "lesson", lessonId: lesson.id })}
                    className={cn(
                      "mb-3 ml-3 flex-1 rounded-lg border p-3.5 text-left transition-all sm:p-4 term-focus",
                      unlocked ? "hover:-translate-y-px" : "cursor-not-allowed opacity-45",
                      done
                        ? "border-primary/30 bg-primary/5"
                        : isNext
                          ? cn(c.border, c.bgSoft)
                          : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {isBoss ? (
                        <span className="rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-red-400">
                          boss
                        </span>
                      ) : null}
                      {hasEx ? (
                        <span className="rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-sky-300">
                          coding
                        </span>
                      ) : null}
                      {done ? (
                        <span className="rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                          cleared
                        </span>
                      ) : null}
                      {!unlocked ? (
                        <span className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          locked
                        </span>
                      ) : null}
                      <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden />
                          {lesson.minutes}m
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Zap className="h-3 w-3" aria-hidden />
                          {lesson.xp}
                        </span>
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-1.5 font-display text-lg uppercase leading-snug sm:text-xl",
                        isBoss ? "text-red-300" : "text-foreground",
                      )}
                    >
                      {lesson.title}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
