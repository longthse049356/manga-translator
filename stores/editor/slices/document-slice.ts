import { StateCreator } from "zustand";
import { DocumentSlice, EditorStore, Layer } from "../types";
import { v4 as uuidv4 } from "uuid";

export const createDocumentSlice: StateCreator<
  EditorStore,
  [["zustand/immer", never]],
  [],
  DocumentSlice
> = (set) => ({
  layers: [
    { id: "1", name: "Text Layer", type: "text", visible: true, locked: false },
    { id: "2", name: "Clean Image", type: "image", visible: true, locked: false },
    { id: "3", name: "Original", type: "image", visible: false, locked: true },
  ],
  textBoxes: [],

  addLayer: (layer) =>
    set((state) => {
      const newLayer: Layer = {
        ...layer,
        id: uuidv4(),
      };
      state.layers.push(newLayer);
      console.log(`[Document] Layer added:`, newLayer.id);
    }),

  removeLayer: (id) =>
    set((state) => {
      state.layers = state.layers.filter((l) => l.id !== id);
      console.log(`[Document] Layer removed:`, id);
    }),

  updateLayer: (id, updates) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer, updates);
      }
    }),

  toggleLayerVisibility: (id) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (layer) {
        layer.visible = !layer.visible;
      }
    }),

  toggleLayerLock: (id) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (layer) {
        layer.locked = !layer.locked;
      }
    }),

  addTextBox: (box) =>
    set((state) => {
      const newBox = {
        ...box,
        id: uuidv4(),
      };
      state.textBoxes.push(newBox);
      console.log(`[Document] TextBox added:`, newBox.id);
    }),

  removeTextBox: (id) =>
    set((state) => {
      state.textBoxes = state.textBoxes.filter((t) => t.id !== id);
    }),

  updateTextBox: (id, updates) =>
    set((state) => {
      const textBox = state.textBoxes.find((t) => t.id === id);
      if (textBox) {
        Object.assign(textBox, updates);
      }
    }),
});
