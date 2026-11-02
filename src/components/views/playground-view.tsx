"use client";

import { useEffect, useState } from "react";
import { getRunner, type RunResult } from "@/lib/runner";
import { TermWindow, SectionHeading } from "@/components/term-ui";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ta:playground-code";

const SAMPLE = `// TRAINING GROUNDS — free code mode
// Write anything. console.log() it. Break things.
// Nothing here can escape the sandbox.

// Example: brute-force a Caesar cipher
function rotate(text, shift) {
  let out = "";
  for (const ch of text) {
    if (ch >= "A" && ch <= "Z") {
      const code = ch.charCodeAt(0) - 65;
      const moved = ((code + shift) % 26 + 26) % 26;
      out += String.fromCharCode(moved + 65);
    } else {
      out += ch;
    }
  }
  return out;
}

const secret = "KHOOR";
for (let s = 1; s < 26; s++) {
  console.log("shift " + s + ": " + rotate(secret, -s));
}
`;

export function PlaygroundView() {
  const [code, setCode] = useState(SAMPLE);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCode(saved);
    } catch {
      /* private mode etc */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore quota errors */
    }
  }, [code]);

  async function run() {
    if (running) return;
    setRunning(true);
    try {
      const r = await getRunner().run(code);
      setResult(r);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>
          <span className="text-muted-foreground mr-2">$</span>playground
        </SectionHeading>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          A free-range sandbox for your JavaScript experiments. Runs in an isolated frame on your
          device — no server, no network. Your code auto-saves locally.
        </p>
      </div>

      <TermWindow title="playground.js" bodyClassName="p-0">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const el = e.currentTarget;
              const start = el.selectionStart;
              const end = el.selectionEnd;
              const next = code.slice(0, start) + "  " + code.slice(end);
              setCode(next);
              requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = start + 2;
              });
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              void run();
            }
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="JavaScript playground editor"
          className="block min-h-[300px] w-full resize-y bg-[#050806] p-4 font-mono text-[13px] leading-6 text-emerald-100 caret-emerald-400 outline-none sm:min-h-[380px]"
        />
        <div className="flex items-center gap-2 border-t border-border bg-secondary/40 px-3 py-2.5">
          <button
            type="button"
            onClick={() => void run()}
            disabled={running}
            className="flex items-center gap-2 rounded-md border border-primary/50 bg-primary/15 px-4 py-2 font-mono text-sm font-bold text-primary term-focus hover:bg-primary/25 disabled:opacity-50"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            {running ? "running..." : "run"}
          </button>
          <button
            type="button"
            onClick={() => {
              setCode(SAMPLE);
              setResult(null);
            }}
            className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-2 font-mono text-xs text-muted-foreground term-focus hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            load sample
          </button>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">ctrl+enter to run</span>
        </div>
      </TermWindow>

      {result ? (
        <div className="animate-rise space-y-3">
          {result.error ? (
            <div className="rounded-md border border-red-500/40 bg-red-500/5 p-3">
              <p className="mb-1 font-mono text-xs font-bold uppercase text-red-400">runtime error</p>
              <pre className="overflow-x-auto font-mono text-[12.5px] leading-5 text-red-200/90">
                <code>{result.error}</code>
              </pre>
            </div>
          ) : null}
          <TermWindow title="console" bodyClassName="p-3">
            {result.logs.length === 0 && !result.error ? (
              <p className="font-mono text-xs text-muted-foreground">
                no output — try console.log(&quot;something&quot;)
              </p>
            ) : (
              <pre className="max-h-72 overflow-y-auto font-mono text-[12.5px] leading-5 text-foreground/80">
                <code>
                  {result.logs.map((l, i) => (
                    <span key={i} className="block">
                      <span className="text-primary select-none" aria-hidden>
                        &raquo;{" "}
                      </span>
                      {l}
                    </span>
                  ))}
                </code>
              </pre>
            )}
          </TermWindow>
        </div>
      ) : null}
    </div>
  );
}
