"use client";

/**
 * Terminal Academy — retro sound engine.
 * Every effect is synthesized with the Web Audio API: no audio files,
 * no network, works forever offline (and inside the Android WebView).
 *
 * Browsers require a user gesture before audio may play, so the
 * AudioContext is created lazily on the first sfx call (which always
 * happens inside a click/key handler).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SoundSettings = {
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
};

export const useSoundSettings = create<SoundSettings>()(
  persist(
    (set) => ({
      soundOn: true,
      setSoundOn: (on) => set({ soundOn: on }),
    }),
    {
      name: "terminal-sound-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

type ToneOpts = {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  /** slide to this frequency over the duration */
  slideTo?: number;
};

function tone(o: ToneOpts) {
  if (!useSoundSettings.getState().soundOn) return;
  const ac = getCtx();
  if (!ac) return;
  const { freq, dur = 0.08, type = "square", gain = 0.04, delay = 0, slideTo } = o;

  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const amp = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);

  amp.gain.setValueAtTime(0, t0);
  amp.gain.linearRampToValueAtTime(gain, t0 + 0.008);
  amp.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);

  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noiseBurst(dur = 0.18, gain = 0.05, delay = 0) {
  if (!useSoundSettings.getState().soundOn) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  const amp = ac.createGain();
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.buffer = buf;
  src.connect(filter).connect(amp).connect(ac.destination);
  src.start(t0);
}

/** All the academy's sound effects. Safe to call anywhere — silent when muted. */
export const sfx = {
  /** tiny UI blip for buttons/selections */
  click: () => tone({ freq: 760, dur: 0.045, gain: 0.028, type: "square" }),
  /** soft tick for toggles and typing */
  tick: () => tone({ freq: 1180, dur: 0.025, gain: 0.016, type: "square" }),
  /** ascending pair — correct answer */
  correct: () => {
    tone({ freq: 620, dur: 0.07, gain: 0.05, type: "triangle" });
    tone({ freq: 930, dur: 0.11, gain: 0.05, type: "triangle", delay: 0.07 });
  },
  /** descending buzz — wrong answer */
  wrong: () => {
    tone({ freq: 200, dur: 0.16, gain: 0.05, type: "sawtooth", slideTo: 110 });
  },
  /** shield break / boss takes a hit */
  bossHit: () => {
    noiseBurst(0.12, 0.05);
    tone({ freq: 130, dur: 0.16, gain: 0.06, type: "square", slideTo: 60 });
  },
  /** player loses a heart */
  heartLose: () => {
    tone({ freq: 300, dur: 0.12, gain: 0.05, type: "sawtooth", slideTo: 150 });
    noiseBurst(0.14, 0.04, 0.05);
  },
  /** level-up arpeggio */
  levelup: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ freq: f, dur: 0.12, gain: 0.05, type: "square", delay: i * 0.09 }),
    );
  },
  /** mission complete fanfare */
  victory: () => {
    [392, 523, 659].forEach((f, i) =>
      tone({ freq: f, dur: 0.11, gain: 0.05, type: "triangle", delay: i * 0.08 }),
    );
    tone({ freq: 784, dur: 0.22, gain: 0.06, type: "triangle", delay: 0.24 });
  },
  /** boss defeated — bigger fanfare */
  bossVictory: () => {
    [330, 415, 494, 622].forEach((f, i) =>
      tone({ freq: f, dur: 0.13, gain: 0.05, type: "square", delay: i * 0.1 }),
    );
    [988, 1245].forEach((f, i) =>
      tone({ freq: f, dur: 0.2, gain: 0.05, type: "triangle", delay: 0.5 + i * 0.12 }),
    );
  },
  /** blackout / game over */
  defeat: () => {
    [440, 330, 220].forEach((f, i) =>
      tone({ freq: f, dur: 0.18, gain: 0.05, type: "sawtooth", delay: i * 0.14, slideTo: f * 0.7 }),
    );
  },
  /** arcade countdown blip */
  count: () => tone({ freq: 880, dur: 0.06, gain: 0.04, type: "square" }),
  /** round start */
  roundStart: () => {
    tone({ freq: 520, dur: 0.06, gain: 0.04, type: "square" });
    tone({ freq: 700, dur: 0.08, gain: 0.04, type: "square", delay: 0.06 });
  },
  /** keystroke in the typing game — very quiet */
  key: () => tone({ freq: 1400 + Math.random() * 300, dur: 0.018, gain: 0.012, type: "square" }),
  /** boot terminal ready */
  boot: () => {
    tone({ freq: 660, dur: 0.08, gain: 0.03, type: "square" });
    tone({ freq: 990, dur: 0.12, gain: 0.03, type: "square", delay: 0.09 });
  },
};
