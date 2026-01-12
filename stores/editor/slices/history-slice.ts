import { StateCreator } from "zustand";
import { HistorySlice, EditorStore, HistoryData } from "../types";

export const createHistorySlice: StateCreator<
  EditorStore,
  [["zustand/immer", never]],
  [],
  HistorySlice
> = (set, get) => ({
  history: {
    past: [],
    future: [],
  },

  undo: () =>
    set((state) => {
      if (state.history.past.length > 0) {
        const newPast = [...state.history.past];
        const previousState = newPast.pop();

        if (previousState) {
          const currentState: HistoryData = {
            layers: state.layers,
            textBoxes: state.textBoxes,
          };
          state.history.future.unshift(currentState);

          state.layers = previousState.layers;
          state.textBoxes = previousState.textBoxes;
        }
      }
      console.log(`[History] Undo executed`);
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length > 0) {
        const newFuture = [...state.history.future];
        const nextState = newFuture.shift();

        if (nextState) {
          const currentState: HistoryData = {
            layers: state.layers,
            textBoxes: state.textBoxes,
          };
          state.history.past.push(currentState);

          state.layers = nextState.layers;
          state.textBoxes = nextState.textBoxes;
        }
      }
      console.log(`[History] Redo executed`);
    }),

  recordHistory: () =>
    set((state) => {
      const snapshot: HistoryData = {
        layers: JSON.parse(JSON.stringify(state.layers)),
        textBoxes: JSON.parse(JSON.stringify(state.textBoxes)),
      };
      state.history.past.push(snapshot);

      // Keep only last 50 history states
      if (state.history.past.length > 50) {
        state.history.past.shift();
      }

      state.history.future = [];
    }),
});
