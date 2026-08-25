import type { Skill } from "@/types/drill";

export const skillLabels: Record<Skill, string> = {
  python: "Python Fundamentals",
  hashing: "Arrays & Hashing",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  stack: "Stack",
  "binary-search": "Binary Search",
  "linked-list": "Linked Lists",
  tree: "Trees",
  dfs: "DFS",
  bfs: "BFS",
  heap: "Heap",
  intervals: "Intervals",
  graph: "Graphs",
  backtracking: "Backtracking",
  "topological-sort": "Topological Sort",
  "prefix-sum": "Prefix Sum",
  "monotonic-stack": "Monotonic Stack",
  greedy: "Greedy",
  trie: "Trie",
  "union-find": "Union Find",
  dp: "1D Dynamic Programming",
};

export const coreSkills: Skill[] = [
  "python",
  "hashing",
  "two-pointers",
  "sliding-window",
  "stack",
  "binary-search",
  "linked-list",
  "tree",
  "dfs",
  "bfs",
  "heap",
  "intervals",
  "graph",
];

export interface SkillGuide {
  skill: Skill;
  useWhen: string;
  lookFor: string[];
  whyItFits: string;
}

export interface DrillPatternNote {
  whatItDoes: string;
  useWhen: string;
  lookFor: string;
}

export const drillPatternNotes: Record<string, DrillPatternNote> = {
  "hash-index-map": {
    whatItDoes: "Stores each value alongside its position, such as {4: 0, 7: 1}, so you can answer value-to-index lookups in constant time.",
    useWhen: "A later part of the problem needs to find a value's position, especially while scanning the list once.",
    lookFor: "pair sums, target minus current value, return the indexes, complement, find the matching value",
  },
};

export const skillGuides: SkillGuide[] = [
  {
    skill: "hashing",
    useWhen: "You need fast lookup, counting, grouping, or duplicate detection.",
    lookFor: ["frequency", "duplicate", "seen before", "pair sums", "anagram", "group by"],
    whyItFits: "Hash maps and sets trade memory for constant-time membership and counting.",
  },
  {
    skill: "two-pointers",
    useWhen: "The input is sorted, or you can scan from both ends or compact in place.",
    lookFor: ["sorted array", "in-place", "palindrome", "remove duplicates", "pair", "left and right"],
    whyItFits: "Moving pointers lets you discard impossible work without nested loops.",
  },
  {
    skill: "sliding-window",
    useWhen: "You are evaluating contiguous subarrays or substrings.",
    lookFor: ["subarray", "substring", "contiguous", "at most", "at least", "longest", "minimum length"],
    whyItFits: "A window reuses work as it expands and shrinks instead of recomputing each range.",
  },
  {
    skill: "stack",
    useWhen: "The most recent unresolved item matters.",
    lookFor: ["valid parentheses", "nested", "undo", "previous smaller", "remove adjacent", "evaluate expression"],
    whyItFits: "Stacks preserve last-in, first-out order, which matches nesting and unresolved-state problems.",
  },
  {
    skill: "binary-search",
    useWhen: "The data or answer space is ordered and you can decide which half to discard.",
    lookFor: ["sorted", "minimum possible", "maximum possible", "first true", "last false", "O(log n)"],
    whyItFits: "Binary search needs a monotonic condition: once something is valid, one side stays valid.",
  },
  {
    skill: "linked-list",
    useWhen: "You must manipulate node pointers without array indexing.",
    lookFor: ["ListNode", "reverse list", "cycle", "merge lists", "middle node", "fast and slow"],
    whyItFits: "Linked list problems are about preserving next pointers while changing traversal state.",
  },
  {
    skill: "tree",
    useWhen: "The problem is naturally recursive over left and right children.",
    lookFor: ["root", "leaf", "height", "depth", "ancestor", "subtree", "balanced"],
    whyItFits: "Most tree answers combine results from children into an answer for the current node.",
  },
  {
    skill: "dfs",
    useWhen: "You need to explore as far as possible, mark visited state, or evaluate connected structure.",
    lookFor: ["connected component", "path exists", "island", "recursive", "back edge", "traverse all"],
    whyItFits: "DFS is good when the shape is recursive or when each branch can be fully explored before moving on.",
  },
  {
    skill: "bfs",
    useWhen: "You need shortest paths in an unweighted graph or level-by-level traversal.",
    lookFor: ["shortest path", "minimum moves", "nearest", "level order", "fewest steps", "unweighted"],
    whyItFits: "BFS explores by distance, so the first time you reach a node is the shortest route.",
  },
  {
    skill: "heap",
    useWhen: "You repeatedly need the smallest, largest, or top k items.",
    lookFor: ["top k", "kth largest", "median", "merge k", "closest", "priority", "schedule"],
    whyItFits: "A heap keeps the next best candidate available without fully sorting every time.",
  },
  {
    skill: "intervals",
    useWhen: "The input is ranges with starts and ends.",
    lookFor: ["merge intervals", "overlap", "meeting rooms", "insert interval", "start time", "end time"],
    whyItFits: "Sorting by start or end turns range conflicts into local comparisons.",
  },
  {
    skill: "graph",
    useWhen: "Items are connected by relationships or dependencies.",
    lookFor: ["edges", "nodes", "neighbors", "routes", "connections", "adjacency list"],
    whyItFits: "A graph model makes relationships explicit so traversal or ordering can solve the problem.",
  },
  {
    skill: "topological-sort",
    useWhen: "You need an order that respects prerequisites or dependencies.",
    lookFor: ["prerequisite", "dependency", "course schedule", "build order", "before", "cycle"],
    whyItFits: "Topological sort repeatedly processes nodes whose dependencies are already satisfied.",
  },
  {
    skill: "backtracking",
    useWhen: "You must generate choices, combinations, permutations, or search all valid configurations.",
    lookFor: ["all combinations", "all permutations", "subsets", "valid arrangements", "choose", "constraint"],
    whyItFits: "Backtracking explores a choice, recurses, then undoes the choice to try the next option.",
  },
  {
    skill: "prefix-sum",
    useWhen: "You need many range sums or subarray-sum checks.",
    lookFor: ["range sum", "subarray sum", "sum between", "many queries", "target sum"],
    whyItFits: "Prefix sums convert repeated range work into subtraction between stored totals.",
  },
  {
    skill: "monotonic-stack",
    useWhen: "You need the next greater, next smaller, or a nearest boundary.",
    lookFor: ["next greater", "next smaller", "daily temperatures", "largest rectangle", "nearest"],
    whyItFits: "A monotonic stack keeps only candidates that can still answer a future question.",
  },
  {
    skill: "union-find",
    useWhen: "You need to merge groups and ask whether items are connected.",
    lookFor: ["connected components", "union", "find", "same group", "redundant connection", "network"],
    whyItFits: "Union Find maintains component identity efficiently as edges are added.",
  },
  {
    skill: "dp",
    useWhen: "The answer depends on overlapping subproblems or best choices from previous states.",
    lookFor: ["number of ways", "maximum profit", "minimum cost", "can reach", "previous choices"],
    whyItFits: "Dynamic programming stores answers to smaller states so each state is solved once.",
  },
];
