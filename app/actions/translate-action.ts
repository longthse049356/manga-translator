"use server";

import { translateMangaImage } from "@/services/gemini";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface TranslateImageResponse {
  success: boolean;
  image?: string;
  mimeType?: string;
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

