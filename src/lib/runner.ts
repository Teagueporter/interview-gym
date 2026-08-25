"use client";

import type { TestResult } from "@/types/progress";

export function runPython(code: string, testCode: string, timeoutMs = 3000): Promise<TestResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL("../workers/pyodide.worker.ts", import.meta.url), { type: "module" });
    const timer = window.setTimeout(() => {
      worker.terminate();
      resolve({
        passed: 0,
        failed: 1,
        total: 1,
        durationMs: timeoutMs,
        failures: [{ name: "Execution timed out", message: "Possible infinite loop." }],
        timedOut: true,
      });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<TestResult>) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };

    worker.onerror = (event) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve({
        passed: 0,
        failed: 1,
        total: 1,
        durationMs: 0,
        failures: [{ name: "Worker error", message: event.message }],
        error: event.message,
      });
    };

    worker.postMessage({ code, testCode });
  });
}

