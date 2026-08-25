import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "node_modules", "pyodide");
const target = join(root, "public", "pyodide");
const workerSource = join(root, "src", "workers", "pyodide.worker.mjs");

const files = [
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "pyodide.mjs",
  "pyodide-lock.json",
  "python_stdlib.zip",
];

mkdirSync(target, { recursive: true });

for (const file of files) {
  copyFileSync(join(source, file), join(target, file));
}

copyFileSync(workerSource, join(target, "pyodide.worker.mjs"));

console.log(`Synced ${files.length + 1} Pyodide runtime assets to public/pyodide`);
