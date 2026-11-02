import type { CourseId } from "@/data/types";

export type View =
  | { name: "dashboard" }
  | { name: "course"; courseId: CourseId }
  | { name: "lesson"; lessonId: string }
  | { name: "playground" }
  | { name: "profile" }
  | { name: "about" };

export function viewKey(v: View): string {
  return v.name === "course"
    ? `course:${v.courseId}`
    : v.name === "lesson"
      ? `lesson:${v.lessonId}`
      : v.name;
}
