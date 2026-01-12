"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowDown,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorStore, selectLayers } from "@/stores/editor";

const FONTS = [
  "Inter",
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
];

/**
 * Right Panel - Properties & Layers Management
 * 
 * Refactored to use Zustand store for state management
 */
export function RightPanel() {
  // ✅ Subscribe to layers from store
  const layers = useEditorStore(selectLayers);
  const toggleLayerVisibility = useEditorStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useEditorStore((state) => state.toggleLayerLock);
  const addLayer = useEditorStore((state) => state.addLayer);

  return (
    <TooltipProvider>
      <div className="w-80 border-l border-white/10 bg-neutral-900 overflow-y-auto">
        <Tabs defaultValue="properties" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b border-white/10 bg-transparent p-0">
            <TabsTrigger
              value="properties"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="layers"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent"
            >
              Layers
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Typography Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Typography</h3>

              {/* Font Family */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Font Family</Label>
                <Select defaultValue="Inter">
                  <SelectTrigger className="border-white/20 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-white/20">
                    {FONTS.map((font) => (
                      <SelectItem key={font} value={font} className="text-white">
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Font Size: 16px</Label>
                <Slider
                  value={[16]}
                  onValueChange={() => {}}
                  min={8}
                  max={72}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Line Height */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Line Height: 1.5</Label>
                <Slider
                  value={[1.5]}
                  onValueChange={() => {}}
                  min={0.8}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Letter Spacing */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Letter Spacing: 0px</Label>
                <Slider
                  value={[0]}
                  onValueChange={() => {}}
                  min={-5}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Text Style */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Style</Label>
                <ToggleGroup type="multiple" className="justify-start">
                  <ToggleGroupItem
                    value="bold"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="italic"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Alignment */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Alignment</Label>
                <ToggleGroup type="single" className="justify-start">
                  <ToggleGroupItem
                    value="left"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="center"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="right"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <AlignRight className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="justify"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <AlignJustify className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Text Orientation */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Orientation</Label>
                <ToggleGroup type="single" defaultValue="horizontal" className="justify-start">
                  <ToggleGroupItem
                    value="horizontal"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span className="ml-1 text-xs">Horizontal</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="vertical"
                    className="border-white/20 hover:bg-white/10 data-[state=on]:bg-white/20"
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="ml-1 text-xs">Vertical</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Color Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Color & Style</h3>

              {/* Text Color */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Text Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    defaultValue="#000000"
                    className="h-10 w-10 cursor-pointer rounded border border-white/20"
                  />
                  <Input
                    defaultValue="#000000"
                    className="flex-1 border-white/20 bg-white/5 text-white text-xs"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    defaultValue="#ffffff"
                    className="h-10 w-10 cursor-pointer rounded border border-white/20"
                  />
                  <Input
                    defaultValue="#ffffff"
                    className="flex-1 border-white/20 bg-white/5 text-white text-xs"
                  />
                </div>
              </div>

              {/* Padding */}
              <div className="space-y-2">
                <Label className="text-xs text-white/70">Padding: 8px</Label>
                <Slider
                  value={[8]}
                  onValueChange={() => {}}
                  min={0}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          {/* Layers Tab */}
          <TabsContent value="layers" className="flex-1 flex flex-col overflow-hidden p-4">
            {/* Layer List */}
            <div className="flex-1 space-y-2 overflow-y-auto mb-4">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2 hover:bg-white/10 transition-colors"
                >
                  {/* Layer Icon */}
                  <div className="text-white/50 text-xs">
                    {layer.type === "text" ? "T" : "🖼"}
                  </div>

                  {/* Layer Name */}
                  <span className="flex-1 text-xs text-white truncate">{layer.name}</span>

                  {/* Visibility Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/20"
                        onClick={() => toggleLayerVisibility(layer.id)}
                      >
                        {layer.visible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle Visibility</TooltipContent>
                  </Tooltip>

                  {/* Lock Toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white/50 hover:text-white hover:bg-white/20"
                        onClick={() => toggleLayerLock(layer.id)}
                      >
                        {layer.locked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle Lock</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>

            {/* Layer Actions */}
            <div className="flex gap-2 border-t border-white/10 pt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                    onClick={() => addLayer({ name: "New Layer", type: "text", visible: true, locked: false })}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Layer
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add a new layer</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete layer</TooltipContent>
              </Tooltip>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
