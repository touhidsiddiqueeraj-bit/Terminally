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
./android/sync-assets.sh      # also strips *.map source maps

# 3. Build the APK
#    - Open the android/ folder in Android Studio → Run ▶ (debug APK), or
#    - Command line (the Gradle wrapper is committed, no local Gradle needed):
cd android && ./gradlew assembleDebug
#    → app/build/outputs/apk/debug/app-debug.apk   (debug-signed, installable)
```

JDK 17+ and Android SDK 34 are required (Android Studio bundles both);
`local.properties` pointing at the SDK is created automatically by Android
Studio, or by hand: `sdk.dir=/path/to/android-sdk`.

### Release signing

`assembleRelease` reads `android/keystore.properties` (gitignored) when it
exists and signs the APK with your key. Create it once:

```bash
keytool -genkeypair -v \
  -keystore android/keystores/terminal-academy-release.keystore \
  -alias terminalacademy -keyalg RSA -keysize 2048 -validity 10000

cat > android/keystore.properties <<'EOF'
storeFile=keystores/terminal-academy-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=terminalacademy
keyPassword=YOUR_KEY_PASSWORD
EOF

cd android && ./gradlew assembleRelease
# → app/build/outputs/apk/release/app-release.apk (signed, zipaligned)
```

Without `keystore.properties` the release build still works and produces an
**unsigned** APK you can sign later with `apksigner`. CI builds debug-signed
APKs for sideloading; releases attach them automatically on `v*` tags.

> **Keep the keystore.** Android only treats a new APK as an *update* of the
> installed app when it's signed with the same key — otherwise users must
> uninstall first.

### CI & releases

`.github/workflows/ci.yml` builds a debug APK on every push/PR (artifact
`terminal-academy-debug-apk`). `.github/workflows/release.yml` is a manual
builder: run it from the Actions tab with a tag name (e.g. `v1.0.0`) and it
attaches a debug APK + site/project zips to that release.

The **signed** APK that end users install is built and uploaded by hand —
the release keystore never leaves the maintainer's machine. To automate
release signing instead, store the keystore + `keystore.properties` as repo
secrets and swap `assembleDebug` for `assembleRelease`.

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

- **White screen on launch, but assets ARE in the APK** → check the aapt
  ignore pattern: Next.js keeps all JS/CSS under `assets/_next/`, and aapt's
  *default* pattern contains `<dir>_*`, which silently drops underscore-
  prefixed directories. `app/build.gradle.kts` overrides
  `androidResources.ignoreAssetsPattern` for exactly this reason — don't
  remove it. Verify with:
  `unzip -l app-release.apk | grep assets/_next/`
- **White screen on launch, assets missing** → run `sync-assets.sh` (needs
  `bun run build:static` first).
- **"Page not found" style error** → make sure `out/index.html` exists and was
  copied to `app/src/main/assets/index.html`.
- **Progress lost on app update** → it shouldn't be (same origin, same
  WebView); users can also export/import a save file from Profile → Your Data.
- **Gradle out of memory in small CI runners** → `gradle.properties` pins a
  ~1.5 GB heap; raise `org.gradle.jvmargs` on machines with RAM to spare.
