"use client";

import { memo } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Split, MessageSquarePlus } from "lucide-react";
import { useTranslateStore, ViewMode } from "./store";

export const ViewModeControls = memo(function ViewModeControls() {
  const viewMode = useTranslateStore((state) => state.viewMode);
  const isFeedbackMode = useTranslateStore((state) => state.isFeedbackMode);
  const setViewMode = useTranslateStore((state) => state.setViewMode);
  const setIsFeedbackMode = useTranslateStore((state) => state.setIsFeedbackMode);

  // When feedback mode is enabled, force translated view (disable compare)
  const handleFeedbackModeToggle = () => {
    if (!isFeedbackMode && viewMode === "compare") {
      setViewMode("translated");
    }
    setIsFeedbackMode(!isFeedbackMode);
  };

  // When compare mode is selected, disable feedback mode
  const handleViewModeChange = (value: ViewMode) => {
    if (value === "compare" && isFeedbackMode) {
      setIsFeedbackMode(false);
    }
    setViewMode(value);
  };

  return (
    <div className="sticky top-24 z-40 mx-auto flex max-w-fit items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && handleViewModeChange(value as ViewMode)}
        className="gap-1"
      >
        <ToggleGroupItem
          value="translated"
          aria-label="Show translated only"
          className="gap-2 rounded-xl px-4 py-2 text-white/70 transition-all data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-500 data-[state=on]:to-pink-500 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-purple-500/50"
        >
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">Translated</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="original"
          aria-label="Show original only"
          className="gap-2 rounded-xl px-4 py-2 text-white/70 transition-all data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-blue-500 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-cyan-500/50"
        >
          <EyeOff className="h-4 w-4" />
          <span className="text-sm font-medium">Original</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="compare"
          aria-label="Compare side by side"
          disabled={isFeedbackMode}
          className="gap-2 rounded-xl px-4 py-2 text-white/70 transition-all data-[state=on]:bg-gradient-to-r data-[state=on]:from-orange-500 data-[state=on]:to-pink-500 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-orange-500/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Split className="h-4 w-4" />
          <span className="text-sm font-medium">Compare</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Feedback Mode toggle */}
      <div className="h-6 w-px bg-white/20" />
      <Button
        onClick={handleFeedbackModeToggle}
        disabled={viewMode === "compare"}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
          isFeedbackMode
            ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/50"
            : "text-white/70 hover:bg-white/10"
        } disabled:cursor-not-allowed disabled:opacity-40`}
        variant="ghost"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Feedback {isFeedbackMode ? "On" : "Off"}
      </Button>
    </div>
  );
});

