import type { Course } from "./types";
import { foundationsCourse } from "./course-foundations";
import { cryptoCourse } from "./course-crypto";
import { securityCourse } from "./course-security";

export const COURSES: Course[] = [foundationsCourse, cryptoCourse, securityCourse];
