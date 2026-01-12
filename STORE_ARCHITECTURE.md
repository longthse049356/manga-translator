# Zustand Store Architecture - Editor State Management

## Overview

The Editor uses **Zustand with Slices Pattern** for scalable, performant state management. This replaces local useState calls with a centralized, single source of truth.

## Why Zustand + Slices?

### ✅ Benefits vs Local State

| Aspect | Local State (useState) | Zustand |
|--------|----------------------|---------|
| **Prop Drilling** | ❌ Pass through multiple levels | ✅ Direct access anywhere |
| **Performance** | ❌ Parent re-renders all children | ✅ Selective subscriptions |
| **State Sync** | ❌ Hard to sync across components | ✅ Single source of truth |
| **Undo/Redo** | ❌ Complex manual tracking | ✅ Built-in history support |
| **DevTools** | ❌ Limited debugging | ✅ Redux DevTools integration |
| **Persistence** | ❌ Manual localStorage | ✅ Built-in persist middleware |
| **Scalability** | ❌ Unwieldy as code grows | ✅ Organized slices |

## Store Architecture

```
stores/editor/
├── types.ts           # TypeScript interfaces
├── index.ts           # Main store + selectors
└── slices/
    ├── ui-slice.ts       # zoom, view mode, opacity, active tool
    ├── selection-slice.ts # selected objects, layers
    ├── canvas-slice.ts    # uploaded image, pan position
    ├── document-slice.ts  # layers, text boxes (core data)
    └── history-slice.ts   # undo/redo state
```

## Store Slices

### 1. UI Slice
Transient UI state that doesn't need persistence.

```typescript
{
  activeTool: string;
  zoom: number;           // 10-300%
  viewMode: "single" | "scroll";
  opacity: number;        // 0-100
}
```

**Used in:** `TopNav`, `LeftToolbar`

### 2. Selection Slice
Track what user has selected.

```typescript
{
  selectedObjectIds: string[];     // Multi-select
  selectedLayerId: string | null;  // Single layer
}
```

**Used in:** `RightPanel`, `Canvas`

### 3. Canvas Slice
Canvas rendering state.

```typescript
{
  uploadedImage: string | null;  // Base64 or URL
  panX: number;
  panY: number;
}
```

**Used in:** `CanvasArea`

### 4. Document Slice ⭐ (Core Data)
The actual document structure - **PERSISTED** to localStorage.

```typescript
{
  layers: Layer[];
  textBoxes: TextBox[];
  
  // Actions
  addLayer()
  removeLayer()
  updateLayer()
  toggleLayerVisibility()
  toggleLayerLock()
  addTextBox()
  updateTextBox()
  removeTextBox()
}
```

**Used in:** `RightPanel`, `Canvas`

### 5. History Slice
Undo/Redo management.

```typescript
{
  history: {
    past: HistoryData[];    // Snapshots
    future: HistoryData[];  // For redo
  }
  
  // Actions
  undo()
  redo()
  recordHistory()  // Snapshot current state
}
```

**Used in:** `TopNav` (undo/redo buttons)

## Usage Patterns

### ✅ Correct: Selective Subscription

```typescript
// ❌ Re-renders on ANY store change
const store = useEditorStore();

// ✅ Only re-renders when zoom changes (optimal)
const zoom = useEditorStore((state) => state.zoom);
const setZoom = useEditorStore((state) => state.setZoom);

// ✅ Multiple values with shallow compare
const { layers, textBoxes } = useEditorStore(
  (state) => ({ layers: state.layers, textBoxes: state.textBoxes }),
  shallow
);
```

### Pre-built Selectors

The store exports optimized selectors:

```typescript
import { 
  selectActiveTool,
  selectZoom,
  selectLayers,
  selectCanUndo,
  selectCanRedo 
} from "@/stores/editor";

// Usage
const activeTool = useEditorStore(selectActiveTool);
```

### Recording History

After major changes, call `recordHistory()`:

```typescript
const recordHistory = useEditorStore((state) => state.recordHistory);

// After user action
updateTextBox(id, updates);
recordHistory();  // Save snapshot
```

## Middleware Stack

```typescript
create<EditorStore>()(
  devtools(           // Redux DevTools debugging
    persist(          // localStorage persistence
      immer(...)      // Immutable updates
    )
  )
)
```

### Middleware Details

1. **Immer** - Allows "mutating" state directly in handlers (under the hood it's immutable)
   ```typescript
   state.activeTool = "text";  // Works because of Immer
   ```

2. **Persist** - Auto-saves document data to localStorage
   - Only persists: `layers`, `textBoxes` (document data)
   - Does NOT persist: `zoom`, `selectedTool`, etc. (UI state)

3. **DevTools** - Debug with Redux DevTools browser extension
   - Time-travel debugging
   - Action replay
   - State snapshots

## Performance Tips

### 1. **Use Selectors** to minimize re-renders

```typescript
// Bad: triggers updates on zoom, scroll, selection changes
const { zoom, uploadedImage, selectedIds } = useEditorStore();

// Good: each component only subscribes to what it needs
const zoom = useEditorStore((state) => state.zoom);
const uploadedImage = useEditorStore((state) => state.uploadedImage);
const selectedIds = useEditorStore((state) => state.selectedObjectIds);
```

### 2. **Create Reusable Selectors** outside components

```typescript
// ❌ Creates new function on every render
const layers = useEditorStore((state) => state.layers);

// ✅ Selector created once, reused
export const selectLayers = (state) => state.layers;

// In component
const layers = useEditorStore(selectLayers);
```

### 3. **Use Shallow Compare** for objects

```typescript
const { layers, textBoxes } = useEditorStore(
  (state) => ({ layers: state.layers, textBoxes: state.textBoxes }),
  shallow  // ⬅️ Prevent re-render if inner values didn't change
);
```

## Future Scaling

As the editor grows:

1. **Add new slices** for new features (undo/redo becomes complex? → dedicated slice)
2. **Add middlewares** (e.g., `logger` for debugging)
3. **Multi-slice actions** - dispatch changes across slices atomically
4. **Computed state** - derive values from multiple slices

Example: Advanced History with branching

```typescript
const createAdvancedHistorySlice = (set, get) => ({
  history: {
    branches: {},     // Multiple undo timelines
    currentBranch: "main",
    // ...
  },
  // Advanced undo/redo logic
});
```

## File Structure After Refactoring

```
components/editor/
├── top-nav.tsx        # Uses zoom, viewMode, opacity, undo/redo
├── left-toolbar.tsx   # Uses activeTool
├── canvas-area.tsx    # Uses uploadedImage
├── right-panel.tsx    # Uses layers, textBoxes
└── index.ts

stores/
└── editor/
    ├── types.ts                 # 80+ lines types
    ├── index.ts                 # Main store + selectors
    └── slices/
        ├── ui-slice.ts
        ├── selection-slice.ts
        ├── canvas-slice.ts
        ├── document-slice.ts
        └── history-slice.ts

app/editor/
└── page.tsx           # Simple: just renders layout, all state in store
```

## Next Steps

1. **Implement Text Styling** - Connect RightPanel sliders → TextBox styles
2. **Add Keyboard Shortcuts** - Ctrl+Z → undo, Ctrl+Y → redo
3. **Export/Import** - Save document as JSON using persisted state
4. **Collaboration** - Sync store changes via WebSocket
5. **Performance Monitoring** - Track re-render counts per component

---

**Build Status:** ✅ Successful  
**Store Ready:** ✅ Full setup with 5 slices  
**Performance:** ✅ Optimized with selective subscriptions  
**Debugging:** ✅ Redux DevTools ready
