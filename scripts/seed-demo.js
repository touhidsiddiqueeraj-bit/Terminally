(() => {
  const cr = (q, e, x) => ({ completedAt: "2026-11-01T10:00:00Z", quizPerfect: q, exerciseDone: e, xpAwarded: x });
  const L = {
    "fnd-what-is-a-computer": cr(true, false, 30),
    "fnd-binary": cr(true, true, 40),
    "fnd-bytes": cr(false, true, 35),
    "fnd-text-as-numbers": cr(true, true, 40),
    "fnd-boss-binary": cr(true, false, 60),
    "fnd-booleans": cr(true, true, 40),
    "fnd-logic-gates": cr(true, true, 40),
    "fnd-branching": cr(false, true, 35),
    "fnd-loops": cr(true, true, 40),
    "fnd-boss-logic": cr(true, false, 60),
    "crp-secrecy-basics": cr(true, false, 30),
    "crp-caesar": cr(true, true, 40),
    "crp-breaking-caesar": cr(true, true, 40),
    "crp-vigenere": cr(false, true, 35),
    "crp-boss-vault": cr(true, false, 60),
    "crp-xor": cr(true, true, 40),
    "crp-one-time-pad": cr(true, false, 30),
    "crp-hashing": cr(true, true, 40),
    "crp-password-hashing": cr(true, true, 40),
    "crp-symmetric": cr(true, false, 30),
    "crp-key-problem": cr(true, false, 30),
    "crp-boss-breach": cr(true, false, 60),
    "crp-randomness": cr(true, true, 40),
    "crp-nonce": cr(true, false, 30),
    "crp-frequency": cr(true, true, 40),
    "crp-cryptanalysis": cr(true, false, 30),
  };
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem(
    "terminal-academy-v1",
    JSON.stringify({
      state: {
        handle: "byte_rider",
        xp: 1365,
        streak: { count: 5, best: 9, lastActiveDate: today, freezes: 1 },
        lessons: L,
        badges: { "first-steps": "2026-10-28T09:00:00Z", "streak-7": "2026-11-01T09:30:00Z" },
        lastLessonId: "crp-cryptanalysis",
        history: { "2026-10-28": 95, "2026-10-29": 100, "2026-10-30": 75, "2026-10-31": 35, "2026-11-01": 100 },
        version: 1,
      },
      version: 0,
    }),
  );
  return "seeded " + Object.keys(L).length + " lessons";
})()
