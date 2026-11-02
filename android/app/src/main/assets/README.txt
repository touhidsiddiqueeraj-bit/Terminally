This folder is filled by ../../sync-assets.sh

Steps (from the repository root):
  1) bun run build:static      -> exports the site to out/
  2) ./android/sync-assets.sh  -> copies out/* into this folder
  3) open android/ in Android Studio, build the APK

Until then this app has nothing to display.
