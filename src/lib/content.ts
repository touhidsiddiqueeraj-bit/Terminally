import { COURSES } from "@/data/courses";
import type { Course, Lesson, Chapter, CourseId } from "@/data/types";

export type LessonRef = {
  course: Course;
  chapter: Chapter;
  lesson: Lesson;
  /** 0-based position within the whole course */
  index: number;
  /** globally unique lesson id */
  id: string;
};

/** Flattened, ordered list of every node in every course. */
export const ALL_LESSONS: LessonRef[] = COURSES.flatMap((course) => {
  let i = 0;
  return course.chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({
      course,
      chapter,
      lesson,
      index: i++,
      id: lesson.id,
    })),
  );
});

const BY_ID = new Map<string, LessonRef>(ALL_LESSONS.map((r) => [r.id, r]));

export function getLessonRef(id: string): LessonRef | undefined {
  return BY_ID.get(id);
}

export function getCourse(id: CourseId): Course {
  const c = COURSES.find((c) => c.id === id);
  if (!c) throw new Error(`Unknown course: ${id}`);
  return c;
}

export function lessonsOf(courseId: CourseId): LessonRef[] {
  return ALL_LESSONS.filter((r) => r.course.id === courseId);
}

/** The next node in the same course, or null when the course is done. */
export function nextLessonRef(id: string): LessonRef | null {
  const ref = BY_ID.get(id);
  if (!ref) return null;
  const siblings = lessonsOf(ref.course.id);
  return siblings[ref.index + 1] ?? null;
}

/** Is this node unlocked? First node of each course is always open. */
export function isUnlocked(ref: LessonRef, completed: Set<string>): boolean {
  if (ref.index === 0) return true;
  const siblings = lessonsOf(ref.course.id);
  return completed.has(siblings[ref.index - 1].id);
}

export type CourseStats = {
  done: number;
  total: number;
  pct: number;
  xpEarned: number;
  xpTotal: number;
};

export function courseStats(
  courseId: CourseId,
  completed: Map<string, { xpAwarded: number }>,
): CourseStats {
  const siblings = lessonsOf(courseId);
  const total = siblings.length;
  let done = 0;
  let xpEarned = 0;
  let xpTotal = 0;
  for (const s of siblings) {
    xpTotal += s.lesson.xp;
    const rec = completed.get(s.id);
    if (rec) {
      done += 1;
      xpEarned += rec.xpAwarded;
    }
  }
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100), xpEarned, xpTotal };
}

/** First not-yet-completed node of a course (or null). */
export function nextIncomplete(courseId: CourseId, completed: Set<string>): LessonRef | null {
  return lessonsOf(courseId).find((r) => !completed.has(r.id)) ?? null;
}

export const CONTENT_TOTALS = {
  nodes: ALL_LESSONS.length,
  lessons: ALL_LESSONS.filter((r) => !r.lesson.boss).length,
  bosses: ALL_LESSONS.filter((r) => r.lesson.boss).length,
  exercises: ALL_LESSONS.filter((r) => r.lesson.exercise).length,
  xp: ALL_LESSONS.reduce((sum, r) => sum + r.lesson.xp, 0),
};
