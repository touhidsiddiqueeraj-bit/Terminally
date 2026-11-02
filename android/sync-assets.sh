#!/usr/bin/env bash
# Terminal Academy — sync the static web export into the Android app's assets.
#
#   1) bun run build:static     (from the repo root — produces out/)
#   2) ./android/sync-assets.sh (this script — copies out/ into app assets)
#   3) open android/ in Android Studio → build the APK
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f "../out/index.html" ]; then
  echo "✗ ../out/index.html not found."
  echo "  Run 'bun run build:static' (or 'STATIC_EXPORT=1 npm run build') from the repo root first."
  exit 1
fi

DEST="app/src/main/assets"
mkdir -p "$DEST"

# Clear only the files we own (keep the placeholder README)
find "$DEST" -mindepth 1 ! -name 'README.txt' -exec rm -rf {} +

cp -r ../out/* "$DEST/"

# Source maps are dev-only weight inside the APK — drop them.
find "$DEST" -type f -name '*.map' -delete

SIZE=$(du -sh "$DEST" | cut -f1)
echo "✓ synced $SIZE of static site into $DEST"
echo "  → open this folder in Android Studio and build the APK"
