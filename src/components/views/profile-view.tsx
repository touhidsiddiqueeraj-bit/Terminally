"use client";

import { useRef, useState } from "react";
import { useAcademy } from "@/lib/store";
import { BADGES, levelInfo, todayStr, addDays } from "@/lib/gamify";
import { CONTENT_TOTALS, lessonsOf } from "@/lib/content";
import { Icon, SectionHeading, StatChip, TermWindow, XPBar } from "@/components/term-ui";
import { Save, Download, Upload, Trash2, Flame, Zap, Swords, Code2, Brain, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProfileView({ go }: { go: (v: { name: "about" } | { name: "dashboard" } | { name: "course"; courseId: "foundations" | "crypto" | "security" }) => void }) {
  const handle = useAcademy((s) => s.handle);
  const setHandle = useAcademy((s) => s.setHandle);
  const xp = useAcademy((s) => s.xp);
  const streak = useAcademy((s) => s.streak);
  const lessons = useAcademy((s) => s.lessons);
  const badges = useAcademy((s) => s.badges);
  const exportData = useAcademy((s) => s.exportData);
  const importData = useAcademy((s) => s.importData);
  const resetAll = useAcademy((s) => s.resetAll);

  const [nameDraft, setNameDraft] = useState(handle);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const lvl = levelInfo(xp);
  const lessonsDone = Object.keys(lessons).length;
  const exercisesDone = Object.values(lessons).filter((r) => r.exerciseDone).length;
  const perfectChecks = Object.values(lessons).filter((r) => r.quizPerfect).length;
  const bossesSlain = lessonsOf("foundations")
    .concat(lessonsOf("crypto"))
    .concat(lessonsOf("security"))
    .filter((r) => r.lesson.boss && lessons[r.id]).length;

  // last 28 days activity strip
  const today = todayStr();
  const days = Array.from({ length: 28 }, (_, i) => addDays(today, -(27 - i)));
  const history = useAcademy((s) => s.history);

  function doExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `terminal-academy-progress-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress exported. Keep that file safe — it is your save game.");
  }

  function doImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(String(reader.result));
      if (ok) toast.success("Progress imported. Welcome back.");
      else toast.error("That file does not look like a Terminal Academy save.");
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-8">
      {/* identity */}
      <TermWindow title="operator.config" bodyClassName="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              operator handle
            </p>
            <div className="mt-2 flex gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                maxLength={20}
                aria-label="your handle"
                className="min-w-0 flex-1 rounded-md border border-border bg-[#050806] px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary/60"
              />
              <button
                type="button"
                onClick={() => {
                  setHandle(nameDraft);
                  toast.success("Handle updated.");
                }}
                className="flex items-center gap-2 rounded-md border border-primary/50 bg-primary/15 px-3 py-2 font-mono text-xs font-bold text-primary term-focus hover:bg-primary/25"
              >
                <Save className="h-3.5 w-3.5" aria-hidden />
                save
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatChip icon={<Zap className="h-4 w-4" />} label="xp" value={xp} />
            <StatChip icon={<Flame className="h-4 w-4" />} label="streak" value={`${streak.count}d`} />
            <StatChip icon={<Snowflake className="h-4 w-4" />} label="freezes" value={streak.freezes} />
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
            <span>
              lvl {lvl.level} — {lvl.title}
            </span>
            <span>
              {lvl.into}/{lvl.span} xp
            </span>
          </div>
          <XPBar pct={lvl.pct} />
        </div>
      </TermWindow>

      {/* activity strip */}
      <section aria-label="recent activity">
        <SectionHeading className="mb-3 text-xl sm:text-2xl">
          <span className="text-muted-foreground mr-2">$</span>last_28_days
        </SectionHeading>
        <div className="rounded-md border border-border bg-card p-4">
          <div className="flex flex-wrap gap-1.5">
            {days.map((d) => {
              const earned = history[d] ?? 0;
              return (
                <span
                  key={d}
                  title={`${d}: ${earned} xp`}
                  className={cn(
                    "h-5 w-5 rounded-sm border",
                    earned > 0
                      ? earned >= 60
                        ? "border-primary/60 bg-primary"
                        : "border-primary/40 bg-primary/50"
                      : "border-border bg-secondary/50",
                  )}
                />
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            each square is a day — bright squares are days you earned xp. keep the chain unbroken.
          </p>
        </div>
      </section>

      {/* stats */}
      <section aria-label="statistics">
        <SectionHeading className="mb-3 text-xl sm:text-2xl">
          <span className="text-muted-foreground mr-2">$</span>stats
        </SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat icon={<Brain className="h-4 w-4" />} label="nodes cleared" value={`${lessonsDone}/${CONTENT_TOTALS.nodes}`} />
          <MiniStat icon={<Code2 className="h-4 w-4" />} label="drills passed" value={`${exercisesDone}/${CONTENT_TOTALS.exercises}`} />
          <MiniStat icon={<Swords className="h-4 w-4" />} label="bosses slain" value={`${bossesSlain}/${CONTENT_TOTALS.bosses}`} />
          <MiniStat icon={<Brain className="h-4 w-4" />} label="perfect checks" value={String(perfectChecks)} />
        </div>
      </section>

      {/* badges */}
      <section aria-label="badges">
        <SectionHeading className="mb-3 text-xl sm:text-2xl">
          <span className="text-muted-foreground mr-2">$</span>badges —{" "}
          <span className="text-primary">
            {Object.keys(badges).length}/{BADGES.length}
          </span>
        </SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b) => {
            const earned = !!badges[b.id];
            return (
              <div
                key={b.id}
                className={cn(
                  "rounded-lg border p-4 text-center transition-colors",
                  earned
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-border bg-card opacity-45",
                )}
              >
                <span
                  className={cn(
                    "mx-auto flex h-11 w-11 items-center justify-center rounded-md border",
                    earned ? "border-violet-500/50 bg-black/30 text-violet-300" : "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon name={b.icon} className="h-6 w-6" />
                </span>
                <p className={cn("font-display mt-2 text-lg uppercase leading-tight", earned ? "text-violet-300" : "text-muted-foreground")}>
                  {b.title}
                </p>
                <p className="mt-0.5 font-mono text-[10px] leading-4 text-muted-foreground">{b.desc}</p>
                {earned ? (
                  <p className="mt-1 font-mono text-[10px] text-violet-400">
                    earned {new Date(badges[b.id]).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* data management */}
      <section aria-label="your data">
        <SectionHeading className="mb-3 text-xl sm:text-2xl">
          <span className="text-muted-foreground mr-2">$</span>your_data
        </SectionHeading>
        <div className="rounded-lg border border-border bg-card p-4 sm:p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            All progress lives in this browser&apos;s storage — nothing was ever sent anywhere. Moving
            devices? Export here, import there.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={doExport}
              className="flex items-center gap-2 rounded-md border border-primary/50 bg-primary/15 px-4 py-2.5 font-mono text-sm font-bold text-primary term-focus hover:bg-primary/25"
            >
              <Download className="h-4 w-4" aria-hidden />
              export progress
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-md border border-sky-400/40 bg-sky-400/10 px-4 py-2.5 font-mono text-sm text-sky-300 term-focus hover:bg-sky-400/20"
            >
              <Upload className="h-4 w-4" aria-hidden />
              import progress
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) doImport(f);
                e.target.value = "";
              }}
            />
            {confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                  toast.error("Progress wiped. Fresh terminal, fresh start.");
                }}
                className="flex items-center gap-2 rounded-md border-2 border-red-500/60 bg-red-500/20 px-4 py-2.5 font-mono text-sm font-bold text-red-300 term-focus"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                confirm wipe — no undo
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/5 px-4 py-2.5 font-mono text-sm text-red-400 term-focus hover:bg-red-500/15"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                reset everything
              </button>
            )}
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => go({ name: "about" })}
        className="font-mono text-xs uppercase tracking-wider text-muted-foreground term-focus hover:text-primary"
      >
        about this app / offline + android info →
      </button>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-1 font-display text-2xl text-foreground">{value}</p>
    </div>
  );
}
