"use client";

/**
 * FX kit — the animation layer:
 *  - Confetti: a canvas burst of terminal glyphs ({, }, </>, 0, 1, $, #) in
 *    course colors. No dependencies, DPR-aware, auto-cleans.
 *  - AnimatedNumber: rAF count-up for XP counters.
 *  - BootSplash: the retro boot sequence shown once per browser session.
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sound";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------- confetti ---------------- */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  glyph: string;
  color: string;
  size: number;
  life: number;
};

const GLYPHS = ["{", "}", "</", ">", "0", "1", "$", "#", ";", "*"];
const COLORS = ["#22e394", "#a78bfa", "#fbbf24", "#f472b6", "#67e8f9"];

/**
 * Fire a confetti burst. Re-render the component with an incremented `fire`
 * value to trigger a new burst (e.g. `<Confetti fire={burstCount} />`).
 */
export function Confetti({ fire, intensity = 1 }: { fire: number; intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    const W = canvas.width;
    const H = canvas.height;
    const n = Math.round(90 * intensity);
    const cx = W / 2;
    const cy = H * 0.42;

    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2.2 + Math.random() * 4.2) * dpr;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2 * dpr,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.32,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: (10 + Math.random() * 10) * dpr,
        life: 1,
      });
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const tick = () => {
      const ps = particlesRef.current;
      ctx.clearRect(0, 0, W, H);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.vy += 0.14 * dpr; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life -= 0.011;
        if (p.life <= 0 || p.y > H + 40) {
          ps.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = p.color;
        ctx.textAlign = "center";
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      }
      frame++;
      if (ps.length > 0 && frame < 600) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fire, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
      aria-hidden
    />
  );
}

/* ---------------- animated number ---------------- */

/** Counts up (or down) to `value` with an ease-out curve. */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number | null>(null);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const dur = Math.min(900, 260 + Math.abs(to - from) * 2);
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
}

/* ---------------- boot splash ---------------- */

const BOOT_LINES = [
  "[ ok ] terminal_academy kernel v1.1 loaded",
  "[ ok ] mounting /dev/curiosity … 5 courses · 100 nodes",
  "[ ok ] arming arcade module … 4 games",
  "[ ok ] sound blaster … online",
  "[ ok ] decrypting your progress … done",
];

export function BootSplash({ onFinished }: { onFinished: () => void }) {
  const [lines, setLines] = useState(0);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    let skip = true;
    try {
      skip = sessionStorage.getItem("ta-booted") === "1";
    } catch {
      skip = false;
    }
    if (!skip && prefersReducedMotion()) skip = true;

    if (skip) {
      const t = window.setTimeout(() => {
        sfx.boot();
        onFinishedRef.current();
      }, 0);
      return () => window.clearTimeout(t);
    }

    let li = 0;
    let finishTimer: number | undefined;
    const id = window.setInterval(() => {
      li += 1;
      setLines(li);
      sfx.tick();
      if (li >= BOOT_LINES.length) {
        window.clearInterval(id);
        finishTimer = window.setTimeout(finish, 500);
      }
    }, 220);
    return () => {
      window.clearInterval(id);
      if (finishTimer !== undefined) window.clearTimeout(finishTimer);
    };

    function finish() {
      try {
        sessionStorage.setItem("ta-booted", "1");
      } catch {
        /* private mode — fine, we just re-boot next load */
      }
      sfx.boot();
      onFinishedRef.current();
    }
  }, []);

  function finishNow() {
    try {
      sessionStorage.setItem("ta-booted", "1");
    } catch {
      /* ignore */
    }
    sfx.boot();
    onFinishedRef.current();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
      <pre
        className="font-mono text-[7px] leading-tight text-primary/80 sm:text-[10px]"
        aria-hidden
      >{` ████████╗ █████╗ ██████╗ ███████╗██████╗  █████╗
 ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗
    ██║   ███████║██████╔╝█████╗  ██████╔╝███████║
    ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██╗██╔══██║
    ██║   ██║  ██║██║  ██║███████╗██║  ██║██║  ██║
    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝`}</pre>
      <div
        className="w-full max-w-md space-y-1 font-mono text-[11px] text-muted-foreground"
        role="status"
        aria-label="booting the academy"
      >
        {BOOT_LINES.slice(0, lines).map((l, i) => (
          <p key={i} className="animate-rise text-left">{l}</p>
        ))}
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
        booting<span className="caret" aria-hidden />
      </p>
      <button
        type="button"
        onClick={finishNow}
        className="rounded-md border border-border bg-secondary px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground term-focus hover:text-foreground"
      >
        skip boot
      </button>
    </div>
  );
}
