"use client";

import { memo } from "react";
import Image from "next/image";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { ImageCommentOverlay } from "./image-comment-overlay";
import { ViewModeControls } from "./view-mode-controls";
import { useTranslateStore } from "./store";

export const ReaderView = memo(function ReaderView() {
  const images = useTranslateStore((state) => state.images);
  const viewMode = useTranslateStore((state) => state.viewMode);
  const isFeedbackMode = useTranslateStore((state) => state.isFeedbackMode);
  const onAddComment = useTranslateStore((state) => state.addCommentToImage);
  const onSaveComment = useTranslateStore((state) => state.updateComment);
  const onDeleteComment = useTranslateStore((state) => state.deleteComment);
  const onRegenerateWithFeedback = useTranslateStore(
    (state) => state.regenerateWithFeedback
  );

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
      <ViewModeControls />

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
            ) : viewMode === "translated" ? (
              <div className="relative">
                <ImageCommentOverlay
                  imageUrl={image.translatedImageUrl!}
                  alt={`Translated ${image.fileName}`}
                  comments={image.comments}
                  isFeedbackMode={isFeedbackMode}
                  onAddComment={(x, y) => onAddComment(image.id, x, y)}
                  onSaveComment={(commentId, text) =>
                    onSaveComment(image.id, commentId, text)
                  }
                  onDeleteComment={(commentId) =>
                    onDeleteComment(image.id, commentId)
                  }
                />
                {/* Regenerate Button */}
                {image.comments.length > 0 && (
                  <div className="absolute bottom-4 right-4 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Button
                      onClick={() => onRegenerateWithFeedback(image.id)}
                      className="gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 font-semibold text-white shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/40"
                    >
                      <RotateCw className="h-4 w-4" />
                      Regenerate with {image.comments.length} Fix
                      {image.comments.length > 1 ? "es" : ""}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full">
                <Image
                  src={image.originalImageUrl}
                  alt={`Original ${image.fileName}`}
                  width={800}
                  height={1200}
                  className="w-full h-auto"
                  unoptimized
                  priority={index < 3}
                />
              </div>
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
});

