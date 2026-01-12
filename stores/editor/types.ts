// Base types
export interface Layer {
  id: string;
  name: string;
  type: "text" | "image";
  visible: boolean;
  locked: boolean;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right" | "justify";
  orientation: "horizontal" | "vertical";
  textColor: string;
  backgroundColor: string;
  lineHeight: number;
  letterSpacing: number;
  padding: number;
}

export interface TextBox {
  id: string;
  layerId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: TextStyle;
}

// UI Slice
export interface UISlice {
  activeTool: string;
  zoom: number;
  viewMode: "single" | "scroll";
  opacity: number;
  
  setActiveTool: (tool: string) => void;
  setZoom: (zoom: number) => void;
  setViewMode: (mode: "single" | "scroll") => void;
  setOpacity: (opacity: number) => void;
}

// Selection Slice
export interface SelectionSlice {
  selectedObjectIds: string[];
  selectedLayerId: string | null;
  
  selectObject: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  selectLayer: (id: string) => void;
}

// Canvas Slice
export interface CanvasSlice {
  uploadedImage: string | null;
  panX: number;
  panY: number;
  
  setUploadedImage: (image: string | null) => void;
  setPan: (x: number, y: number) => void;
}

// Document Slice
export interface DocumentSlice {
  layers: Layer[];
  textBoxes: TextBox[];
  
  addLayer: (layer: Omit<Layer, "id">) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  
  addTextBox: (box: Omit<TextBox, "id">) => void;
  removeTextBox: (id: string) => void;
  updateTextBox: (id: string, updates: Partial<TextBox>) => void;
}

// History State (only data, not functions)
export interface HistoryData {
  layers: Layer[];
  textBoxes: TextBox[];
}

export interface HistoryState {
  past: HistoryData[];
  future: HistoryData[];
}

export interface HistorySlice {
  history: HistoryState;
  
  undo: () => void;
  redo: () => void;
  recordHistory: () => void;
}

// Combined Store
export type EditorStore = UISlice &
  SelectionSlice &
  CanvasSlice &
  DocumentSlice &
  HistorySlice;
