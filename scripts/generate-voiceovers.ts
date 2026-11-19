/**
 * Regenerate the studio voice notes with local Qwen3-TTS (qwentts.cpp).
 *
 *   bun scripts/generate-voiceovers.ts
 *
 * Narration is extracted locally from each lesson (title + opening paragraph
 * + closing callout). Audio is cached under $TMPDIR/terminal-voiceover, so an
 * interrupted run resumes where it stopped.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { COURSES } from "../src/data/courses";
import type { Lesson } from "../src/data/types";

const ROOT = resolve(import.meta.dir, "..");
const CACHE = join(process.env.TMPDIR ?? "/tmp", "terminal-voiceover");
const OUT = join(CACHE, "audio");
for (const dir of [join(OUT, "lessons"), join(OUT, "bosses"), join(CACHE, "wav")]) mkdirSync(dir, { recursive: true });

const QWEN = process.env.QWEN_TTS ?? join(process.env.HOME ?? "", "qwentts.cpp/build/qwen-tts");
const MODELS = process.env.QWEN_MODELS ?? "/mnt/backup/llm-models";
const TALKER = process.env.QWEN_TALKER ?? join(MODELS, "qwen-talker-1.7b-customvoice-Q4_K_M.gguf");
const CODEC = process.env.QWEN_CODEC ?? join(MODELS, "qwen-tokenizer-12hz-Q4_K_M.gguf");
const LESSON_VOICE = process.env.LESSON_VOICE ?? "vivian";
const BOSS_VOICE = process.env.BOSS_VOICE ?? "aiden";
const LESSON_STYLE = process.env.LESSON_STYLE ?? "";
const BOSS_STYLE = process.env.BOSS_STYLE ?? "Menacing, theatrical video-game villain, slow and deliberate.";
const ONLY = process.env.ONLY;
const LIMIT = Number(process.env.LIMIT ?? 0);

type Job = { id: string; kind: "lesson" | "boss"; script: string; voice: string; style: string };

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

function lessonScript(lesson: Lesson): string {
  const paragraphs = lesson.concept.flatMap((b) => (b.type === "p" ? [b.text] : []));
  const callout = [...lesson.concept].reverse().find((b) => b.type === "callout");
  const parts = [lesson.title, paragraphs[0] ?? ""];
  if (words(parts.join(" ")) < 60 && paragraphs[1]) parts.push(paragraphs[1]);
  if (callout) parts.push(callout.text);
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function jobs(): Job[] {
  const out: Job[] = [];
  for (const course of COURSES) {
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        out.push(
          lesson.boss
            ? { id: lesson.id, kind: "boss", script: lesson.boss.intro, voice: BOSS_VOICE, style: BOSS_STYLE }
            : { id: lesson.id, kind: "lesson", script: lessonScript(lesson), voice: LESSON_VOICE, style: LESSON_STYLE },
        );
      }
    }
  }
  return out;
}

function ffprobe(file: string): string {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file]);
  return r.stdout.toString().trim();
}

function fmtDuration(file: string): string {
  const d = Number(ffprobe(file));
  if (!Number.isFinite(d) || d <= 0) throw new Error(`bad duration for ${file}`);
  return String(Math.round(d * 10) / 10);
}

function writeAudio(job: Job): string {
  const file = join(OUT, job.kind === "boss" ? "bosses" : "lessons", `${job.id}.mp3`);
  if (existsSync(file) && Number(ffprobe(file)) > 1) return file;

  const wav = join(CACHE, "wav", `${job.id}.wav`);
  const run = spawnSync(
    QWEN,
    ["--model", TALKER, "--codec", CODEC, "--lang", "English", "--speaker", job.voice,
      ...(job.style ? ["--instruct", job.style] : []), "--max-new", "4096", "--format", "wav16", "-o", wav],
    { input: job.script, timeout: 900_000, maxBuffer: 1 << 20 },
  );
  if (run.status !== 0 || !existsSync(wav)) {
    throw new Error((run.stderr?.toString() || run.stdout?.toString() || "qwen-tts failed").slice(-500));
  }

  const enc = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "48k", "-ac", "1", file]);
  rmSync(wav, { force: true });
  if (enc.status !== 0) throw new Error(`ffmpeg failed for ${job.id}: ${enc.stderr}`);
  return file;
}

function refreshClips(all: Job[]): void {
  const lessons = all.filter((j) => j.kind === "lesson").map((j) =>
    `  "${j.id}": { file: "audio/lessons/${j.id}.mp3", seconds: ${fmtDuration(join(OUT, "lessons", `${j.id}.mp3`))} },`);
  const bosses = all.filter((j) => j.kind === "boss").map((j) =>
    `  "${j.id}": { file: "audio/bosses/${j.id}.mp3", seconds: ${fmtDuration(join(OUT, "bosses", `${j.id}.mp3`))} },`);

  const total = all.reduce((sum, j) =>
    sum + Number(fmtDuration(join(OUT, j.kind === "boss" ? "bosses" : "lessons", `${j.id}.mp3`))), 0);

  const path = join(ROOT, "src/data/audio-notes.ts");
  const src = readFileSync(path, "utf8");
  const next = src
    .replace(/export const AUDIO_NOTES: Record<string, AudioClip> = \{[\s\S]*?\n\};/,
      `export const AUDIO_NOTES: Record<string, AudioClip> = {\n${lessons.join("\n")}\n};`)
    .replace(/export const BOSS_VOICES: Record<string, AudioClip> = \{[\s\S]*?\n\};/,
      `export const BOSS_VOICES: Record<string, AudioClip> = {\n${bosses.join("\n")}\n};`)
    .replace(/clips: \d+,\n  minutes: \d+,/, `clips: ${all.length},\n  minutes: ${Math.round(total / 60)},`);
  writeFileSync(path, next);
}

function main() {
  const all = jobs();
  const selected = all.filter((j) => !ONLY || j.id === ONLY);
  console.log(`${selected.length} clips · ${LESSON_VOICE}/${BOSS_VOICE} · qwen3-tts`);

  for (const [i, job] of selected.entries()) {
    if (LIMIT && i >= LIMIT) break;
    try {
      const file = writeAudio(job);
      console.log(`✓ ${job.kind.padEnd(6)} ${job.id} (${fmtDuration(file)}s, ${words(job.script)}w) [${i + 1}/${selected.length}]`);
    } catch (err) {
      console.error(`✗ ${job.id}: ${(err as Error).message}`);
      process.exitCode = 1;
    }
  }

  if (selected.length === all.length && !process.exitCode) {
    for (const job of all) {
      const dest = join(ROOT, "public/audio", job.kind === "boss" ? "bosses" : "lessons", `${job.id}.mp3`);
      mkdirSync(join(dest, ".."), { recursive: true });
      writeFileSync(dest, readFileSync(join(OUT, job.kind === "boss" ? "bosses" : "lessons", `${job.id}.mp3`)));
    }
    refreshClips(all);
    console.log("✓ public/audio + src/data/audio-notes.ts updated");
  }
}

main();
