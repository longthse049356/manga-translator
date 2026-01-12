import { StateCreator } from "zustand";
import { UISlice, EditorStore } from "../types";

export const createUISlice: StateCreator<
  EditorStore,
  [["zustand/immer", never]],
  [],
  UISlice
> = (set) => ({
  activeTool: "select",
  zoom: 100,
  viewMode: "single",
  opacity: 100,

  setActiveTool: (tool) =>
    set((state) => {
      state.activeTool = tool;
      console.log(`[UI] Tool changed to:`, tool);
    }),

  setZoom: (zoom) =>
    set((state) => {
      state.zoom = Math.max(10, Math.min(300, zoom));
    }),

  setViewMode: (mode) =>
    set((state) => {
      state.viewMode = mode;
      console.log(`[UI] View mode changed to:`, mode);
    }),

  setOpacity: (opacity) =>
    set((state) => {
      state.opacity = Math.max(0, Math.min(100, opacity));
    }),
});
