import type { Course } from "./types";
import { foundationsCourse } from "./course-foundations";
import { cryptoCourse } from "./course-crypto";
import { securityCourse } from "./course-security";
import { architectureCourse } from "./course-architecture";
import { developmentCourse } from "./course-development";

export const COURSES: Course[] = [
  foundationsCourse,
  cryptoCourse,
  securityCourse,
  architectureCourse,
  developmentCourse,
];
