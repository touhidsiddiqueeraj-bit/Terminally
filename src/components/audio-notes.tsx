"use client";

/**
 * Audio notes — "listen to this lesson".
 *
 * Every lesson ships with a studio-recorded voice note: a pre-generated
 * narration clip served from /audio (and cached by the service worker after
 * the first listen, so notes work offline). The device's built-in
 * speechSynthesis remains available as a fallback that can read the *full*
 * lesson text aloud when a clip is missing or fails to load offline.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Block } from "@/data/types";
import type { AudioClip } from "@/data/audio-notes";
import { AUDIO_NOTES } from "@/data/audio-notes";
import { cn } from "@/lib/utils";
import { Volume2, Play, Pause, Square, Gauge, Headphones, BookOpenText } from "lucide-react";
import { sfx } from "@/lib/sound";

const RATES = [0.75, 1, 1.25, 1.5] as const;

type Mode = "idle" | "studio" | "device";

function fmtTime(t: number): string {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function extractPassages(title: string, blocks: Block[]): string[] {
  const out: string[] = [title];
  for (const b of blocks) {
    switch (b.type) {
      case "p":
        out.push(b.text);
        break;
      case "h":
        out.push(`Section: ${b.text}`);
        break;
      case "list":
        out.push(b.items.map((it, i) => `${i + 1}. ${it}`).join(" "));
        break;
      case "callout":
        out.push(`${b.title ?? "Note"}: ${b.text}`);
        break;
      default:
        break; // code, ascii, tables, demos stay silent
    }
  }
  return out;
}

export function AudioNotes({
  lessonId,
  title,
  blocks,
}: {
  lessonId: string;
  title: string;
  blocks: Block[];
}) {
  const clip: AudioClip | undefined = AUDIO_NOTES[lessonId];
  const passages = useMemo(() => extractPassages(title, blocks), [title, blocks]);
  const ttsSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [mode, setMode] = useState<Mode>("idle");
  const [paused, setPaused] = useState(false);
  const [idx, setIdx] = useState(0);
  const [rateIdx, setRateIdx] = useState(1);
  const [studioError, setStudioError] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(clip?.seconds ?? 0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---- studio clip lifecycle ----------------------------------------- */

  useEffect(() => {
    if (!clip) return;
    const a = new Audio(clip.file);
    audioRef.current = a;
    a.preload = "metadata";
    // prime the service-worker cache with a full (non-Range) fetch so the
    // clip keeps working offline — idempotent, the worker serves cache-first
    if (navigator.onLine) void fetch(clip.file).catch(() => {});
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => {
      const d = a.duration;
      if (Number.isFinite(d) && d > 0) setDuration(d);
    };
    const onEnd = () => {
      setMode("idle");
      setPaused(false);
      setTime(0);
    };
    const onErr = () => {
      // clip unavailable (offline, never cached) — fall back to device tts
      setStudioError(true);
      setMode("idle");
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
      audioRef.current = null;
    };
  }, [clip]);

  /* ---- stop device tts on unmount ------------------------------------- */

  useEffect(() => {
    return () => {
      if (ttsSupported) window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

  function applyRate(next: number) {
    const a = audioRef.current;
    if (a) {
      a.playbackRate = next;
      Reflect.set(a, "preservesPitch", true);
    }
  }

  function stopStudio() {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setTime(0);
  }

  /* ---- device tts ------------------------------------------------------ */

  function speakFrom(i: number, rate: number) {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    const speak = (j: number) => {
      if (j >= passages.length) {
        setMode("idle");
        setIdx(0);
        return;
      }
      setIdx(j);
      const u = new SpeechSynthesisUtterance(passages[j]);
      u.rate = rate;
      u.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const en = voices.find(
        (v) => v.lang.startsWith("en") && /male|david|daniel/i.test(v.name),
      ) ?? voices.find((v) => v.lang.startsWith("en"));
      if (en) u.voice = en;
      u.onend = () => speak(j + 1);
      u.onerror = () => setMode("idle");
      window.speechSynthesis.speak(u);
    };
    speak(i);
  }

  /* ---- controls -------------------------------------------------------- */

  function playStudio() {
    if (!clip || studioError) return;
    sfx.click();
    if (ttsSupported) window.speechSynthesis.cancel();
    setMode("studio");
    setPaused(false);
    applyRate(RATES[rateIdx]);
    void audioRef.current?.play();
  }

  function pauseStudio() {
    if (!clip) return;
    sfx.click();
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play();
      setPaused(false);
    } else {
      a.pause();
      setPaused(true);
    }
  }

  function playDevice() {
    if (!ttsSupported) return;
    sfx.click();
    stopStudio();
    setMode("device");
    setPaused(false);
    speakFrom(idx, RATES[rateIdx]);
  }

  function pauseDevice() {
    if (!ttsSupported) return;
    sfx.click();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function stopAll() {
    sfx.click();
    stopStudio();
    if (ttsSupported) window.speechSynthesis.cancel();
    setMode("idle");
    setPaused(false);
    setIdx(0);
  }

  function cycleRate() {
    sfx.tick();
    const next = (rateIdx + 1) % RATES.length;
    setRateIdx(next);
    applyRate(RATES[next]);
    if (mode === "device" && !paused) speakFrom(idx, RATES[next]);
  }

  function seek(t: number) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = t;
    setTime(t);
  }

  /* ---- render ---------------------------------------------------------- */

  if (!clip && !ttsSupported) return null;
  const active = mode !== "idle" && !paused;

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border border-violet-500/40 bg-violet-500/5 px-4 py-3"
      role="group"
      aria-label="audio notes — listen to this lesson"
    >
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-violet-300">
        <Volume2 className="h-4 w-4" aria-hidden />
        audio_notes
      </span>

      {clip && !studioError ? (
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {mode === "studio" ? (
              <button
                type="button"
                onClick={pauseStudio}
                className="flex items-center gap-1.5 rounded-md border border-violet-500/50 bg-violet-500/15 px-3 py-1.5 font-mono text-xs uppercase text-violet-200 term-focus hover:bg-violet-500/25"
              >
                {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
                {paused ? "resume" : "pause"}
              </button>
            ) : (
              <button
                type="button"
                onClick={playStudio}
                className="flex items-center gap-1.5 rounded-md border border-violet-500/50 bg-violet-500/15 px-3 py-1.5 font-mono text-xs uppercase text-violet-200 term-focus hover:bg-violet-500/25"
              >
                <Play className="h-3.5 w-3.5" aria-hidden />
                listen
              </button>
            )}
            {mode === "studio" ? (
              <button
                type="button"
                onClick={stopAll}
                aria-label="stop audio"
                className="flex items-center rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 font-mono text-xs uppercase text-muted-foreground term-focus hover:text-foreground"
              >
                <Square className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
            <button
              type="button"
              onClick={cycleRate}
              className="flex items-center gap-1 rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 font-mono text-xs uppercase text-muted-foreground term-focus hover:text-foreground"
              title="reading speed"
            >
              <Gauge className="h-3.5 w-3.5" aria-hidden />
              {RATES[rateIdx]}×
            </button>
          </div>

          {/* seek bar + time */}
          <div className="flex min-w-36 flex-1 items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || clip.seconds || 1}
              step={0.5}
              value={Math.min(time, duration || 1)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="seek voice note"
              className="h-1.5 w-full min-w-16 cursor-pointer accent-violet-500"
            />
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {fmtTime(time)} / {fmtTime(duration || clip.seconds)}
            </span>
          </div>

          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violet-300",
              mode === "studio" && !paused && "animate-pulse",
            )}
            title="pre-generated studio narration"
          >
            <Headphones className="h-3 w-3" aria-hidden />
            studio
          </span>
        </div>
      ) : (
        <span className="font-mono text-[11px] text-muted-foreground">
          {clip ? "clip unavailable — using device voice" : "device voice"}
        </span>
      )}

      {/* device tts: full lesson text */}
      {ttsSupported && passages.length > 1 ? (
        <div className="flex items-center gap-2">
          {mode === "device" ? (
            <>
              <button
                type="button"
                onClick={pauseDevice}
                className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 font-mono text-xs uppercase text-muted-foreground term-focus hover:text-foreground"
              >
                {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
                {paused ? "resume" : "pause"}
              </button>
              <button
                type="button"
                onClick={stopAll}
                aria-label="stop device voice"
                className="flex items-center rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 font-mono text-xs uppercase text-muted-foreground term-focus hover:text-foreground"
              >
                <Square className="h-3.5 w-3.5" aria-hidden />
              </button>
              <span className="font-mono text-[11px] text-muted-foreground">
                passage {idx + 1}/{passages.length}
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={playDevice}
              className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 font-mono text-[11px] uppercase text-muted-foreground term-focus hover:text-foreground"
              title="read the full lesson text with the device voice"
            >
              <BookOpenText className="h-3.5 w-3.5" aria-hidden />
              full lesson · device voice
            </button>
          )}
        </div>
      ) : null}

      {active ? (
        <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-[2px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-3 w-[3px] rounded-sm bg-violet-400 animate-pulse"
                style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
              />
            ))}
          </span>
        </span>
      ) : null}
    </div>
  );
}
