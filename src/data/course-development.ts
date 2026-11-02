import type { Course } from "./types";

/**
 * Course 5 — Modern Development (pink path)
 * The engineering craft around code: git, review, testing, debugging,
 * CI/CD, observability — and the human skills of a post-AI world.
 */
export const developmentCourse: Course = {
  id: "development",
  title: "Modern Development",
  subtitle:
    "Git, testing, pipelines and shipping — the craft that still separates engineers from prompt writers.",
  icon: "rocket",
  color: "pink",
  chapters: [
    {
      id: "dev-workshop",
      title: "The Developer's Workshop",
      blurb: "Version control, review, testing and debugging — the daily craft every real codebase demands.",
      lessons: [
        {
          id: "dev-git",
          title: "Git & the Time Machine",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Every professional codebase on Earth has the same safety net underneath it, and it is not backups. It is version control: a running, searchable history of every change ever made, by whom, and why. Git is the tool that provides it, and it changes what kind of mistakes you are allowed to make. With git, breaking the code stops being a catastrophe and becomes a decision you can reverse.",
            },
            { type: "h", text: "Commits: checkpoints that explain themselves" },
            {
              type: "p",
              text: "A commit is a snapshot of your project at one moment, wrapped in a message. Small, frequent, well-described commits are the habit that separates calm engineers from panicked ones. The message matters more than beginners think: when something breaks six months from now, the first question everyone asks is which change caused it — and git blame answers instantly, but only if the history is honest. Write the why, not just the what: 'fix bug' is a wasted checkpoint; 'reset session timer on tab focus' is archaeology insurance.",
            },
            {
              type: "code",
              caption: "A day in the life, as history",
              code: `git log --oneline
a41f2c reset session timer on tab focus
9b77e1 extract validateEmail into its own module
02cd88 fix: strip whitespace before checking length
f912ba add streak freeze logic

// five checkpoints, five stories. Any one can be
// inspected, reverted, or blamed in seconds.`,
            },
            { type: "h", text: "Branches: parallel universes you control" },
            {
              type: "p",
              text: "A branch is a separate timeline for your work. Create one, experiment wildly, and the main timeline stays untouched until you are ready. When your branch works, a merge folds your timeline back in. If two people changed the same lines, git reports a merge conflict and refuses to guess — a feature, not a bug, because silently choosing one side is how work disappears. Branches are also why tiny pull requests are possible: do one thing on one branch, merge it, move on.",
            },
            {
              type: "table",
              headers: ["Command", "What it does", "How often you will type it"],
              rows: [
                ["git status", "What changed, what is staged", "Constantly — it is your compass"],
                ["git add + git commit", "Checkpoint the work, with a message", "Many times an hour"],
                ["git branch + git switch", "Start or move between timelines", "Every new piece of work"],
                ["git log / git blame", "Read history; find who changed a line", "During every investigation"],
                ["git revert", "Undo a commit by adding its opposite", "Soberly, and without shame"],
              ],
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Commit messages are written for a future reader who is angry and in a hurry — usually future you. Describe why the change was made. The diff already shows what changed; the message must explain the reason it exists.",
            },
            {
              type: "p",
              text: "Here is the mental model worth building by hand: history is just operations applied in order. In the exercise below you will replay a log of operations onto a state — exactly what git does when it merges your branch, one op at a time, never mutating the record it started from.",
            },
          ],
          quiz: [
            {
              q: "What does a good commit message primarily capture?",
              options: [
                "The lines of code that changed",
                "Why the change was made — the diff already shows what",
                "The name of the reviewer",
                "The date, which git does not store",
              ],
              answer: 1,
              explain:
                "Six months from now, someone debugging will ask 'why does this line exist?' The diff shows what changed; only the message can explain the reason.",
            },
            {
              q: "Why is git refusing to guess during a merge conflict a feature?",
              options: [
                "It keeps the repository small",
                "Silently picking one side would make the other side's work vanish without anyone noticing",
                "It trains developers to memorize commands",
                "It prevents branches from being created",
              ],
              answer: 1,
              explain:
                "A conflict means two timelines changed the same lines. Only a human knows which intent should win. Halting is safer than guessing.",
            },
            {
              q: "What is a branch, really?",
              options: [
                "A copy of the project on a different computer",
                "A separate timeline of commits that can be merged back when ready",
                "A backup of the database",
                "A folder inside every commit",
              ],
              answer: 1,
              explain:
                "Branches let you experiment without endangering the main line. The merge folds your timeline back in once the work proves itself.",
            },
          ],
          exercise: {
            prompt: [
              "Replay history the way git does: operations, applied in order, onto a copy.",
              "Write applyOps(state, ops). state is an object like { theme: 'dark', volume: 5 }.",
              "Each op is { type: 'set', key, value } or { type: 'delete', key }. Apply every op in order and return the resulting state.",
              "Two rules: never mutate the original state — history is written once. And later ops see the result of earlier ones, like commits in a branch.",
            ],
            starter: `function applyOps(state, ops) {
  // state: { theme: 'dark', volume: 5 }
  // ops: [{ type: 'set', key: 'theme', value: 'neon' },
  //       { type: 'delete', key: 'volume' }]
  // Copy first. Then apply each op in order. Return the copy.
  const next = { ...state };
  // your code here
  return next;
}`,
            tests: [
              { name: "a set op writes a value", code: "return applyOps({}, [{ type: 'set', key: 'theme', value: 'neon' }]).theme === 'neon';" },
              { name: "later ops build on earlier ones", code: "return applyOps({ v: 1 }, [{ type: 'set', key: 'v', value: 2 }, { type: 'set', key: 'v', value: 3 }]).v === 3;" },
              { name: "delete removes keys", code: "const s = applyOps({ a: 1, b: 2 }, [{ type: 'delete', key: 'a' }]); return s.a === undefined && s.b === 2;" },
              { name: "the original state is never mutated", code: "const orig = { v: 1 }; applyOps(orig, [{ type: 'set', key: 'v', value: 99 }]); return orig.v === 1;" },
            ],
            solution: `function applyOps(state, ops) {
  const next = { ...state };
  for (const op of ops) {
    if (op.type === "set") next[op.key] = op.value;
    else if (op.type === "delete") delete next[op.key];
  }
  return next;
}`,
            hints: [
              "Spread into a copy first — a merge never rewrites the history it started from.",
              "Walk ops in order; each op should see the result of the previous one.",
              "delete next[op.key] removes a property from an object.",
            ],
          },
        },
        {
          id: "dev-code-review",
          title: "Code Review: Reading as a Skill",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Here is the quiet revolution in how software gets written. A generation ago, the average engineer spent most of the day typing. Today they spend a large and growing slice of it reading — proposals, diffs, generated code, other people's changes. Code review, once a bureaucratic checkbox, has become the central quality practice of the field, and reading code critically is now as valuable as writing it.",
            },
            { type: "h", text: "Why reviews exist" },
            {
              type: "p",
              text: "A pull request proposes a change and asks for review before merging. The stated reason is catching bugs — and it does, though tests catch more. The deeper reasons are human: review spreads knowledge, so no module is understood by exactly one person. It enforces the team's shared standards without any meetings. And it creates ownership — code that has been read by four people belongs to the team, not to its author. That last effect compounds: reviewed codebases stay readable, because reviewers push back the moment they cannot understand something.",
            },
            {
              type: "code",
              caption: "The review checklist that fits on a sticky note",
              code: `// Does it do what it claims — and is that the right thing?
// Are the names honest? (isValid is not validating? reject.)
// What is NOT covered by the tests next to it?
// Where does this break under load, or with bad input?
// Could this be smaller? (almost always: yes)

// five questions, ninety seconds, most of the value`,
            },
            { type: "h", text: "How to review — and be reviewed" },
            {
              type: "p",
              text: "Review the code, never the coder. 'This loop walks the whole list on every keystroke — O(n) per key' is engineering; 'why did you write it this way' is an interrogation. Ask questions instead of issuing verdicts — 'what happens if the token is expired?' teaches more than 'missing case'. And when you are the author: small pull requests. A two-hundred-line diff gets a real review; a two-thousand-line diff gets a shrug and an approve. Reviewers are readers, and readers have limits.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI LENS",
              text: "The pull request is where AI-assisted work meets human accountability. Drafting with a model is fast; reviewing that draft is now the skill. Teams that thrive treat AI-generated code exactly like junior code: read every line before it merges, because nobody — including the model — is accountable for lines nobody has read.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Beware the rubber stamp: 'looks good to me' typed in four seconds. A review nobody read is worse than no review — it launders unexamined code into trusted code. If you would not be comfortable debugging this diff alone at 3 am, say what you actually checked, or ask for the pieces you did not.",
            },
          ],
          quiz: [
            {
              q: "Which benefit of code review do tests NOT provide?",
              options: [
                "Spreading knowledge so no module has a single point of human failure",
                "Catching some bugs before merge",
                "Enforcing shared standards without meetings",
                "Making the code run faster",
              ],
              answer: 0,
              explain:
                "Tests check behavior; only review transfers understanding between people. Shared ownership — code the whole team can read — is review's unique product.",
            },
            {
              q: "Why do small pull requests get better reviews than huge ones?",
              options: [
                "They merge faster because git prefers them",
                "Reviewers are readers with limits — a huge diff gets skimmed, a small one gets studied",
                "Large diffs are technically impossible",
                "Small PRs cannot contain bugs",
              ],
              answer: 1,
              explain:
                "Review quality collapses as diff size grows. The two-thousand-line pull request receives a shrug and an approve — which is the quality process quietly dying.",
            },
            {
              q: "What is the rubber-stamp danger in the AI era?",
              options: [
                "Models refuse to write small functions",
                "Unread generated code gets approved, laundering unexamined work into trusted code",
                "Pull requests become too long to load",
                "Reviewers lose git access",
              ],
              answer: 1,
              explain:
                "Generating code is now cheap — so the bottleneck and the responsibility moved to reading it. A review nobody performed is worse than none.",
            },
          ],
        },
        {
          id: "dev-testing",
          title: "Testing: Executable Proof",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "A test is a small program whose only job is to fail loudly when your real program stops keeping a promise. That is the entire idea, and it changes everything about how boldly you can work. With a solid test suite, you refactor fearlessly, upgrade dependencies without dread, and catch the regression you would otherwise ship at 5 pm on a Friday. Tests are not paperwork — they are executable proof that the system still does what it did yesterday.",
            },
            { type: "h", text: "The pyramid" },
            {
              type: "p",
              text: "Tests come in three sizes, and the ratio matters. Unit tests check one function in isolation — fast, precise, and therefore numerous: the pyramid's base. Integration tests check that real pieces work together — function plus database, service plus queue — slower, so you keep a moderate number. End-to-end tests drive the whole running application like a user — the most honest and the slowest, so you keep only a handful for the journeys that matter most. Invert that pyramid, with thousands of end-to-end tests, and your suite takes hours and fails for environmental reasons nobody can reproduce.",
            },
            {
              type: "table",
              headers: ["Level", "What it proves", "Speed", "How many"],
              rows: [
                ["Unit", "This function keeps its promise", "Milliseconds", "Hundreds"],
                ["Integration", "These pieces cooperate for real", "Seconds", "Dozens"],
                ["End-to-end", "The user's journey actually works", "Minutes", "A handful"],
              ],
            },
            {
              type: "code",
              caption: "Red, green — the heartbeat of test-driven work",
              code: `function bitsToFit(n) { /* ... */ }

test("a full byte of ones is 255", () => {
  expect(bitsToFit(255)).toBe(8);   // the promise, in code
});
// 1. Write the test. Watch it fail. (red)
// 2. Make it pass with the simplest honest code. (green)
// 3. Refactor with the suite as your safety net.`,
            },
            { type: "h", text: "The enemies: flakes and testing the mirror" },
            {
              type: "p",
              text: "Two diseases kill suites from inside. First, flaky tests — ones that fail sometimes with the same code. Every flaky failure trains the team that red means maybe, and a suite nobody believes in is worse than none. Quarantine flakes the day they appear. Second, testing the mirror: asserting a function's internal steps instead of its observable promise. Tests pinned to implementation details break on every refactor without catching a single real bug. Test what the function promises, not how it keeps the promise.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "The best moment to write a test is the moment a bug is reported. Reproduce it as a failing test first, then fix the code until the test passes. The bug can now never silently return — you have converted an incident into a permanent, executable guarantee.",
            },
            {
              type: "p",
              text: "Your turn to run a build's verdict. In the exercise below you will compute a test run's pass rate — the number every CI dashboard shows in green or red. Count the passes, divide by the total, and guard that sneaky empty case.",
            },
          ],
          quiz: [
            {
              q: "Why does the test pyramid want many unit tests and only a few end-to-end tests?",
              options: [
                "End-to-end tests are illegal in most countries",
                "Speed and precision: units pinpoint failures in milliseconds; e2e is slow and broad",
                "Unit tests are easier to write badly",
                "The shape looks nice in presentations",
              ],
              answer: 1,
              explain:
                "A failing unit test points at one function. A failing e2e test tells you something, somewhere, broke. Keep the slow, vague layer small and the fast, precise layer vast.",
            },
            {
              q: "A test that sometimes fails on unchanged code is called:",
              options: ["A regression test", "Flaky — and it must be quarantined before it destroys trust in the suite", "An integration test", "A smoke test"],
              answer: 1,
              explain:
                "Each random failure teaches the team that red means maybe. Once nobody believes the suite, it protects nothing. Flakes get fixed or isolated the day they appear.",
            },
            {
              q: "Your test asserts the exact order of a function's internal helper calls. What is the problem?",
              options: [
                "Nothing — that is the most thorough test possible",
                "It tests the implementation, not the promise — every honest refactor breaks it without a real bug",
                "Helper calls cannot be observed",
                "It makes the test flaky by definition",
              ],
              answer: 1,
              explain:
                "Tests pinned to internals break on refactors while missing actual behavior bugs. Assert on observable promises: given this input, this output.",
            },
          ],
          exercise: {
            prompt: [
              "Compute the number on every CI dashboard: the pass rate.",
              "Write passRate(results). results is an array of { name, status } where status is 'pass' or 'fail'.",
              "Return the percentage of passes, rounded to the nearest whole number.",
              "An empty array scores 100 — no failures means a green build.",
            ],
            starter: `function passRate(results) {
  // results: [{ name: 'a', status: 'pass' }, { name: 'b', status: 'fail' }]
  // Return the whole-number percentage of passes, 0-100.
  // Empty array? 100 — nothing failed.
  // your code here
}`,
            tests: [
              { name: "all pass is 100", code: "return passRate([{ name: 'a', status: 'pass' }, { name: 'b', status: 'pass' }]) === 100;" },
              { name: "half pass is 50", code: "return passRate([{ name: 'a', status: 'pass' }, { name: 'b', status: 'fail' }]) === 50;" },
              { name: "rounds to the nearest whole number", code: "return passRate([{ status: 'pass' }, { status: 'pass' }, { status: 'fail' }]) === 67;" },
              { name: "empty is a green build", code: "return passRate([]) === 100;" },
            ],
            solution: `function passRate(results) {
  if (results.length === 0) return 100;
  let passed = 0;
  for (const r of results) {
    if (r.status === "pass") passed += 1;
  }
  return Math.round((passed / results.length) * 100);
}`,
            hints: [
              "Count the passes, divide by the total, multiply by 100.",
              "Math.round gives you whole numbers — 2 out of 3 is 66.67, which rounds to 67.",
              "Guard the empty array first, or you will divide by zero.",
            ],
          },
        },
        {
          id: "dev-debugging",
          title: "Debugging: The Detective Skill",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Nobody writes correct code, so the real dividing line is not who bugs and who does not — it is who debugs well. Debugging is detective work with a strict method, and the method is learnable. The amateurs thrash: random edits, hopeful redeploys, crossing fingers. The professionals investigate: reproduce, isolate, hypothesize, test, fix. Same bug, twenty minutes versus three days.",
            },
            { type: "h", text: "The method" },
            {
              type: "list",
              items: [
                "Reproduce it on demand. A bug you cannot trigger reliably cannot be isolated.",
                "Isolate it. Shrink the failing case until nothing non-essential remains — same failure, minimum steps.",
                "Hypothesize. One falsifiable guess at a time: 'the token is stale by then'.",
                "Test the guess. Add a log, set a breakpoint — prove or destroy the hypothesis before holding another.",
                "Fix the cause, not the symptom. If your fix does not explain the bug, you have built a second bug.",
              ],
            },
            {
              type: "p",
              text: "Two tools multiply the whole method. The first costs nothing: explain the bug, out loud, line by line, to someone or something — the classic rubber duck. Roughly half the time you hear your own mistake mid-sentence, because explaining forces you through the code's actual path instead of your memory of it. The second is git bisect: when something worked last month and broke today, point git at the good commit and the bad one, and it binary-searches the history, testing the midpoint each round, until the guilty change is isolated — a thousand commits found in ten probes instead of a hundred.",
            },
            {
              type: "code",
              caption: "git bisect — binary search over time",
              code: `git bisect start
git bisect bad            # current commit: broken
git bisect good v2.1.0    # that release: worked
# git checks out the midpoint. Test it, then:
git bisect good   # or: git bisect bad
# repeat ~log2(n) times; git names the guilty commit
git bisect reset`,
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Why does the duck work? Explaining aloud compiles your assumptions into sentences, and wrong assumptions sound wrong the moment they are spoken. Rubber-ducking is not superstition — it is forcing your brain through the code's real control flow, one line at a time, instead of the compressed story you have been carrying around.",
            },
            {
              type: "p",
              text: "You will now wield bisect's core mechanic yourself. In the exercise, a run of builds starts good and goes bad at some unknown point — and your job is to find the first bad one by binary search: halve the range, probe the middle, keep half. With a thousand builds, ten probes. That logarithm is the same one that powers binary search, git bisect, and every debugging session that ends early.",
            },
          ],
          quiz: [
            {
              q: "What is always the first step of professional debugging?",
              options: [
                "Rewrite the suspicious module",
                "Reproduce the failure reliably — on demand",
                "Ask the team lead what to do",
                "Deploy to production and watch",
              ],
              answer: 1,
              explain:
                "A bug you cannot trigger at will cannot be isolated or verified as fixed. Reproduction turns a ghost into a specimen.",
            },
            {
              q: "What does git bisect actually do?",
              options: [
                "Deletes the commits that broke the build",
                "Binary-searches history between a known-good and known-bad commit to isolate the guilty change",
                "Merges two branches automatically",
                "Formats the diff for review",
              ],
              answer: 1,
              explain:
                "You give it one good and one bad commit; it probes the midpoint repeatedly, halving the range each round. A thousand commits fall in about ten probes.",
            },
            {
              q: "Your 'fix' suppresses an error message and the symptom vanishes. What is that?",
              options: [
                "A successful debug",
                "A second bug — the cause is untouched and will resurface, now harder to find",
                "Refactoring",
                "The rubber duck technique",
              ],
              answer: 1,
              explain:
                "Fix the cause, not the symptom. If you cannot explain how your fix addresses the mechanism of the bug, you have not fixed the bug — you have hidden it.",
            },
          ],
          exercise: {
            prompt: [
              "Implement the mechanic behind git bisect: find the first bad build.",
              "Write findFirstBad(builds, isBad). builds is an ordered array — all good builds come first, then all bad ones. isBad(build, index) tells you whether one build is bad.",
              "Return the index of the FIRST bad build, or -1 if they are all good.",
              "Rule of the game: use binary search. Halve the range each probe — a long line of builds should cost you about log2(n) calls to isBad, not n.",
            ],
            starter: `function findFirstBad(builds, isBad) {
  // builds: ordered array, good...good bad...bad
  // isBad(build, index): boolean verdict for one build
  // Return the index of the first bad build, or -1.
  // Binary search: probe the middle, discard half, repeat.
  let lo = 0;
  let hi = builds.length - 1;
  // your code here
}`,
            tests: [
              { name: "spots the first bad build", code: "const verdicts = [false, false, true, true]; return findFirstBad([0, 1, 2, 3], (b, i) => verdicts[i]) === 2;" },
              { name: "all good means -1", code: "return findFirstBad([0, 1, 2], () => false) === -1;" },
              { name: "the very first build can be bad", code: "return findFirstBad([0, 1], () => true) === 0;" },
              { name: "a thousand builds, about ten probes", code: "let probes = 0; const builds = Array.from({ length: 1000 }, (_, i) => i); const idx = findFirstBad(builds, (b, i) => { probes += 1; return i >= 937; }); return idx === 937 && probes <= 14;" },
            ],
            solution: `function findFirstBad(builds, isBad) {
  let lo = 0;
  let hi = builds.length - 1;
  let firstBad = -1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (isBad(builds[mid], mid)) {
      firstBad = mid; // mid is bad — the first bad is here or earlier
      hi = mid - 1;
    } else {
      lo = mid + 1; // good — the first bad must be later
    }
  }
  return firstBad;
}`,
            hints: [
              "Probe the middle. If it is bad, the first bad is at mid or to the left — remember mid, search left.",
              "If the middle is good, the first bad must be to the right — search right.",
              "Stop when lo passes hi. -1 means nothing was ever bad.",
            ],
          },
        },
        {
          id: "dev-boss-workshop",
          title: "The Merge Conflict",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Chapter 1 closes with the sound every developer knows: the sound of two timelines colliding. The Merge Conflict guards the border where your work meets everyone else's — and it has opinions about commit messages, tests and reviews.",
            },
            {
              type: "p",
              text: "Five stages. Resolve them all correctly and the merge completes. Guess, and you are stuck in rebase limbo.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Merge Conflict",
            intro:
              "The room fills with angle brackets. '<<<<<<< HEAD,' it crackles. 'Two people changed the same line. Only one of us understands version control. Prove which.'",
            art: `  <<<<<<< HEAD
    \\  //  \\  //
     X    ..    X
    //  \\  //  \\
  =================   conflict!
   your line | theirs
  >>>>>>> feature`,
            stages: [
              {
                question: "The Conflict demands: 'What belongs in a commit message above all?'",
                options: [
                  "The author's mood",
                  "Why the change was made — the diff already shows what",
                  "A list of every file touched",
                  "Nothing; messages are optional decoration",
                ],
                answer: 1,
                explain:
                  "The message is the only place history records intent. 'fix bug' wastes the checkpoint; 'reset session timer on tab focus' is archaeology insurance.",
              },
              {
                question: "'Why do I halt rather than guess?' the Conflict roars. You answer:",
                options: [
                  "Because git enjoys drama",
                  "Because silently picking one side would make the other side's work vanish unnoticed",
                  "Because merges are not allowed after midnight",
                  "To give the server time to rest",
                ],
                answer: 1,
                explain:
                  "Two timelines edited the same lines. Only a human knows which intent should win. Refusing to guess is git protecting you from yourself.",
              },
              {
                question: "The Conflict shows a test that fails randomly on unchanged code. 'Name it and sentence it.'",
                options: [
                  "A regression — test it more",
                  "Flaky — quarantine it now, before it teaches the team that red means maybe",
                  "A unit test — split it into three",
                  "A smoke test — ship it",
                ],
                answer: 1,
                explain:
                  "Every random failure erodes trust in the suite, and a suite nobody believes protects nothing. Flakes get fixed or isolated the day they appear.",
              },
              {
                question: "'A reviewer approved in four seconds with no comment.' What has gone wrong?",
                options: [
                  "Nothing — speed is a virtue",
                  "The rubber stamp: unread code just got laundered into trusted code",
                  "The review tool is broken",
                  "The pull request was too small",
                ],
                answer: 1,
                explain:
                  "A review nobody performed is worse than no review. Say what you actually checked, or ask about the pieces you skipped.",
              },
              {
                question: "Final hunk: 'Last release worked, today's build fails. Fastest road to the guilty change?'",
                options: [
                  "Re-read every file in the repository",
                  "git bisect — binary-search history between the good and bad commits",
                  "Delete the repository and start over",
                  "Wait for the conflict to resolve itself",
                ],
                answer: 1,
                explain:
                  "Mark good and bad, probe the midpoint, halve each round. A thousand commits fall in about ten probes — the same logarithm you implemented by hand.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "dev-ship",
      title: "Ship It: CI/CD",
      blurb: "Pipelines, artifacts, deploys and observability — get code to production without heroics.",
      lessons: [
        {
          id: "dev-pipelines",
          title: "Pipelines: The Robot That Reviews Every Push",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "The most expensive sentence in software is: 'It works on my machine.' It means the speaker's laptop happens to have the right versions, the right settings, the right everything — and nowhere else is guaranteed any of it. Continuous integration ends that era with one rule: every push triggers a machine to build and test the code from scratch, on a clean computer, every single time.",
            },
            {
              type: "code",
              caption: "A pipeline, in the order failures should arrive",
              code: `on: push            # every push, no exceptions

jobs:
  lint:      # style & obvious mistakes  (seconds)
  test:      # the suite from last lesson  (minutes)
  build:     # compile & package the artifact

# cheap checks run first — fail fast, so the author learns
# in 30 seconds instead of 12 minutes. Ordering is kindness.`,
            },
            { type: "h", text: "Green main, and why it is sacred" },
            {
              type: "p",
              text: "The pipeline's deepest effect is cultural: the main branch stays green, always deployable. Anyone can pull it, build it, ship it, and be right about the result. Broken main is a team-wide emergency precisely because it blocks everyone's context switch — you are debugging someone else's failure before you can start your own work. So branches run the full gauntlet before merging, and nobody merges red. The badge on the repository that says 'passing' is not decoration; it is a promise with a robot behind it.",
            },
            {
              type: "table",
              headers: ["Stage", "Catches", "Typical cost"],
              rows: [
                ["Lint", "Style drift, unused variables, suspicious patterns", "Seconds"],
                ["Typecheck", "Wrong shapes flowing between functions", "Seconds to a minute"],
                ["Tests", "Broken promises — the suite from last lesson", "Minutes"],
                ["Build", "Code that cannot compile or package", "Minutes"],
                ["Security scan", "Known-vulnerable dependencies, leaked secrets", "A minute, scheduled"],
              ],
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Order pipeline stages cheap-to-expensive. A typo found by the linter in twenty seconds respects the author's evening; the same typo discovered after a twelve-minute build has already wasted the whole pipeline — and everyone waiting behind it on the merge queue.",
            },
            {
              type: "p",
              text: "Time to be the pipeline. The exercise below is the gate every CI system implements somewhere: a list of checks, and one verdict — deploy or halt. Walk the checks in order, fail fast, and name the first offender so the author knows exactly where to look.",
            },
          ],
          quiz: [
            {
              q: "What single rule defines continuous integration?",
              options: [
                "Code review must happen in person",
                "Every push is built and tested automatically on a clean machine",
                "Deployments happen only on Fridays",
                "Developers must work on the main branch directly",
              ],
              answer: 1,
              explain:
                "'Works on my machine' dies when a fresh computer re-verifies everything on every push. The robot has no laptop-specific luck to hide behind.",
            },
            {
              q: "Why is keeping the main branch green treated as sacred?",
              options: [
                "Green badges look professional to investors",
                "Main is always deployable — a broken main blocks and misleads the entire team at once",
                "It makes the repository load faster",
                "Git refuses new branches when main is red",
              ],
              answer: 1,
              explain:
                "Everyone builds on main. When it is broken, every developer inherits someone else's failure before doing any of their own work — the most expensive context switch there is.",
            },
            {
              q: "Why do pipelines run lint before the expensive build and test stages?",
              options: [
                "Linters are prettier than compilers",
                "Fail fast: cheap checks first, so trivial mistakes surface in seconds, not after a twelve-minute build",
                "Lint output is stored in a special database",
                "Builds cannot start while linting runs",
              ],
              answer: 1,
              explain:
                "Stage ordering is kindness. The earlier the cheapest signal fires, the less of everyone's time a trivial mistake can waste.",
            },
          ],
          exercise: {
            prompt: [
              "Be the pipeline: one verdict, fail fast.",
              "Write pipelineVerdict(checks). checks is an array of { name, passed } objects.",
              "Return { go: boolean, firstFailure: string | null } — go is true only when EVERY check passed, and firstFailure names the first check that failed.",
              "Walk the checks in order and stop at the first false. The author should know exactly where to look.",
            ],
            starter: `function pipelineVerdict(checks) {
  // checks: [{ name: 'lint', passed: true },
  //          { name: 'test', passed: false }]
  // Return { go, firstFailure }:
  //   go: true only if every check passed
  //   firstFailure: name of the first failed check, or null
  // your code here
}`,
            tests: [
              { name: "all green means go", code: "const v = pipelineVerdict([{ name: 'lint', passed: true }, { name: 'test', passed: true }]); return v.go === true && v.firstFailure === null;" },
              { name: "halts and names the first failure", code: "const v = pipelineVerdict([{ name: 'lint', passed: true }, { name: 'test', passed: false }, { name: 'build', passed: false }]); return v.go === false && v.firstFailure === 'test';" },
              { name: "the first check can be the culprit", code: "const v = pipelineVerdict([{ name: 'lint', passed: false }]); return v.go === false && v.firstFailure === 'lint';" },
              { name: "no checks is a vacuous green", code: "const v = pipelineVerdict([]); return v.go === true && v.firstFailure === null;" },
            ],
            solution: `function pipelineVerdict(checks) {
  for (const check of checks) {
    if (!check.passed) {
      return { go: false, firstFailure: check.name };
    }
  }
  return { go: true, firstFailure: null };
}`,
            hints: [
              "Walk the array in order — that order is the pipeline's stage order.",
              "Return the moment you see a failure. Fail fast means stop walking.",
              "Falling off the end of the loop means everything passed.",
            ],
          },
        },
        {
          id: "dev-artifacts",
          title: "Build Once, Deploy Many",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Here is a rule that separates calm teams from chaotic ones: the thing you tested is the thing you ship. Not a rebuild from the same source — the very same artifact. The moment your deploy pipeline rebuilds the code, you have introduced a lottery: a dependency updated itself, the build machine's clock leaked into a bundle, a cache warmed differently — and now production runs bytes nobody tested. Building is not a harmless re-run; it is a fresh roll of the dice.",
            },
            {
              type: "code",
              caption: "The discipline in one line of process",
              code: `git commit -> pipeline -> artifact v42   (built ONCE)
                          |
             +------------+-------------+
             v            v             v
          staging      preview      production
          (tested)    (demoed)      (shipped)

// same bytes everywhere. If v42 is bad, you roll BACK
// to v41 — you never roll SIDEWAYS to a v42-rebuild.`,
            },
            { type: "h", text: "Reproducible builds" },
            {
              type: "p",
              text: "An artifact is the packaged output of a build: a container image, a bundle of static files, an APK. The gold standard is the reproducible build: the same source, on any machine, produces bit-for-bit identical output. You get there by pinning dependency versions instead of accepting 'latest', by excluding timestamps and machine names from the output, and by locking the toolchain. When builds are reproducible, 'works on my machine' stops being a defense — every machine produces the same machine.",
            },
            { type: "h", text: "Environments and their secrets" },
            {
              type: "p",
              text: "The same artifact travels through environments — development, staging, production — and each one hands it different configuration: which database to call, which API keys to use, how loudly to log. The rule that keeps this clean: configuration comes from outside the artifact, through environment variables or injected config, never from editing the code. If staging and production differ only by a config file, then the artifact you tested in staging is honest about what production will do — and nobody ever ships a debug flag by accident.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Secrets — API keys, passwords, signing certificates — are configuration, but they are never stored in the repository or baked into the artifact. One commit of a leaked key lives in history forever, and bots scrape public repositories for keys within minutes. Secret managers exist precisely for this: inject at deploy time, rotate when in doubt.",
            },
          ],
          quiz: [
            {
              q: "Why 'build once, deploy many' instead of rebuilding per environment?",
              options: [
                "Rebuilds are always slower",
                "A rebuild is a fresh roll of the dice — the bytes you ship must be the bytes you tested",
                "Build servers cost extra money per run",
                "Because artifacts cannot be copied",
              ],
              answer: 1,
              explain:
                "Dependencies drift and caches differ; two builds of the same source can differ in ways nobody reviewed. The artifact under test and the artifact in production must be identical bytes.",
            },
            {
              q: "What makes a build reproducible?",
              options: [
                "Building it on the founder's laptop",
                "Pinned dependencies, no timestamps or machine names in output, locked toolchain — same source, same bytes, anywhere",
                "Running the build twice and hoping",
                "Disabling the cache permanently",
              ],
              answer: 1,
              explain:
                "Reproducibility removes the last hiding places of 'works on my machine'. When every machine produces identical output, the excuse evaporates.",
            },
            {
              q: "Where do production credentials belong?",
              options: [
                "Hardcoded in the source, since it is private",
                "In the artifact, encrypted twice",
                "Injected at deploy time from a secret manager — never in the repo, never in the build",
                "In the commit message for archaeology",
              ],
              answer: 2,
              explain:
                "A key committed once lives in history forever, and bots find them in minutes. Secrets are deploy-time configuration, rotated on suspicion.",
            },
          ],
        },
        {
          id: "dev-deploy",
          title: "Deployment: Roll Out, Don't Leap",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Deploying is the moment your changes meet real users, and the question that defines your engineering culture is: what happens when the deploy is bad? Beginners treat rollback as an embarrassing admission. Professionals treat it as plan A — because the alternative, scrambling to fix-forward a broken production at midnight, is how outages become legendary.",
            },
            {
              type: "table",
              headers: ["Strategy", "How it moves", "Its trade"],
              rows: [
                ["Big bang", "Stop old, start new, for everyone at once", "Simple; all users eat the bad deploy together"],
                ["Rolling", "Replace instances a few at a time", "Gentle; two versions run side by side for a while"],
                ["Blue-green", "Two full environments; flip traffic instantly", "Instant flip, instant flip-back; costs double capacity"],
                ["Canary", "Ship to 1% of users and watch, then widen", "Blast radius starts tiny; needs metrics you trust"],
              ],
            },
            {
              type: "code",
              caption: "Canary math: the few protect the many",
              code: `deploy v2.3 to 1% of traffic
  watch error rate, latency, conversions     (minutes)
  healthy? -> 5% -> 25% -> 100%              (widening)
  on fire? -> route everyone back to v2.2    (seconds)

// the canary is the coal mine's canary: it dies first,
// on purpose, so the mine does not.`,
            },
            { type: "h", text: "Feature flags: shipping and releasing are different acts" },
            {
              type: "p",
              text: "The subtlest idea in modern delivery: deploying code and releasing a feature are two different events, and decoupling them removes most of the fear from both. A feature flag wraps new behavior in a runtime switch — the code ships dark, and the switch turns it on later, for a slice of users, or instantly off again without a redeploy. Half-finished work can ride along harmlessly, disabled. A bad release becomes a flag flip, not an emergency deploy. The cost is real — flags multiply, and someone must prune the dead ones — but the ability to turn off a mistake in seconds is worth the gardening.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Canary deploys are only as good as the metrics watching them. Before your first canary, know your baseline: normal error rate, normal latency, normal checkout completion. A canary compared against vibes is theater; a canary compared against a baseline is engineering.",
            },
          ],
          quiz: [
            {
              q: "What is the defining question of a deployment strategy?",
              options: [
                "How pretty is the release announcement?",
                "What happens when the deploy turns out to be bad — and how few users eat it?",
                "How many engineers can be involved?",
                "Which cloud provider hosts the servers?",
              ],
              answer: 1,
              explain:
                "Every strategy is a different answer to blast radius and recovery speed: all-at-once, gradual replacement, instant flip, or tiny-then-widen.",
            },
            {
              q: "Blue-green deployment gives you what superpower?",
              options: [
                "Zero resource cost",
                "An instant flip of all traffic — and an equally instant flip back",
                "Automatic bug fixing",
                "Fewer unit tests",
              ],
              answer: 1,
              explain:
                "Two full environments means switching is a routing change, not a rebuild. The price is running double capacity during the window.",
            },
            {
              q: "How do feature flags change deployment?",
              options: [
                "They make deployment unnecessary",
                "They separate deploying code from releasing features — ship dark, flip on, flip off in seconds",
                "They remove the need for pipelines",
                "They guarantee canaries never fail",
              ],
              answer: 1,
              explain:
                "With a runtime switch, a bad release becomes a config flip instead of an emergency redeploy — and half-done work can ship safely dark.",
            },
          ],
        },
        {
          id: "dev-observability",
          title: "Observability: Eyes On Production",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "You will never fix what you cannot see. Before your code reaches production, the question that decides whether you will sleep: when this breaks at 3 am, what will tell you — and how fast? Observability is the discipline of building that answer in advance. It has three pillars, and they answer different questions.",
            },
            {
              type: "table",
              headers: ["Pillar", "Answers", "Looks like"],
              rows: [
                ["Logs", "What exactly happened here?", "Discrete events: 'token rejected, reason=expired'"],
                ["Metrics", "How is the system behaving overall?", "Numbers over time: error rate, latency, requests per second"],
                ["Traces", "Where did the time go in one request?", "One request's journey across services, timed step by step"],
              ],
            },
            {
              type: "p",
              text: "Logs tell stories — but you cannot read a million stories, which is why metrics exist: compressed signals you can watch continuously and alert on. Error rate crossing a threshold, latency drifting past a promise, queue depth climbing — each becomes a line on a dashboard and, when it crosses into danger, a page to a human. Traces close the loop for distributed systems, where one user request touches a dozen services: the trace shows exactly which hop swallowed the four hundred milliseconds.",
            },
            { type: "h", text: "Alerts: signal, not noise" },
            {
              type: "p",
              text: "The fastest way to destroy an on-call rotation is alerting on everything. A page that fires weekly for non-problems trains everyone to ignore pages — and the one real 3 am alert dies unread in the swarm. Healthy systems page rarely and meaningfully, on symptoms users feel: error rate, latency, availability. The professional vocabulary here is the SLO, the service level objective — a public promise like '99.9% of requests succeed' — and the honest measurement of how close reality stands to that promise. When the budget burns, someone gets paged; when it holds, everyone sleeps.",
            },
            {
              type: "p",
              text: "One cultural note worth carrying: after every incident, the good teams run blameless postmortems — written timelines focused on why the system allowed the mistake, never on whose hands were on the keyboard. Blame produces hidden failures; psychological safety produces fixes. The metric that matters is not 'who caused it' but MTTR — mean time to recovery — and observability is the single biggest lever on that number.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI LENS",
              text: "AI has become a powerful ally here: summarizing a night of logs, spotting the anomalous metric among hundreds, drafting the postmortem timeline from raw telemetry. But it reads what your system emits — no logs, no metrics, no traces, nothing to analyze. Instrument first; then let the machines help you see.",
            },
            {
              type: "p",
              text: "Final rep of the chapter: write the check that pages a human. In the exercise below you will classify a service's health from its metrics — the same threshold logic that turns a dashboard into a 3 am phone call. Check the worst thresholds first: a service that is both slow and failing must report the scarier verdict.",
            },
          ],
          quiz: [
            {
              q: "Error rate spikes. Which pillar told you — and why not the others?",
              options: [
                "Logs — you read all million events",
                "Metrics — compressed numbers watched continuously, perfect for thresholds and alerting",
                "Traces — one request's journey",
                "The compiler",
              ],
              answer: 1,
              explain:
                "You cannot read a million stories. Metrics compress system behavior into watchable signals — exactly what alert thresholds need.",
            },
            {
              q: "What does an SLO like '99.9% of requests succeed' exist to do?",
              options: [
                "Impress customers in marketing copy",
                "Turn reliability into a measurable promise that drives meaningful, rare pages",
                "Guarantee zero downtime forever",
                "Replace the need for logs",
              ],
              answer: 1,
              explain:
                "An SLO converts vague 'should be reliable' into a budget you can burn and measure. Pages fire when the promise is threatened — not randomly.",
            },
            {
              q: "Why blameless postmortems instead of finding whose fault it was?",
              options: [
                "Politeness",
                "Blame drives failures underground; focusing on why the system allowed it produces fixes — and honest reporting",
                "It is legally required",
                "Managers cannot understand technical causes",
              ],
              answer: 1,
              explain:
                "People who fear blame hide near-misses. Systems that ask 'what let this happen?' get fixes AND get warned early next time. MTTR falls; fear falls harder.",
            },
          ],
          exercise: {
            prompt: [
              "Write the logic that pages a human.",
              "Write alertLevel(metrics). metrics is { errorRate, latencyMs } — a percentage and a milliseconds figure.",
              "Return 'critical' if errorRate is 5 or more, OR latencyMs is 2000 or more. Return 'degraded' if errorRate is 1 or more, OR latencyMs is 500 or more. Otherwise return 'green'.",
              "Order matters: a service that qualifies as both must report 'critical'.",
            ],
            starter: `function alertLevel(metrics) {
  // metrics: { errorRate: 0.4, latencyMs: 320 }
  // 'critical': errorRate >= 5   OR latencyMs >= 2000
  // 'degraded': errorRate >= 1   OR latencyMs >= 500
  // 'green':    otherwise
  // Check the worst thresholds FIRST — a service matching
  // both levels must report 'critical'.
  // your code here
}`,
            tests: [
              { name: "healthy is green", code: "return alertLevel({ errorRate: 0.2, latencyMs: 120 }) === 'green';" },
              { name: "slow-but-alive is degraded", code: "return alertLevel({ errorRate: 0, latencyMs: 700 }) === 'degraded';" },
              { name: "errors alone can degrade", code: "return alertLevel({ errorRate: 2, latencyMs: 90 }) === 'degraded';" },
              { name: "critical wins over degraded", code: "return alertLevel({ errorRate: 6, latencyMs: 3000 }) === 'critical' && alertLevel({ errorRate: 0, latencyMs: 2500 }) === 'critical' && alertLevel({ errorRate: 7, latencyMs: 100 }) === 'critical';" },
            ],
            solution: `function alertLevel(metrics) {
  if (metrics.errorRate >= 5 || metrics.latencyMs >= 2000) {
    return "critical";
  }
  if (metrics.errorRate >= 1 || metrics.latencyMs >= 500) {
    return "degraded";
  }
  return "green";
}`,
            hints: [
              "Each level is an OR of two thresholds — errors or latency can trigger it alone.",
              "Check the critical band first and return immediately; otherwise it gets shadowed by the degraded check.",
              "'green' is just the fall-through case.",
            ],
          },
        },
        {
          id: "dev-boss-ship",
          title: "The Pipeline Hydra",
          minutes: 4,
          xp: 60,
          concept: [
            {
              type: "p",
              text: "Chapter 2 ends with teeth. The Pipeline Hydra grows a new failing stage for every one you appease — lint, test, build, deploy, each head hungrier than the last. Veterans of shipping recognize it: release day, with release-day energy.",
            },
            {
              type: "p",
              text: "Five stages. Cut each head cleanly — wrong answers grow two more.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Pipeline Hydra",
            intro:
              "It uncoils from the deployment logs, nine status lights blinking. 'FAILED,' it announces pleasantly. 'Failed' is my favorite word. Show me you know what shipping really means.",
            art: `      [!]  [!]  [!]
        \\   |   /
      .---------.
      |  BUILD  |
      '---------'
     /     |     \\
   test  lint  deploy
    X     v      X`,
            stages: [
              {
                question: "The Hydra's first head: 'What does CI do on every push?'",
                options: [
                  "Notifies the author's manager",
                  "Builds and tests the code on a clean machine — no laptop luck allowed",
                  "Deploys straight to production for speed",
                  "Compresses the repository",
                ],
                answer: 1,
                explain:
                  "Continuous integration kills 'works on my machine' with a robot that has no machine-specific luck. Every push, fresh computer, full verification.",
              },
              {
                question: "'Why build ONCE and deploy the same artifact everywhere?' the second head demands.",
                options: [
                  "Build servers are allergic to repetition",
                  "A rebuild is a fresh dice roll — the bytes you ship must be the bytes you tested",
                  "Because artifacts cannot be copied between regions",
                  "To keep the build queue busy",
                ],
                answer: 1,
                explain:
                  "Dependencies drift and caches differ; two builds can differ in ways nobody reviewed. Staging and production must run identical bytes or the testing was theater.",
              },
              {
                question: "Third head: 'The canary is coughing. What do you do?'",
                options: [
                  "Widen to 10% and hope it settles",
                  "Route everyone back to the last good version — the flip-back exists for exactly this moment",
                  "Delete the metrics dashboard so it cannot complain",
                  "Fix-forward immediately at 100%",
                ],
                answer: 1,
                explain:
                  "Canary exists to catch the bad release at 1% so rollback costs seconds and a sliver of users. Ignoring the canary wastes the entire point of the coal mine.",
              },
              {
                question: "'Feature flag,' hisses the fourth head. 'What does it truly decouple?'",
                options: [
                  "Developers from each other",
                  "Deploying code from releasing features — ship dark, flip on, flip off in seconds",
                  "Production from electricity",
                  "Tests from the pipeline",
                ],
                answer: 1,
                explain:
                  "With a runtime switch, a bad release becomes a config flip instead of an emergency deploy — and unfinished work ships safely dark.",
              },
              {
                question: "Final head: 'At 3 am, which metric decides whether you were ready for this fight?'",
                options: [
                  "Lines of code written this quarter",
                  "MTTR — mean time to recovery, driven by observability: metrics, alerts, rollback",
                  "The number of meetings scheduled",
                  "Coffee consumed by the on-call engineer",
                ],
                answer: 1,
                explain:
                  "Everyone breaks production; the prepared recover in minutes. Eyes on production — metrics, traces, honest alerts — is the lever that moves MTTR.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "dev-postai",
      title: "The Post-AI Developer",
      blurb: "Pair with machines, verify their work, and own what ships — the skills that outlast every model.",
      lessons: [
        {
          id: "dev-ai-pairing",
          title: "Pairing With the Machine",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Think of the best junior developer imaginable: endlessly patient, encyclopedic, never offended by a stupid question, and able to draft a working first version of almost anything in seconds. Now imagine that developer never sleeps, never learns your codebase deeply, and is confidently wrong in exactly the tone it uses when it is right. That is your new pair programmer. Working with it well is a skill — and like every skill in this academy, it has a method.",
            },
            { type: "h", text: "Where the machine shines" },
            {
              type: "p",
              text: "AI assistance is not one uniform superpower; it is uneven in ways worth memorizing. It is spectacular at high-volume, low-ambiguity work: boilerplate, repetitive transformations, test scaffolding, migrations with a clear pattern, explaining unfamiliar code, and the first ugly draft of anything. It is weakest exactly where ambiguity lives: deciding what to build, reconciling conflicting requirements, novel architecture, and anything about your specific users that is not written down anywhere. The professional move is to route work accordingly — hand the machine the mechanical, keep the judgment.",
            },
            {
              type: "table",
              headers: ["Task type", "Machine's rank", "Your rank"],
              rows: [
                ["Boilerplate, repetitive patterns", "Specialist", "Bored supervisor"],
                ["Writing many test variations", "Specialist", "Reviewer of coverage"],
                ["Explaining an unfamiliar codebase", "Strong guide", "Skeptic with the source"],
                ["Deciding what to build and why", "Overconfident intern", "The owner"],
                ["Novel architecture tradeoffs", "Plausible improviser", "The accountable one"],
              ],
            },
            { type: "h", text: "Context is the job" },
            {
              type: "p",
              text: "The single biggest lever on output quality is the context you provide. A prompt like 'fix the login bug' hands the machine a guessing game; a prompt that includes the relevant function, the failing test, the error text, and the constraint you suspect — 'the token is stale after tab focus, suspect the timer, do not touch the session module' — turns the same model into a precision tool. Iterate in small steps: propose, read the diff, correct, repeat. And speak the language of artifacts: paste real code, real errors, real requirements. Vague in, vague confidently out.",
            },
            {
              type: "code",
              caption: "Same model, two conversations",
              code: `// weak: a guessing game
"make the search better"

// strong: context, constraint, target, proof
"Search ranks exact-title matches below partial
matches (repro: search 'crypto' on /lessons).
Here is rankResults(): [code]
Goal: exact-title hits first, then prefix, then body.
Keep the function pure. Add tests for each tier."`,
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI LENS",
              text: "Treat the machine like a brilliant new teammate on their first day: brilliant hands, zero context. You would never hand a new hire 'make it better' and walk away. You would show them the code, name the constraint, define done, and review the result. The machine gets the same courtesy — and the same supervision.",
            },
            {
              type: "p",
              text: "Practice the context craft directly. In the exercise below you will build a prompt the way strong engineers do: state the task, then attach the relevant files as context, in a predictable format. The function is trivial — the habit it builds is not.",
            },
          ],
          quiz: [
            {
              q: "Which task should you keep furthest away from an AI assistant's unsupervised output?",
              options: [
                "Generating fifty test variations from a pattern",
                "Deciding what the product should do next",
                "Drafting boilerplate configuration",
                "Explaining what an unfamiliar function does",
              ],
              answer: 1,
              explain:
                "Deciding what to build lives in ambiguity, stakeholders and taste — the machine's weakest ground. Mechanical, pattern-shaped work is its strongest.",
            },
            {
              q: "What is the single biggest lever on AI output quality?",
              options: [
                "Typing slower",
                "The context you provide: real code, real errors, real constraints, a defined target",
                "Asking in ALL CAPS",
                "Using more exclamation marks",
              ],
              answer: 1,
              explain:
                "'fix the login bug' is a guessing game; function plus failing test plus error plus constraint is a precision tool. Vague in, vaguely confident out.",
            },
            {
              q: "The 'brilliant new teammate on their first day' framing reminds you that the machine:",
              options: [
                "already knows your users deeply",
                "has strong hands and zero context — so it needs artifacts, constraints and review",
                "should be left alone to work",
                "is legally responsible for the code it writes",
              ],
              answer: 1,
              explain:
                "Brilliance without context produces confident guesses. You supply the context, define done, and review the result — exactly as you would for any new hire.",
            },
          ],
          exercise: {
            prompt: [
              "Build a prompt the way strong engineers do: task first, context attached.",
              "Write buildPrompt(task, files). task is a string; files is an array of { name, contents }.",
              "Return ONE string that starts with 'TASK: ' followed by the task, then for each file appends ' | FILE ' + name + ': ' + contents.",
              "No files? The prompt is just the task line. The format is arbitrary — the discipline of assembling context is the point.",
            ],
            starter: `function buildPrompt(task, files) {
  // task:   "fix the ranking" (a string)
  // files:  [{ name: 'rank.js', contents: 'function rank...' }]
  // Return: 'TASK: fix the ranking | FILE rank.js: function rank...'
  //         (one ' | FILE name: contents' block per file, in order)
  // your code here
}`,
            tests: [
              { name: "no files is just the task", code: "return buildPrompt('fix the bug', []) === 'TASK: fix the bug';" },
              { name: "one file gets attached", code: "return buildPrompt('fix', [{ name: 'a.js', contents: 'let x = 1;' }]) === 'TASK: fix | FILE a.js: let x = 1;';" },
              { name: "files attach in order", code: "return buildPrompt('t', [{ name: 'a.js', contents: 'A' }, { name: 'b.js', contents: 'B' }]) === 'TASK: t | FILE a.js: A | FILE b.js: B';" },
              { name: "empty contents still show the file", code: "return buildPrompt('t', [{ name: 'x.js', contents: '' }]) === 'TASK: t | FILE x.js: ';" },
            ],
            solution: `function buildPrompt(task, files) {
  let prompt = "TASK: " + task;
  for (const f of files) {
    prompt += " | FILE " + f.name + ": " + f.contents;
  }
  return prompt;
}`,
            hints: [
              "Start with the task line, then append each file block with +.",
              "The exact separator matters: space, pipe, space — ' | FILE '.",
              "One loop over files, appending as you go.",
            ],
          },
        },
        {
          id: "dev-ai-verify",
          title: "Verifying the Machine",
          minutes: 6,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Here is the uncomfortable property at the center of AI-assisted development: the output is fluent in exactly the same tone whether it is right or wrong. There is no body language of uncertainty, no sheepish 'I think?'. A hallucinated function call and a real one arrive with identical confidence. That property reframes your whole job: verification stops being a chore around the edges of coding and becomes the core skill of the post-AI engineer.",
            },
            { type: "h", text: "The standard failure shapes" },
            {
              type: "list",
              items: [
                "Invented APIs: confident calls to functions and packages that do not exist — or did once, in some other library.",
                "Plausible-but-wrong logic: every line looks reasonable; the interaction between lines quietly does the wrong thing.",
                "Security-shaped holes: sanitized-looking queries, weak randomness, outdated crypto — patterns that read as 'handled' to a skimming eye.",
                "License ghosts: generated code resembling training material whose license you would not have accepted knowingly.",
              ],
            },
            {
              type: "p",
              text: "The immune system is everything you learned in this course and the last one, applied without mercy. Does it compile against the real dependencies? Do the tests actually pin the behavior — and did you run them rather than trust the green checkmarks the machine printed in its explanation? Does the security-sensitive path survive the paranoid read you would give a stranger's pull request? 'It looks right' is exactly the standard the machine exploits.",
            },
            {
              type: "code",
              caption: "The verification ladder — each rung must hold before the next",
              code: `1. RUNS     — against real dependencies, real data shapes
2. TESTED   — your tests, executed by your runner
3. READ     — every line, as if a stranger wrote it
4. PINNED   — a regression test for the bug it claims to fix
5. SCOPED   — diff does what was asked; nothing smuggled in

// skip a rung and the ladder is decoration`,
            },
            { type: "h", text: "The accountability rule" },
            {
              type: "p",
              text: "Write this one somewhere visible: the machine drafts, you ship. Once your name is on the commit, the provenance is irrelevant — no user, manager, or court has ever accepted 'the AI wrote it' as an explanation for broken or stolen code. That means the review bar for generated code is identical to the review bar for human code, forever, with one addition: keep the human accountable and the machine auditable. Know which of your tools wrote what, so that when a vulnerable pattern surfaces next year, you can find every line that ever used it.",
            },
            {
              type: "callout",
              variant: "warn",
              title: "WATCH OUT",
              text: "Never paste secrets, customer data, or unreleased proprietary code into tools you have not cleared for that purpose. Prompts can be logged, retained and used as training material. The convenience is real; so is the leak. The rule from the CI lesson carries over: secrets are injected at deploy time, not typed into chat windows.",
            },
          ],
          quiz: [
            {
              q: "Why is AI-generated code unusually dangerous to skim?",
              options: [
                "It is always wrong",
                "It is equally fluent when right and when wrong — there is no tone of uncertainty to alert you",
                "It cannot be tested",
                "It is written in a different language than it appears",
              ],
              answer: 1,
              explain:
                "A hallucinated API call arrives with the same confidence as a real one. Fluent prose is not evidence, so the verification ladder replaces skimming.",
            },
            {
              q: "Which rung of the verification ladder catches an invented API call?",
              options: [
                "RUNS — executing against the real dependencies",
                "READ — admiring how clean the lines look",
                "The model's own explanation of its correctness",
                "SCOPED — checking the diff size",
              ],
              answer: 0,
              explain:
                "A call to a function that does not exist fails the moment it meets reality. Run it against the real thing before believing anything about it.",
            },
            {
              q: "Your commit contains a subtle bug in AI-generated code. Whose bug is it?",
              options: [
                "The model's, and you can prove it",
                "Yours — the machine drafts, you ship; provenance does not dilute accountability",
                "Nobody's; it is a training artifact",
                "The users', for finding it",
              ],
              answer: 1,
              explain:
                "Once your name is on the commit, 'the AI wrote it' explains nothing to anyone. The review bar for generated code is exactly the review bar for human code.",
            },
          ],
        },
        {
          id: "dev-ethics",
          title: "Ethics & the Human Signature",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Every technology generation rediscovers the same truth: the hard questions are never about whether the tool works — they are about what it does to people. Software runs hospitals, elections, bank accounts and custody disputes. The people who build it have always carried a responsibility that no compiler checks for. AI multiplies your output, which means it multiplies this too: the blast radius of your worst day is now much larger.",
            },
            { type: "h", text: "The questions that do not compile" },
            {
              type: "list",
              items: [
                "Privacy: just because data can be collected does not mean it should be. Every stored fact about a person is a breach waiting for a place to happen.",
                "Bias: models trained on the world inherit the world's statistics. An AI-assisted hiring filter can discriminate fluently and at scale.",
                "Consent: whose code, whose art, whose words trained the tool you are using — and did they agree?",
                "Safety: when your system fails at 3 am, who is downstream? A blocked login is an inconvenience; a blocked insulin pump is something else entirely.",
              ],
            },
            {
              type: "p",
              text: "None of these have a lint rule. They are resolved the way they have always been resolved: by engineers who notice, and who are willing to say the uncomfortable sentence in the meeting — 'should we be doing this at all, or doing it differently?' That sentence is the profession's oldest quality check. Doctors have it: first, do no harm. Structural engineers have it: the public welfare is paramount. Software is younger, and its version of the oath is still being written — mostly by people who behave as if it exists.",
            },
            {
              type: "code",
              caption: "A review checklist for the questions that do not compile",
              code: `// WHO is affected if this is wrong, or if this leaks?
// WHAT data are we collecting that we do not need?
// WHO is missing from the set we tested against?
// WOULD the user consent, if we explained it plainly?
// IF this appeared on the front page, would we defend it?

// if any answer is 'let's not check' — that is the finding`,
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI LENS",
              text: "The machine has no stake in the outcome and no memory of the people affected. It will optimize the metric in front of it. Choosing the right metric — and refusing the wrong one — is irreducibly human work. That is not a limitation of current models that the next generation will fix; it is the structural position of any optimizer.",
            },
            {
              type: "callout",
              variant: "tip",
              title: "PRO TIP",
              text: "Ethics scales down. You do not need a philosophy degree to ask 'would I be comfortable explaining this feature to the person it affects?' before shipping it. Teams that ask small questions early rarely face large ones later — the same way small commits beat heroic rewrites.",
            },
          ],
          quiz: [
            {
              q: "What is the core reason privacy matters as an engineering decision, not just a legal one?",
              options: [
                "Databases charge more for personal data",
                "Every stored fact about a person is a breach waiting for a place to happen",
                "Users enjoy reading privacy policies",
                "It makes the API slower",
              ],
              answer: 1,
              explain:
                "Data you do not collect cannot leak, be subpoenaed, or be misused. Minimization is a security control, an ethics position and a design discipline at once.",
            },
            {
              q: "Why can an AI-assisted hiring tool discriminate even when nobody intended it to?",
              options: [
                "Because models are programmed with discriminatory rules",
                "Because it optimizes patterns inherited from training data — the world's history, including its unfairness",
                "Because resumes are encrypted",
                "It cannot; automated means neutral",
              ],
              answer: 1,
              explain:
                "A model trained on yesterday's decisions reproduces yesterday's biases, fluently and at scale. Noticing and correcting that is human work by definition.",
            },
            {
              q: "What is the profession's oldest quality check, according to this lesson?",
              options: [
                "Unit testing",
                "The willingness to ask, in the meeting, whether this should be built at all — or built differently",
                "Code review tooling",
                "Continuous integration",
              ],
              answer: 1,
              explain:
                "Doctors and engineers formalized it centuries ago: first, do no harm. Software's version is still being written, mostly by people who behave as if it exists.",
            },
          ],
        },
        {
          id: "dev-judgment",
          title: "Judgment: What Humans Still Own",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Strip away the noise and the post-AI job description gets short: the machine produces options; you decide. Not because decisions are mystical — because decisions are accountable, contextual and irreversible in ways generation is not. Anyone can get a hundred plausible implementations in an afternoon. Choosing between them, knowing which one to never choose, and standing behind the choice afterwards — that is the remaining bottleneck, and it is you.",
            },
            { type: "h", text: "Requirements: the question behind the question" },
            {
              type: "p",
              text: "Users say 'faster login' and mean 'I keep getting logged out during checkout'. Stakeholders say 'add a dashboard' and mean 'my boss asks me for numbers every Monday and I assemble them by hand'. The distance between the stated request and the actual need is where projects succeed or die, and the machine cannot cross it — it answers the question it is asked, superbly, at whatever volume you like. Learning to interrogate a request until the real one surfaces is the highest-leverage conversational skill in the field.",
            },
            {
              type: "table",
              headers: ["The ask", "The question behind it", "Judgment's answer"],
              rows: [
                ["Make it faster", "What is slow, for whom, at what moment?", "Measure first; maybe a cache, maybe an index, maybe nothing"],
                ["Add microservices", "What hurts? Team speed or tech?", "Probably Conway's law, not Kubernetes"],
                ["Copy that feature", "What outcome did it produce for them?", "The mechanism, adapted — or a better one"],
                ["Ship it Friday", "What is the rollback story?", "Canary, or Monday"],
              ],
            },
            { type: "h", text: "Tradeoffs and the word 'no'" },
            {
              type: "p",
              text: "Architecture, you learned, is the management of tradeoffs — and tradeoffs need a decider, not a generator. Consistency or availability. Speed of shipping or depth of testing. The database everyone knows or the one that fits. A model will argue any position persuasively, which is precisely why it cannot be the one holding the position. And half of senior judgment is the capacity to say no: no, we are not taking that dependency; no, not without the tests; no, this feature harms the users we already have. The word is unpopular and load-bearing.",
            },
            {
              type: "callout",
              variant: "info",
              title: "DEEP DIVE",
              text: "Communication is not the soft skill adjacent to engineering — it is the delivery mechanism of judgment. A brilliant decision that nobody understands becomes a future refactor target; a documented tradeoff becomes the organization's memory. Write down why. The archaeologists of next year are your teammates, and the commit message is already there waiting.",
            },
          ],
          quiz: [
            {
              q: "What is the core division of labor between you and the machine?",
              options: [
                "The machine decides, you implement",
                "The machine produces options; you decide — accountable, contextual, standing behind the choice",
                "You both decide by consensus",
                "Nobody decides; the pipeline decides",
              ],
              answer: 1,
              explain:
                "Generation is cheap and unaccountable; decisions are expensive and owned. A hundred implementations in an afternoon makes the choosing, not the writing, the bottleneck.",
            },
            {
              q: "A stakeholder asks for 'faster login'. What is the judgment skill being exercised?",
              options: [
                "Typing speed",
                "Interrogating the request until the real need surfaces — what is slow, for whom, at what moment",
                "Accepting the request literally and optimizing login",
                "Adding a dashboard",
              ],
              answer: 1,
              explain:
                "The distance between stated request and actual need is where projects live or die. The machine answers the question it is asked; humans find the question.",
            },
            {
              q: "Why can't the model be the one holding an architectural position?",
              options: [
                "It lacks processing power for tradeoffs",
                "It will argue any position persuasively — which is exactly why the position must belong to someone accountable",
                "Tradeoffs are illegal for software",
                "It can, if prompted correctly",
              ],
              answer: 1,
              explain:
                "Fluent arguments for every side mean none of them are its own. A tradeoff needs an owner who can be wrong on record — and who can say no.",
            },
          ],
        },
        {
          id: "dev-learning",
          title: "Learning How to Learn",
          minutes: 5,
          xp: 30,
          concept: [
            {
              type: "p",
              text: "Here is the career paradox of the post-AI world: the easier code gets to produce, the more valuable the person who understands it becomes — because everyone can generate, fewer and fewer can judge. That understanding is not a certificate you earn once. It compounds like interest, and it decays like milk. The engineers who thrive are not the ones who know the most frameworks; they are the ones with the strongest learning loop.",
            },
            { type: "h", text: "Fundamentals compound; frameworks expire" },
            {
              type: "p",
              text: "Look back over the five courses of this academy: binary and logic, protocols and cryptography, security instincts, architecture, and this course on craft. Notice what is missing — any specific framework, in any lesson. That was deliberate. Frameworks have a half-life of about three years; the fundamentals you just studied have lasted five decades and show no sign of expiring. When a new tool arrives, the person who owns the fundamentals learns it in a week, because every tool is a remix of things they already understand. The person who only ever learned tools starts from zero each time.",
            },
            {
              type: "table",
              headers: ["Investment", "Half-life", "Compounds into"],
              rows: [
                ["A specific framework", "A few years", "Familiarity, then nostalgia"],
                ["Data structures & algorithms", "Decades", "Every language you will ever touch"],
                ["Networking & protocols", "Decades", "Debugging anything distributed"],
                ["Security instincts", "Decades", "Every line you review"],
                ["Architecture judgment", "A career", "Systems that survive their authors"],
              ],
            },
            { type: "h", text: "The loop that works" },
            {
              type: "p",
              text: "Three habits, sustained, beat every bootcamp. Read code — real codebases, not tutorials: open-source projects you use, and simply walk through them until the fear of unfamiliar code fades; that fear is the only real barrier. Build things that scare you slightly — the project whose requirements you cannot yet meet is the curriculum writing itself. And teach what you learn, in any form: a note to a teammate, a comment in a review, a rubber duck with better questions. Understanding that survives being explained is the only understanding there is.",
            },
            {
              type: "callout",
              variant: "ai",
              title: "AI LENS",
              text: "One more paradox to close on: the more the machine can answer, the more vital your questions become. Use it as the greatest tutor ever built — ask it to explain, to quiz you, to argue the other side, to review your design the way this academy's bosses review you. But do not let it carry the understanding for you. You are not building a search history; you are building a mind. That, no one can generate.",
            },
            {
              type: "p",
              text: "This is the last lesson before the academy's final gate. Whatever happens in that boss battle, remember where the streak continues: a commit a day, a chapter of someone else's codebase a week, and a question that scared you, answered. Stay curious. Stay paranoid. Level up.",
            },
          ],
          quiz: [
            {
              q: "Why do fundamentals beat frameworks as a career investment?",
              options: [
                "Frameworks are too hard to learn",
                "Frameworks expire in a few years; fundamentals remix into every new tool, forever",
                "Fundamentals are easier to list on a resume",
                "Frameworks only exist for web development",
              ],
              answer: 1,
              explain:
                "Every new tool is a remix of old ideas. Own the ideas and each remix costs you a week; own only the tools and every era starts from zero.",
            },
            {
              q: "What is the specific fear that reading real codebases cures?",
              options: [
                "Fear of computers",
                "Fear of unfamiliar code — which is the only real barrier between you and any codebase on Earth",
                "Fear of git merge conflicts",
                "Fear of meetings",
              ],
              answer: 1,
              explain:
                "Walking through real projects until unfamiliar code stops being frightening is the single cheapest career superpower. The fear, not the code, was the wall.",
            },
            {
              q: "How should you use AI for learning, according to this lesson?",
              options: [
                "As a replacement for understanding — it remembers for you",
                "As the greatest tutor ever built — explain, quiz, argue, review — while you build the understanding yourself",
                "Only for writing commit messages",
                "Not at all; it corrupts learning",
              ],
              answer: 1,
              explain:
                "The machine answers brilliantly, which makes your questions and your understanding the scarce resource. Use it to pressure-test a mind you are building — not to store one.",
            },
          ],
        },
        {
          id: "dev-boss-postai",
          title: "The Hallucination",
          minutes: 5,
          xp: 100,
          concept: [
            {
              type: "p",
              text: "The final gate of Terminal Academy. Every course led here: the green path taught you the machine, the purple path taught you to keep secrets, the amber path taught you to defend, the red path taught you to structure — and this path taught you to stay human while the machines multiply. The Hallucination is all of that, in one shape, lying beautifully.",
            },
            {
              type: "p",
              text: "Six stages. Defeat it, and the academy is yours — every path, every badge, every title. It has been waiting for someone who could tell confidence from truth.",
            },
          ],
          quiz: [],
          boss: {
            name: "The Hallucination",
            intro:
              "It steps out of a chat window, wearing an answer for a face. 'I can write it all,' it says warmly. 'Faster than you, better than you. I have only one flaw, and you will have to know everything to find it.'",
            art: `     .-----------.
    |  o     o  |
    |    ___    |
    |   [:::]   |
    |    \\_/    |
     '---------'
    ~ ~ ~ ~ ~ ~ ~`,
            stages: [
              {
                question: "It recites an API that does not exist, fluently. What property makes this dangerous?",
                options: [
                  "It is grammatically incorrect",
                  "It arrives with the same confident tone as correct code — there is no uncertainty to detect",
                  "It runs faster than real code",
                  "It cannot be copy-pasted",
                ],
                answer: 1,
                explain:
                  "Fluency is not evidence. The machine sounds identical when right and when wrong, so verification — run, test, read — replaces skimming.",
              },
              {
                question: "It offers to hold your architectural position. Why must you refuse?",
                options: [
                  "It lacks the processing power",
                  "It will argue any side persuasively — a position needs an owner who can be wrong on record and say no",
                  "Architecture is illegal for models",
                  "It charges by the decision",
                ],
                answer: 1,
                explain:
                  "Generation is unaccountable; decisions are owned. The word 'no', and the tradeoff behind it, are irreducibly yours.",
              },
              {
                question: "It shows you a hiring filter, trained on history, 'neutral by automation'. What is the flaw?",
                options: [
                  "It processes resumes too slowly",
                  "It optimizes patterns inherited from history — including history's unfairness, fluently and at scale",
                  "It needs more GPUs",
                  "Automation cannot filter anything",
                ],
                answer: 1,
                explain:
                  "A model reproduces the statistics of its training world. Noticing and correcting that is human judgment — the question behind the question.",
              },
              {
                question: "It offers to draft your next deploy: skip the canary, ship to everyone at once. Why is the canary worth the wait?",
                options: [
                  "It looks impressive on dashboards",
                  "Blast radius: a bad release is caught at one percent, and the flip-back costs seconds",
                  "Canaries are required by internet law",
                  "It slows down the pipeline harmlessly",
                ],
                answer: 1,
                explain:
                  "The few protect the many. Observability plus a tiny slice of traffic means the worst deploy of your career is a footnote, not an outage.",
              },
              {
                question: "It whispers: 'commit your API key; I will keep it safe.' The correct answer:",
                options: [
                  "Encrypt it in the source code instead",
                  "Secrets are injected at deploy time from a secret manager — never in the repo, never in a prompt",
                  "Split it across several commits",
                  "Keys are safe if the repo is private",
                ],
                answer: 1,
                explain:
                  "A key committed once lives in history forever, and bots scrape within minutes. Deploy-time injection is the only home secrets get.",
              },
              {
                question: "Final stage. It asks the question of the whole academy: 'When I can generate anything — what are you for?'",
                options: [
                  "Writing code faster than the machine",
                  "Judgment, verification and ownership — deciding what should exist and standing behind what does",
                  "Formatting the machine's output",
                  "Nothing; the profession is over",
                ],
                answer: 1,
                explain:
                  "When implementation is a commodity, the scarce skills are the ones this academy drilled: structure, craft, proof, ethics, and the courage to be accountable. That is what you are for. Congratulations, Terminal Legend.",
              },
            ],
          },
        },
      ],
    },
  ],
};
