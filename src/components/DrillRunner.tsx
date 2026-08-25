"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Lightbulb, Play, RotateCcw, X } from "lucide-react";
import type { Drill } from "@/types/drill";
import type { Attempt, Rating, TestResult } from "@/types/progress";
import { applyAttempt } from "@/lib/storage";
import { useGymState } from "@/lib/useGymState";
import { runPython } from "@/lib/runner";
import { formatDuration } from "@/lib/time";
import { drillPatternNotes, skillGuides } from "@/data/skills";
import { CodeEditor } from "./CodeEditor";

export function DrillRunner({ drill, sessionIds = [] }: { drill: Drill; sessionIds?: string[] }) {
  const { state, setState } = useGymState();
  const [code, setCode] = useState(drill.starterCode);
  const [startedAt] = useState(() => new Date());
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [running, setRunning] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.getTime()) / 1000)), 500);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void execute();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "]") {
        event.preventDefault();
        setHintsUsed((value) => Math.min(drill.hints.length, value + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const currentIndex = sessionIds.indexOf(drill.id);
  const nextId = currentIndex >= 0 ? sessionIds[currentIndex + 1] : undefined;
  const skillGuide = skillGuides.find((guide) => guide.skill === drill.skill);
  const patternNote = drillPatternNotes[drill.id];

  async function execute() {
    if (running || completed) return;
    setRunning(true);
    const next = await runPython(code, drill.testCode);
    setResult(next);
    setRunning(false);
    if (next.passed === next.total && next.total > 0) setCompleted(true);
  }

  function record(rating: Rating, passed = true) {
    const completedAt = new Date();
    const attempt: Attempt = {
      drillId: drill.id,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationSeconds: seconds,
      passed,
      testsPassed: result?.passed ?? 0,
      testsTotal: result?.total ?? 0,
      rating,
      hintsUsed,
      timedOut: Boolean(result?.timedOut),
      code,
    };
    setState((current) => applyAttempt(current, attempt));
    setCompleted(true);
  }

  const status = useMemo(() => {
    if (!result) return null;
    if (result.timedOut) return "Execution timed out. Possible infinite loop.";
    if (result.passed === result.total) return `${result.passed} / ${result.total} tests passed`;
    return `${result.failed} failed, ${result.passed} passed`;
  }, [result]);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded-md border border-zinc-800 bg-zinc-950 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{drill.skill.replaceAll("-", " ")}</p>
            <h1 className="mt-1 text-2xl font-semibold">{drill.title}</h1>
          </div>
          <div className="rounded-md border border-zinc-800 px-3 py-2 font-mono text-sm">
            {formatDuration(seconds)} / {formatDuration(drill.targetTimeSeconds)}
          </div>
        </div>
        <p className="whitespace-pre-line text-sm leading-6 text-zinc-300">{drill.prompt}</p>
        {(patternNote || skillGuide) && (
          <div className="mt-5 rounded-md border border-emerald-900/70 bg-emerald-950/20 p-4">
            <h2 className="font-semibold text-emerald-100">What this pattern is for</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {patternNote?.whatItDoes ?? skillGuide?.whyItFits}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              <span className="font-medium text-zinc-100">Use it when:</span> {patternNote?.useWhen ?? skillGuide?.useWhen}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              <span className="font-medium text-zinc-100">Look for:</span> {patternNote?.lookFor ?? skillGuide?.lookFor.join(", ")}
            </p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={execute} disabled={running || completed} className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50">
            <Play size={16} /> {running ? "Running..." : "Run Tests"}
          </button>
          <button onClick={() => setHintsUsed((value) => Math.min(drill.hints.length, value + 1))} className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2 text-sm">
            <Lightbulb size={16} /> Hint
          </button>
          <button onClick={() => record("failed", false)} className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2 text-sm">
            <X size={16} /> Skip
          </button>
        </div>
        {hintsUsed > 0 && (
          <div className="mt-5 space-y-2">
            {drill.hints.slice(0, hintsUsed).map((hint, index) => (
              <p key={hint} className="rounded-md border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300">Hint {index + 1}: {hint}</p>
            ))}
          </div>
        )}
        {status && (
          <div className="mt-5 rounded-md border border-zinc-800 bg-zinc-900 p-4">
            <p className="font-medium">{status}</p>
            {result?.failures.map((failure) => (
              <pre key={failure.name} className="mt-3 whitespace-pre-wrap rounded-md bg-zinc-950 p-3 text-xs text-zinc-300">{failure.name}: {failure.message}</pre>
            ))}
          </div>
        )}
        {completed && (
          <div className="mt-5 space-y-3">
            {result?.passed === result?.total && (
              <div>
                <p className="mb-2 text-sm text-zinc-400">How did that feel?</p>
                <div className="grid gap-2">
                  {(["clean", "hesitated", "hard"] as Rating[]).map((rating) => (
                    <button key={rating} onClick={() => record(rating)} className="rounded-md border border-zinc-700 px-3 py-2 text-left text-sm capitalize hover:bg-zinc-900">{rating}</button>
                  ))}
                </div>
              </div>
            )}
            <Review drill={drill} code={code} />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setCode(drill.starterCode); setResult(null); setCompleted(false); }} className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2 text-sm"><RotateCcw size={16} /> Retry</button>
              <Link href={nextId ? `/drill/${nextId}?session=${sessionIds.join(",")}` : "/warmup?complete=1"} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-950">Next Drill <ChevronRight size={16} /></Link>
            </div>
          </div>
        )}
      </section>
      <section>
        <CodeEditor value={code} onChange={setCode} />
      </section>
    </main>
  );
}

function Review({ drill, code }: { drill: Drill; code: string }) {
  return (
    <div className="space-y-3 rounded-md border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-semibold">Review</h2>
      <pre className="max-h-48 overflow-auto rounded-md bg-zinc-950 p-3 text-xs text-zinc-300">{code}</pre>
      <pre className="max-h-64 overflow-auto rounded-md bg-zinc-950 p-3 text-xs text-emerald-100">{drill.referenceSolution}</pre>
      <p className="text-sm text-zinc-300">{drill.explanation}</p>
      <div className="flex gap-2 text-xs text-zinc-400">
        <span>Time: {drill.expectedTimeComplexity}</span>
        <span>Space: {drill.expectedSpaceComplexity}</span>
      </div>
    </div>
  );
}

export function ResultPill({ passed }: { passed: boolean }) {
  return passed ? <Check className="text-emerald-300" size={16} /> : <X className="text-red-300" size={16} />;
}
