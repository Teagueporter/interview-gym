"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { getDrill } from "@/data/drills";
import { generateSession } from "@/lib/session";
import { useGymState } from "@/lib/useGymState";
import { skillMastery } from "@/lib/mastery";

export default function WarmupPage() {
  return (
    <Suspense fallback={<main className="px-5 py-8 text-zinc-400">Loading warmup...</main>}>
      <WarmupContent />
    </Suspense>
  );
}

function WarmupContent() {
  const done = useSearchParams().get("complete");
  const { state, setState } = useGymState();
  const session = (state.activeSession?.map(getDrill).filter(Boolean) ?? generateSession(state)) as ReturnType<typeof generateSession>;
  const weakest = skillMastery(state).slice(0, 3);

  if (done) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-10">
        <CheckCircle2 className="mb-4 text-emerald-300" size={36} />
        <h1 className="text-3xl font-semibold">Warmup complete</h1>
        <p className="mt-2 text-zinc-400">{state.attempts.slice(0, session.length).filter((item) => item.passed).length} / {session.length} passed</p>
        <div className="mt-6 space-y-2">
          {weakest.map((item) => <div key={item.skill} className="flex justify-between rounded-md border border-zinc-800 p-3"><span>{item.label}</span><span className="font-mono">{item.score}%</span></div>)}
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/history" className="rounded-md border border-zinc-700 px-4 py-2">Review Mistakes</Link>
          <Link href="/" className="rounded-md bg-white px-4 py-2 font-semibold text-zinc-950">Start LeetCode Session</Link>
        </div>
      </main>
    );
  }

  function start() {
    setState({ ...state, activeSession: session.map((drill) => drill.id) });
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="text-3xl font-semibold">Daily Warmup</h1>
      <p className="mt-2 text-zinc-400">{session.length} drills · balanced review, weak areas, and new practice</p>
      <div className="mt-6 space-y-3">
        {session.map((drill, index) => (
          <div key={drill.id} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 p-4">
            <div><p className="text-sm text-zinc-500">Drill {index + 1}</p><p className="font-medium">{drill.title}</p></div>
            <span className="text-sm uppercase text-emerald-300">{drill.skill.replaceAll("-", " ")}</span>
          </div>
        ))}
      </div>
      <Link onClick={start} href={`/drill/${session[0]?.id}?session=${session.map((drill) => drill.id).join(",")}`} className="mt-6 inline-flex rounded-md bg-emerald-400 px-5 py-3 font-semibold text-zinc-950">Start Warmup</Link>
    </main>
  );
}
