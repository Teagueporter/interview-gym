import Link from "next/link";
import { drills } from "@/data/drills";
import { skillLabels } from "@/data/skills";

export default function ReferencePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="text-3xl font-semibold">Reference</h1>
      <p className="mt-2 text-zinc-400">Templates stay outside the active drill screen.</p>
      <section className="mt-6 grid gap-4 rounded-md border border-zinc-800 bg-zinc-950 p-5 md:grid-cols-3">
        <div>
          <h2 className="font-semibold">Use it after reps</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Finish, fail, or skip a drill first. Then compare your code against the template and look for the one idea you missed.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Memorize shapes</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            These are implementation patterns: queue setup, pointer movement, visited checks, heap maintenance, and backtracking undo steps.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Practice directly</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Use Practice when a template feels rusty. It opens the matching drill with a blank starter instead of letting the reference become passive reading.
          </p>
        </div>
      </section>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {drills.slice(0, 18).map((drill) => (
          <article key={drill.id} className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-emerald-300">{skillLabels[drill.skill]}</p>
                <h2 className="font-semibold">{drill.title}</h2>
              </div>
              <Link href={`/drill/${drill.id}`} className="rounded-md border border-zinc-700 px-3 py-2 text-sm">Practice</Link>
            </div>
            <pre className="max-h-72 overflow-auto rounded-md bg-zinc-900 p-3 text-xs text-zinc-200">{drill.referenceSolution}</pre>
          </article>
        ))}
      </div>
    </main>
  );
}
