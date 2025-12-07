"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { translateImageAction } from "@/app/actions/translate-action";

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  translatedImageUrl?: string;
  status: "pending" | "uploading" | "translating" | "completed" | "error";
  progress?: number;
  errorMessage?: string;
}

interface UploadImageProps {
  onImageUpload?: (images: UploadedImage[]) => void;
  onTranslate?: (image: UploadedImage) => Promise<void>;
  maxFiles?: number;
  acceptedFormats?: string;
}

export function UploadImage({
  onImageUpload,
  onTranslate,
  maxFiles = 10,
  acceptedFormats = "image/*",
}: UploadImageProps) {
  const [images, setImages] = React.useState<UploadedImage[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const idCounterRef = React.useRef(0);

  const generateId = React.useCallback(() => {
    idCounterRef.current += 1;
    return `image-${Date.now()}-${idCounterRef.current}`;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: UploadedImage[] = Array.from(files)
      .slice(0, maxFiles - images.length)
      .map((file) => ({
        id: generateId(),
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
      }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImageUpload?.(updatedImages);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTranslate = async (image: UploadedImage) => {
    const updatedImage = {
      ...image,
      status: "translating" as const,
      progress: 0,
      errorMessage: undefined,
    };
    setImages((prev) =>
      prev.map((img) => (img.id === image.id ? updatedImage : img))
    );

    try {
      // Update progress
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, progress: 25 } : img
        )
      );

      // Create FormData
      const formData = new FormData();
      formData.append("image", image.file);

      // Update progress
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, progress: 50 } : img
        )
      );

      // Call Server Action
      if (onTranslate) {
        await onTranslate(updatedImage);
      } else {
        const response = await translateImageAction(formData);

        if (!response.success) {
          throw new Error(response.error || "Failed to translate image");
        }

        if (!response.image) {
          throw new Error("Invalid response from server");
        }

        // Update progress
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, progress: 75 } : img
          )
        );

        // Convert base64 to blob URL
        const base64Image = response.image;
        const mimeType = response.mimeType || "image/png";
        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const translatedUrl = URL.createObjectURL(blob);

        // Update with translated image
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: "completed" as const,
                  progress: 100,
                  translatedImageUrl: translatedUrl,
                }
              : img
          )
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: "error" as const,
                errorMessage,
              }
            : img
        )
      );
    }
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      onImageUpload?.(updated);
      return updated;
    });
  };

  const handleDownload = (image: UploadedImage) => {
    if (!image.translatedImageUrl) return;

    const link = document.createElement("a");
    link.href = image.translatedImageUrl;
    link.download = `translated_${image.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  React.useEffect(() => {
    return () => {
      // Cleanup object URLs
      images.forEach((img) => {
        URL.revokeObjectURL(img.preview);
        if (img.translatedImageUrl) {
          URL.revokeObjectURL(img.translatedImageUrl);
        }
      });
    };
  }, [images]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          multiple
          onChange={handleFileChange}
          disabled={images.length >= maxFiles}
          className="cursor-pointer"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxFiles}
        >
          Chọn ảnh
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Original Image */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Ảnh gốc
                    </p>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                      <Image
                        src={image.preview}
                        alt={image.file.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Translated Image */}
                  {image.translatedImageUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Ảnh đã dịch
                      </p>
                      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted border-2 border-primary">
                        <Image
                          src={image.translatedImageUrl}
                          alt={`Translated ${image.file.name}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium truncate">
                      {image.file.name}
                    </p>
                    {image.status === "translating" && (
                      <div className="space-y-1">
                        <Progress value={image.progress || 0} />
                        <p className="text-xs text-muted-foreground">
                          Đang dịch...
                        </p>
                      </div>
                    )}
                    {image.status === "completed" && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        ✓ Đã dịch xong
                      </p>
                    )}
                    {image.status === "error" && (
                      <div className="space-y-1">
                        <p className="text-xs text-destructive">
                          ✗ Lỗi khi dịch
                        </p>
                        {image.errorMessage && (
                          <p className="text-xs text-destructive/80">
                            {image.errorMessage}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {image.status === "pending" && (
                        <Button
                          onClick={() => handleTranslate(image)}
                          className="flex-1 text-sm py-2"
                        >
                          Dịch
                        </Button>
                      )}
                      {image.status === "completed" &&
                        image.translatedImageUrl && (
                          <Button
                            onClick={() => handleDownload(image)}
                            className="flex-1 text-sm py-2"
                          >
                            Tải xuống
                          </Button>
                        )}
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(image.id)}
                        className="text-sm py-2"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có ảnh nào được tải lên
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Chọn ảnh để bắt đầu dịch
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

