import { ImageItem } from "@/types";
import { translateImageAction, translateImagesBatchAction } from "@/app/actions/translate-action";
import { fetchMangadexChapterAction } from "@/app/actions/mangadex-action";
import { ApiClient } from "@/lib/api-client";

export const validateFile = (file: File): string | null => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type: ${file.name}. Please select a .jpg, .png, or .webp image.`;
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return `File size exceeds 10MB: ${file.name}. Please select a smaller image.`;
  }

  return null;
};

export const generateImageId = (): string => {
  return `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateCommentId = (): string => {
  return `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export interface TranslateSingleImageResult {
  id: string;
  success: boolean;
  translatedImageUrl?: string;
  error?: string;
}

export interface TranslateBatchResult {
  results: Array<{ id: string; success: boolean; translatedImageUrl?: string; error?: string }>;
  successCount: number;
  failedCount: number;
}

export const translateSingleImage = async (
  imageItem: ImageItem,
  seriesName: string,
  isRetry: boolean = false,
  feedback?: string
): Promise<TranslateSingleImageResult> => {
  try {
    const formData = new FormData();

    if (imageItem.file) {
      formData.append("image", imageItem.file);
    } else if (imageItem.sourceUrl) {
      const proxyUrl = `/api/mangadex-proxy?url=${encodeURIComponent(imageItem.sourceUrl)}`;
      const imageBlob = await ApiClient.getBlob(proxyUrl);
      const file = new File([imageBlob.blob], imageItem.fileName, { type: imageBlob.contentType });
      formData.append("image", file);
    } else {
      throw new Error("No file or source URL available");
    }

    if (seriesName.trim()) {
      formData.append("seriesName", seriesName.trim());
    }

    if (feedback) {
      formData.append("feedback", feedback);
    }

    const response = await translateImageAction(formData);

    if (!response.success) {
      throw new Error(response.error || "Translation failed");
    }

    if (!response.image) {
      throw new Error("No translated image received from server");
    }

    const mimeType = response.mimeType || "image/png";
    const translatedDataUrl = `data:${mimeType};base64,${response.image}`;

    return {
      id: imageItem.id,
      success: true,
      translatedImageUrl: translatedDataUrl,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";

    const currentRetryCount = isRetry ? imageItem.retryCount + 1 : imageItem.retryCount;

    if (currentRetryCount === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return translateSingleImage(imageItem, seriesName, true, feedback);
    }

    return {
      id: imageItem.id,
      success: false,
      error: errorMessage,
    };
  }
};

export const fetchMangadexChapter = async (
  mangadexUrl: string
): Promise<{ imageUrls: string[]; error?: string }> => {
  if (!mangadexUrl.trim()) {
    return { imageUrls: [], error: "Please enter a MangaDex chapter URL" };
  }

  try {
    const response = await fetchMangadexChapterAction(mangadexUrl.trim());

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch chapter");
    }

    if (!response.imageUrls || response.imageUrls.length === 0) {
      throw new Error("No images found in this chapter");
    }

    return { imageUrls: response.imageUrls };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return { imageUrls: [], error: errorMessage };
  }
};

export const translateImagesBatch = async (
  imageItems: ImageItem[],
  seriesName: string,
  feedback?: string
): Promise<TranslateBatchResult> => {
  try {
    const formData = new FormData();

    // Prepare files - need to fetch from sourceUrl if needed
    const filePromises = imageItems.map(async (item, index) => {
      if (item.file) {
        return { file: item.file, index };
      } else if (item.sourceUrl) {
        const proxyUrl = `/api/mangadex-proxy?url=${encodeURIComponent(item.sourceUrl)}`;
        const imageBlob = await ApiClient.getBlob(proxyUrl);
        const file = new File([imageBlob.blob], item.fileName, { type: imageBlob.contentType });
        return { file, index };
      } else {
        throw new Error(`No file or source URL available for image ${item.id}`);
      }
    });

    const fileResults = await Promise.all(filePromises);

    // Add files to FormData
    fileResults.forEach(({ file, index }) => {
      formData.append(`image${index}`, file);
    });

    if (seriesName.trim()) {
      formData.append("seriesName", seriesName.trim());
    }

    if (feedback) {
      formData.append("feedback", feedback);
    }

    const response = await translateImagesBatchAction(formData);

    if (!response.success) {
      // If batch failed entirely, mark all as failed
      return {
        results: imageItems.map((item) => ({
          id: item.id,
          success: false,
          error: response.error || "Batch translation failed",
        })),
        successCount: 0,
        failedCount: imageItems.length,
      };
    }

    // Map results back to image items
    const results: Array<{ id: string; success: boolean; translatedImageUrl?: string; error?: string }> = [];
    let successCount = 0;
    let failedCount = 0;

    // Create error map for quick lookup
    const errorMap = new Map<number, string>();
    if (response.errors) {
      response.errors.forEach((err) => {
        errorMap.set(err.index, err.error);
      });
    }

    // Track valid image index (skipping errors)
    let validImageIndex = 0;

    imageItems.forEach((item, index) => {
      const error = errorMap.get(index);
      if (error) {
        // This image had a validation error
        results.push({
          id: item.id,
          success: false,
          error,
        });
        failedCount++;
      } else {
        // This image was valid, get its result
        const imageResult = response.images?.[validImageIndex];
        if (imageResult && imageResult.image) {
          const mimeType = imageResult.mimeType || "image/png";
          const translatedDataUrl = `data:${mimeType};base64,${imageResult.image}`;
          results.push({
            id: item.id,
            success: true,
            translatedImageUrl: translatedDataUrl,
          });
          successCount++;
          validImageIndex++;
        } else {
          results.push({
            id: item.id,
            success: false,
            error: "No translated image received from server",
          });
          failedCount++;
          validImageIndex++;
        }
      }
    });

    return {
      results,
      successCount,
      failedCount,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    
    // Mark all as failed
    return {
      results: imageItems.map((item) => ({
        id: item.id,
        success: false,
        error: errorMessage,
      })),
      successCount: 0,
      failedCount: imageItems.length,
    };
  }
};

