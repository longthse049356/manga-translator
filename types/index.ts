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

