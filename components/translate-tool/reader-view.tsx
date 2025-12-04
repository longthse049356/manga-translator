"use client";

import { useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, EyeOff, Split, ZoomIn } from "lucide-react";

interface ImageItem {
  id: string;
  file: File | null;
  originalImageUrl: string;
  sourceUrl?: string;
  fileName: string;
  translatedImageUrl: string | null;
  loading: boolean;
  error: string | null;
  progress: number;
  retryCount: number;
}

interface ReaderViewProps {
  images: ImageItem[];
}

type ViewMode = "translated" | "original" | "compare";

export function ReaderView({ images }: ReaderViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("translated");
  const [enableZoom, setEnableZoom] = useState(false);

  // Filter only translated images
  const translatedImages = images.filter((img) => img.translatedImageUrl);

  if (translatedImages.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center backdrop-blur-xl">
          <p className="text-lg text-white/70">
            No translated images yet. Upload and translate some images first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Controls - Floating Glass Panel */}
      <div className="sticky top-24 z-40 mx-auto flex max-w-fit items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && setViewMode(value as ViewMode)}
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
            className="gap-2 rounded-xl px-4 py-2 text-white/70 transition-all data-[state=on]:bg-gradient-to-r data-[state=on]:from-orange-500 data-[state=on]:to-pink-500 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-orange-500/50"
          >
            <Split className="h-4 w-4" />
            <span className="text-sm font-medium">Compare</span>
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Zoom toggle for mobile */}
        <div className="h-6 w-px bg-white/20" />
        <button
          onClick={() => setEnableZoom(!enableZoom)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            enableZoom
              ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50"
              : "text-white/70 hover:bg-white/10"
          }`}
          aria-label="Toggle zoom"
        >
          <ZoomIn className="h-4 w-4" />
          Zoom {enableZoom ? "On" : "Off"}
        </button>
      </div>

      {/* Images Container - Gapless vertical scrolling */}
      <div className="mx-auto max-w-3xl space-y-0">
        {translatedImages.map((image, index) => (
          <div key={image.id} className="relative">
            {/* Page number indicator */}
            <div className="absolute left-4 top-4 z-10 rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              Page {index + 1} / {translatedImages.length}
            </div>

            {/* Image display based on view mode */}
            {viewMode === "compare" ? (
              <div className="overflow-hidden bg-neutral-950">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={image.originalImageUrl}
                      alt={`Original ${image.fileName}`}
                      style={{ objectFit: "contain" }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={image.translatedImageUrl!}
                      alt={`Translated ${image.fileName}`}
                      style={{ objectFit: "contain" }}
                    />
                  }
                  position={50}
                  className="w-full"
                />
              </div>
            ) : enableZoom ? (
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                doubleClick={{ mode: "toggle" }}
              >
                <TransformComponent wrapperClass="!w-full" contentClass="!w-full">
                  <img
                    src={
                      viewMode === "translated"
                        ? image.translatedImageUrl!
                        : image.originalImageUrl
                    }
                    alt={`${viewMode === "translated" ? "Translated" : "Original"} ${image.fileName}`}
                    className="w-full"
                    loading="lazy"
                  />
                </TransformComponent>
              </TransformWrapper>
            ) : (
              <img
                src={
                  viewMode === "translated"
                    ? image.translatedImageUrl!
                    : image.originalImageUrl
                }
                alt={`${viewMode === "translated" ? "Translated" : "Original"} ${image.fileName}`}
                className="w-full"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {/* End indicator */}
      <div className="mx-auto max-w-fit rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-center backdrop-blur-xl">
        <p className="text-sm font-medium text-white/70">
          End of chapter • {translatedImages.length} pages
        </p>
      </div>
    </div>
  );
}

