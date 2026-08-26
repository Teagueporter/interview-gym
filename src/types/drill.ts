export type Skill =
  | "python"
  | "hashing"
  | "two-pointers"
  | "sliding-window"
  | "stack"
  | "binary-search"
  | "linked-list"
  | "tree"
  | "dfs"
  | "bfs"
  | "heap"
  | "intervals"
  | "graph"
  | "backtracking"
  | "topological-sort"
  | "prefix-sum"
  | "monotonic-stack"
  | "greedy"
  | "trie"
  | "union-find"
  | "dp";

export type Difficulty = "fundamental" | "intermediate" | "advanced";

export interface DrillWalkthrough {
  input: string;
  steps: string[];
  output: string;
}

export interface Drill {
  id: string;
  title: string;
  skill: Skill;
  difficulty: Difficulty;
  prompt: string;
  targetTimeSeconds: number;
  starterCode: string;
  testCode: string;
  referenceSolution: string;
  explanation: string;
  hints: string[];
  expectedTimeComplexity?: string;
  expectedSpaceComplexity?: string;
  tags: string[];
  prerequisites?: string[];
  walkthrough?: DrillWalkthrough;
}
