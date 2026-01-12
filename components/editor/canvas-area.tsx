"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useEditorStore, selectUploadedImage, selectActiveTool } from "@/stores/editor";

export function CanvasArea() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // ✅ Subscribe to store
  const uploadedImage = useEditorStore(selectUploadedImage);
  const activeTool = useEditorStore(selectActiveTool);
  const setUploadedImage = useEditorStore((state) => state.setUploadedImage);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImage(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImage(files[0]);
    }
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      console.log(`[Canvas] Image uploaded:`, file.name, activeTool);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`relative flex-1 flex items-center justify-center bg-neutral-950 overflow-auto transition-all ${
        isDragging ? "bg-neutral-900 ring-2 ring-cyan-500/50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!uploadedImage ? (
        // Upload Placeholder
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/20 ring-2 ring-cyan-500/30">
            <Upload className="h-10 w-10 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Upload or Drop Image</h3>
            <p className="mt-1 text-sm text-white/60">
              Drag & drop an image here or click to browse
            </p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Select Image
          </Button>
        </div>
      ) : (
        // Image Canvas
        <div className="relative p-8 flex items-center justify-center">
          <div className="relative bg-neutral-900 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
            <img
              src={uploadedImage}
              alt="Canvas"
              className="max-h-[80vh] max-w-[80vw] object-contain"
            />

            {/* Grid Overlay (Optional) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Upload New Image (Bottom Right) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-4 right-4 p-2 rounded-lg bg-cyan-600/80 hover:bg-cyan-600 text-white transition-colors"
            title="Upload new image"
          >
            <Upload className="h-4 w-4" />
          </button>

          {/* Debug Info */}
          <div className="absolute top-4 left-4 bg-black/50 text-xs text-white/70 px-2 py-1 rounded">
            Tool: {activeTool}
          </div>
        </div>
      )}
    </div>
  );
}
