import { ImageItem } from "@/types";
import { translateImageAction } from "@/app/actions/translate-action";
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

