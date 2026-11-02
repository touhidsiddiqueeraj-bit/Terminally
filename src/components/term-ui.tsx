"use client";

import { Cpu, KeyRound, Shield, Sparkles, Flame, Zap, Target, Brain, Code2, Terminal, Swords, Crown, GraduationCap, TrendingUp, Trophy, Lock, Check, BookOpen, ChevronRight, Heart, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseId } from "@/data/types";

/* ---------------- course color system ---------------- */

export type CourseColor = {
  text: string;
  bgSoft: string;
  border: string;
  glow: string;
  ring: string;
  hex: string;
};

export const COURSE_COLORS: Record<CourseId, CourseColor> = {
  foundations: {
    text: "text-emerald-400",
    bgSoft: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    glow: "glow-green",
    ring: "focus-visible:ring-emerald-500",
    hex: "#34d399",
  },
  crypto: {
    text: "text-violet-400",
    bgSoft: "bg-violet-500/10",
    border: "border-violet-500/40",
    glow: "glow-purple",
    ring: "focus-visible:ring-violet-500",
    hex: "#a78bfa",
  },
  security: {
    text: "text-amber-400",
    bgSoft: "bg-amber-500/10",
    border: "border-amber-500/40",
    glow: "glow-amber",
    ring: "focus-visible:ring-amber-500",
    hex: "#fbbf24",
  },
};

export function courseColor(id: CourseId): CourseColor {
  return COURSE_COLORS[id];
}

/* ---------------- icon registry ---------------- */

export const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  key: KeyRound,
  shield: Shield,
  sparkles: Sparkles,
  flame: Flame,
  zap: Zap,
  target: Target,
  brain: Brain,
  code: Code2,
  terminal: Terminal,
  swords: Swords,
  crown: Crown,
  graduation: GraduationCap,
  trending: TrendingUp,
  trophy: Trophy,
  lock: Lock,
  check: Check,
  book: BookOpen,
  chevron: ChevronRight,
  heart: Heart,
  star: Star,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? BookOpen;
  return <Cmp className={className} aria-hidden />;
}

/* ---------------- terminal window chrome ---------------- */

export function TermWindow({
  title,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("rounded-md border border-border bg-card overflow-hidden", className)}>
      <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-2 truncate font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </div>
  );
}

/* ---------------- small stat chip ---------------- */

export function StatChip({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5",
        className,
      )}
      title={label}
    >
      <span className="text-primary">{icon}</span>
      <span className="font-mono text-xs text-muted-foreground hidden sm:inline">{label}</span>
      <span className="font-mono text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

/* ---------------- xp progress bar ---------------- */

export function XPBar({
  pct,
  className,
  colorClass,
}: {
  pct: number;
  className?: string;
  colorClass?: string;
}) {
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-sm border border-border bg-secondary", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full bg-primary transition-all duration-700", colorClass)}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}

/* ---------------- section heading in terminal style ---------------- */

export function SectionHeading({
  children,
  className,
  accent = "text-primary",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-2xl sm:text-3xl tracking-wide uppercase",
        accent,
        className,
      )}
    >
      {children}
    </h2>
  );
}
