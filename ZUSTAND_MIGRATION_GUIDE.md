# Zustand Migration Guide - From useState to Store

## Quick Summary

**Before:** Components managed state individually with useState, causing prop drilling and re-render issues.

**After:** Single Zustand store with 5 slices, optimal performance, and professional features.

---

## 1. Installation

```bash
npm install zustand immer uuid @radix-ui/react-tabs @radix-ui/react-select
```

---

## 2. Store Structure

### File Organization
```
stores/
└── editor/
    ├── types.ts           # TypeScript types
    ├── index.ts           # Main store
    └── slices/
        ├── ui-slice.ts
        ├── selection-slice.ts
        ├── canvas-slice.ts
        ├── document-slice.ts
        └── history-slice.ts
```

---

## 3. Basic Usage

### Import
```typescript
import { useEditorStore, selectZoom } from "@/stores/editor";
```

### Subscribe to State
```typescript
// One value
const zoom = useEditorStore((state) => state.zoom);

// Multiple values
const { zoom, viewMode, opacity } = useEditorStore((state) => ({
  zoom: state.zoom,
  viewMode: state.viewMode,
  opacity: state.opacity,
}));

// Pre-built selector
const zoom = useEditorStore(selectZoom);
```

### Update State
```typescript
const setZoom = useEditorStore((state) => state.setZoom);
setZoom(150);
```

---

## 4. Migration Examples

### Example 1: TopNav Component

**Before (useState):**
```typescript
export function TopNav() {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState("single");
  const [opacity, setOpacity] = useState(100);

  return (
    <>
      <button onClick={() => setZoom(zoom + 10)}>Zoom In</button>
      <span>{zoom}%</span>
    </>
  );
}
```

**After (Zustand):**
```typescript
export function TopNav() {
  const zoom = useEditorStore(selectZoom);
  const setZoom = useEditorStore((state) => state.setZoom);

  return (
    <>
      <button onClick={() => setZoom(zoom + 10)}>Zoom In</button>
      <span>{zoom}%</span>
    </>
  );
}
```

**Benefits:**
- ✅ No useState
- ✅ No prop drilling from parent
- ✅ Can be used in any component

---

### Example 2: RightPanel (Complex State)

**Before (useState with local functions):**
```typescript
export function RightPanel({ activeTool }) {
  const [layers, setLayers] = useState(DEFAULT_LAYERS);

  const toggleVisibility = (id) => {
    setLayers(
      layers.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } : l
      )
    );
  };

  return (
    <div>
      {layers.map((layer) => (
        <button onClick={() => toggleVisibility(layer.id)}>
          {layer.visible ? "Hide" : "Show"}
        </button>
      ))}
    </div>
  );
}
```

**After (Zustand):**
```typescript
export function RightPanel() {
  const layers = useEditorStore(selectLayers);
  const toggleLayerVisibility = useEditorStore(
    (state) => state.toggleLayerVisibility
  );

  return (
    <div>
      {layers.map((layer) => (
        <button onClick={() => toggleLayerVisibility(layer.id)}>
          {layer.visible ? "Hide" : "Show"}
        </button>
      ))}
    </div>
  );
}
```

**Benefits:**
- ✅ Logic centralized in store
- ✅ Layers persist on reload
- ✅ Easy to debug
- ✅ Can use in other components

---

### Example 3: Prop Drilling Elimination

**Before:**
```typescript
// EditorPage passes props through multiple levels
function EditorPage() {
  const [activeTool, setActiveTool] = useState("select");
  
  return (
    <LeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
  );
}

function LeftToolbar({ activeTool, onToolChange }) {
  return (
    <button onClick={() => onToolChange("text")}>Text</button>
  );
}
```

**After:**
```typescript
function EditorPage() {
  return <LeftToolbar />;  // ← No props!
}

function LeftToolbar() {
  const activeTool = useEditorStore(selectActiveTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  
  return (
    <button onClick={() => setActiveTool("text")}>Text</button>
  );
}
```

**Benefits:**
- ✅ Prop chains eliminated
- ✅ Easier to add features
- ✅ Less re-renders
- ✅ Cleaner components

---

## 5. Advanced Patterns

### Using Actions

```typescript
// Get an action from store
const addLayer = useEditorStore((state) => state.addLayer);

// Call it
addLayer({ name: "New Layer", type: "text", visible: true, locked: false });
```

### Recording History

```typescript
const updateTextBox = useEditorStore((state) => state.updateTextBox);
const recordHistory = useEditorStore((state) => state.recordHistory);

const handleUpdate = (id, updates) => {
  updateTextBox(id, updates);
  recordHistory();  // Snapshot for undo/redo
};
```

### Undo/Redo

```typescript
const undo = useEditorStore((state) => state.undo);
const redo = useEditorStore((state) => state.redo);
const canUndo = useEditorStore(selectCanUndo);
const canRedo = useEditorStore(selectCanRedo);

<button onClick={() => undo()} disabled={!canUndo}>Undo</button>
<button onClick={() => redo()} disabled={!canRedo}>Redo</button>
```

### Multiple Values Efficiently

```typescript
import { useShallow } from "zustand/react";

const { layers, textBoxes } = useEditorStore(
  useShallow((state) => ({
    layers: state.layers,
    textBoxes: state.textBoxes,
  }))
);
```

---

## 6. Available Slices

### UI Slice
```typescript
{
  activeTool: string;
  zoom: number;
  viewMode: "single" | "scroll";
  opacity: number;
  
  setActiveTool(tool)
  setZoom(zoom)
  setViewMode(mode)
  setOpacity(opacity)
}
```

