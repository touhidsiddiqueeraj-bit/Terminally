"use client";

/**
 * Interactive demos — live widgets rendered inside lessons.
 * Each demo is real, client-side logic the learner can poke at:
 * flip actual bits, turn an actual Caesar dial, watch a hash avalanche,
 * grow actual password entropy, and fire a packet across the network.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { DemoId } from "@/data/types";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/sound";
import { Play, RotateCcw, Dices, Wifi, Server, Router, Laptop, ArrowRight } from "lucide-react";

/* ---------------- shared chrome ---------------- */

const DEMO_META: Record<DemoId, { title: string; blurb: string }> = {
  "binary-lab": { title: "bit_workshop", blurb: "flip the switches — the machine's answer updates live" },
  "caesar-wheel": { title: "caesar_dial", blurb: "slide the dial — every letter marches around the alphabet" },
  "xor-pad": { title: "xor_pad", blurb: "toggle key bits — encryption and decryption are the same move" },
  "hash-viz": { title: "hash_forge", blurb: "change one character — watch the whole digest explode" },
  "entropy-meter": { title: "entropy_gauge", blurb: "grow a password — watch its cracking cost soar" },
  "packet-run": { title: "packet_run", blurb: "fire a packet — hop by hop across the internet" },
};

function DemoShell({ demo, title, children }: { demo: DemoId; title?: string; children: React.ReactNode }) {
  const meta = DEMO_META[demo];
  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden rounded-md border border-primary/30 bg-card"
    >
      <figcaption className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/60 px-3 py-1.5">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
          live_demo
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {title ?? meta.title}
        </span>
        <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground sm:inline">
          {meta.blurb}
        </span>
      </figcaption>
      <div className="p-4 sm:p-5">{children}</div>
    </motion.figure>
  );
}

/* ---------------- binary lab ---------------- */

const BIT_VALUE = [128, 64, 32, 16, 8, 4, 2, 1];

function BinaryLab() {
  const [bits, setBits] = useState<number[]>([0, 0, 0, 0, 0, 1, 0, 1]);
  const [challenge, setChallenge] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const value = bits.reduce((sum, b, i) => sum + b * BIT_VALUE[i], 0);
  const hex = value.toString(16).padStart(2, "0").toUpperCase();
  const ch = value >= 32 && value < 127 ? String.fromCharCode(value) : "·";

  function toggle(i: number) {
    sfx.tick();
    const next = [...bits];
    next[i] = next[i] ? 0 : 1;
    setBits(next);
    if (challenge !== null) {
      const nv = next.reduce((sum, b, j) => sum + b * BIT_VALUE[j], 0);
      if (nv === challenge) {
        sfx.correct();
        setFlash(true);
        setChallenge(null);
      } else {
        setFlash(false);
      }
    }
  }

  function newChallenge() {
    sfx.roundStart();
    setFlash(false);
    setChallenge(Math.floor(Math.random() * 128) + 64); // 64..191
  }

  return (
    <div className="space-y-4">
      {/* bit switches */}
      <div className={cn("grid grid-cols-8 gap-1 sm:gap-1.5", flash && "animate-pop")}>
        {bits.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={!!b}
            aria-label={`bit worth ${BIT_VALUE[i]}`}
            className={cn(
              "group flex flex-col items-center gap-1 rounded-md border py-2 transition-all term-focus active:translate-y-px",
              b
                ? "border-primary/60 bg-primary/15 shadow-[0_0_12px_-4px_rgba(34,227,148,0.5)]"
                : "border-border bg-secondary/40 hover:border-primary/40",
            )}
          >
            <span
              className={cn(
                "font-display text-xl leading-none transition-colors",
                b ? "text-primary" : "text-muted-foreground/60",
              )}
            >
              {b}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">{BIT_VALUE[i]}</span>
          </button>
        ))}
      </div>

      {/* readouts */}
      <div className="grid grid-cols-3 gap-2">
        <Readout label="decimal" value={String(value)} />
        <Readout label="hex" value={`0x${hex}`} />
        <Readout label="ascii" value={ch === "·" ? "—" : `'${ch}'`} />
      </div>

      {/* challenge */}
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-secondary/30 px-3 py-2.5">
        {challenge === null ? (
          <>
            <span className="font-mono text-xs text-muted-foreground">challenge: build a number from bits</span>
            <button
              type="button"
              onClick={newChallenge}
              className="ml-auto flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary term-focus hover:bg-primary/20"
            >
              <Dices className="h-3.5 w-3.5" aria-hidden /> give me a target
            </button>
          </>
        ) : (
          <>
            <span className="font-mono text-xs text-muted-foreground">target:</span>
            <span className="font-display text-2xl text-primary glow-green">{challenge}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {value < challenge ? "▲ add more" : value > challenge ? "▼ too big — clear some" : "match!"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-[#050806] px-3 py-2 text-center">
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-xl leading-tight text-primary">{value}</p>
    </div>
  );
}

/* ---------------- caesar wheel ---------------- */

function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-z]/gi, (c) => {
    const base = c === c.toLowerCase() ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
  });
}

