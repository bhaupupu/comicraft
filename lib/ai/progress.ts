/** Progress events streamed from the orchestrator to the editor. Client-safe (no server-only imports). */
export type ProgressEvent =
  | { type: "stage"; key: "story" | "characters" | "panels"; label: string; total?: number }
  | { type: "tick"; key: "characters" | "panels"; current: number; total: number; label?: string }
  | { type: "done"; made: number; remaining: number; placeholder: boolean; title: string }
  | { type: "error"; message: string };
