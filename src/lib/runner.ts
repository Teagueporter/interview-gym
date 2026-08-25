"use client";

import type { TestResult } from "@/types/progress";

type WorkerMessage =
  | { type: "ready" }
  | { type: "status"; status: string }
  | { type: "result"; result: TestResult };

export function runPython(code: string, testCode: string, timeoutMs = 3000): Promise<TestResult> {
  return new Promise((resolve) => {
    const worker = new Worker("/pyodide/pyodide.worker.mjs", { type: "module" });
    let executionTimer: number | null = null;
    const loadTimer = window.setTimeout(() => {
      worker.terminate();
      resolve({
        passed: 0,
        failed: 1,
        total: 1,
        durationMs: 30000,
        failures: [{ name: "Python runtime timed out", message: "Pyodide took too long to load." }],
        timedOut: true,
      });
    }, 30000);

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      if (event.data.type === "ready") {
        window.clearTimeout(loadTimer);
        executionTimer = window.setTimeout(() => {
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
        return;
      }

      if (event.data.type === "status") {
        console.info(`[python-worker] ${event.data.status}`);
        return;
      }

      if (executionTimer !== null) window.clearTimeout(executionTimer);
      window.clearTimeout(loadTimer);
      worker.terminate();
      resolve(event.data.result);
    };

    worker.onerror = (event) => {
      if (executionTimer !== null) window.clearTimeout(executionTimer);
      window.clearTimeout(loadTimer);
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
