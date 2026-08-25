"use client";

import { useState } from "react";
import { runPython } from "@/lib/runner";
import type { TestResult } from "@/types/progress";

const cases = [
  {
    name: "Known passing function",
    code: "def frequency(items):\n    counts = {}\n    for item in items:\n        counts[item] = counts.get(item, 0) + 1\n    return counts",
    testCode: "TESTS = [(\"counts\", lambda: frequency(['a','b','a']) == {'a': 2, 'b': 1})]",
  },
  {
    name: "Known runtime error",
    code: "def frequency(items):\n    counts = {}\n    for item in items:\n        counts[item] += 1\n    return counts",
    testCode: "TESTS = [(\"counts\", lambda: frequency(['a']) == {'a': 1})]",
  },
  {
    name: "Known infinite loop",
    code: "def frequency(items):\n    while True:\n        pass\n    return {}",
    testCode: "TESTS = [(\"counts\", lambda: frequency(['a']) == {'a': 1})]",
  },
];

export default function ExecutionDiagnosticsPage() {
  const [results, setResults] = useState<Record<string, TestResult | "running">>({});

  async function runCase(testCase: (typeof cases)[number]) {
    setResults((current) => ({ ...current, [testCase.name]: "running" }));
    const result = await runPython(testCase.code, testCase.testCode);
    setResults((current) => ({ ...current, [testCase.name]: result }));
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="text-3xl font-semibold">Execution Diagnostics</h1>
      <p className="mt-2 text-zinc-400">
        These checks isolate the Python runner from the drill UI.
      </p>
      <div className="mt-6 space-y-3">
        {cases.map((testCase) => {
          const result = results[testCase.name];
          return (
            <section key={testCase.name} className="rounded-md border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">{testCase.name}</h2>
                <button onClick={() => runCase(testCase)} className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-950">
                  Run
                </button>
              </div>
              {result && (
                <pre className="mt-3 whitespace-pre-wrap rounded-md bg-zinc-900 p-3 text-xs text-zinc-200">
                  {result === "running" ? "Running..." : JSON.stringify(result, null, 2)}
                </pre>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}

