"use client";

import { useState, useCallback, useEffect } from "react";
import {
  GradientBackground,
  ReaderHeader,
  UploadZone,
  ImageGrid,
  ReaderView,
} from "@/components/translate-tool";

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

export default function TranslateToolPage() {
  const [mode, setMode] = useState<"upload" | "reader">("upload");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [mangadexUrl, setMangadexUrl] = useState<string>("");
  const [loadingMangadex, setLoadingMangadex] = useState(false);

  // Generate unique ID for each image
  const generateId = useCallback(() => {
    return `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type: ${file.name}. Please select a .jpg, .png, or .webp image.`;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `File size exceeds 10MB: ${file.name}. Please select a smaller image.`;
    }

    return null;
  }, []);

  // Handle file selection (multiple files)
  const handleFilesSelect = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newImages: ImageItem[] = [];
      const errors: string[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
          return;
        }

        const id = generateId();
        const originalImageUrl = URL.createObjectURL(file);

        newImages.push({
          id,
          file,
          originalImageUrl,
          fileName: file.name,
          translatedImageUrl: null,
          loading: false,
          error: null,
          progress: 0,
          retryCount: 0,
        });
      });

      if (errors.length > 0) {
        setGlobalError(errors.join("\n"));
      } else {
        setGlobalError(null);
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
      }
    },
    [validateFile, generateId]
  );

  // Translate single image with retry logic
  const translateSingleImage = useCallback(
    async (
      imageItem: ImageItem,
      isRetry: boolean = false
    ): Promise<{
      id: string;
      success: boolean;
      translatedImageUrl?: string;
      error?: string;
    }> => {
      // Update loading state
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageItem.id
            ? {
                ...img,
                loading: true,
                error: null,
                progress: 0,
                retryCount: isRetry ? img.retryCount + 1 : img.retryCount,
              }
            : img
        )
      );

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageItem.id
                ? {
                    ...img,
                    progress: Math.min(img.progress + 10, 90),
                  }
                : img
            )
          );
        }, 200);

        // Prepare FormData
        const formData = new FormData();

        // Nếu có file, dùng file. Nếu không, fetch từ URL
        if (imageItem.file) {
          formData.append("image", imageItem.file);
        } else if (imageItem.sourceUrl) {
          // Fetch ảnh từ MangaDex proxy và convert thành File
          const proxyUrl = `/api/mangadex-proxy?url=${encodeURIComponent(imageItem.sourceUrl)}`;
          const imageResponse = await fetch(proxyUrl);
          if (!imageResponse.ok) {
            throw new Error("Failed to fetch image from MangaDex");
          }
          const blob = await imageResponse.blob();
          const file = new File([blob], imageItem.fileName, { type: blob.type });
          formData.append("image", file);
        } else {
          throw new Error("No file or source URL available");
        }

        // Call API
        const response = await fetch("/api/translate", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Translation failed: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.success || !data.image) {
          throw new Error("No translated image received from API");
        }

        // Convert base64 to data URL
        const mimeType = data.mimeType || "image/png";
        const translatedDataUrl = `data:${mimeType};base64,${data.image}`;

        // Update success state
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageItem.id
              ? {
                  ...img,
                  loading: false,
                  translatedImageUrl: translatedDataUrl,
                  progress: 100,
                  retryCount: 0,
                }
              : img
          )
        );

        return {
          id: imageItem.id,
          success: true,
          translatedImageUrl: translatedDataUrl,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";

        const currentRetryCount = isRetry
          ? imageItem.retryCount + 1
          : imageItem.retryCount;

        // Auto-retry once if not already retried
        if (currentRetryCount === 0) {
          console.log(`Auto-retrying translation for ${imageItem.fileName}...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return translateSingleImage(imageItem, true);
        }

        // Update error state
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageItem.id
              ? {
                  ...img,
                  loading: false,
                  error: errorMessage,
                  progress: 0,
                }
              : img
          )
        );

        return {
          id: imageItem.id,
          success: false,
          error: errorMessage,
        };
      }
    },
    []
  );

  // Handle translate all images with concurrency limit
  const handleTranslateAll = useCallback(async () => {
    const imagesToTranslate = images.filter(
      (img) => !img.translatedImageUrl && !img.loading
    );

    if (imagesToTranslate.length === 0) {
      setGlobalError("No images to translate.");
      return;
    }

    setGlobalError(null);

    const MAX_CONCURRENT = 10;
    const queue: ImageItem[] = [...imagesToTranslate];
    const results: Array<{ success: boolean; id: string }> = [];
    const activePromises: Map<
      string,
      Promise<{
        id: string;
        success: boolean;
        translatedImageUrl?: string;
        error?: string;
      }>
    > = new Map();

    // Process queue with concurrency limit
    while (queue.length > 0 || activePromises.size > 0) {
      while (activePromises.size < MAX_CONCURRENT && queue.length > 0) {
        const imageItem = queue.shift();
        if (!imageItem) break;

        const promise = translateSingleImage(imageItem)
          .then((result) => {
            results.push({
              success: result.success,
              id: result.id,
            });
            return result;
          })
          .catch((error) => {
            console.error(`Translation failed for ${imageItem.fileName}:`, error);
            results.push({
              success: false,
              id: imageItem.id,
            });
            return {
              id: imageItem.id,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            };
          })
          .finally(() => {
            activePromises.delete(imageItem.id);
          });

        activePromises.set(imageItem.id, promise);
      }

      if (
        activePromises.size >= MAX_CONCURRENT ||
        (queue.length === 0 && activePromises.size > 0)
      ) {
        await Promise.race(Array.from(activePromises.values()));
      } else if (queue.length === 0 && activePromises.size === 0) {
        break;
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(
      `Translation completed: ${successful} successful, ${failed} failed`
    );
  }, [images, translateSingleImage]);

  // Remove image
  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.originalImageUrl);
        if (imageToRemove.translatedImageUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(imageToRemove.translatedImageUrl);
        }
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  // Download translated image
  const handleDownload = useCallback((imageItem: ImageItem) => {
    if (!imageItem.translatedImageUrl) return;

    const link = document.createElement("a");
    link.href = imageItem.translatedImageUrl;
    link.download = `translated-${imageItem.fileName}`;
    link.click();
  }, []);

  // Handle retry for a single image
  const handleRetry = useCallback(
    async (imageItem: ImageItem) => {
      await translateSingleImage(imageItem, true);
    },
    [translateSingleImage]
  );

  // Handle fetch images from MangaDex chapter URL
  const handleFetchMangadex = useCallback(async () => {
    if (!mangadexUrl.trim()) {
      setGlobalError("Please enter a MangaDex chapter URL");
      return;
    }

    setLoadingMangadex(true);
    setGlobalError(null);

    try {
      const response = await fetch(
        `/api/mangadex-chapter?url=${encodeURIComponent(mangadexUrl.trim())}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch chapter: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success || !data.imageUrls || data.imageUrls.length === 0) {
        throw new Error("No images found in this chapter");
      }

      const newImages: ImageItem[] = data.imageUrls.map(
        (imageUrl: string, index: number) => {
          const id = generateId();
          const fileName =
            imageUrl.split("/").pop() || `mangadex-${index + 1}.jpg`;
          const proxyUrl = `/api/mangadex-proxy?url=${encodeURIComponent(imageUrl)}`;

          return {
            id,
            file: null,
            originalImageUrl: proxyUrl,
            sourceUrl: imageUrl,
            fileName,
            translatedImageUrl: null,
            loading: false,
            error: null,
            progress: 0,
            retryCount: 0,
          };
        }
      );

      setImages((prev) => [...prev, ...newImages]);
      setMangadexUrl("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setGlobalError(errorMessage);
    } finally {
      setLoadingMangadex(false);
    }
  }, [mangadexUrl, generateId]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.originalImageUrl);
        if (img.translatedImageUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(img.translatedImageUrl);
        }
      });
    };
  }, [images]);

  const hasUntranslatedImages = images.some(
    (img) => !img.translatedImageUrl && !img.loading
  );
  const isTranslating = images.some((img) => img.loading);

  return (
    <>
      {/* Aurora Gradient Background */}
      <GradientBackground />

      {/* Main Content */}
      <div className="relative min-h-screen">
        {/* Header */}
        <ReaderHeader
          mode={mode}
          onModeChange={setMode}
          onTranslateAll={handleTranslateAll}
          isTranslating={isTranslating}
          hasUntranslatedImages={hasUntranslatedImages}
        />

        {/* Content Container */}
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Global Error Display */}
          {globalError && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 backdrop-blur-xl">
                <p className="whitespace-pre-line text-sm font-medium text-red-200">
                  {globalError}
                </p>
              </div>
            </div>
          )}

          {/* Mode-based Content */}
          {mode === "upload" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Upload Zone */}
              <UploadZone
                onFilesSelect={handleFilesSelect}
                onMangadexFetch={handleFetchMangadex}
                mangadexUrl={mangadexUrl}
                onMangadexUrlChange={setMangadexUrl}
                loadingMangadex={loadingMangadex}
              />

              {/* Image Grid */}
              {images.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                  <ImageGrid
                    images={images}
                    onRemoveImage={handleRemoveImage}
                    onRetry={handleRetry}
                    onDownload={handleDownload}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ReaderView images={images} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
