"use client";

/**
 * Arcade score vault — keeps high scores for every arcade game,
 * persisted to localStorage like the rest of your journey.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type GameId = "bit-blitz" | "command-rush" | "phishing-spotter" | "type-rush";

export type GameRecord = { score: number; at: string }; // ISO date

export type ArcadeState = {
  bests: Partial<Record<GameId, GameRecord>>;
  plays: number;
  lastGame: GameId | null;

  recordScore: (game: GameId, score: number) => { isBest: boolean; best: number };
  notePlay: (game: GameId) => void;
};

export const ARCADE_GAMES: Array<{ id: GameId; name: string; tagline: string; unit: string }> = [
  { id: "bit-blitz", name: "bit_blitz", tagline: "flip bits against the clock", unit: "pts" },
  { id: "command-rush", name: "command_rush", tagline: "60s rapid-fire trivia", unit: "pts" },
  { id: "phishing-spotter", name: "phishing_spotter", tagline: "real or rogue domains", unit: "pts" },
  { id: "type-rush", name: "type_rush", tagline: "terminal typing speedrun", unit: "wpm" },
];

export const useArcade = create<ArcadeState>()(
  persist(
    (set, get) => ({
      bests: {},
      plays: 0,
      lastGame: null,

      recordScore: (game, score) => {
        const prev = get().bests[game];
        const isBest = !prev || score > prev.score;
        if (isBest) {
          const bests = { ...get().bests, [game]: { score, at: new Date().toISOString() } };
          set({ bests });
        }
        return { isBest, best: Math.max(score, prev?.score ?? 0) };
      },

      notePlay: (game) => set({ plays: get().plays + 1, lastGame: game }),
    }),
    {
      name: "terminal-arcade-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
