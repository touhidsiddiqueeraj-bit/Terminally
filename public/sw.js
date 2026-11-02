/*
 * Terminal Academy — service worker
 * Offline-first: cache the app shell and all static assets.
 * The app itself is a single route with local state, so once cached
 * it runs completely offline.
 *
 * All paths are derived from the registration scope, so the worker
 * works both at the domain root and under a subdirectory
 * (e.g. GitHub Pages project sites).
 */

const CACHE_NAME = "terminal-academy-v2";
// Scope always ends with "/" — e.g. "/" or "/Terminally/".
const BASE = new URL(self.registration.scope).pathname;
const CORE_ASSETS = [
  BASE,
  BASE + "manifest.webmanifest",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)));
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network first, fall back to cached shell (offline).
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(BASE, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached =
            (await cache.match(request)) || (await cache.match(BASE));
          if (cached) return cached;
          return new Response(
            "<html><body style='background:#060a08;color:#d9e8de;font-family:monospace;padding:2rem'>Terminal Academy is starting up — reconnect once to finish the offline install.</body></html>",
            { headers: { "Content-Type": "text/html" } },
          );
        }
      })(),
    );
    return;
  }

  // Static assets: cache first, refresh in the background.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) {
        event.waitUntil(
          (async () => {
            try {
              const fresh = await fetch(request);
              if (fresh && fresh.ok) cache.put(request, fresh.clone());
            } catch {
              /* offline — cached copy stands */
            }
          })(),
        );
        return cached;
      }
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok && fresh.type === "basic") {
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch {
        return new Response("", { status: 504, statusText: "offline" });
      }
    })(),
  );
});
