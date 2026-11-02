"use client";

import { SectionHeading, TermWindow } from "@/components/term-ui";
import { BookOpen, HelpCircle, Code2, Swords, WifiOff, Smartphone, Terminal } from "lucide-react";

export function AboutView() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeading>
          <span className="text-muted-foreground mr-2">$</span>man terminal_academy
        </SectionHeading>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-foreground/85">
          Terminal Academy is a gamified learning system for the computer science that actually
          matters in a post-AI world. It borrows its learning loop from the best coding education
          platforms out there — inspired in particular by how boot.dev teaches — and rebuilds it as a
          fully offline, single-device experience.
        </p>
      </div>

      <TermWindow title="how_the_loop_works">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            {
              icon: <BookOpen className="h-5 w-5" />,
              t: "1. READ",
              d: "Every concept arrives in 3-6 minute bursts. One idea at a time, analogies first, jargon decoded on contact.",
            },
            {
              icon: <HelpCircle className="h-5 w-5" />,
              t: "2. CHECK",
              d: "Instant quizzes with explanations. Aim true on the first try for bonus XP — wrong answers teach, then let you retry.",
            },
            {
              icon: <Code2 className="h-5 w-5" />,
              t: "3. CODE",
              d: "Training Grounds: write real JavaScript and run it right here. Auto-graded checks, hints, and solutions.",
            },
            {
              icon: <Swords className="h-5 w-5" />,
              t: "4. BOSS",
              d: "Every chapter ends with a boss battle. Three hearts, real stakes, zero mercy. Beat it to unlock the next chapter.",
            },
          ].map((s) => (
            <div key={s.t}>
              <div className="flex items-center gap-2 text-primary">
                {s.icon}
                <span className="font-display text-lg uppercase">{s.t}</span>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-foreground/75">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
          XP and levels track your growth. Daily streaks keep you honest — every 7-day streak banks a
          streak freeze that protects one missed day. Badges mark the milestones.
        </p>
      </TermWindow>

      <section aria-label="offline first">
        <SectionHeading className="text-xl sm:text-2xl">
          <span className="text-muted-foreground mr-2">$</span>offline_by_design
        </SectionHeading>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 text-emerald-400">
              <WifiOff className="h-5 w-5" aria-hidden />
              <span className="font-display text-lg uppercase">works with zero signal</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground/80">
              Every lesson, quiz, exercise and boss is bundled into the app itself. Code runs in a
              sandboxed frame on your device. Your progress is stored locally. No accounts, no
              tracking, no server calls — the whole academy fits in a few megabytes.
            </p>
          </div>
          <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 text-violet-300">
              <Smartphone className="h-5 w-5" aria-hidden />
              <span className="font-display text-lg uppercase">install it like an app</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground/80">
              On your phone or desktop browser, use &quot;Add to Home Screen&quot; / &quot;Install
              app&quot; — it launches full-screen from its own icon and keeps working offline. The
              same codebase wraps into a native Android app via the included WebView project.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="android">
        <SectionHeading className="text-xl sm:text-2xl">
          <span className="text-muted-foreground mr-2">$</span>the_android_build
        </SectionHeading>
        <div className="mt-3 rounded-lg border border-border bg-card p-5">
          <p className="text-sm leading-6 text-foreground/80">
            This website is the Android app. The repository ships with a ready-to-build Android
            Studio project (the <span className="font-mono text-primary">android/</span> folder) that
            wraps the exported site in a native WebView shell:
          </p>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-foreground/80">
            <li className="flex gap-3">
              <span className="font-mono text-primary">1.</span>
              <span>
                Run <span className="font-mono text-primary">bun run build:static</span> — exports the
                whole site as static files into <span className="font-mono">out/</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-primary">2.</span>
              <span>
                Run <span className="font-mono text-primary">./android/sync-assets.sh</span> — copies
                them into the Android project&apos;s assets
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-primary">3.</span>
              <span>
                Open <span className="font-mono text-primary">android/</span> in Android Studio and
                build the APK — the app runs with airplane mode on
              </span>
            </li>
          </ol>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            # the full walkthrough lives in android/README.md
          </p>
        </div>
      </section>

      <section aria-label="credits">
        <SectionHeading className="text-xl sm:text-2xl">
          <span className="text-muted-foreground mr-2">$</span>credits
        </SectionHeading>
        <div className="mt-3 rounded-lg border border-border bg-card p-5 text-sm leading-7 text-foreground/80">
          <p>
            The learning system — linear paths, micro-lessons, in-browser coding, XP, streaks, boss
            battles — is modeled on the approach pioneered by{" "}
            <span className="text-primary">boot.dev</span>, rebuilt from scratch as an open,
            offline-first experience.
          </p>
          <p className="mt-2 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" aria-hidden />
            terminal_academy v1.0 — stay curious, stay paranoid
          </p>
        </div>
      </section>
    </div>
  );
}
