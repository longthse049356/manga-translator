"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link2, Image as ImageIcon } from "lucide-react";

interface UploadZoneProps {
  onFilesSelect: (files: FileList | File[]) => void;
  onMangadexFetch?: () => void;
  mangadexUrl?: string;
  onMangadexUrlChange?: (url: string) => void;
  loadingMangadex?: boolean;
  seriesName?: string;
  onSeriesNameChange?: (name: string) => void;
}

export function UploadZone({
  onFilesSelect,
  onMangadexFetch,
  mangadexUrl = "",
  onMangadexUrlChange,
  loadingMangadex = false,
  seriesName = "",
  onSeriesNameChange,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFilesSelect(files);
      }
    },
    [onFilesSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesSelect(files);
      }
    },
    [onFilesSelect]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Series Name Input - Optional */}
      {onSeriesNameChange && (
        <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur transition-opacity group-hover:opacity-20" />
          
          <div className="relative p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 ring-1 ring-purple-400/30">
                <ImageIcon className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Series Name (Optional)
                </h3>
                <p className="text-sm text-purple-200/60">
                  Enter series name for better translation context
                </p>
              </div>
            </div>

            <Input
              type="text"
              placeholder="e.g., One Piece, Naruto, Attack on Titan..."
              value={seriesName}
              onChange={(e) => onSeriesNameChange(e.target.value)}
              className="rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-purple-500/50"
            />
          </div>
        </div>
      )}

      {/* MangaDex Fetcher - Glass Card */}
      {onMangadexFetch && onMangadexUrlChange && (
        <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl transition-all hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 blur transition-opacity group-hover:opacity-20" />
          
          <div className="relative p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 ring-1 ring-cyan-400/30">
                <Link2 className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Fetch from MangaDex
                </h3>
                <p className="text-sm text-cyan-200/60">
                  Enter a chapter URL to import all pages
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://mangadex.org/chapter/..."
                value={mangadexUrl}
                onChange={(e) => onMangadexUrlChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loadingMangadex && mangadexUrl.trim()) {
                    onMangadexFetch();
                  }
                }}
                className="flex-1 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-cyan-500/50"
              />
              <Button
                onClick={onMangadexFetch}
                disabled={loadingMangadex || !mangadexUrl.trim()}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-6 font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/60 disabled:opacity-50"
              >
                {loadingMangadex ? "Loading..." : "Fetch"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload - Glowing Glass Panel */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/30"
      >
        {/* Animated glow on hover */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-0 blur-xl transition-opacity group-hover:opacity-30" />
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="relative px-8 py-16 text-center">
          {/* Icon with gradient */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 ring-2 ring-purple-400/30 transition-transform group-hover:scale-110 group-hover:ring-cyan-400/50">
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 p-4 shadow-2xl shadow-purple-500/50">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Text */}
          <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">
            Drop your manga images here
          </h3>
          <p className="mb-1 text-lg text-cyan-200/80">
            or click to browse files
          </p>
          <p className="text-sm text-white/50">
            Supported: .jpg, .png, .webp • Max 10MB per file
          </p>

          {/* Feature badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { icon: ImageIcon, text: "Multiple files" },
              { icon: Upload, text: "Drag & drop" },
              { icon: Link2, text: "URL import" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
              >
                <feature.icon className="h-3 w-3" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

