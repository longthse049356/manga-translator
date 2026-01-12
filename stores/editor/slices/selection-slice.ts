import { StateCreator } from "zustand";
import { SelectionSlice, EditorStore } from "../types";

export const createSelectionSlice: StateCreator<
  EditorStore,
  [["zustand/immer", never]],
  [],
  SelectionSlice
> = (set) => ({
  selectedObjectIds: [],
  selectedLayerId: null,

  selectObject: (id, multi = false) =>
    set((state) => {
      if (multi) {
        if (!state.selectedObjectIds.includes(id)) {
          state.selectedObjectIds.push(id);
        }
      } else {
        state.selectedObjectIds = [id];
      }
      console.log(`[Selection] Object selected:`, id, "multi:", multi);
    }),

  deselectAll: () =>
    set((state) => {
      state.selectedObjectIds = [];
      state.selectedLayerId = null;
    }),

  selectLayer: (id) =>
    set((state) => {
      state.selectedLayerId = id;
      console.log(`[Selection] Layer selected:`, id);
    }),
});
