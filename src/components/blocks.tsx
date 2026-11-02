"use client";

import type { Block } from "@/data/types";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, Lightbulb, Bot } from "lucide-react";

/** Renders lesson concept blocks — the reading part of every lesson. */
export function LessonBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-[15px] leading-7 text-foreground/90">{block.text}</p>
      );
    case "h":
      return (
        <h3 className="font-display text-xl uppercase tracking-wide text-primary pt-2">
          <span className="text-muted-foreground mr-2">#</span>
          {block.text}
        </h3>
      );
    case "code":
      return (
        <figure className="overflow-hidden rounded-md border border-border">
          {block.caption ? (
            <figcaption className="border-b border-border bg-secondary/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
          <pre className="overflow-x-auto bg-[#050806] p-4 font-mono text-[13px] leading-6 text-emerald-100/90">
            <code>{block.code}</code>
          </pre>
        </figure>
      );
    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-7 text-foreground/90">
              <span className="mt-0.5 font-mono text-primary select-none" aria-hidden>
                &gt;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return <Callout block={block} />;
    case "ascii":
      return (
        <pre
          className="overflow-x-auto rounded-md border border-border bg-[#050806] p-4 font-mono text-[11px] sm:text-[13px] leading-tight text-primary/90"
          aria-label="ASCII art illustration"
        >
          {block.art}
        </pre>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/70">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-border px-3 py-2 text-left font-mono text-xs uppercase tracking-wider text-primary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="odd:bg-secondary/20">
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-border/50 px-3 py-2 text-foreground/85">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

function Callout({ block }: { block: Extract<Block, { type: "callout" }> }) {
  const styles = {
    info: {
      wrap: "border-sky-400/30 bg-sky-400/5",
      icon: <Info className="h-4 w-4 text-sky-400" aria-hidden />,
      label: "DEEP DIVE",
      labelCls: "text-sky-400",
    },
    warn: {
      wrap: "border-red-400/30 bg-red-400/5",
      icon: <AlertTriangle className="h-4 w-4 text-red-400" aria-hidden />,
      label: "WATCH OUT",
      labelCls: "text-red-400",
    },
    tip: {
      wrap: "border-emerald-400/30 bg-emerald-400/5",
      icon: <Lightbulb className="h-4 w-4 text-emerald-400" aria-hidden />,
      label: "PRO TIP",
      labelCls: "text-emerald-400",
    },
    ai: {
      wrap: "border-violet-400/30 bg-violet-400/5",
      icon: <Bot className="h-4 w-4 text-violet-400" aria-hidden />,
      label: "AI ERA",
      labelCls: "text-violet-400",
    },
  }[block.variant];

  return (
    <aside className={cn("rounded-md border p-4", styles.wrap)}>
      <div className="mb-1.5 flex items-center gap-2">
        {styles.icon}
        <span className={cn("font-mono text-[11px] font-bold uppercase tracking-widest", styles.labelCls)}>
          {styles.label}
        </span>
      </div>
      <p className="text-sm leading-6 text-foreground/85">{block.text}</p>
    </aside>
  );
}
