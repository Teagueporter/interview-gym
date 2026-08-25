import { drills } from "@/data/drills";
import { skillLabels } from "@/data/skills";
import type { Skill } from "@/types/drill";
import type { DrillProgress, StoredState } from "@/types/progress";

const confidenceValue = { clean: 100, hesitated: 70, hard: 40, failed: 0 };

export function drillMastery(progress: DrillProgress, targetTimeSeconds: number) {
  if (progress.attempts === 0) return 35;
  const boxScore = ((progress.box - 1) / 4) * 100;
  const successScore = (progress.passes / progress.attempts) * 100;
  const speedScore = progress.bestDurationSeconds
    ? Math.max(0, Math.min(100, (targetTimeSeconds / progress.bestDurationSeconds) * 80))
    : 0;
  const confidenceScore = progress.lastRating ? confidenceValue[progress.lastRating] : 0;
  return Math.round(boxScore * 0.5 + successScore * 0.25 + speedScore * 0.15 + confidenceScore * 0.1);
}

export function skillMastery(state: StoredState) {
  const grouped = new Map<Skill, number[]>();
  for (const drill of drills) {
    const progress = state.progress[drill.id];
    const score = drillMastery(progress, drill.targetTimeSeconds);
    grouped.set(drill.skill, [...(grouped.get(drill.skill) ?? []), score]);
  }
  return Object.entries(skillLabels)
    .map(([skill, label]) => {
      const scores = grouped.get(skill as Skill) ?? [35];
      return { skill: skill as Skill, label, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) };
    })
    .sort((a, b) => a.score - b.score);
}

