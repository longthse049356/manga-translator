# 📘 Editor Development Guidelines

This guide defines the principles, architecture, and workflow for adding new features to the Editor in the Manga Translator project.
**Goal:** Ensure consistency, performance, and scalability as the codebase grows.

---

## 1. State Management Architecture (IMPORTANT)

We use **Zustand** with the **Slices Pattern**. Follow these rules strictly:

### ✅ Rule 1: "Zustand First"
- **Global State:** Any state shared across >1 component (e.g., `zoom`, `activeTool`, `layers`, `canvas`) **MUST** live in the Store.
- **Local State (`useState`):** Only for local, temporary UI states (hover, transient dropdown, unsent input).
- **NO Prop Drilling:** Do not pass state down more than one level. Children should subscribe directly to the Store.

### ✅ Rule 2: Selective Subscription (Performance)
Never subscribe to the whole store. Always select only what you need to avoid extra re-renders.

**❌ Bad:**
```typescript
const { zoom } = useEditorStore(); // Re-renders on ANY state change
```

**✅ Good:**
```typescript
const zoom = useEditorStore((state) => state.zoom); // Only re-renders when zoom changes
// Or use a predefined selector (preferred)
const zoom = useEditorStore(selectZoom);
```

**✅ Good (multiple states):**
```typescript
import { useShallow } from "zustand/react/shallow";

// useShallow to avoid re-render when objects are shallow-equal
const { activeTool, zoom } = useEditorStore(
  useShallow((state) => ({ activeTool: state.activeTool, zoom: state.zoom }))
);
```

### ✅ Rule 3: Slice Boundaries
When adding new state, place it in the correct slice in `FE/stores/editor/slices/`:
1. **`ui-slice`**: UI state (zoom, view mode, opacity, active tool). *Not persisted.*
2. **`document-slice`**: Core data (layers, text boxes, images). *Persisted to localStorage.*
3. **`selection-slice`**: Current selections. *Not persisted.*
4. **`canvas-slice`**: Canvas state (pan, uploaded image). *Not persisted.*
5. **`history-slice`**: Undo/Redo logic.

---

## 2. UI/UX & Styling Rules

### 🎨 Design System
- **Framework:** Tailwind CSS.
- **Components:** Shadcn UI (`@/components/ui/...`).
- **Icons:** `lucide-react`.

### 🌑 Theme & Colors (Dark Mode Default)
Use the standard palette to stay consistent with the Editor:

| Element | Tailwind Class | Note |
| :--- | :--- | :--- |
| **Main Background** | `bg-neutral-950` | Darkest base |
| **Panel Background** | `bg-neutral-900` | Sidebar, Toolbar |
| **Border** | `border-white/10` | Subtle divider |
| **Primary Text** | `text-white` | |
| **Secondary Text** | `text-white/70` | Labels, hints |
| **Muted Text** | `text-white/50` | Units, placeholders |
| **Active/Primary** | `text-cyan-500` or `bg-cyan-600` | Accent |
| **Hover** | `hover:bg-white/10` | Standard hover |

### 🧩 Component Structure
Main editor components live in `FE/components/editor/`:
- `top-nav.tsx`: Top bar (Zoom, Undo/Redo, Export).
- `left-toolbar.tsx`: Tools (Select, Text, Brush...).
- `right-panel.tsx`: Properties & Layers.
- `canvas-area.tsx`: Canvas display & interactions.

---

## 3. Adding a New Feature (Step-by-Step)

Example: Add **Image Filter** (Brightness/Contrast).

### Step 1: Define Types
Edit `FE/stores/editor/types.ts`:
```typescript
// Add to Layer or create a new interface
export interface ImageFilter {
  brightness: number;
  contrast: number;
}
// Update DocumentSlice if you store this data
```

### Step 2: Add/Update Slice
Edit `FE/stores/editor/slices/document-slice.ts` (if stored per layer) or create `filter-slice.ts`.
```typescript
// Add action to DocumentSlice
setLayerFilter: (id: string, filter: ImageFilter) => void;
```

### Step 3: Implement Logic in Store
Update the store to handle the state change (Immer allows direct mutation).
**Note:** If the action changes document content, call `recordHistory()` (for undo/redo).

```typescript
setLayerFilter: (id, filter) => set((state) => {
    const layer = state.layers.find(l => l.id === id);
    if (layer) {
        layer.filter = filter; // Immer allows direct mutation
    }
})
```

### Step 4: Build the UI
Create UI in `right-panel.tsx` or a new component.
- Import Store: `const setLayerFilter = useEditorStore(state => state.setLayerFilter);`
- Use Shadcn Slider/Input to adjust values.

---

## 4. Definition of Done (Checklist)

Before marking a feature as done, verify:

- [ ] **Store:** State updates correctly in Redux DevTools.
- [ ] **Performance:** No unnecessary re-renders (check with React DevTools Profiler or `console.log`).
- [ ] **Persistence:** After reload (F5), document data (layers, text) is intact.
- [ ] **Undo/Redo:** Undo/Redo works as expected.
- [ ] **UI:** Colors/spacings follow `neutral-950`, `white/10`, `text-white`, cyan accents.

---

## 5. Common Pitfalls

1) **Data lost after reload**
   *Cause:* Forgot to include state in `partialize` of `persist` (file `stores/editor/index.ts`). Only whitelisted fields are saved.

2) **Slider lagging**
   *Cause:* Parent component re-renders on every slider change.
   *Fix:* Split into smaller components and subscribe only to needed state (selectors/useShallow).

3) **Undo not working**
   *Cause:* Forgot to call `recordHistory()` after mutating document data.
