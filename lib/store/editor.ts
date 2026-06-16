import { create } from "zustand";

export type EditorTool =
  | "story"
  | "characters"
  | "scenes"
  | "panels"
  | "dialogue"
  | "assets";

interface EditorState {
  tool: EditorTool;
  selectedPanelId: string | null;
  zoom: number;
  setTool: (tool: EditorTool) => void;
  selectPanel: (id: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

/**
 * Canvas/editor UI state. Lives in Zustand (not React state) so that — in
 * Phase 3 — the canvas, the AI assistant and the inspector can all read and
 * mutate the same selection without prop-drilling.
 */
export const useEditorStore = create<EditorState>((set) => ({
  tool: "panels",
  selectedPanelId: "p2",
  zoom: 100,
  setTool: (tool) => set({ tool }),
  selectPanel: (selectedPanelId) => set({ selectedPanelId }),
  zoomIn: () => set((s) => ({ zoom: Math.min(160, s.zoom + 10) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(50, s.zoom - 10) })),
}));
