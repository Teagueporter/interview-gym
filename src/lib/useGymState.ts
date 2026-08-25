"use client";

import { useEffect, useState } from "react";
import type { StoredState } from "@/types/progress";
import { emptyState, loadState, saveState } from "./storage";

export function useGymState() {
  const [state, setState] = useState<StoredState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  const updateState = (next: StoredState | ((state: StoredState) => StoredState)) => {
    setState((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      saveState(resolved);
      return resolved;
    });
  };

  return { state, setState: updateState, ready };
}

