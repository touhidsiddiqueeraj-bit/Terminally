"use client";

import { useEffect } from "react";

/** Registers the offline service worker (PWA). Silent no-op if unsupported. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      // Relative path so the worker also works when the app is served
      // from a subdirectory (e.g. GitHub Pages project sites).
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* offline install unavailable — app still works online */
      });
    };
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);
  return null;
}
