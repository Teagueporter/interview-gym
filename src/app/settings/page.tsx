"use client";

import { Download, Upload } from "lucide-react";
import { useGymState } from "@/lib/useGymState";
import { emptyState } from "@/lib/storage";

export default function SettingsPage() {
  const { state, setState } = useGymState();
  function exportProgress() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interview-gym-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  function importProgress(file: File) {
    void file.text().then((text) => setState(JSON.parse(text)));
  }
  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <section className="mt-6 space-y-4 rounded-md border border-zinc-800 bg-zinc-950 p-5">
        <label className="flex items-center justify-between gap-4">
          <span>Warmup length</span>
          <select value={state.settings.drillCount} onChange={(event) => setState({ ...state, settings: { ...state.settings, drillCount: Number(event.target.value) as 3 | 5 | 10 } })} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
            <option value={3}>Quick · 3 drills</option>
            <option value={5}>Standard · 5 drills</option>
            <option value={10}>Full · 10 drills</option>
          </select>
        </label>
        <label className="flex items-center justify-between gap-4">
          <span>Disable autocomplete</span>
          <input type="checkbox" checked={state.settings.disableAutocomplete} onChange={(event) => setState({ ...state, settings: { ...state.settings, disableAutocomplete: event.target.checked } })} />
        </label>
        <div className="flex flex-wrap gap-3 pt-3">
          <button onClick={exportProgress} className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2"><Download size={16} /> Export Progress</button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 px-4 py-2"><Upload size={16} /> Import Progress<input type="file" accept="application/json" className="hidden" onChange={(event) => event.target.files?.[0] && importProgress(event.target.files[0])} /></label>
          <button onClick={() => setState(emptyState())} className="rounded-md border border-red-900 px-4 py-2 text-red-200">Reset</button>
        </div>
      </section>
    </main>
  );
}

