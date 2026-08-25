import { loadPyodide } from "pyodide";

let pyodidePromise: ReturnType<typeof loadPyodide> | null = null;

self.onmessage = async (event: MessageEvent<{ code: string; testCode: string }>) => {
  const started = performance.now();
  pyodidePromise ??= loadPyodide();
  const pyodide = await pyodidePromise;
  const harness = `
import traceback

result = {"passed": 0, "failed": 0, "total": 0, "failures": []}

try:
${indent(event.data.code)}

${indent(event.data.testCode)}

    result["total"] = len(TESTS)
    for name, fn in TESTS:
        try:
            if fn():
                result["passed"] += 1
            else:
                result["failed"] += 1
                result["failures"].append({"name": name, "message": "Assertion returned False"})
        except Exception:
            result["failed"] += 1
            result["failures"].append({"name": name, "message": traceback.format_exc(limit=3)})
except Exception:
    result["failed"] = 1
    result["total"] = 1
    result["failures"].append({"name": "Runtime error", "message": traceback.format_exc(limit=5)})
result
`;
  try {
    const proxy = await pyodide.runPythonAsync(harness);
    const result = proxy.toJs({ dict_converter: Object.fromEntries }) as {
      passed: number;
      failed: number;
      total: number;
      failures: { name: string; message: string }[];
    };
    self.postMessage({ ...result, durationMs: Math.round(performance.now() - started) });
  } catch (error) {
    self.postMessage({
      passed: 0,
      failed: 1,
      total: 1,
      durationMs: Math.round(performance.now() - started),
      failures: [{ name: "Runtime error", message: error instanceof Error ? error.message : String(error) }],
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

function indent(value: string) {
  return value
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");
}
