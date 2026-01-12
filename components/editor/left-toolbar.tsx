"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  MousePointer2,
  Hand,
  Crop,
  Type,
  Brush,
  Eraser,
  Pipette,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorStore, selectActiveTool } from "@/stores/editor";

const TOOLS = [
  { id: "select", icon: MousePointer2, label: "Selection", shortcut: "V" },
  { id: "hand", icon: Hand, label: "Pan/Move", shortcut: "H" },
  { id: "region", icon: Crop, label: "Region Tool", shortcut: "R" },
  { id: "text", icon: Type, label: "Text Tool", shortcut: "T" },
  { id: "brush", icon: Brush, label: "Brush", shortcut: "B" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
  { id: "eyedropper", icon: Pipette, label: "Eyedropper", shortcut: "I" },
];

export function LeftToolbar() {
  // ✅ Only subscribe to activeTool - component only re-renders when tool changes
  const activeTool = useEditorStore(selectActiveTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  return (
    <TooltipProvider>
      <div className="flex w-20 flex-col border-r border-white/10 bg-neutral-900 p-2">
        <ToggleGroup
          type="single"
          value={activeTool}
          onValueChange={(value) => value && setActiveTool(value)}
          className="flex flex-col gap-2"
        >
          {TOOLS.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={tool.id}
                    className="h-12 w-12 border border-white/20 rounded-lg hover:bg-white/10 hover:border-white/30 data-[state=on]:bg-white/20 data-[state=on]:border-white/40"
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <div className="font-semibold">{tool.label}</div>
                    <div className="text-xs text-white/60">({tool.shortcut})</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </ToggleGroup>

        {/* Divider */}
        <div className="my-2 h-px bg-white/10" />

        {/* Additional tools section for future expansion */}
        <div className="text-xs text-white/50 text-center py-2">More tools coming soon</div>
      </div>
    </TooltipProvider>
  );
}
