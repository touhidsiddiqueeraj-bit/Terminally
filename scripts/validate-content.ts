/**
 * Content validation for Terminal Academy courses.
 * Checks: unique ids, answer indices in range, tests present, boss stages,
 * minutes/xp sanity, no markdown symbols in prose.
 * Run: node scripts/validate-content.mjs  (via tsx-free approach: uses a tiny TS strip? No —)
 * Actually run with: bunx tsx scripts/validate-content.ts
 */
import { COURSES } from "../src/data/courses";
import type { Lesson, Block } from "../src/data/types";

let errors: string[] = [];
let warnings: string[] = [];
const seenIds = new Set<string>();
const MARKDOWN_RE = /\*\*|^#|\[.*\]\(|`/;

function checkBlock(courseId: string, lessonId: string, b: Block, where: string) {
  if (b.type === "p" || b.type === "h") {
    if (MARKDOWN_RE.test(b.text)) {
      warnings.push(`${lessonId} ${where}: possible markdown in text: ${b.text.slice(0, 60)}`);
    }
  }
  if (b.type === "callout" && MARKDOWN_RE.test(b.text)) {
    warnings.push(`${lessonId} callout: possible markdown: ${b.text.slice(0, 60)}`);
  }
  if (b.type === "ascii") {
    const lines = b.art.split("\n");
    if (lines.length > 9) warnings.push(`${lessonId}: ascii art has ${lines.length} lines (>9)`);
    for (const l of lines) {
      if (l.length > 60) warnings.push(`${lessonId}: ascii line too wide (${l.length}): ${l.slice(0, 40)}`);
    }
  }
}

function checkLesson(courseId: string, lesson: Lesson) {
  if (seenIds.has(lesson.id)) errors.push(`DUPLICATE lesson id: ${lesson.id}`);
  seenIds.add(lesson.id);

  if (lesson.minutes < 1 || lesson.minutes > 15) warnings.push(`${lesson.id}: odd minutes ${lesson.minutes}`);
  if (lesson.xp !== 20 && lesson.xp !== 30 && lesson.xp !== 60 && lesson.xp !== 100) {
    warnings.push(`${lesson.id}: unexpected xp ${lesson.xp}`);
  }

  // concept — bosses only need their dramatic intro; lessons need real content
  const minConcept = lesson.boss ? 1 : 4;
  if (lesson.concept.length < minConcept) errors.push(`${lesson.id}: concept too short (${lesson.concept.length} < ${minConcept})`);
  lesson.concept.forEach((b, i) => checkBlock(courseId, lesson.id, b, `concept[${i}]`));

  // quiz
  if (!lesson.boss) {
    if (lesson.quiz.length < 2) errors.push(`${lesson.id}: quiz has ${lesson.quiz.length} questions (<2)`);
    for (const [qi, q] of lesson.quiz.entries()) {
      if (q.options.length < 3 || q.options.length > 4) errors.push(`${lesson.id} q${qi}: ${q.options.length} options`);
      if (q.answer < 0 || q.answer >= q.options.length) errors.push(`${lesson.id} q${qi}: answer index ${q.answer} out of range`);
      if (!q.explain) errors.push(`${lesson.id} q${qi}: missing explain`);
      const set = new Set(q.options);
      if (set.size !== q.options.length) errors.push(`${lesson.id} q${qi}: duplicate options`);
    }
  } else {
    if (lesson.quiz.length !== 0) errors.push(`${lesson.id}: boss should have empty quiz, has ${lesson.quiz.length}`);
    if (!lesson.boss.stages || lesson.boss.stages.length < 4) errors.push(`${lesson.id}: boss stages ${lesson.boss?.stages?.length}`);
    for (const [si, s] of (lesson.boss.stages ?? []).entries()) {
      if (s.answer < 0 || s.answer >= s.options.length) errors.push(`${lesson.id} boss stage ${si}: answer out of range`);
      if (!s.explain) errors.push(`${lesson.id} boss stage ${si}: missing explain`);
    }
  }

  // exercise
  if (lesson.exercise) {
    const ex = lesson.exercise;
    if (!ex.starter || !ex.solution) errors.push(`${lesson.id}: exercise missing starter/solution`);
    if (!ex.tests || ex.tests.length < 3) errors.push(`${lesson.id}: exercise tests ${ex.tests?.length} (<3)`);
    if (!ex.hints || ex.hints.length < 2) warnings.push(`${lesson.id}: only ${ex.hints?.length} hints`);
  }
}

let nodeCount = 0, lessonCount = 0, bossCount = 0, exCount = 0, quizCount = 0, stageCount = 0;
let totalXp = 0;

for (const course of COURSES) {
  for (const chapter of course.chapters) {
    for (const lesson of chapter.lessons) {
      nodeCount++;
      totalXp += lesson.xp;
      if (lesson.boss) { bossCount++; stageCount += lesson.boss.stages.length; }
      else { lessonCount++; quizCount += lesson.quiz.length; }
      if (lesson.exercise) exCount++;
      checkLesson(course.id, lesson);
    }
  }
}

console.log(`courses: ${COURSES.length}`);
console.log(`nodes: ${nodeCount} (lessons ${lessonCount}, bosses ${bossCount})`);
console.log(`quiz questions: ${quizCount}, boss stages: ${stageCount}, exercises: ${exCount}`);
console.log(`total XP available: ${totalXp}`);
console.log(`\nERRORS (${errors.length}):`);
errors.forEach((e) => console.log("  ✗ " + e));
console.log(`\nWARNINGS (${warnings.length}):`);
warnings.slice(0, 20).forEach((w) => console.log("  ! " + w));
if (errors.length === 0) console.log("\n✓ content valid");
process.exit(errors.length === 0 ? 0 : 1);
