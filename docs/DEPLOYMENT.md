# Deployment

Terminally is a static site — if it builds, it ships. There is no server, no database and no
runtime configuration. Three supported deployment paths:

## 1. GitHub Pages (automatic)

The [deploy-pages workflow](../.github/workflows/deploy-pages.yml) runs on every push to `main`:

1. `bun install --frozen-lockfile`
2. `BASE_PATH=/Terminally bun run build:static` → produces `out/`
3. uploads `out/` as a Pages artifact and deploys it

**One-time setup** (repo owner):

> *Settings → Pages → Build and deployment → Source: **GitHub Actions***

After that the live app is at `https://<user>.github.io/Terminally/` and redeployed on every
push to `main`. Workflow runs are visible under the repo's *Actions* tab; the README badges
reflect their status.

### Why BASE_PATH is needed

GitHub Pages project sites serve from a subdirectory (`/Terminally/`), so asset URLs must be
prefixed. `next.config.ts` reads `BASE_PATH` and sets Next's `basePath`/`assetPrefix`. The
service worker and manifest are subpath-safe by construction: `sw.js` derives every precache
URL from its registration scope, and the manifest uses relative icon paths. The same build
therefore works at a domain root (set no `BASE_PATH`) or any subdirectory.

## 2. Any static host (manual)

```bash
bun install
bun run build:static          # → out/
# serve out/ from your CDN / S3 / Netlify / nginx…
# if serving from a subfolder: BASE_PATH=/my-folder bun run build:static
```

The `out/` directory is the complete app: `index.html`, chunks, icons, `sw.js`, `manifest.webmanifest`.

## 3. Android APK

The static export is bundled *into* the app — see [android/README.md](../android/README.md):

```bash
bun run build:static && ./android/sync-assets.sh
# then open android/ in Android Studio → build / sign the APK
```

## Releases

Tagging a version publishes a GitHub Release (via [release.yml](../.github/workflows/release.yml)):

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release job validates content, builds the static site and attaches two artifacts:

- `terminally-site-vX.Y.Z.zip` — the deployable static site
- `terminally-android-project-vX.Y.Z.zip` — the Android Studio project with assets pre-synced

## CI gates (what must stay green)

| Check | Enforced by |
|---|---|
| ESLint clean | `bun run lint` |
| TypeScript strict clean | `bun run typecheck` |
| Course data structurally valid | `scripts/validate-content.ts` |
| Every exercise: solution passes, starter fails | `scripts/verify-exercises.ts` |
| Static export builds | `bun run build:static` |

All of these run on every push and pull request ([ci.yml](../.github/workflows/ci.yml)) —
a broken quiz answer index or a "freebie" exercise fails the build before it can reach learners.
