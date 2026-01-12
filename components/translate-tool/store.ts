import { create } from "zustand";
import { ImageItem } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";
import {
  validateFile,
  generateImageId,
  generateCommentId,
  translateSingleImage,
  translateImagesBatch,
  fetchMangadexChapter,
} from "@/services/translate";

export type ViewMode = "translated" | "original" | "compare";

interface TranslateStore {
  // State
  images: ImageItem[];
  mode: "upload" | "reader";
  viewMode: ViewMode;
  isFeedbackMode: boolean;
  globalError: string | null;
  mangadexUrl: string;
  loadingMangadex: boolean;
  seriesName: string;

  // Image actions
  setImages: (images: ImageItem[]) => void;
  addImages: (images: ImageItem[]) => void;
  updateImage: (id: string, updates: Partial<ImageItem>) => void;
  removeImage: (id: string) => void;
  reorderImages: (oldIndex: number, newIndex: number) => void;
  sortImagesByName: () => void;

  // UI state actions
  setMode: (mode: "upload" | "reader") => void;
  setViewMode: (viewMode: ViewMode) => void;
  setIsFeedbackMode: (isFeedbackMode: boolean) => void;
  setGlobalError: (error: string | null) => void;

  // MangaDex actions
  setMangadexUrl: (url: string) => void;
  setLoadingMangadex: (loading: boolean) => void;

  // Series name
  setSeriesName: (name: string) => void;

  // Complex actions
  addFilesToImages: (files: FileList | File[]) => void;
  translateImages: (
    imageIds: string[]
  ) => Promise<{ success: number; failed: number }>;
  fetchMangadexImages: () => Promise<void>;
  addCommentToImage: (imageId: string, x: number, y: number) => void;
  updateComment: (imageId: string, commentId: string, text: string) => void;
  deleteComment: (imageId: string, commentId: string) => void;
  regenerateWithFeedback: (imageId: string) => Promise<void>;

  // Derived state
  translatedImagesCount: () => number;
  hasUntranslatedImages: () => boolean;
  isTranslating: () => boolean;
  hasTranslatedImages: () => boolean;
}

