"use client";

import { drills } from "@/data/drills";
import type { Drill } from "@/types/drill";
import type { Attempt, DrillProgress, Rating, Settings, StoredState } from "@/types/progress";

const key = "interview-gym-state";

export const defaultSettings: Settings = {
  drillCount: 5,
  disableAutocomplete: true,
  showWeakestFirst: true,
};

function initialProgress(drill: Drill): DrillProgress {
  return {
    drillId: drill.id,
    attempts: 0,
    passes: 0,
    box: 1,
    streak: 0,
    lastAttemptAt: null,
    nextDueAt: null,
    averageDurationSeconds: 0,
    bestDurationSeconds: null,
    lastRating: null,
  };
}

export function emptyState(): StoredState {
  return {
    schemaVersion: 1,
    progress: Object.fromEntries(drills.map((drill) => [drill.id, initialProgress(drill)])),
    attempts: [],
    settings: defaultSettings,
  };
}

export function loadState(): StoredState {
  if (typeof window === "undefined") return emptyState();
  const raw = window.localStorage.getItem(key);
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(raw) as StoredState;
    const seeded = emptyState();
    return {
      ...seeded,
      ...parsed,
      settings: { ...defaultSettings, ...parsed.settings },
      progress: { ...seeded.progress, ...parsed.progress },
      attempts: parsed.attempts ?? [],
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: StoredState) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

const intervals: Record<number, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
};

export function applyAttempt(state: StoredState, attempt: Attempt): StoredState {
  const drill = drills.find((item) => item.id === attempt.drillId);
  if (!drill) return state;
  const current = state.progress[attempt.drillId] ?? initialProgress(drill);
  const nextBox = nextLeitnerBox(current.box, attempt.rating);
  const due = new Date(attempt.completedAt);
  due.setDate(due.getDate() + intervals[nextBox]);

  const nextProgress: DrillProgress = {
    ...current,
    attempts: current.attempts + 1,
    passes: current.passes + (attempt.passed ? 1 : 0),
    box: nextBox,
    streak: attempt.passed ? current.streak + 1 : 0,
    lastAttemptAt: attempt.completedAt,
    nextDueAt: due.toISOString(),
    averageDurationSeconds:
      current.attempts === 0
        ? attempt.durationSeconds
        : Math.round((current.averageDurationSeconds * current.attempts + attempt.durationSeconds) / (current.attempts + 1)),
    bestDurationSeconds: attempt.passed
      ? Math.min(current.bestDurationSeconds ?? attempt.durationSeconds, attempt.durationSeconds)
      : current.bestDurationSeconds,
    lastRating: attempt.rating,
  };

  return {
    ...state,
    attempts: [attempt, ...state.attempts].slice(0, 500),
    progress: { ...state.progress, [attempt.drillId]: nextProgress },
  };
}

function nextLeitnerBox(box: DrillProgress["box"], rating: Rating): DrillProgress["box"] {
  if (rating === "clean") return Math.min(5, box + 1) as DrillProgress["box"];
  if (rating === "hard") return Math.max(1, box - 1) as DrillProgress["box"];
  if (rating === "failed") return 1;
  return box;
}
