// Common types for the application

// Image types for translation tool
export interface ImageComment {
  id: string;
  x: number;
  y: number;
  text: string;
  number: number;
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

