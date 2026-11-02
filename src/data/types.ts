/**
 * Terminal Academy — content data model
 * All learning content is authored against these types and bundled
 * statically so the whole app works 100% offline.
 */

/** A single content block inside a lesson's concept section. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "code"; caption?: string; code: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; variant: "info" | "warn" | "tip" | "ai"; title?: string; text: string }
  | { type: "ascii"; art: string }
  | { type: "table"; headers: string[]; rows: string[][] };

/** A multiple-choice quiz question. `answer` is the index into `options`. */
export type QuizQuestion = {
  q: string;
  code?: string;
  options: string[];
  answer: number;
  explain: string;
};

/** One auto-graded test. `code` is the body of a function that must return truthy. */
export type TestCase = {
  name: string;
  code: string;
};

/** A boot.dev-style in-browser coding exercise. */
export type Exercise = {
  prompt: string[];
  starter: string;
  tests: TestCase[];
  solution: string;
  hints: string[];
};

/** One round of a boss battle. */
export type BossStage = {
  question: string;
  code?: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Boss = {
  name: string;
  intro: string;
  art?: string;
  stages: BossStage[];
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  xp: number;
  /** Concept reading content. */
  concept: Block[];
  /** Knowledge-check quiz (always present for lessons). */
  quiz: QuizQuestion[];
  /** Optional coding exercise. */
  exercise?: Exercise;
  /** Present only on boss-battle nodes. */
  boss?: Boss;
};

export type Chapter = {
  id: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
};

export type CourseId = "foundations" | "crypto" | "security" | "architecture" | "development";

export type Course = {
  id: CourseId;
  title: string;
  subtitle: string;
  icon: "cpu" | "key" | "shield" | "blocks" | "rocket";
  color: "green" | "purple" | "amber" | "red" | "pink";
  chapters: Chapter[];
};
