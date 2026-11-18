"use client";

/**
 * Audio notes — "listen to this lesson".
 * Uses the browser's built-in speechSynthesis: no network, no audio files,
 * works offline and inside the Android WebView. Reads the lesson's prose
 * (headings, paragraphs, lists, callouts) and skips code/art tables.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Block } from "@/data/types";
import { cn } from "@/lib/utils";
import { Volume2, Play, Pause, Square, Gauge } from "lucide-react";
import { sfx } from "@/lib/sound";

const RATES = [0.85, 1, 1.25, 1.5] as const;

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

export function AudioNotes({ title, blocks }: { title: string; blocks: Block[] }) {
  const passages = useMemo(() => extractPassages(title, blocks), [title, blocks]);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [idx, setIdx] = useState(0);
  const [rateIdx, setRateIdx] = useState(1);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const boundaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  function speakFrom(i: number, rate: number) {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const speak = (j: number) => {
      if (j >= passages.length) {
        setPlaying(false);
        setIdx(0);
        return;
      }
      setIdx(j);
      const u = new SpeechSynthesisUtterance(passages[j]);
      u.rate = rate;
      u.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const en = voices.find((v) => v.lang.startsWith("en") && /male|david|daniel/i.test(v.name))
        ?? voices.find((v) => v.lang.startsWith("en"))
        ?? undefined;
      if (en) u.voice = en;
      u.onend = () => speak(j + 1);
      u.onerror = () => {
        setPlaying(false);
      };
      window.speechSynthesis.speak(u);
    };
    speak(i);
  }

  function play() {
    sfx.click();
    setPlaying(true);
    setPaused(false);
    speakFrom(idx, RATES[rateIdx]);
  }

  function pause() {
    if (!supported) return;
    sfx.click();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function stop() {
    if (!supported) return;
    sfx.click();
    window.speechSynthesis.cancel();
    setPlaying(false);
    setPaused(false);
    setIdx(0);
  }

  function cycleRate() {
    sfx.tick();
    const next = (rateIdx + 1) % RATES.length;
    setRateIdx(next);
    if (playing && !paused) speakFrom(idx, RATES[next]);
  }

  if (!supported) return null;

  return (
    <div
      ref={boundaryRef}
      className="flex flex-wrap items-center gap-3 rounded-lg border border-violet-500/40 bg-violet-500/5 px-4 py-3"
      role="group"
      aria-label="audio notes — listen to this lesson"
    >
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-violet-300">
        <Volume2 className="h-4 w-4" aria-hidden />
        audio_notes
      </span>

      <div className="flex items-center gap-2">
        {playing ? (
          <button
            type="button"
            onClick={pause}
            className="flex items-center gap-1.5 rounded-md border border-violet-500/50 bg-violet-500/15 px-3 py-1.5 font-mono text-xs uppercase text-violet-200 term-focus hover:bg-violet-500/25"
          >
            {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
            {paused ? "resume" : "pause"}
          </button>
        ) : (
          <button
            type="button"
            onClick={play}
            className="flex items-center gap-1.5 rounded-md border border-violet-500/50 bg-violet-500/15 px-3 py-1.5 font-mono text-xs uppercase text-violet-200 term-focus hover:bg-violet-500/25"
          >
            <Play className="h-3.5 w-3.5" aria-hidden />
            listen
          </button>
        )}
        {playing ? (
          <button
            type="button"
            onClick={stop}
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

      {playing ? (
        <span className="ml-auto flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="flex items-center gap-[2px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-3 w-[3px] rounded-sm bg-violet-400",
                  !paused && "animate-pulse",
                )}
                style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
              />
            ))}
          </span>
          passage {idx + 1}/{passages.length}
        </span>
      ) : (
        <span className="ml-auto hidden font-mono text-[11px] text-muted-foreground sm:inline">
          {passages.length} passages — offline text-to-speech
        </span>
      )}
    </div>
  );
}
