"use client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Settings, Upload, BookOpen } from "lucide-react";

interface ReaderHeaderProps {
  mode: "upload" | "reader";
  onModeChange: (mode: "upload" | "reader") => void;
  onTranslateAll?: () => void;
  isTranslating?: boolean;
  hasUntranslatedImages?: boolean;
}

export function ReaderHeader({
  mode,
  onModeChange,
  onTranslateAll,
  isTranslating = false,
  hasUntranslatedImages = false,
}: ReaderHeaderProps) {
  return (
    <header className="sticky top-4 z-50 mx-4 animate-in fade-in slide-in-from-top-5 duration-500">
      <div className="mx-auto max-w-7xl">
        {/* Glass container with vibrant border */}
        <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-pink-500/5" />
          
          {/* Content */}
          <div className="relative flex items-center justify-between p-4">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/50">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white drop-shadow-lg">
                  Manga Translator
                </h1>
                <p className="text-xs text-cyan-200/80">
                  Powered by Gemini AI
                </p>
              </div>
            </div>

            {/* Center: Mode Toggle */}
            <ToggleGroup 
              type="single" 
              value={mode} 
              onValueChange={(value) => value && onModeChange(value as "upload" | "reader")}
              className="rounded-xl border border-white/20 bg-white/5 p-1 backdrop-blur-sm"
            >
              <ToggleGroupItem 
                value="upload" 
                aria-label="Upload Mode"
                className="gap-2 rounded-lg px-4 py-2 text-white/70 transition-all data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-purple-500 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-cyan-500/50"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Upload</span>
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="reader" 
                aria-label="Reader Mode"
                className="gap-2 rounded-lg px-4 py-2 text-white/70 transition-all data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-500 data-[state=on]:to-pink-500 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-purple-500/50"
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Reader</span>
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {hasUntranslatedImages && onTranslateAll && (
                <Button
                  onClick={onTranslateAll}
                  disabled={isTranslating}
                  className="gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-6 font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/60 disabled:opacity-50"
                >
                  {isTranslating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Translating...</span>
                    </>
                  ) : (
                    <span>Translate All</span>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

