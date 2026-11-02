"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { viewKey, type View } from "@/lib/nav";
import { useAcademy } from "@/lib/store";
import { levelInfo } from "@/lib/gamify";
import { DashboardView } from "@/components/views/dashboard";
import { CourseView } from "@/components/views/course-view";
import { LessonView } from "@/components/views/lesson-view";
import { PlaygroundView } from "@/components/views/playground-view";
import { ProfileView } from "@/components/views/profile-view";
import { AboutView } from "@/components/views/about-view";
import { House, Code2, User, Info, Zap, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH = ` ████████╗ █████╗ ██████╗ ███████╗██████╗  █████╗
 ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗
    ██║   ███████║██████╔╝█████╗  ██████╔╝███████║
    ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██╗██╔══██║
    ██║   ██║  ██║██║  ██║███████╗██║  ██║██║  ██║
    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝`;

const emptySubscribe = () => () => {};

export function AppShell() {
  const [view, setView] = useState<View>({ name: "dashboard" });

  const xp = useAcademy((s) => s.xp);
  const streak = useAcademy((s) => s.streak);

  // hydration guard: false during SSR, true on the client — no flash of empty state
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  function go(v: View) {
    setView(v);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
        <pre className="font-mono text-[7px] leading-tight text-primary/80 sm:text-[10px]" aria-hidden>
          {SPLASH}
        </pre>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
          booting<span className="caret" aria-hidden />
        </p>
      </div>
    );
  }

  const lvl = levelInfo(xp);

  const navItems: Array<{ key: View["name"]; label: string; icon: React.ReactNode; view: View }> = [
    { key: "dashboard", label: "home", icon: <House className="h-5 w-5" aria-hidden />, view: { name: "dashboard" } },
    { key: "playground", label: "playground", icon: <Code2 className="h-5 w-5" aria-hidden />, view: { name: "playground" } },
    { key: "profile", label: "profile", icon: <User className="h-5 w-5" aria-hidden />, view: { name: "profile" } },
    { key: "about", label: "about", icon: <Info className="h-5 w-5" aria-hidden />, view: { name: "about" } },
  ];

  return (
    <div className="scanlines flex min-h-screen flex-col bg-background">
      {/* header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => go({ name: "dashboard" })}
            className="flex min-w-0 items-center gap-2 term-focus"
            aria-label="Terminal Academy home"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/50 bg-primary/10 font-display text-lg text-primary">
              &gt;_
            </span>
            <span className="font-display truncate text-xl uppercase tracking-wide text-primary glow-green sm:text-2xl">
              terminal_academy
            </span>
          </button>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="main navigation">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => go(item.view)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wider term-focus",
                  view.name === item.key
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-3" aria-label="your stats">
            <span className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px]">
              <Zap className="h-3.5 w-3.5 text-primary" aria-hidden />
              <span className="text-primary">{xp}</span>
              <span className="text-muted-foreground">xp</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px]">
              <span className="text-muted-foreground">lvl</span>
              <span className="text-primary">{lvl.level}</span>
            </span>
            <span
              className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px]"
              title={`streak: ${streak.count} days (best ${streak.best}) — freezes: ${streak.freezes}`}
            >
              <Flame
                className={cn("h-3.5 w-3.5", streak.count > 0 ? "text-red-400" : "text-muted-foreground")}
                aria-hidden
              />
              <span className={streak.count > 0 ? "text-red-300" : "text-muted-foreground"}>
                {streak.count}d
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-8 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewKey(view)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {view.name === "dashboard" ? <DashboardView go={go} /> : null}
            {view.name === "course" ? <CourseView courseId={view.courseId} go={go} /> : null}
            {view.name === "lesson" ? <LessonView lessonId={view.lessonId} go={go} /> : null}
            {view.name === "playground" ? <PlaygroundView /> : null}
            {view.name === "profile" ? <ProfileView go={go} /> : null}
            {view.name === "about" ? <AboutView /> : null}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* footer */}
      <footer className="border-t border-border py-4 pb-24 md:pb-4">
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          terminal_academy v1.0 — offline-first cs education — learning system inspired by boot.dev
        </p>
      </footer>

      {/* mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden"
        aria-label="mobile navigation"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => go(item.view)}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-0.5 py-2 term-focus",
                view.name === item.key ? "text-primary" : "text-muted-foreground",
              )}
              aria-current={view.name === item.key ? "page" : undefined}
            >
              {item.icon}
              <span className="font-mono text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
