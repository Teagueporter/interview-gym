"use client";

import Link from "next/link";
import { drills } from "@/data/drills";
import { skillLabels } from "@/data/skills";
import { drillMastery, skillMastery } from "@/lib/mastery";
import { generateSkillSession } from "@/lib/session";
import { useGymState } from "@/lib/useGymState";

export default function SkillsPage() {
  const { state, setState } = useGymState();
  const skills = skillMastery(state);
  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <h1 className="text-3xl font-semibold">Interview Readiness</h1>
      <div className="mt-6 grid gap-3">
        {skills.map((item) => {
          const session = generateSkillSession(item.skill);
          return (
            <section key={item.skill} className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex justify-between text-sm"><span>{item.label}</span><span className="font-mono">{item.score}</span></div>
                  <div className="h-2 overflow-hidden rounded bg-zinc-800"><div className="h-full bg-emerald-400" style={{ width: `${item.score}%` }} /></div>
                </div>
                {session[0] && (
                  <Link onClick={() => setState({ ...state, activeSession: session.map((drill) => drill.id) })} href={`/drill/${session[0].id}?session=${session.map((drill) => drill.id).join(",")}`} className="rounded-md border border-zinc-700 px-3 py-2 text-sm">
                    Practice
                  </Link>
                )}
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {drills.filter((drill) => drill.skill === item.skill).slice(0, 3).map((drill) => (
                  <Link key={drill.id} href={`/drill/${drill.id}`} className="rounded-md bg-zinc-900 p-3 text-sm hover:bg-zinc-800">
                    <span className="block truncate">{drill.title}</span>
                    <span className="font-mono text-zinc-500">{drillMastery(state.progress[drill.id], drill.targetTimeSeconds)}%</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

