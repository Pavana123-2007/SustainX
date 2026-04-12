/**
 * Gamification utility module for SustainX.
 * Standalone — no imports from existing project files.
 *
 * Cycle: Sapling (0 XP) → Tree (200 XP) → plant 🌳 → reset to Sapling
 *
 * Integration example (after analyzeImageWithGemini resolves):
 *   updateUserProgress(result.ecoScore)
 */

const STORAGE_KEY = "sustainx_progress";
const FOREST_KEY  = "sustainx_forest";

/** XP needed to complete one cycle and plant a tree */
export const TREE_XP_GOAL = 200;

export interface UserProgress {
  xp: number;          // current XP within the cycle (0 – TREE_XP_GOAL)
  level: string;       // "Sapling" or "Tree" (visual stage within cycle)
  ecoPoints: number;   // cumulative eco points (never resets)
  streak: number;
  lastScanDate: string | null;
}

export interface LevelInfo {
  name: string;
  nextLevelXP: number;   // always TREE_XP_GOAL
  progressXP: number;    // XP earned in current cycle
  bandSize: number;      // always TREE_XP_GOAL
  pct: number;           // 0–100 fill percentage
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: "Sapling",
  ecoPoints: 0,
  streak: 0,
  lastScanDate: null,
};

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86400000
  );
}

/** Returns visual stage name based on progress within cycle */
function stageFromXP(xp: number): string {
  return xp >= TREE_XP_GOAL / 2 ? "Tree" : "Sapling";
}

export function getLevelInfo(xp: number): LevelInfo {
  const safeXP = Math.max(0, Math.min(xp, TREE_XP_GOAL));
  return {
    name: stageFromXP(safeXP),
    nextLevelXP: TREE_XP_GOAL,
    progressXP: safeXP,
    bandSize: TREE_XP_GOAL,
    pct: Math.round((safeXP / TREE_XP_GOAL) * 100),
  };
}

export function getUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as UserProgress;
    if (typeof parsed.xp !== "number") return { ...DEFAULT_PROGRESS };
    return parsed;
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function getForestTrees(): string[] {
  try {
    const raw = localStorage.getItem(FOREST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function plantTree() {
  try {
    const trees = getForestTrees();
    trees.push("🌳");
    localStorage.setItem(FOREST_KEY, JSON.stringify(trees));
  } catch {}
}

export function updateUserProgress(score: number): UserProgress & { treePlanted: boolean } {
  const safeScore = isFinite(score) ? score : 0;
  const clamped = Math.max(0, Math.min(100, safeScore));

  // Score < 40 → penalty, 40–69 → small gain, 70+ → full gain
  const xpGained = clamped < 40
    ? -Math.round((40 - clamped) * 1.5)
    : Math.round(clamped * 1.5);
  const ecoPointsGained = clamped < 40
    ? -Math.round((40 - clamped) / 10)
    : Math.round(clamped / 10);

  const current = getUserProgress();
  const today = todayUTC();

  // Streak
  let newStreak = current.streak;
  if (current.lastScanDate === null) {
    newStreak = 1;
  } else {
    const diff = daysBetween(current.lastScanDate, today);
    if (diff === 1) newStreak = current.streak + 1;
    else if (diff > 1) newStreak = 1;
  }

  const rawXP = current.xp + xpGained;
  let treePlanted = false;

  let newXP: number;
  if (rawXP >= TREE_XP_GOAL) {
    // Cycle complete — plant a tree and reset
    plantTree();
    treePlanted = true;
    newXP = 0;
  } else {
    newXP = Math.max(0, rawXP);
  }

  const newEcoPoints = Math.max(0, current.ecoPoints + ecoPointsGained);

  const updated: UserProgress = {
    xp: newXP,
    level: stageFromXP(newXP),
    ecoPoints: newEcoPoints,
    streak: newStreak,
    lastScanDate: today,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return { ...updated, treePlanted };
}
