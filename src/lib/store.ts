"use client";

/**
 * Offline progress store — everything lives in localStorage via zustand/persist.
 * No accounts, no server: your device remembers your journey.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ALL_LESSONS, getLessonRef, lessonsOf, courseStats } from "@/lib/content";
import { COURSES } from "@/data/courses";
import type { CourseId } from "@/data/types";
import { levelFromXp, todayStr, addDays, daysBetween } from "@/lib/gamify";

export type LessonRecord = {
  completedAt: string; // ISO
  quizPerfect: boolean;
  exerciseDone: boolean;
  xpAwarded: number;
};

export type CompleteResult = {
  xpGained: number;
  newLevel: number | null;
  newBadges: string[];
  streak: { count: number; usedFreeze: boolean; freezeEarned: boolean };
  firstTime: boolean;
};

type Streak = {
  count: number;
  best: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  freezes: number;
};

export type AcademyState = {
  handle: string;
  xp: number;
  streak: Streak;
  lessons: Record<string, LessonRecord>;
  badges: Record<string, string>; // badgeId -> ISO earned
  lastLessonId: string | null;
  history: Record<string, number>; // YYYY-MM-DD -> xp gained
  version: number;

  setHandle: (name: string) => void;
  completeLesson: (
    lessonId: string,
    opts: { quizPerfect: boolean; exerciseDone: boolean },
  ) => CompleteResult | null;
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
};

const BADGE_RULES: Array<{
  id: string;
  test: (s: { lessons: Record<string, LessonRecord>; xp: number; streak: Streak }) => boolean;
}> = [
  { id: "first-steps", test: (s) => Object.keys(s.lessons).length >= 1 },
  { id: "streak-7", test: (s) => s.streak.count >= 7 || s.streak.best >= 7 },
  { id: "streak-30", test: (s) => s.streak.count >= 30 || s.streak.best >= 30 },
  {
    id: "quiz-sniper",
    test: (s) => Object.values(s.lessons).filter((r) => r.quizPerfect).length >= 10,
  },
  {
    id: "quiz-machine",
    test: (s) => Object.values(s.lessons).filter((r) => r.quizPerfect).length >= 25,
  },
  {
    id: "code-runner",
    test: (s) => Object.values(s.lessons).filter((r) => r.exerciseDone).length >= 5,
  },
  {
    id: "code-ninja",
    test: (s) =>
      Object.values(s.lessons).filter((r) => r.exerciseDone).length >=
      ALL_LESSONS.filter((r) => r.lesson.exercise).length,
  },
  {
    id: "boss-slayer",
    test: (s) =>
      ALL_LESSONS.filter((r) => r.lesson.boss && s.lessons[r.id]).length >= 1,
  },
  {
    id: "boss-master",
    test: (s) =>
      ALL_LESSONS.filter((r) => r.lesson.boss && s.lessons[r.id]).length ===
      ALL_LESSONS.filter((r) => r.lesson.boss).length,
  },
  { id: "foundations-complete", test: (s) => courseComplete(s, "foundations") },
  { id: "crypto-complete", test: (s) => courseComplete(s, "crypto") },
  { id: "security-complete", test: (s) => courseComplete(s, "security") },
  { id: "architecture-complete", test: (s) => courseComplete(s, "architecture") },
  { id: "development-complete", test: (s) => courseComplete(s, "development") },
  { id: "level-5", test: (s) => levelFromXp(s.xp) >= 5 },
  { id: "level-10", test: (s) => levelFromXp(s.xp) >= 10 },
  {
    id: "scholar",
    test: (s) => COURSES.every((c) => courseComplete(s, c.id)),
  },
];

function courseComplete(
  s: { lessons: Record<string, LessonRecord> },
  courseId: CourseId,
): boolean {
  const siblings = lessonsOf(courseId);
  return siblings.every((r) => s.lessons[r.id]);
}

function evaluateBadges(state: AcademyState): string[] {
  const snapshot = { lessons: state.lessons, xp: state.xp, streak: state.streak };
  const earned: string[] = [];
  for (const rule of BADGE_RULES) {
    if (!state.badges[rule.id] && rule.test(snapshot)) {
      earned.push(rule.id);
    }
  }
  return earned;
}

const emptyStreak: Streak = { count: 0, best: 0, lastActiveDate: null, freezes: 0 };

export const useAcademy = create<AcademyState>()(
  persist(
    (set, get) => ({
      handle: "agent",
      xp: 0,
      streak: { ...emptyStreak },
      lessons: {},
      badges: {},
      lastLessonId: null,
      history: {},
      version: 1,

      setHandle: (name) => set({ handle: name.trim().slice(0, 20) || "agent" }),

      completeLesson: (lessonId, opts) => {
        const ref = getLessonRef(lessonId);
        if (!ref) return null;
        const state = get();
        const existing = state.lessons[lessonId];

        // ----- XP -----
        let xpGained = 0;
        if (!existing) {
          xpGained = ref.lesson.xp;
          const hasGradedPart = ref.lesson.quiz.length > 0 || !!ref.lesson.boss;
          if (hasGradedPart && opts.quizPerfect) xpGained += 5;
          if (ref.lesson.exercise && opts.exerciseDone) xpGained += 5;
        }

        // ----- streak -----
        let streak = { ...state.streak };
        const today = todayStr();
        let usedFreeze = false;
        let freezeEarned = false;
        if (streak.lastActiveDate !== today) {
          if (streak.lastActiveDate) {
            const gap = daysBetween(streak.lastActiveDate, today);
            if (gap === 1) {
              streak.count += 1;
            } else if (gap === 2 && streak.freezes > 0) {
              streak.freezes -= 1;
              streak.count += 1;
              usedFreeze = true;
            } else {
              streak.count = 1;
            }
          } else {
            streak.count = 1;
          }
          streak.lastActiveDate = today;
          streak.best = Math.max(streak.best, streak.count);
          if (streak.count > 0 && streak.count % 7 === 0 && streak.freezes < 3) {
            streak.freezes += 1;
            freezeEarned = true;
          }
        }

        // ----- commit -----
        const lessons = { ...state.lessons };
        lessons[lessonId] = existing
          ? {
              ...existing,
              quizPerfect: existing.quizPerfect || opts.quizPerfect,
              exerciseDone: existing.exerciseDone || opts.exerciseDone,
            }
          : {
              completedAt: new Date().toISOString(),
              quizPerfect: opts.quizPerfect,
              exerciseDone: opts.exerciseDone,
              xpAwarded: xpGained,
            };

        const prevLevel = levelFromXp(state.xp);
        const xp = state.xp + xpGained;
        const newLevel = levelFromXp(xp) > prevLevel ? levelFromXp(xp) : null;

        const history = { ...state.history };
        history[today] = (history[today] ?? 0) + xpGained;

        const nextState: AcademyState = {
          ...state,
          xp,
          streak,
          lessons,
          lastLessonId: lessonId,
          history,
        };

        // ----- badges -----
        const newBadges = evaluateBadges(nextState);
        const badges = { ...state.badges };
        const now = new Date().toISOString();
        for (const id of newBadges) badges[id] = now;

        set({
          xp,
          streak,
          lessons,
          badges,
          lastLessonId: lessonId,
          history,
        });

        return {
          xpGained,
          newLevel,
          newBadges,
          streak: { count: streak.count, usedFreeze, freezeEarned },
          firstTime: !existing,
        };
      },

      exportData: () => {
        const s = get();
        return JSON.stringify(
          {
            app: "terminal-academy",
            version: 1,
            exportedAt: new Date().toISOString(),
            handle: s.handle,
            xp: s.xp,
            streak: s.streak,
            lessons: s.lessons,
            badges: s.badges,
            lastLessonId: s.lastLessonId,
            history: s.history,
          },
          null,
          2,
        );
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.app !== "terminal-academy" || typeof data.xp !== "number" || !data.lessons) {
            return false;
          }
          set({
            handle: typeof data.handle === "string" ? data.handle : "agent",
            xp: data.xp,
            streak: data.streak ?? { ...emptyStreak },
            lessons: data.lessons ?? {},
            badges: data.badges ?? {},
            lastLessonId: data.lastLessonId ?? null,
            history: data.history ?? {},
            version: 1,
          });
          return true;
        } catch {
          return false;
        }
      },

      resetAll: () => {
        set({
          handle: "agent",
          xp: 0,
          streak: { ...emptyStreak },
          lessons: {},
          badges: {},
          lastLessonId: null,
          history: {},
          version: 1,
        });
      },
    }),
    {
      name: "terminal-academy-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/* ---------------- derived selectors ---------------- */

export function useCompletedSet(): Set<string> {
  return new Set(Object.keys(useAcademy((s) => s.lessons)));
}
