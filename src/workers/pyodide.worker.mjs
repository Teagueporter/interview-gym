import { loadPyodide } from "./pyodide.mjs";

let pyodidePromise = null;

self.onmessage = async (event) => {
  const started = performance.now();
  try {
    const indexURL = new URL("/pyodide/", self.location.origin).href;
    self.postMessage({ type: "status", status: "worker started" });
    for (const asset of ["pyodide-lock.json", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip"]) {
      const response = await fetch(new URL(asset, indexURL), { cache: "no-store" });
      if (!response.ok) throw new Error(`${asset} returned HTTP ${response.status}`);
      self.postMessage({ type: "status", status: `${asset} loaded (${response.headers.get("content-length") ?? "unknown"} bytes)` });
    }
    self.postMessage({ type: "status", status: "starting Pyodide" });
    pyodidePromise ??= loadPyodide({ indexURL });
    const pyodide = await pyodidePromise;
    self.postMessage({ type: "ready" });
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

    const proxy = await pyodide.runPythonAsync(harness);
    const result = proxy.toJs({ dict_converter: Object.fromEntries });
    self.postMessage({ type: "result", result: { ...result, durationMs: Math.round(performance.now() - started) } });
  } catch (error) {
    self.postMessage({
      type: "result",
      result: {
        passed: 0,
        failed: 1,
        total: 1,
        durationMs: Math.round(performance.now() - started),
        failures: [{ name: "Python runtime error", message: error instanceof Error ? error.message : String(error) }],
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
};

function indent(value) {
  return value
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");
}
