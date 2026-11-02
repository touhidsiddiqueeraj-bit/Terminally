/**
 * Verifies every exercise's solution passes its own tests,
 * and that the starter code does NOT pass them all.
 * Run: bun scripts/verify-exercises.ts
 */
import { COURSES } from "../src/data/courses";
import type { Exercise } from "../src/data/types";

let failures = 0;

for (const course of COURSES) {
  for (const chapter of course.chapters) {
    for (const lesson of chapter.lessons) {
      if (!lesson.exercise) continue;
      const ex = lesson.exercise as Exercise;

      // solution must pass every test
      try {
        const results = ex.tests.map((t) => {
          const fn = new Function(
            `"use strict";${ex.solution}\n;return (function(){${t.code}})();`,
          );
          return { name: t.name, pass: !!fn() };
        });
        const failed = results.filter((r) => !r.pass);
        if (failed.length > 0) {
          failures++;
          console.log(`✗ ${lesson.id}: SOLUTION FAILS ${failed.length}/${ex.tests.length} tests`);
          failed.forEach((f) => console.log(`    - ${f.name}`));
        } else {
          console.log(`✓ ${lesson.id}: solution passes all ${ex.tests.length} tests`);
        }
      } catch (e) {
        failures++;
        console.log(`✗ ${lesson.id}: solution throws: ${e}`);
      }

      // starter must NOT pass all tests (otherwise the exercise is a freebie)
      try {
        const allPass = ex.tests.every((t) => {
          try {
            const fn = new Function(
              `"use strict";${ex.starter}\n;return (function(){${t.code}})();`,
            );
            return !!fn();
          } catch {
            return false;
          }
        });
        if (allPass) {
          failures++;
          console.log(`✗ ${lesson.id}: STARTER ALREADY PASSES ALL TESTS (freebie!)`);
        }
      } catch {
        /* starter throwing is fine */
      }
    }
  }
}

console.log(failures === 0 ? "\n✓ all exercises verified" : `\n✗ ${failures} problems`);
process.exit(failures === 0 ? 0 : 1);
