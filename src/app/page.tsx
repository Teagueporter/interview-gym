"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Dumbbell, Target, TrendingUp } from "lucide-react";
import { skillLabels } from "@/data/skills";
import { drills } from "@/data/drills";
import { skillMastery } from "@/lib/mastery";
import { generateSession } from "@/lib/session";
import { useGymState } from "@/lib/useGymState";
import { formatDuration, todayGreeting } from "@/lib/time";

export default function Dashboard() {
  const { state, setState } = useGymState();
  const session = generateSession(state);
  const weakest = skillMastery(state).slice(0, 3);
  const recent = state.attempts.slice(0, 31);
  const passRate = recent.length ? Math.round((recent.filter((item) => item.passed).length / recent.length) * 100) : 0;
  const avgTime = recent.length ? Math.round(recent.reduce((sum, item) => sum + item.durationSeconds, 0) / recent.length) : 0;

  function startWarmup() {
    setState({ ...state, activeSession: session.map((drill) => drill.id) });
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <p className="text-zinc-400">{todayGreeting()}</p>
      <div className="mt-3 flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-semibold tracking-normal">Today&apos;s Warmup</h1>
          <p className="mt-2 text-zinc-400">~10 minutes · {state.settings.drillCount} drills</p>
        </div>
        <Link onClick={startWarmup} href="/warmup" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 font-semibold text-zinc-950">
          Start Warmup <ArrowRight size={18} />
        </Link>
      </div>
      <section className="mt-6 grid gap-4 lg:grid-cols-4">
        <Panel title="Weakest Skills" icon={<Target size={18} />}>
          {weakest.map((item) => (
            <Metric key={item.skill} label={item.label} value={`${item.score}%`} />
          ))}
        </Panel>
        <Panel title="Last 31 Drills" icon={<TrendingUp size={18} />}>
          <Metric label="Sessions" value={String(new Set(recent.map((item) => item.startedAt.slice(0, 10))).size)} />
          <Metric label="Drills" value={String(recent.length)} />
          <Metric label="Pass rate" value={`${passRate}%`} />
          <Metric label="Avg time" value={avgTime ? formatDuration(avgTime) : "--"} />
        </Panel>
        <Panel title="Due For Review" icon={<CalendarClock size={18} />}>
          {session.slice(0, 4).map((drill) => (
            <Metric key={drill.id} label={drill.title} value="Today" />
          ))}
        </Panel>
        <Panel title="Up Next" icon={<Dumbbell size={18} />}>
          {session.slice(0, 4).map((drill) => (
            <Metric key={drill.id} label={drill.title} value={skillLabels[drill.skill]} />
          ))}
        </Panel>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Drill Bank</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {drills.slice(0, 10).map((drill) => (
            <Link key={drill.id} href={`/drill/${drill.id}`} className="rounded-md border border-zinc-800 bg-zinc-950 p-4 hover:border-zinc-600">
              <p className="font-medium">{drill.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{skillLabels[drill.skill]}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-300">{icon}{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 text-sm"><span className="truncate text-zinc-400">{label}</span><span className="font-mono text-zinc-100">{value}</span></div>;
}

