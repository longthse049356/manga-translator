# Zustand Store - Quick Reference Guide

## Import Store
```typescript
import { useEditorStore, selectActiveTool, selectZoom } from "@/stores/editor";
```

## Subscribe to State

### Single Value (Most Common)
```typescript
// Component only re-renders when zoom changes
const zoom = useEditorStore((state) => state.zoom);
```

### Multiple Values
```typescript
// Use object selector for multiple values
const { zoom, viewMode, opacity } = useEditorStore(
  (state) => ({ zoom: state.zoom, viewMode: state.viewMode, opacity: state.opacity })
);
```

### Pre-built Selectors
```typescript
// More efficient - selector created outside component
const zoom = useEditorStore(selectZoom);
const layers = useEditorStore(selectLayers);
```

## Update State

### Direct Update
```typescript
const setZoom = useEditorStore((state) => state.setZoom);
setZoom(150);  // Zoom to 150%
```

### Object/Nested Update
```typescript
const updateTextBox = useEditorStore((state) => state.updateTextBox);
updateTextBox(textBoxId, { 
  style: { ...currentStyle, fontSize: 24 }
});
```

### Array Operations
```typescript
const addLayer = useEditorStore((state) => state.addLayer);
addLayer({ 
  name: "New Layer", 
  type: "text", 
  visible: true, 
  locked: false 
});
```

## Common Patterns

### Full Example Component
```typescript
"use client";

import { useEditorStore, selectLayers } from "@/stores/editor";

export function MyComponent() {
  // Subscribe to layers (only re-renders when layers change)
  const layers = useEditorStore(selectLayers);
  
  // Get action from store
  const addLayer = useEditorStore((state) => state.addLayer);
  const toggleLayerVisibility = useEditorStore((state) => state.toggleLayerVisibility);
  
  const handleAddNewLayer = () => {
    addLayer({ name: "New Layer", type: "text", visible: true, locked: false });
  };
  
  const handleToggleLayer = (layerId: string) => {
    toggleLayerVisibility(layerId);
  };
  
  return (
    <div>
      <button onClick={handleAddNewLayer}>Add Layer</button>
      <ul>
        {layers.map((layer) => (
          <li key={layer.id}>
            {layer.name}
            <button onClick={() => handleToggleLayer(layer.id)}>
              {layer.visible ? "Hide" : "Show"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Undo/Redo
```typescript
const undo = useEditorStore((state) => state.undo);
const redo = useEditorStore((state) => state.redo);
const canUndo = useEditorStore(selectCanUndo);
const canRedo = useEditorStore(selectCanRedo);

// Usage
<button onClick={() => undo()} disabled={!canUndo}>Undo</button>
<button onClick={() => redo()} disabled={!canRedo}>Redo</button>
```

### Recording History
```typescript
const recordHistory = useEditorStore((state) => state.recordHistory);
const updateTextBox = useEditorStore((state) => state.updateTextBox);

const handleStyleChange = (textBoxId: string, newStyle: TextStyle) => {
  updateTextBox(textBoxId, { style: newStyle });
  recordHistory();  // Snapshot for undo/redo
};
```

## Available Slices

### UI Slice
```typescript
{
  activeTool,
  zoom,
  viewMode,
  opacity,
  setActiveTool,
  setZoom,
  setViewMode,
  setOpacity,
}
```

### Selection Slice
```typescript
{
  selectedObjectIds,
  selectedLayerId,
  selectObject,
  deselectAll,
  selectLayer,
}
```

### Canvas Slice
```typescript
{
  uploadedImage,
  panX,
  panY,
  setUploadedImage,
  setPan,
}
```

### Document Slice (Persisted)
```typescript
{
  layers,
  textBoxes,
  addLayer,
  removeLayer,
  updateLayer,
  toggleLayerVisibility,
  toggleLayerLock,
  addTextBox,
  removeTextBox,
  updateTextBox,
}
```

### History Slice
```typescript
{
  history,
  undo,
  redo,
  recordHistory,
}
```

## Pre-built Selectors
```typescript
selectActiveTool          // Current tool
selectZoom                // Current zoom %
selectViewMode            // "single" or "scroll"
selectOpacity             // Opacity 0-100
selectSelectedObjectIds   // Currently selected objects
selectSelectedLayerId     // Currently selected layer
selectUploadedImage       // Current canvas image
selectLayers              // All layers
selectTextBoxes           // All text boxes
selectVisibleLayers       // Filtered visible layers
selectCanUndo             // Boolean: can undo?
selectCanRedo             // Boolean: can redo?
```

## Debugging

### Console Logs
All actions log to console with `[Slice Name]` prefix:
```
[UI] Tool changed to: text
[Selection] Object selected: layer-123 multi: false
[Canvas] Image uploaded
[Document] Layer added: layer-456
[History] Undo executed
```

### Redux DevTools
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. See all actions and state changes
4. Time-travel debug by clicking actions
5. Export/import state snapshots

### Check State in Console
```javascript
// In browser console
store = window.store;  // After store is set up
store.getState();      // See full state
```

## Performance Tips

✅ **DO**
```typescript
// Minimal re-renders
const zoom = useEditorStore((state) => state.zoom);
```

✅ **DO**
```typescript
// Use pre-built selectors
const layers = useEditorStore(selectLayers);
```

✅ **DO**
```typescript
// Create selectors outside components
export const selectMyData = (state) => state.myData;

// In component
const myData = useEditorStore(selectMyData);
```

❌ **DON'T**
```typescript
// Subscribes to entire store - re-renders on any change
const store = useEditorStore();
```

❌ **DON'T**
```typescript
// Selector created on every render
const layers = useEditorStore((state) => state.layers);
// Better: use pre-built selector above
```

## Common Issues & Solutions

### Issue: Component re-renders too often
**Solution:** Use a selector that only subscribes to what you need
```typescript
// Before (re-renders on any state change)
const { zoom, layers, selectedIds } = useEditorStore();

// After (only re-renders when zoom changes)
const zoom = useEditorStore(selectZoom);
```

### Issue: State changes don't appear
**Solution:** Make sure you're calling the action, not just returning it
```typescript
// Wrong
const setZoom = useEditorStore((state) => state.setZoom);
// (doesn't do anything)

// Right
const setZoom = useEditorStore((state) => state.setZoom);
setZoom(150);  // ← Must call the function
```

### Issue: Undo/Redo not working
**Solution:** Call `recordHistory()` after making changes
```typescript
const updateTextBox = useEditorStore((state) => state.updateTextBox);
const recordHistory = useEditorStore((state) => state.recordHistory);

// Make change
updateTextBox(id, updates);

// Record for undo/redo
recordHistory();
```

### Issue: Data lost on page reload
**Solution:** Document data (layers, textBoxes) is persisted automatically, but UI state isn't
```typescript
// This will persist (auto-saved to localStorage)
addLayer({ name: "Layer 1", type: "text", visible: true, locked: false });

// This will NOT persist (UI state)
setZoom(200);
setActiveTool("text");
```

## File Locations

```
/stores/editor/
  ├── index.ts                    # Main store
  ├── types.ts                    # TypeScript types
  └── slices/
      ├── ui-slice.ts
      ├── selection-slice.ts
      ├── canvas-slice.ts
      ├── document-slice.ts
      └── history-slice.ts

/components/editor/
  ├── top-nav.tsx                 # Uses UI slice
  ├── left-toolbar.tsx            # Uses UI slice
  ├── canvas-area.tsx             # Uses Canvas slice
  └── right-panel.tsx             # Uses Document slice
```

---

**Last Updated:** 2026-01-12  
**Status:** ✅ Production Ready
