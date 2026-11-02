# Terminal Academy — Setup & Deployment Guide

A boot.dev-inspired, gamified, offline-first learning system that teaches the
computer science that matters in a post-AI world.

## What you got

**The website (this sandbox project)** — a complete single-page learning app:

| Course | Nodes | Focus |
| --- | --- | --- |
| Digital Foundations | 15 | bits & bytes, logic gates, how the internet works |
| Cryptography (flagship) | 23 | Caesar → Vigenère → XOR → hashing → AES → RSA → TLS → post-quantum |
| Security & Privacy | 16 | passwords/2FA, phishing & AI scams, malware, privacy in the AI era |

Totals: **54 nodes** (44 lessons + 10 boss battles), **126 quiz questions**,
**14 auto-graded JavaScript exercises**, **~1,700 XP** of content, **15 badges**,
XP/level system (10 titles), daily streaks with streak freezes, free playground.

Everything runs client-side: static content + localStorage progress. Zero
server calls. It works in airplane mode (verified).

**The Android wrapper** — `terminal-academy-android-wrapper.zip` (also in the
repo at `android/`): a ready-to-build Android Studio project that bundles the
exported site into a WebView APK with no permissions and no internet.

## Run the website locally (this repo)

```bash
bun install        # or npm install
bun run dev        # or npm run dev → http://localhost:3000
```

## Install it as an app (PWA)

Deploy the static export (see below) to any static host — or open the site,
then use your browser's **Install app / Add to Home Screen**. It launches
full-screen from its own icon and keeps working offline via the service worker
(`public/sw.js`).

## Static export (for hosting & the Android build)

```bash
bun run build:static        # STATIC_EXPORT=1 next build → out/
```

`out/` is a fully self-contained static site: upload it to Netlify, Vercel,
GitHub Pages, S3, a USB stick — anything that can serve files.

## Build the Android APK

1. `bun run build:static` (from repo root)
2. `./android/sync-assets.sh` (copies `out/` into `app/src/main/assets/`)
3. Open `android/` in Android Studio → Run ▶ (or `cd android && ./gradlew assembleDebug`)

The APK declares **no INTERNET permission** — the academy ships inside it.
Learner progress persists in the WebView's localStorage. Full details in
`android/README.md`.

## Where things live

```
src/
  data/
    types.ts                 content data model
    course-foundations.ts    Digital Foundations (15 nodes)
    course-crypto.ts         Cryptography (23 nodes)
    course-security.ts       Security & Privacy (16 nodes)
  lib/
    store.ts                 zustand + localStorage progress store
    gamify.ts                XP, levels, badges, streak math
    runner.ts                sandboxed iframe JS runner ("Training Grounds")
    content.ts               course helpers (unlocking, stats)
  components/
    app-shell.tsx            SPA shell: header, bottom nav, view router
    boss-battle.tsx          boss encounters (shields, hearts, victory)
    code-exercise.tsx        editor + auto-graded checks + hints + solutions
    quiz.tsx                 knowledge checks with retry
    blocks.tsx               lesson content renderer
    views/…                  dashboard, course map, lesson, playground, profile, about
public/
  manifest.webmanifest       PWA manifest
  sw.js                      offline service worker
  icons/                     generated PWA icons (scripts/gen-icons.mjs)
android/                     native WebView wrapper project
scripts/
  validate-content.ts        content sanity checks
  verify-exercises.ts        proves solutions pass & starters fail
  gen-icons.mjs              regenerates PWA icons
```

## Adding content

Lessons are plain TypeScript data (`src/data/course-*.ts`) following the types
in `src/data/types.ts`. Add a lesson, run
`bun scripts/validate-content.ts` and `bun scripts/verify-exercises.ts`, done —
the gamification, unlocking and UI pick it up automatically.

## Design notes

- Learning loop modeled on boot.dev: read → quiz → code → boss, linear paths,
  XP, streaks, boss battles — rebuilt as an offline-first single-page app.
- Coding exercises run in a `sandbox="allow-scripts"` iframe: no DOM access to
  the app, no network, 6-second timeout, alert/prompt disabled.
- One deliberate deviation from boot.dev: no accounts, no leaderboard, no
  server — everything is local by design, so the same code ships to Android
  unchanged.
