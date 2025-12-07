// Common types for the application
// Add your shared types here

export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TranslateImageResponse {
  success: boolean;
  image?: string; // Base64 encoded image
  mimeType?: string;
  error?: string;
}

// Image types for translate tool
export interface ImageComment {
  id: string;
  x: number; // % position from left
  y: number; // % position from top
  text: string;
  number: number; // Display number (1, 2, 3...)
}

export interface ImageItem {
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

