"use client";

import { TopNav } from "@/components/editor/top-nav";
import { LeftToolbar } from "@/components/editor/left-toolbar";
import { RightPanel } from "@/components/editor/right-panel";
import { CanvasArea } from "@/components/editor/canvas-area";

/**
 * Editor Page - Main Editor Workstation
 * 
 * Uses Zustand store for state management:
 * - UI State (zoom, view mode, opacity)
 * - Selection State (selected objects, layers)
 * - Canvas State (uploaded image, pan)
 * - Document State (layers, text boxes)
 * - History State (undo/redo)
 */
export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-white">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <LeftToolbar />

        {/* Center Canvas */}
        <CanvasArea />

        {/* Right Properties Panel */}
        <RightPanel />
      </div>
    </div>
  );
}
