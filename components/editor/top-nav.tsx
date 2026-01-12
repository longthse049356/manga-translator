"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  RotateCcw, 
  RotateCw, 
  ZoomOut, 
  ZoomIn,
  Eye,
  Download,
  Settings,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorStore, selectZoom, selectViewMode, selectOpacity } from "@/stores/editor";
import { memo } from "react";

// ✅ Tách Global Actions ra component riêng để tránh re-render khi opacity thay đổi
const GlobalActions = memo(function GlobalActions() {
  const zoom = useEditorStore(selectZoom);
  const viewMode = useEditorStore(selectViewMode);

  const setZoom = useEditorStore((state) => state.setZoom);
  const setViewMode = useEditorStore((state) => state.setViewMode);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);

  return (
    <div className="flex items-center gap-4">
      {/* Undo/Redo */}
      <div className="flex items-center gap-2 border-l border-r border-white/10 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={() => undo()}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={() => redo()}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10" 
              onClick={() => setZoom(zoom - 10)}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
        <div className="w-20 text-center text-xs font-medium text-white">{zoom}%</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10" 
              onClick={() => setZoom(zoom + 10)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </div>

      {/* View Mode */}
      <div className="flex items-center gap-2 border-l border-white/10 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-white hover:bg-white/10 ${viewMode === "single" ? "bg-white/20" : ""}`}
              onClick={() => setViewMode("single")}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Single Page View</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`text-white hover:bg-white/10 ${viewMode === "scroll" ? "bg-white/20" : ""}`}
              onClick={() => setViewMode("scroll")}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Scroll View (Webtoon)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
});

// ✅ Tách Opacity Slider ra component riêng
const OpacitySlider = memo(function OpacitySlider() {
  const opacity = useEditorStore(selectOpacity);
  const setOpacity = useEditorStore((state) => state.setOpacity);

  return (
    <div className="flex items-center gap-2 border-l border-white/10 px-4">
      <Eye className="h-4 w-4 text-white/70 flex-shrink-0" />
      <Slider 
        value={[opacity]} 
        onValueChange={(val) => setOpacity(val[0])}
        min={0}
        max={100}
        step={1}
        className="w-24 flex-shrink-0"
      />
      <span className="text-xs text-white/50 w-10 text-right flex-shrink-0">{opacity}%</span>
    </div>
  );
});

export function TopNav() {

  return (
    <TooltipProvider>
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-neutral-900 px-4">
        {/* Left: Logo & Project Info */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-sm font-semibold text-white">Untitled Project</div>
          <div className="text-xs text-white/50">All changes saved</div>
        </div>

        {/* Center: Global Actions */}
        <GlobalActions />

        {/* Right: Export & Settings */}
        <div className="flex items-center gap-2">
          {/* Opacity Slider */}
          <OpacitySlider />

          {/* Export */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
          </Tooltip>

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
