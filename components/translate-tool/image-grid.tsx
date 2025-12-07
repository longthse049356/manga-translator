"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Download, Trash2, RotateCw } from "lucide-react";

interface ImageComment {
  id: string;
  x: number;
  y: number;
  text: string;
  number: number;
}

interface ImageItem {
  id: string;
  file: File | null;
  originalImageUrl: string;
  sourceUrl?: string;
  fileName: string;
  translatedImageUrl: string | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  comments: ImageComment[];
}

interface ImageGridProps {
  images: ImageItem[];
  onRemoveImage: (id: string) => void;
  onRetry: (image: ImageItem) => void;
  onDownload: (image: ImageItem) => void;
}

export function ImageGrid({
  images,
  onRemoveImage,
  onRetry,
  onDownload,
}: ImageGridProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <div className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Your Images
            </h3>
            <p className="text-sm text-cyan-200/60">
              {images.filter((img) => img.translatedImageUrl).length} of{" "}
              {images.length} translated
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {images.filter((img) => img.translatedImageUrl).length}
              </div>
              <div className="text-xs text-white/50">Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {images.filter((img) => img.loading).length}
              </div>
              <div className="text-xs text-white/50">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {images.filter((img) => img.error).length}
              </div>
              <div className="text-xs text-white/50">Failed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Status indicator at top */}
            <div className="absolute right-2 top-2 z-10">
              {image.loading ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                </div>
              ) : image.translatedImageUrl ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </div>
              ) : image.error ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 backdrop-blur-sm">
                  <XCircle className="h-4 w-4 text-red-400" />
                </div>
              ) : null}
            </div>

            {/* Image Preview */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
              <Image
                src={image.originalImageUrl}
                alt={image.fileName}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {image.loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                    <p className="mt-2 text-sm text-white">
                      Translating...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-3">
              <p className="mb-2 truncate text-sm font-medium text-white">
                {image.fileName}
              </p>

              {/* Error Message */}
              {image.error && (
                <div className="mb-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                    <p className="text-xs text-red-200 leading-relaxed">
                      {image.error}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {image.translatedImageUrl && (
                  <Button
                    size="sm"
                    onClick={() => onDownload(image)}
                    className="flex-1 gap-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                )}
                {image.error && (
                  <Button
                    size="sm"
                    onClick={() => onRetry(image)}
                    disabled={image.loading}
                    className="flex-1 gap-1 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
                  >
                    <RotateCw className="h-3 w-3" />
                    Retry
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveImage(image.id)}
                  className="gap-1 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