export const useTranslateStore = create<TranslateStore>((set, get) => ({
  // Initial state
  images: [],
  mode: "upload",
  viewMode: "translated",
  isFeedbackMode: false,
  globalError: null,
  mangadexUrl: "",
  loadingMangadex: false,
  seriesName: "",

  // Image actions
  setImages: (images) => set({ images }),
  addImages: (newImages) =>
    set((state) => ({ images: [...state.images, ...newImages] })),
  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((img) => (img.id === id ? { ...img, ...updates } : img)),
    })),
  removeImage: (id) =>
    set((state) => {
      const imageToRemove = state.images.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.originalImageUrl);
        if (imageToRemove.translatedImageUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(imageToRemove.translatedImageUrl);
        }
      }
      return { images: state.images.filter((img) => img.id !== id) };
    }),

  reorderImages: (oldIndex, newIndex) =>
    set((state) => ({
      images: arrayMove(state.images, oldIndex, newIndex),
    })),

  sortImagesByName: () =>
    set((state) => ({
      images: [...state.images].sort((a, b) =>
        a.fileName.localeCompare(b.fileName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      ),
    })),

  // UI state actions
  setMode: (mode) => set({ mode }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsFeedbackMode: (isFeedbackMode) => set({ isFeedbackMode }),
  setGlobalError: (error) => set({ globalError: error }),

  // MangaDex actions
  setMangadexUrl: (url) => set({ mangadexUrl: url }),
  setLoadingMangadex: (loading) => set({ loadingMangadex: loading }),

  // Series name
  setSeriesName: (name) => set({ seriesName: name }),

  // Complex actions
  addFilesToImages: (files) => {
    const fileArray = Array.from(files);
    const newImages: ImageItem[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
        return;
      }

      const id = generateImageId();
      const originalImageUrl = URL.createObjectURL(file);

      newImages.push({
        id,
        file,
        originalImageUrl,
        fileName: file.name,
        translatedImageUrl: null,
        loading: false,
        error: null,
        retryCount: 0,
        comments: [],
      });
    });

    set((state) => ({
      globalError: errors.length > 0 ? errors.join("\n") : null,
      images: [...state.images, ...newImages],
    }));
  },

  translateImages: async (imageIds) => {
    const { images, seriesName } = get();
    const BATCH_SIZE = 5;
    const MAX_CONCURRENT_BATCHES = 2;

    // Filter and sort images to translate (maintain current order)
    const imagesToTranslate = images
      .filter((img) => imageIds.includes(img.id) && !img.translatedImageUrl && !img.loading)
      .sort((a, b) => {
        // Maintain the order they appear in the images array
        const indexA = images.findIndex((img) => img.id === a.id);
        const indexB = images.findIndex((img) => img.id === b.id);
        return indexA - indexB;
      });

    if (imagesToTranslate.length === 0) {
      set({ globalError: "No images to translate." });
      return { success: 0, failed: 0 };
    }

    set({ globalError: null });

    // Group images into batches of BATCH_SIZE
    const batches: ImageItem[][] = [];
    for (let i = 0; i < imagesToTranslate.length; i += BATCH_SIZE) {
      batches.push(imagesToTranslate.slice(i, i + BATCH_SIZE));
    }

    // Set all images to loading
    set((state) => ({
      images: state.images.map((img) =>
        imageIds.includes(img.id) && !img.translatedImageUrl && !img.loading
          ? ({ ...img, loading: true, error: null } as ImageItem)
          : img
      ),
    }));

    let successCount = 0;
    let failedCount = 0;
    const activeBatchPromises: Map<number, Promise<void>> = new Map();
    let batchIndex = 0;

    // Process batches with concurrency limit
    while (batchIndex < batches.length || activeBatchPromises.size > 0) {
      // Start new batches up to MAX_CONCURRENT_BATCHES
      while (activeBatchPromises.size < MAX_CONCURRENT_BATCHES && batchIndex < batches.length) {
        const currentBatch = batches[batchIndex];
        const currentBatchIndex = batchIndex;
        batchIndex++;

        const batchPromise = translateImagesBatch(currentBatch, seriesName)
          .then((batchResult) => {
            // Update state for each result in the batch
            batchResult.results.forEach((result) => {
              if (result.success) {
                successCount++;
                set((state) => ({
                  images: state.images.map((img) =>
                    img.id === result.id
                      ? ({
                          ...img,
                          loading: false,
                          translatedImageUrl: result.translatedImageUrl,
                          retryCount: 0,
                        } as ImageItem)
                      : img
                  ),
                }));
              } else {
                failedCount++;
                set((state) => ({
                  images: state.images.map((img) =>
                    img.id === result.id
                      ? ({
                          ...img,
                          loading: false,
                          error: result.error || "Translation failed",
                        } as ImageItem)
                      : img
                  ),
                }));
              }
            });
          })
          .catch((error) => {
            // Mark all images in this batch as failed
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            currentBatch.forEach((imageItem) => {
              failedCount++;
              set((state) => ({
                images: state.images.map((img) =>
                  img.id === imageItem.id
                    ? ({ ...img, loading: false, error: errorMessage } as ImageItem)
                    : img
                ),
              }));
            });
          })
          .finally(() => {
            activeBatchPromises.delete(currentBatchIndex);
          });

        activeBatchPromises.set(currentBatchIndex, batchPromise);
      }

      // Wait for at least one batch to complete before starting more
      if (
        activeBatchPromises.size >= MAX_CONCURRENT_BATCHES ||
        (batchIndex >= batches.length && activeBatchPromises.size > 0)
      ) {
        await Promise.race(Array.from(activeBatchPromises.values()));
      } else if (batchIndex >= batches.length && activeBatchPromises.size === 0) {
        break;
      }
    }

    return { success: successCount, failed: failedCount };
  },

  fetchMangadexImages: async () => {
    const { mangadexUrl } = get();

    set({ loadingMangadex: true, globalError: null });

    try {
      const result = await fetchMangadexChapter(mangadexUrl);

      if (result.error) {
        set({ globalError: result.error, loadingMangadex: false });
        return;
      }

      const newImages: ImageItem[] = result.imageUrls.map(
        (imageUrl: string, index: number) => {
          const id = generateImageId();
          const fileName = imageUrl.split("/").pop() || `mangadex-${index + 1}.jpg`;
          // Use API proxy route to fetch images (binary response)
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
            retryCount: 0,
            comments: [],
          };
        }
      );

      set((state) => ({
        images: [...state.images, ...newImages],
        mangadexUrl: "",
        loadingMangadex: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      set({ globalError: errorMessage, loadingMangadex: false });
    }
  },

  addCommentToImage: (imageId, x, y) => {
    set((state) => ({
      images: state.images.map((img) => {
        if (img.id === imageId) {
          const newComment = {
            id: generateCommentId(),
            x,
            y,
            text: "",
            number: img.comments.length + 1,
          };
          return {
            ...img,
            comments: [...img.comments, newComment],
          };
        }
        return img;
      }),
    }));
  },

  updateComment: (imageId, commentId, text) => {
    set((state) => ({
      images: state.images.map((img) => {
        if (img.id === imageId) {
          return {
            ...img,
            comments: img.comments.map((comment) =>
              comment.id === commentId ? { ...comment, text } : comment
            ),
          };
        }
        return img;
      }),
    }));
  },

  deleteComment: (imageId, commentId) => {
    set((state) => ({
      images: state.images.map((img) => {
        if (img.id === imageId) {
          const updatedComments = img.comments
            .filter((comment) => comment.id !== commentId)
            .map((comment, index) => ({
              ...comment,
              number: index + 1,
            }));
          return {
            ...img,
            comments: updatedComments,
          };
        }
        return img;
      }),
    }));
  },

  regenerateWithFeedback: async (imageId) => {
    const { images, seriesName } = get();
    const imageItem = images.find((img) => img.id === imageId);

    if (!imageItem || imageItem.comments.length === 0) {
      return;
    }

    // Construct feedback string from comments
    const feedback = imageItem.comments
      .filter((c) => c.text.trim())
      .map((c, idx) => `${idx + 1}. ${c.text}`)
      .join("\n");

    if (!feedback) {
      set({ globalError: "Please add feedback text to comments before regenerating." });
      return;
    }

    // Clear comments after starting regeneration
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, comments: [] } : img
      ),
    }));

    // Update loading state
    set((state) => ({
      images: state.images.map((img) =>
        img.id === imageId ? { ...img, loading: true, error: null } : img
      ),
    }));

    // Call translation with feedback
    const result = await translateSingleImage(imageItem, seriesName, false, feedback);

    if (result.success) {
      set((state) => ({
        images: state.images.map((img) =>
          img.id === result.id
            ? ({
                ...img,
                loading: false,
                translatedImageUrl: result.translatedImageUrl,
                retryCount: 0,
              } as ImageItem)
            : img
        ),
      }));
    } else {
      set((state) => ({
        images: state.images.map((img) =>
          img.id === result.id
            ? ({
                ...img,
                loading: false,
                error: result.error || "Regeneration failed",
              } as ImageItem)
            : img
        ),
      }));
    }
  },

  // Derived state
  translatedImagesCount: () => {
    return get().images.filter((img) => img.translatedImageUrl).length;
  },

  hasUntranslatedImages: () => {
    return get().images.some((img) => !img.translatedImageUrl && !img.loading);
  },

  isTranslating: () => {
    return get().images.some((img) => img.loading);
  },

  hasTranslatedImages: () => {
    return get().images.some((img) => img.translatedImageUrl);
  },
}));

