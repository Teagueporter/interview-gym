export type Rating = "clean" | "hesitated" | "hard" | "failed";

export interface Attempt {
  drillId: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  rating: Rating;
  hintsUsed: number;
  timedOut: boolean;
  code?: string;
}

export interface DrillProgress {
  drillId: string;
  attempts: number;
  passes: number;
  box: 1 | 2 | 3 | 4 | 5;
  streak: number;
  lastAttemptAt: string | null;
  nextDueAt: string | null;
  averageDurationSeconds: number;
  bestDurationSeconds: number | null;
  lastRating: Rating | null;
}

export interface Settings {
  drillCount: 3 | 5 | 10;
  disableAutocomplete: boolean;
  showWeakestFirst: boolean;
}

export interface StoredState {
  schemaVersion: 1;
  progress: Record<string, DrillProgress>;
  attempts: Attempt[];
  settings: Settings;
  activeSession?: string[];
}

export interface TestFailure {
  name: string;
  message: string;
}

export interface TestResult {
  passed: number;
  failed: number;
  total: number;
  durationMs: number;
  failures: TestFailure[];
  timedOut?: boolean;
  error?: string;
}