### Selection Slice
```typescript
{
  selectedObjectIds: string[];
  selectedLayerId: string | null;
  
  selectObject(id, multi?)
  deselectAll()
  selectLayer(id)
}
```

### Canvas Slice
```typescript
{
  uploadedImage: string | null;
  panX: number;
  panY: number;
  
  setUploadedImage(image)
  setPan(x, y)
}
```

### Document Slice (Persisted)
```typescript
{
  layers: Layer[];
  textBoxes: TextBox[];
  
  addLayer(layer)
  removeLayer(id)
  updateLayer(id, updates)
  toggleLayerVisibility(id)
  toggleLayerLock(id)
  addTextBox(box)
  removeTextBox(id)
  updateTextBox(id, updates)
}
```

### History Slice
```typescript
{
  history: { past: [], future: [] };
  
  undo()
  redo()
  recordHistory()
}
```

---

## 7. Pre-built Selectors

Use these for optimal performance:

```typescript
selectActiveTool          // Current tool
selectZoom                // Current zoom
selectViewMode            // "single" or "scroll"
selectOpacity             // 0-100
selectSelectedObjectIds   // Selected objects
selectSelectedLayerId     // Selected layer
selectUploadedImage       // Canvas image
selectLayers              // All layers
selectTextBoxes           // All text boxes
selectVisibleLayers       // Filtered visible layers
selectCanUndo             // Boolean
selectCanRedo             // Boolean
```

---

## 8. Debugging

### Console Logs
All actions log with `[SliceName]` prefix:
```
[UI] Tool changed to: text
[Document] Layer added: layer-456
[History] Undo executed
```

### Redux DevTools
1. Install browser extension
2. Open DevTools → Redux tab
3. See all state changes
4. Time-travel debug
5. Export/import state

### Browser Console
```javascript
// Check full state
useEditorStore.getState()

// Subscribe to changes
const unsubscribe = useEditorStore.subscribe(
  (state) => console.log(state)
);
```

---

## 9. Performance Tips

✅ **DO:**
```typescript
// Minimal re-renders
const zoom = useEditorStore((state) => state.zoom);

// Use pre-built selectors
const layers = useEditorStore(selectLayers);

// Create selectors outside components
export const selectMyData = (state) => state.myData;
const data = useEditorStore(selectMyData);
```

❌ **DON'T:**
```typescript
// Re-renders on any state change
const store = useEditorStore();

// Creates selector on every render
const data = useEditorStore((state) => state.data);
// Better: move selector outside
```

---

## 10. Common Issues

### Issue: Component re-renders too often
**Solution:** Use a selector that only subscribes to needed data
```typescript
// Before (re-renders on any change)
const { zoom, layers, tools } = useEditorStore();

// After (only on zoom change)
const zoom = useEditorStore(selectZoom);
```

### Issue: Data lost on reload
**Solution:** Document data auto-persists, but check localStorage
```typescript
// This persists automatically
addLayer({ name: "Layer", type: "text", visible: true, locked: false });

// This does NOT persist (UI state)
setZoom(200);
```

### Issue: Undo/Redo not working
**Solution:** Call `recordHistory()` after changes
```typescript
updateTextBox(id, updates);
recordHistory();  // Required!
```

### Issue: TypeScript errors
**Solution:** Import types correctly
```typescript
import { EditorStore } from "@/stores/editor/types";
```

---

## 11. Testing Checklist

- [ ] Component renders correctly
- [ ] Store subscription works
- [ ] State updates on action
- [ ] Component re-renders only when needed
- [ ] Persistence works (reload page)
- [ ] Undo/Redo works
- [ ] Redux DevTools shows actions
- [ ] No console errors

---

## 12. Next: Build New Features

### Example: Add Font Selector

1. **Add to types:**
```typescript
export interface TextStyle {
  fontFamily: string;
  // ...
}
```

2. **Add to document slice:**
```typescript
updateTextBox: (id, updates) => set((state) => {
  const box = state.textBoxes.find(t => t.id === id);
  if (box) Object.assign(box, updates);
})
```

3. **Use in component:**
```typescript
const updateTextBox = useEditorStore((state) => state.updateTextBox);
const handleFontChange = (fontFamily) => {
  updateTextBox(selectedId, {
    style: { ...currentStyle, fontFamily }
  });
  recordHistory();
};
```

---

## 13. Resources

- **Zustand Docs:** https://github.com/pmndrs/zustand
- **Immer Docs:** https://immerjs.github.io/immer/
- **Redux DevTools:** Redux DevTools browser extension

---

## 14. Cheat Sheet

```typescript
// Import
import { useEditorStore, selectZoom } from "@/stores/editor";

// Get state
const zoom = useEditorStore(selectZoom);
const layers = useEditorStore((state) => state.layers);

// Get action
const setZoom = useEditorStore((state) => state.setZoom);
const addLayer = useEditorStore((state) => state.addLayer);

// Call action
setZoom(150);
addLayer({ name: "New", type: "text", visible: true, locked: false });

// History
const recordHistory = useEditorStore((state) => state.recordHistory);
recordHistory();

// Undo/Redo
const undo = useEditorStore((state) => state.undo);
const redo = useEditorStore((state) => state.redo);
undo();
redo();
```

---

**Status:** ✅ Complete & Production Ready  
**Build:** ✅ 0 Errors  
**Documentation:** ✅ 5 Guides  

**Next Step:** `npm run dev`