function CaesarWheel() {
  const [text, setText] = useState("attack at dawn");
  const [shift, setShift] = useState(3);

  const output = useMemo(() => caesarShift(text, shift), [text, shift]);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const shiftedAlphabet = useMemo(
    () => caesarShift(alphabet, shift).toUpperCase(),
    [shift],
  );

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          plaintext
        </span>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            sfx.key();
            setText(e.target.value.slice(0, 48));
          }}
          className="w-full rounded-md border border-border bg-[#050806] px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary/50"
          aria-label="plaintext to encode"
        />
      </label>

      {/* dial */}
      <div>
        <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>shift dial</span>
          <span className="text-primary">+{shift} (rot{shift === 13 ? "13" : shift})</span>
        </div>
        <input
          type="range"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => {
            setShift(Number(e.target.value));
            sfx.tick();
          }}
          className="w-full accent-[#22e394]"
          aria-label="caesar shift amount"
        />
        <div className="mt-2 grid grid-cols-[26] gap-[2px] font-mono text-[10px]" aria-hidden>
          <div className="grid grid-cols-[repeat(26,1fr)] overflow-hidden rounded border border-border bg-[#050806]">
            {alphabet.split("").map((c) => (
              <span key={c} className="py-0.5 text-center text-muted-foreground">{c}</span>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(26,1fr)] overflow-hidden rounded border border-border bg-[#050806]">
            {shiftedAlphabet.split("").map((c, i) => (
              <span
                key={i}
                className={cn(
                  "py-0.5 text-center transition-colors",
                  c === alphabet[i] ? "text-amber-400" : "text-primary",
                )}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">ciphertext</p>
        <p className="break-all font-mono text-sm text-primary">{output || "…"}</p>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">
        rot-13 is the only shift that is its own inverse — set the dial to 13 and watch the rows swap.
      </p>
    </div>
  );
}

/* ---------------- xor pad ---------------- */

function hexOfBits(bits: number[]): string {
  return parseInt(bits.join(""), 2).toString(16).padStart(2, "0").toUpperCase();
}

function BitRow({
  bits,
  label,
  color,
  onFlip,
}: {
  bits: number[];
  label: string;
  color: string;
  onFlip: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-14 shrink-0 font-mono text-[10px] uppercase tracking-widest", color)}>{label}</span>
      <div className="grid flex-1 grid-cols-8 gap-1">
        {bits.map((bit, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onFlip(i)}
            aria-pressed={!!bit}
            aria-label={`${label} bit ${i}`}
            className={cn(
              "rounded border py-1.5 font-mono text-sm transition-all term-focus active:translate-y-px",
              bit
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-border bg-secondary/40 text-muted-foreground/60 hover:border-primary/40",
            )}
          >
            {bit}
          </button>
        ))}
      </div>
      <span className={cn("w-12 shrink-0 text-right font-mono text-xs", color)}>0x{hexOfBits(bits)}</span>
    </div>
  );
}

function XORPad() {
  const [a, setA] = useState<number[]>([0, 1, 0, 1, 0, 0, 1, 1]);
  const [b, setB] = useState<number[]>([1, 0, 0, 1, 1, 1, 0, 0]);
  const out = a.map((x, i) => x ^ b[i]);
  const aVal = parseInt(a.join(""), 2);
  const bVal = parseInt(b.join(""), 2);
  const outVal = parseInt(out.join(""), 2);

  function flip(row: "a" | "b", i: number) {
    sfx.tick();
    if (row === "a") setA((p) => p.map((x, j) => (j === i ? (x ? 0 : 1) : x)));
    else setB((p) => p.map((x, j) => (j === i ? (x ? 0 : 1) : x)));
  }

  return (
    <div className="space-y-3">
      <BitRow bits={a} label="message" color="text-amber-400" onFlip={(i) => flip("a", i)} />
      <BitRow bits={b} label="key" color="text-violet-400" onFlip={(i) => flip("b", i)} />
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">⊕ xor</span>
        <div className="grid flex-1 grid-cols-8 gap-1">
          {out.map((bit, i) => (
            <span
              key={i}
              className={cn(
                "rounded border py-1.5 text-center font-mono text-sm",
                bit ? "border-primary/60 bg-primary/15 text-primary animate-pop" : "border-border bg-secondary/30 text-muted-foreground/60",
              )}
              style={{ animationDuration: "0.25s" }}
            >
              {bit}
            </span>
          ))}
        </div>
        <span className="w-12 shrink-0 text-right font-mono text-xs text-primary">0x{hexOfBits(out)}</span>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">
        {aVal} ⊕ {bVal} = {outVal} — now toggle a key bit: the whole ciphertext changes, and XORing
        the same key again restores the message exactly.
      </p>
    </div>
  );
}

/* ---------------- hash viz ---------------- */

function djb2(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function HashViz() {
  const [input, setInput] = useState("hello");
  const [compare, setCompare] = useState("hellp");

  const h1 = djb2(input);
  const h2 = djb2(compare);
  const bits1 = parseInt(h1, 16).toString(2).padStart(32, "0");
  const bits2 = parseInt(h2, 16).toString(2).padStart(32, "0");
  const diffBits = [...bits1].filter((b, i) => b !== bits2[i]).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            input a
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              sfx.key();
              setInput(e.target.value.slice(0, 24));
            }}
            className="w-full rounded-md border border-border bg-[#050806] px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary/50"
            aria-label="first hash input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            input b (your edit)
          </span>
          <input
            type="text"
            value={compare}
            onChange={(e) => {
              sfx.key();
              setCompare(e.target.value.slice(0, 24));
            }}
            className="w-full rounded-md border border-border bg-[#050806] px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary/50"
            aria-label="second hash input"
          />
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Digest label="digest(a)" hex={h1} />
        <Digest label="digest(b)" hex={h2} />
      </div>

      {/* avalanche */}
      <div className="rounded-md border border-border bg-secondary/30 p-3">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>avalanche — bit differences</span>
          <span className={cn("font-bold", diffBits > 12 ? "text-red-400" : "text-amber-400")}>
            {diffBits}/32 bits flipped
          </span>
        </div>
        <div className="flex gap-[3px]" aria-hidden>
          {[...bits1].map((b, i) => (
            <span
              key={i}
              title={`bit ${i}: ${b} → ${bits2[i]}`}
              className={cn(
                "h-5 flex-1 rounded-sm transition-colors",
                b !== bits2[i] ? "bg-red-500/80" : "bg-primary/25",
              )}
              style={{ minWidth: 8 }}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          change one character — a good hash flips roughly half of all output bits.
          this toy djb2 is not cryptographic, but the avalanche instinct is what
          SHA-256 perfects.
        </p>
      </div>
    </div>
  );
}

function Digest({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-mono text-sm break-all text-primary">{hex}</p>
    </div>
  );
}

/* ---------------- entropy meter ---------------- */

const CLASSES = [
  { test: (pw: string) => /[a-z]/.test(pw), label: "lowercase", pool: 26 },
  { test: (pw: string) => /[A-Z]/.test(pw), label: "uppercase", pool: 26 },
  { test: (pw: string) => /[0-9]/.test(pw), label: "digits", pool: 10 },
  { test: (pw: string) => /[^a-zA-Z0-9]/.test(pw), label: "symbols", pool: 33 },
];

function entropyBits(pw: string): number {
  if (!pw) return 0;
  let pool = 0;
  for (const c of CLASSES) if (c.test(pw)) pool += c.pool;
  return Math.round(pw.length * Math.log2(Math.max(pool, 2)));
}

function crackVerdict(bits: number): { label: string; cls: string; time: string } {
  // 10 billion guesses per second — a strong offline attacker
  const seconds = Math.pow(2, bits - 1) / 1e10;
  if (bits < 28) return { label: "instantly cracked", cls: "text-red-400", time: fmtTime(seconds) };
  if (bits < 45) return { label: "minutes to hours", cls: "text-red-400", time: fmtTime(seconds) };
  if (bits < 60) return { label: "years — but attackable", cls: "text-amber-400", time: fmtTime(seconds) };
  if (bits < 80) return { label: "centuries at scale", cls: "text-emerald-400", time: fmtTime(seconds) };
  return { label: "heat death of the universe", cls: "text-emerald-400", time: fmtTime(seconds) };
}

function fmtTime(seconds: number): string {
  if (seconds < 1e-3) return "< a millisecond";
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} sec`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds < 3.15e7) return `${(seconds / 86400).toFixed(1)} days`;
  const years = seconds / 3.15e7;
  if (years < 1e3) return `${years.toFixed(1)} years`;
  if (years < 1e6) return `${(years / 1e3).toFixed(1)}k years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)}M years`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1)}B years`;
  return "10^" + Math.log10(years).toFixed(0) + " years";
}

function EntropyMeter() {
  const [pw, setPw] = useState("hunter2");
  const bits = entropyBits(pw);
  const pct = Math.min(100, (bits / 100) * 100);
  const verdict = crackVerdict(bits);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          test password (never leaves this page)
        </span>
        <input
          type="text"
          value={pw}
          onChange={(e) => {
            sfx.key();
            setPw(e.target.value.slice(0, 32));
          }}
          className="w-full rounded-md border border-border bg-[#050806] px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary/50"
          aria-label="password to analyze"
          autoComplete="off"
        />
      </label>

      {/* meter */}
      <div>
        <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>entropy</span>
          <span className="font-display text-lg" style={{ color: verdict.cls.startsWith("text-") ? undefined : undefined }}>{bits} bits</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-sm border border-border bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={cn(
              "h-full transition-all duration-500",
              bits < 45 ? "bg-red-500" : bits < 60 ? "bg-amber-500" : "bg-emerald-500",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CLASSES.map((c) => (
          <span
            key={c.label}
            className={cn(
              "rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
              c.test(pw)
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-secondary/40 text-muted-foreground/60",
            )}
          >
            {c.test(pw) ? "✓" : "✗"} {c.label}
          </span>
        ))}
      </div>

      <div className="rounded-md border border-border bg-secondary/30 px-3 py-2">
        <p className="font-mono text-[11px] text-muted-foreground">
          offline attack @ 10 billion guesses/sec:{" "}
          <span className={cn("font-bold", verdict.cls)}>
            {verdict.label} — {verdict.time}
          </span>
        </p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          length beats cleverness: every extra character multiplies the search space.
          try adding 4 random words and watch the verdict flip.
        </p>
      </div>
    </div>
  );
}

/* ---------------- packet run ---------------- */

const HOPS = [
  { name: "your laptop", icon: Laptop },
  { name: "wi-fi router", icon: Wifi },
  { name: "ISP gateway", icon: Router },
  { name: "backbone", icon: ArrowRight },
  { name: "the server", icon: Server },
];

function PacketRun() {
  const [hop, setHop] = useState(-1);
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function fire() {
    if (running) return;
    sfx.roundStart();
    setRunning(true);
    setLog([`$ send packet → ${HOPS[HOPS.length - 1].name}`]);
    setHop(0);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    for (let i = 1; i < HOPS.length; i++) {
      const t = window.setTimeout(() => {
        setHop(i);
        sfx.tick();
        setLog((prev) => [
          ...prev,
          `  ${i}. ${HOPS[i - 1].name} → ${HOPS[i].name}   ttl=${HOPS.length - i}   ${(
            3 + Math.random() * 9
          ).toFixed(1)}ms`,
        ]);
        if (i === HOPS.length - 1) {
          window.setTimeout(() => {
            sfx.correct();
            setLog((prev) => [...prev, `  ✓ response: 200 OK — packet returned home`]);
            setRunning(false);
          }, 420);
        }
      }, 650 * i);
      timers.current.push(t);
    }
  }

  function reset() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setHop(-1);
    setLog([]);
    setRunning(false);
    sfx.click();
  }

  return (
    <div className="space-y-4">
      {/* route */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {HOPS.map((h, i) => {
          const Icon = h.icon;
          const active = hop >= i;
          const current = hop === i;
          return (
            <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-center">
                {i > 0 ? (
                  <span
                    className={cn(
                      "mr-1 h-0.5 flex-1 rounded transition-all duration-500",
                      hop >= i ? "bg-primary/70" : "bg-border",
                    )}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                    active
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-border bg-secondary/40 text-muted-foreground",
                    current && "scale-110 shadow-[0_0_16px_-2px_rgba(34,227,148,0.6)]",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {i < HOPS.length - 1 ? (
                  <span
                    className={cn(
                      "ml-1 h-0.5 flex-1 rounded transition-all duration-500",
                      hop > i ? "bg-primary/70" : "bg-border",
                    )}
                    aria-hidden
                  />
                ) : null}
              </div>
              <span className="truncate font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {h.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* packet dot */}
      <div className="relative h-1 rounded bg-border" aria-hidden>
        <motion.span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(34,227,148,0.8)]"
          animate={{ left: hop >= 0 ? `${(hop / (HOPS.length - 1)) * 100}%` : "0%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={fire}
          disabled={running}
          className={cn(
            "flex items-center gap-1.5 rounded-md border-2 border-primary/60 bg-primary/15 px-4 py-2 font-display text-base uppercase text-primary term-focus hover:bg-primary/25 active:translate-y-px",
            running && "cursor-wait opacity-60",
          )}
        >
          <Play className="h-4 w-4" aria-hidden /> {running ? "in transit…" : "fire packet"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-2 font-mono text-xs uppercase text-muted-foreground term-focus hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> reset
        </button>
      </div>

      {/* traceroute log */}
      <div className="min-h-[7.5rem] rounded-md border border-border bg-[#050806] p-3 font-mono text-[11px] leading-5 text-emerald-100/80">
        {log.length === 0 ? (
          <span className="text-muted-foreground">waiting to fire…</span>
        ) : (
          log.map((l, i) => (
            <p key={i} className="animate-rise">{l}</p>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- registry ---------------- */

const DEMOS: Record<DemoId, () => React.ReactElement> = {
  "binary-lab": BinaryLab,
  "caesar-wheel": CaesarWheel,
  "xor-pad": XORPad,
  "hash-viz": HashViz,
  "entropy-meter": EntropyMeter,
  "packet-run": PacketRun,
};

export function InteractiveDemo({ demo, title }: { demo: DemoId; title?: string }) {
  const Comp = DEMOS[demo];
  return (
    <DemoShell demo={demo} title={title}>
      <Comp />
    </DemoShell>
  );
}
