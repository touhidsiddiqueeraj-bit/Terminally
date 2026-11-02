"use client";

import { useAcademy } from "@/lib/store";
import { COURSES } from "@/data/courses";
import { lessonsOf, courseStats, nextIncomplete, getLessonRef, CONTENT_TOTALS } from "@/lib/content";
import { levelInfo, BADGES } from "@/lib/gamify";
import type { View } from "@/lib/nav";
import { courseColor, Icon, SectionHeading, StatChip, TermWindow, XPBar } from "@/components/term-ui";
import { BookOpen, Code2, Swords, Flame, Snowflake, ChevronRight, Zap, Trophy, Brain, HelpCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardView({ go }: { go: (v: View) => void }) {
  const handle = useAcademy((s) => s.handle);
  const xp = useAcademy((s) => s.xp);
  const streak = useAcademy((s) => s.streak);
  const lessons = useAcademy((s) => s.lessons);
  const lastLessonId = useAcademy((s) => s.lastLessonId);
  const badges = useAcademy((s) => s.badges);

  const completed = new Set(Object.keys(lessons));
  const started = completed.size > 0;
  const lvl = levelInfo(xp);

  const lessonsDone = Object.values(lessons).length;
  const exercisesDone = Object.values(lessons).filter((r) => r.exerciseDone).length;
  const bossesSlain = COURSES.flatMap((c) => lessonsOf(c.id)).filter(
    (r) => r.lesson.boss && completed.has(r.id),
  ).length;

  // where does the learner continue?
  const lastRef = lastLessonId ? getLessonRef(lastLessonId) : null;
  const continueRef =
    lastRef && !completed.has(lastRef.id)
      ? lastRef
      : (COURSES.map((c) => nextIncomplete(c.id, completed)).find(Boolean) ?? null);

  return (
    <div className="space-y-8">
      {/* hero */}
      <TermWindow title="agent_status" bodyClassName="p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {started ? "welcome back," : "system online"}
            </p>
            <h1
              className={cn(
                "font-display text-3xl uppercase leading-tight text-primary glow-green sm:text-5xl",
              )}
            >
              {handle}
              <span className="caret" aria-hidden />
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              lvl {lvl.level} — {lvl.title}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatChip icon={<Zap className="h-4 w-4" />} label="xp" value={xp} />
            <StatChip icon={<Flame className="h-4 w-4" />} label="streak" value={`${streak.count}d`} />
            <StatChip icon={<Snowflake className="h-4 w-4" />} label="freezes" value={streak.freezes} />
            <StatChip icon={<Trophy className="h-4 w-4" />} label="badges" value={`${Object.keys(badges).length}/${BADGES.length}`} />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
            <span>
              lvl {lvl.level} → {lvl.level + 1}
            </span>
            <span>
              {lvl.into}/{lvl.span} xp
            </span>
          </div>
          <XPBar pct={lvl.pct} />
          {streak.count > 0 ? (
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              best streak: {streak.best} days — learn something every day to keep the flame alive
            </p>
          ) : null}
        </div>
      </TermWindow>

      {/* continue */}
      {continueRef ? (
        <button
          type="button"
          onClick={() => go({ name: "lesson", lessonId: continueRef.id })}
          className={cn(
            "group flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-colors sm:p-5 term-focus",
            "border-primary/50 bg-primary/5 hover:bg-primary/10 animate-pulse-glow",
          )}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
            {continueRef.lesson.boss ? (
              <Swords className="h-6 w-6 text-primary" aria-hidden />
            ) : continueRef.lesson.exercise ? (
              <Code2 className="h-6 w-6 text-primary" aria-hidden />
            ) : (
              <BookOpen className="h-6 w-6 text-primary" aria-hidden />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {started ? "continue training" : "begin your first mission"}
            </span>
            <span className="block truncate font-display text-xl uppercase text-foreground sm:text-2xl">
              {continueRef.lesson.title}
            </span>
            <span className="block truncate font-mono text-xs text-muted-foreground">
              {continueRef.course.title} / {continueRef.chapter.title} — {continueRef.lesson.minutes} min
            </span>
          </span>
          <ChevronRight className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
        </button>
      ) : (
        <div className="rounded-lg border-2 border-primary/50 bg-primary/10 p-6 text-center">
          <Trophy className="mx-auto h-10 w-10 text-primary" aria-hidden />
          <p className="font-display mt-2 text-2xl uppercase text-primary glow-green">
            all courses complete
          </p>
          <p className="mt-1 text-sm text-foreground/80">
            You are the Terminal Legend. Replay anything to sharpen your edge.
          </p>
        </div>
      )}

      {/* learning loop explainer */}
      {!started ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: <BookOpen className="h-5 w-5" />, t: "read", d: "short concept bursts" },
            { icon: <HelpCircle className="h-5 w-5" />, t: "check", d: "instant quizzes" },
            { icon: <Code2 className="h-5 w-5" />, t: "code", d: "run real js" },
            { icon: <Swords className="h-5 w-5" />, t: "boss", d: "chapter finales" },
          ].map((s, i) => (
            <div key={s.t} className="rounded-md border border-border bg-card p-3.5 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                {s.icon}
              </div>
              <p className="font-display text-lg uppercase text-foreground">{s.t}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{s.d}</p>
              {i < 3 ? (
                <ChevronRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-border sm:block" aria-hidden />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {/* courses */}
      <section aria-label="courses">
        <SectionHeading className="mb-4">
          <span className="text-muted-foreground mr-2">$</span>learning_paths
        </SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course, i) => {
            const c = courseColor(course.id);
            const stats = courseStats(course.id, new Map(Object.entries(lessons)));
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => go({ name: "course", courseId: course.id })}
                className={cn(
                  "group relative flex flex-col rounded-lg border p-5 text-left transition-all term-focus hover:-translate-y-0.5",
                  c.border,
                  c.bgSoft,
                  "hover:shadow-[0_0_24px_-8px_var(--tw-shadow-color)]",
                  i === 0 && "sm:col-span-2 lg:col-span-1",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-md border bg-black/30", c.border)}>
                    <Icon name={course.icon} className={cn("h-6 w-6", c.text)} />
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {stats.done}/{stats.total} nodes
                  </span>
                </div>
                <h3 className={cn("font-display mt-3 text-2xl uppercase leading-tight", c.text)}>
                  {course.title}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-6 text-foreground/75">{course.subtitle}</p>
                <div className="mt-4">
                  <XPBar pct={stats.pct} colorClass={course.id === "foundations" ? "bg-emerald-500" : course.id === "crypto" ? "bg-violet-500" : "bg-amber-500"} />
                  <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>{stats.pct}% complete</span>
                    <span className={cn("font-bold uppercase tracking-wider transition-colors", c.text)}>
                      {stats.done === 0 ? "start" : stats.done === stats.total ? "replay" : "enter"} →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* stats strip */}
      <section aria-label="your stats" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={<BookOpen className="h-5 w-5" />} label="lessons cleared" value={`${lessonsDone}/${CONTENT_TOTALS.nodes}`} />
        <StatTile icon={<Code2 className="h-5 w-5" />} label="exercises passed" value={`${exercisesDone}/${CONTENT_TOTALS.exercises}`} />
        <StatTile icon={<Swords className="h-5 w-5" />} label="bosses slain" value={`${bossesSlain}/${CONTENT_TOTALS.bosses}`} />
        <StatTile icon={<Brain className="h-5 w-5" />} label="perfect checks" value={`${Object.values(lessons).filter((r) => r.quizPerfect).length}`} />
      </section>

      <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <Play className="h-3 w-3" aria-hidden />
        everything here runs offline — your progress lives on this device
      </p>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-primary">{icon}
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl text-foreground">{value}</p>
    </div>
  );
}
