"use server";

import { translateMangaImage, translateMangaImagesBatch } from "@/services/gemini";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface TranslateImageResponse {
  success: boolean;
  image?: string;
  mimeType?: string;
  error?: string;
}

export interface TranslateImagesBatchResponse {
  success: boolean;
  images?: Array<{ image: string; mimeType: string }>;
  errors?: Array<{ index: number; error: string }>;
  error?: string;
}

export async function translateImageAction(
  formData: FormData
): Promise<TranslateImageResponse> {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not configured on the server",
      };
    }

    // Extract form data
    const file = formData.get("image") as File | null;
    const seriesName = (formData.get("seriesName") as string) || undefined;
    const feedback = (formData.get("feedback") as string) || undefined;

    // Validate file exists
    if (!file) {
      return {
        success: false,
        error: "No image file provided",
      };
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Translate the image
    const translatedImageBase64 = await translateMangaImage(
      file,
      seriesName,
      feedback
    );

    return {
      success: true,
      image: translatedImageBase64,
      mimeType: file.type,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unknown error occurred during translation",
    };
  }
}

export async function translateImagesBatchAction(
  formData: FormData
): Promise<TranslateImagesBatchResponse> {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not configured on the server",
      };
    }

    // Extract form data
    const seriesName = (formData.get("seriesName") as string) || undefined;
    const feedback = (formData.get("feedback") as string) || undefined;

    // Extract all image files
    const files: File[] = [];
    let index = 0;
    while (true) {
      const file = formData.get(`image${index}`) as File | null;
      if (!file) break;
      files.push(file);
      index++;
    }

    // Also check for "image" without index (backward compatibility)
    if (files.length === 0) {
      const file = formData.get("image") as File | null;
      if (file) {
        files.push(file);
      }
    }

    if (files.length === 0) {
      return {
        success: false,
        error: "No image files provided",
      };
    }

    // Validate all files
    const errors: Array<{ index: number; error: string }> = [];
    const validFiles: File[] = [];
    const fileMimeTypes: string[] = [];

    files.forEach((file, idx) => {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push({
          index: idx,
          error: `Invalid file type: ${file.name}. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push({
          index: idx,
          error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB: ${file.name}`,
        });
        return;
      }

      validFiles.push(file);
      fileMimeTypes.push(file.type);
    });

    if (validFiles.length === 0) {
      return {
        success: false,
        errors,
        error: "No valid files to translate",
      };
    }

    // Translate the images in batch
    const translatedImagesBase64 = await translateMangaImagesBatch(
      validFiles,
      seriesName,
      feedback
    );

    // Map results back to original indices
    const results: Array<{ image: string; mimeType: string }> = [];
    let validIndex = 0;
    
    for (let i = 0; i < files.length; i++) {
      const error = errors.find((e) => e.index === i);
      if (error) {
        // Skip invalid files - they're already in errors array
        continue;
      }

      if (validIndex < translatedImagesBase64.length) {
        results.push({
          image: translatedImagesBase64[validIndex],
          mimeType: fileMimeTypes[validIndex] || "image/png",
        });
        validIndex++;
      } else {
        errors.push({
          index: i,
          error: "No translated image received from server",
        });
      }
    }

    return {
      success: true,
      images: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unknown error occurred during batch translation",
    };
  }
}

