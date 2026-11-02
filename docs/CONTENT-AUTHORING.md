# Authoring content

Everything a learner sees is typed data in [`src/data/`](../src/data). This guide shows how to
add a lesson, quiz, coding exercise or boss — and what CI will refuse to let you merge.

## File map

| File | Contents |
|---|---|
| `src/data/types.ts` | The content model (read this first) |
| `src/data/course-foundations.ts` | Digital Foundations (green) |
| `src/data/course-crypto.ts` | Cryptography (purple) |
| `src/data/course-security.ts` | Security & Privacy (amber) |

A course is `chapters[]`, a chapter is `lessons[]`, and each lesson is:

```ts
{
  id: "crp-randomness",          // globally unique, prefix per course
  title: "Randomness: The Ingredient You Cannot Fake",
  minutes: 5,                     // 1–15 (target 3–6 for micro-lessons)
  xp: 30,                         // 20 (intro) | 30 (standard) | 60 (boss)
  concept: Block[],               // the reading — see below
  quiz: QuizQuestion[],           // 2–4 questions, always present on lessons
  exercise?: Exercise,            // optional auto-graded coding drill
  boss?: Boss,                    // set on boss nodes (quiz must then be [])
}
```

## Concept blocks

`concept` is an ordered array of blocks; `blocks.tsx` renders each type:

| Block | Use |
|---|---|
| `{ type: "p", text }` | prose paragraphs (3–5 sentences each) |
| `{ type: "h", text }` | section heading inside the lesson |
| `{ type: "code", caption, code }` | syntax-highlighted sample with optional caption |
| `{ type: "list", items }` | bullet list |
| `{ type: "callout", variant, title, text }` | highlighted box — `info` / `warn` / `tip` / `ai` |
| `{ type: "ascii", art }` | preformatted ASCII art (max 9 lines × 60 chars) |
| `{ type: "table", headers, rows }` | comparison table |

Style rules the project follows: second person, concrete examples, no markdown in `text`
(no `**`, `#`, backticks — the renderer owns the formatting), and an `AI ERA` callout where
the topic touches the post-AI angle.

## Quiz questions

```ts
{ q: "…", code?: "…", options: ["A", "B", "C", "D"], answer: 2, explain: "…" }
```

- 3–4 options, all distinct; `answer` is the index of the correct one.
- `explain` is mandatory — it is shown after answering and is where the teaching happens.
- Wrong options should be *believable* mistakes, not jokes.

## Coding exercises

```ts
{
  prompt: string[],     // shown above the editor, one instruction per line
  starter: string,      // starting code — must NOT pass all tests
  tests: TestCase[],    // each: { name, code } — code is a function body returning truthy
  solution: string,     // reference answer — must pass ALL tests
  hints: string[],      // 2–3 progressive nudges (learners burn XP to peek)
}
```

**The contract CI enforces** (`bun run verify:exercises`):

1. `solution` passes every test,
2. `starter` fails at least one test (no free XP),
3. ≥ 3 tests per exercise.

Guidelines:

- Tests must be deterministic — seed your PRNGs, avoid floats where `===` is used (or compare with a tolerance).
- Keep the exercise a *function the learner completes*, matching the lesson they just read.
- Pre-compute expected values by actually running them (don't hand-calculate).

## Boss battles

A boss node has `quiz: []` and a `boss` object:

```ts
{
  name: "The Chaos Warden",
  intro: "…",                      // dramatic one-liner on the battle screen
  art: "…ascii art…",              // ≤ 9 lines
  stages: BossStage[],             // 4–6 rounds, same shape as quiz questions
}
```

Each stage is multiple-choice combat: the learner has a shield; wrong answers damage it.
`explain` is required per stage — losing a round should still teach.

## Validation

Run locally before pushing (CI runs the same gates):

```bash
bun run validate:content   # structure: ids, answers, stages, xp, minutes, no markdown in prose
bun run verify:exercises   # behavior: solutions pass, starters fail
bun run typecheck          # types
bun run lint               # style
```

## Checklists for a new lesson

1. Pick the chapter and insert the node in learning order — unlocking is strictly sequential
   per course (`content.ts: isUnlocked`), so a lesson's prerequisites are simply its predecessors.
2. Write `concept` (aim for 6–10 blocks), 2–4 quiz questions, and an exercise if the topic is code-shaped.
3. Verify the exercise contract by running `bun run verify:exercises`.
4. `bun run validate:content` — then eyeball the lesson in `bun run dev`.
5. For screenshots/QA, `scripts/seed-demo.js` can pre-seed progress into `localStorage`.
