# Architecture

How Terminally fits together — and why it works with zero backend.

```
┌────────────────────────────────────────────────────────────┐
│                      Next.js static export                  │
│                                                             │
│  src/data/          course content (typed TS literals)      │
│  src/lib/store.ts   zustand + localStorage (progress)       │
│  src/lib/gamify.ts  XP curve · levels · badges · streaks    │
│  src/lib/runner.ts  sandboxed iframe JS runner              │
│  src/lib/content.ts unlock logic · stats · lesson lookup    │
│  src/components/    app shell · views · boss battle · quiz  │
│                                                             │
│  public/sw.js       service worker (offline app shell)      │
└────────────────────────────────────────────────────────────┘
        │                                    │
        ▼ (static files)                    ▼ (same files)
   any static host                    android/ WebView shell
   (GitHub Pages, CDN…)               (bundled in the APK)
```

## 1. Content is data, not markup

Every lesson is a typed TypeScript object in [`src/data/`](../src/data):

- `types.ts` — the content model: `Course → Chapter → Lesson → (concept blocks, quiz, exercise?, boss?)`.
- `course-foundations.ts`, `course-crypto.ts`, `course-security.ts` — the curriculum itself.

Concept sections are arrays of `Block`s (`p`, `h`, `code`, `list`, `callout`, `ascii`, `table`)
rendered by `src/components/blocks.tsx`. Because content is plain data:

- the bundle works offline with no CMS or API,
- CI can statically validate every quiz answer, XP value and exercise (`scripts/validate-content.ts`),
- authoring a lesson means editing one object — see [CONTENT-AUTHORING.md](CONTENT-AUTHORING.md).

## 2. Single-route SPA

The whole app is one Next.js route (`/`). Views (dashboard → course → lesson → playground →
profile → about) are swapped with React state in `app-shell.tsx` — no client-side router, no
deep-link complexity, and the static export is a single `index.html` + chunks. The same
bundle therefore serves from a domain root, a GitHub Pages subpath (`BASE_PATH`), or the
Android WebView's local asset origin.

## 3. Progress engine

`src/lib/store.ts` (zustand + `persist`) is the entire "backend":

| State | Purpose |
|---|---|
| `xp`, `streak`, `handle` | the gamification surface |
| `lessons: Record<id, LessonRecord>` | per-node completion, quiz-perfection, exercise-pass |
| `badges` | unlocked badge ids + timestamps |
| `history` | per-day XP (streak graphs, freeze logic) |

- **XP curve** (`gamify.ts`): level *n* costs `20·n·(n−1)` cumulative XP — fast early ranks, slower later.
- **Streaks** count consecutive active days; every 7-day streak banks a *freeze* that auto-absorbs one missed day.
- **Badges** are pure functions of state (`first-steps`, `boss-slayer`, `crypto-complete`, …) — 15 rules, no server.
- Progress exports/imports as a JSON save file (Profile → Your Data), so learners can move between devices.

## 4. The sandboxed code runner

`src/lib/runner.ts` executes learner JavaScript inside a **sandboxed `<iframe>`**
(`sandbox="allow-scripts"` — no same-origin, no cookies, no storage) and captures `console`
output. Hard timeouts (6s) kill infinite loops; `alert`/`prompt` are defused. Exercise tests
run the same way client-side, and `scripts/verify-exercises.ts` re-runs them in CI:
**every solution must pass all its tests, and every starter must fail at least one** —
which is exactly what prevents shipping a freebie exercise.

## 5. Offline-first PWA

`public/sw.js` precaches the app shell and runtime-caches static assets. All asset paths are
derived from the *registration scope*, so the same worker works at `/` and under `/Terminally/`
(GitHub Pages). `manifest.webmanifest` uses relative icon paths for the same reason.
With the app cached: dashboard, lessons, quizzes, the code sandbox and boss battles all work
in airplane mode — progress included.

## 6. The Android shell

`android/` is a minimal Kotlin app: one `WebView` wired to `WebViewAssetLoader`, which serves
the bundled static export on a fake `https://appassets.androidpx.net/` origin. That gives the
page a secure context (service worker + `localStorage` — the save file) with **zero declared
permissions**. `sync-assets.sh` copies `out/` into the APK assets. Details: [android/README.md](../android/README.md).

## 7. Why no backend, on purpose

A learning app for *security and cryptography* should practice what it preaches: there is no
account database to breach, no session token to steal, no telemetry to leak. The trade-off —
no cross-device sync — is handled by the portable JSON save file.
