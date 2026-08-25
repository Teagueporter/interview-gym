import { drills } from "@/data/drills";
import type { Drill, Skill } from "@/types/drill";
import type { StoredState } from "@/types/progress";
import { skillMastery } from "./mastery";

export function generateSession(state: StoredState, count = state.settings.drillCount): Drill[] {
  const now = Date.now();
  const weakSkills = skillMastery(state).map((item) => item.skill);
  const selected: Drill[] = [];
  const skillCounts = new Map<Skill, number>();

  const add = (drill: Drill) => {
    if (selected.some((item) => item.id === drill.id)) return false;
    if ((skillCounts.get(drill.skill) ?? 0) >= 2) return false;
    selected.push(drill);
    skillCounts.set(drill.skill, (skillCounts.get(drill.skill) ?? 0) + 1);
    return true;
  };

  const due = [...drills]
    .filter((drill) => {
      const nextDueAt = state.progress[drill.id]?.nextDueAt;
      return !nextDueAt || Date.parse(nextDueAt) <= now;
    })
    .sort((a, b) => weakSkills.indexOf(a.skill) - weakSkills.indexOf(b.skill));

  for (const drill of due) {
    if (selected.length >= Math.ceil(count * 0.6)) break;
    add(drill);
  }

  for (const skill of weakSkills) {
    if (selected.length >= count - 1) break;
    const candidate = drills.find((drill) => drill.skill === skill && !selected.some((item) => item.id === drill.id));
    if (candidate) add(candidate);
  }

  const unseen = drills.filter((drill) => state.progress[drill.id]?.attempts === 0);
  for (const drill of [...unseen, ...drills]) {
    if (selected.length >= count) break;
    add(drill);
  }

  return selected.slice(0, count);
}

export function generateSkillSession(skill: Skill, count = 5) {
  return drills.filter((drill) => drill.skill === skill).slice(0, count);
}

