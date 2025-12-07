import { ImageItem } from "@/types";

// Validate file
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

// Generate unique ID for each image
export const generateImageId = (): string => {
  return `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate unique ID for comments
export const generateCommentId = (): string => {
  return `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export interface TranslateSingleImageResult {
  id: string;
  success: boolean;
  translatedImageUrl?: string;
  error?: string;
}

// Translate single image with retry logic
export const translateSingleImage = async (
  imageItem: ImageItem,
  seriesName: string,
  isRetry: boolean = false,
  feedback?: string
): Promise<TranslateSingleImageResult> => {
  try {
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

    // Add series name if provided
    if (seriesName.trim()) {
      formData.append("seriesName", seriesName.trim());
    }

    // Add feedback if provided (for regeneration)
    if (feedback) {
      formData.append("feedback", feedback);
    }

    // Call API
    const response = await fetch("/api/translate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Parse and format error message
      let errorMessage = errorData.error || `Translation failed: ${response.statusText}`;

      // Handle JSON string errors (from Gemini API)
      if (typeof errorMessage === "string" && errorMessage.startsWith("{")) {
        try {
          const parsedError = JSON.parse(errorMessage);
          if (parsedError.error) {
            const geminiError = parsedError.error;
            if (geminiError.code === 503 || geminiError.status === "UNAVAILABLE") {
              errorMessage = "Model đang quá tải. Vui lòng thử lại sau vài giây.";
            } else if (geminiError.code === 429) {
              errorMessage = "Đã vượt quá giới hạn API. Vui lòng thử lại sau.";
            } else {
              errorMessage = geminiError.message || "Lỗi từ Gemini API.";
            }
          }
        } catch {
          // Keep original message if parsing fails
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.success || !data.image) {
      throw new Error("No translated image received from API");
    }

    // Convert base64 to data URL
    const mimeType = data.mimeType || "image/png";
    const translatedDataUrl = `data:${mimeType};base64,${data.image}`;

    return {
      id: imageItem.id,
      success: true,
      translatedImageUrl: translatedDataUrl,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";

    const currentRetryCount = isRetry ? imageItem.retryCount + 1 : imageItem.retryCount;

    // Auto-retry once if not already retried
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

// Fetch images from MangaDex chapter URL
export const fetchMangadexChapter = async (
  mangadexUrl: string
): Promise<{ imageUrls: string[]; error?: string }> => {
  if (!mangadexUrl.trim()) {
    return { imageUrls: [], error: "Please enter a MangaDex chapter URL" };
  }

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

    return { imageUrls: data.imageUrls };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return { imageUrls: [], error: errorMessage };
  }
};

