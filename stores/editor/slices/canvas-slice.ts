import { StateCreator } from "zustand";
import { CanvasSlice, EditorStore } from "../types";

export const createCanvasSlice: StateCreator<
  EditorStore,
  [["zustand/immer", never]],
  [],
  CanvasSlice
> = (set) => ({
  uploadedImage: null,
  panX: 0,
  panY: 0,

  setUploadedImage: (image) =>
    set((state) => {
      state.uploadedImage = image;
      console.log(`[Canvas] Image uploaded`);
    }),

  setPan: (x, y) =>
    set((state) => {
      state.panX = x;
      state.panY = y;
    }),
});
