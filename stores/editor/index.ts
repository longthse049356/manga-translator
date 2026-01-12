import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createUISlice } from "./slices/ui-slice";
import { createSelectionSlice } from "./slices/selection-slice";
import { createCanvasSlice } from "./slices/canvas-slice";
import { createDocumentSlice } from "./slices/document-slice";
import { createHistorySlice } from "./slices/history-slice";

import type { EditorStore } from "./types";

/**
 * Main Editor Store
 * Combines all slices (UI, Selection, Canvas, Document, History)
 * 
 * Features:
 * - Immer for immutable updates
 * - Redux DevTools for debugging
 * - Persist for localStorage (document only, not UI)
 */
export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      immer((...args) => ({
        ...createUISlice(...args),
        ...createSelectionSlice(...args),
        ...createCanvasSlice(...args),
        ...createDocumentSlice(...args),
        ...createHistorySlice(...args),
      })),
      {
        name: "editor-storage",
        // Only persist document data, not UI state
        partialize: (state) => ({
          layers: state.layers,
          textBoxes: state.textBoxes,
        }),
      }
    ),
    {
      name: "Editor Store",
      trace: true,
    }
  )
);

// Selectors for performance optimization
export const selectActiveTool = (state: EditorStore) => state.activeTool;
export const selectZoom = (state: EditorStore) => state.zoom;
export const selectViewMode = (state: EditorStore) => state.viewMode;
export const selectOpacity = (state: EditorStore) => state.opacity;

export const selectSelectedObjectIds = (state: EditorStore) =>
  state.selectedObjectIds;
export const selectSelectedLayerId = (state: EditorStore) =>
  state.selectedLayerId;

export const selectUploadedImage = (state: EditorStore) => state.uploadedImage;

export const selectLayers = (state: EditorStore) => state.layers;
export const selectTextBoxes = (state: EditorStore) => state.textBoxes;
export const selectVisibleLayers = (state: EditorStore) =>
  state.layers.filter((l) => l.visible);

export const selectCanUndo = (state: EditorStore) =>
  state.history.past.length > 0;
export const selectCanRedo = (state: EditorStore) =>
  state.history.future.length > 0;
