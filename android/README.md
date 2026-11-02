# Terminal Academy — Android App

A native Android shell around the Terminal Academy learning website. The entire
academy — every lesson, quiz, coding exercise, boss battle, the JavaScript
sandbox — is bundled **inside the APK**. The app requests **no permissions and
needs no internet**, ever.

```
┌─────────────────────────────────────────────────────┐
│  TerminalAcademy (this folder)                      │
│  ├── app/                                           │
│  │   ├── src/main/java/.../MainActivity.kt   ← shell│
│  │   └── src/main/assets/                     ← site│
│  │        ├── index.html                             │
│  │        ├── _next/...        (framework chunks)   │
│  │        ├── icons/...        (PWA icons)          │
│  │        └── sw.js            (offline cache)      │
│  ├── sync-assets.sh   ← fills assets from out/      │
│  └── README.md        (you are here)                │
└─────────────────────────────────────────────────────┘
```

## How it works

- `MainActivity` hosts a single `WebView`.
- Instead of loading files or a remote URL, it uses
  **`WebViewAssetLoader`** (androidx.webkit) to serve the bundled assets on
  `https://appassets.androidxfs.net/`.
- That fake https origin gives the page a **secure context**, so:
  - `localStorage` works → the learner's XP, streaks and badges persist,
  - the service worker can register (belt-and-suspenders; everything is local
    anyway),
  - no `file://` scheme quirks.
- `domStorageEnabled = true` is essential — it is the save file.
- No `INTERNET` permission is declared: airplane mode forever.

## Build it

Prerequisites on your machine:

- Node.js 18+ (or Bun) and the repo's dependencies (`bun install` / `npm install`)
- Android Studio (Koala or newer) with SDK 34

```bash
# 1. Export the website as static files (from the REPO ROOT, not this folder)
bun run build:static          # produces out/ (uses STATIC_EXPORT=1)

# 2. Copy the export into the Android assets
./android/sync-assets.sh

# 3. Build the APK
#    - Open the android/ folder in Android Studio → Run ▶ (debug APK), or
#    - Command line:
cd android && ./gradlew assembleDebug
#    → app/build/outputs/apk/debug/app-debug.apk
```

For a Play-Store-ready build: `./gradlew assembleRelease` with your signing
config (or use Android Studio's **Generate Signed Bundle / APK** wizard).

## Updating the content

The website is the single source of truth. Edit the Next.js app, then repeat
steps 1-2 above and rebuild. The Android shell almost never changes.

## Details worth knowing

| Thing | Where |
| --- | --- |
| Progress storage | `localStorage` of the WebView origin |
| Back button | navigates in-app history, then exits |
| Min Android | 8.0 (API 24) |
| Target | Android 14 (API 34) |
| App size | the site export is a few MB — tiny for an APK |
| Dark UI | enforced by theme + WebView background (`#060A08`) |

## Troubleshooting

- **White screen on launch** → assets are missing; run `sync-assets.sh`.
- **"Page not found" style error** → make sure `out/index.html` exists and was
  copied to `app/src/main/assets/index.html`.
- **Progress lost on app update** → it shouldn't be (same origin, same
  WebView); users can also export/import a save file from Profile → Your Data.
