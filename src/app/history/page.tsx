"use client";

import Link from "next/link";
import { getDrill } from "@/data/drills";
import { useGymState } from "@/lib/useGymState";
import { formatDuration } from "@/lib/time";

export default function HistoryPage() {
  const { state } = useGymState();
  const byDate = new Map<string, typeof state.attempts>();
  for (const attempt of state.attempts) {
    const day = attempt.completedAt.slice(0, 10);
    byDate.set(day, [...(byDate.get(day) ?? []), attempt]);
  }
  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="text-3xl font-semibold">History</h1>
      <div className="mt-6 space-y-6">
        {[...byDate.entries()].map(([day, attempts]) => (
          <section key={day}>
            <h2 className="mb-2 text-sm font-semibold uppercase text-zinc-500">{day}</h2>
            <div className="space-y-2">
              {attempts.map((attempt) => {
                const drill = getDrill(attempt.drillId);
                return (
                  <Link key={`${attempt.completedAt}-${attempt.drillId}`} href={`/drill/${attempt.drillId}`} className="grid grid-cols-[32px_1fr_auto_auto] gap-3 rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm">
                    <span className={attempt.passed ? "text-emerald-300" : "text-red-300"}>{attempt.passed ? "OK" : "NO"}</span>
                    <span>{drill?.title ?? attempt.drillId}</span>
                    <span className="font-mono text-zinc-400">{formatDuration(attempt.durationSeconds)}</span>
                    <span className="capitalize text-zinc-400">{attempt.rating}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
        {state.attempts.length === 0 && <p className="text-zinc-400">No attempts yet.</p>}
      </div>
    </main>
  );
}

