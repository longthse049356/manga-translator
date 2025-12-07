"use client";

import {
  GradientBackground,
  ReaderHeader,
  UploadZone,
  ImageGrid,
  ReaderView,
} from "@/components/translate-tool";
import { useTranslateStore } from "@/components/translate-tool/store";
import { ImageItem } from "@/types";

export default function TranslateToolPage() {
  const mode = useTranslateStore((state) => state.mode);
  const images = useTranslateStore((state) => state.images);
  const globalError = useTranslateStore((state) => state.globalError);
  const mangadexUrl = useTranslateStore((state) => state.mangadexUrl);
  const loadingMangadex = useTranslateStore((state) => state.loadingMangadex);
  const seriesName = useTranslateStore((state) => state.seriesName);

  const addFilesToImages = useTranslateStore((state) => state.addFilesToImages);
  const setMangadexUrl = useTranslateStore((state) => state.setMangadexUrl);
  const setSeriesName = useTranslateStore((state) => state.setSeriesName);
  const fetchMangadexImages = useTranslateStore((state) => state.fetchMangadexImages);
  const removeImage = useTranslateStore((state) => state.removeImage);
  const translateImages = useTranslateStore((state) => state.translateImages);

  const handleFilesSelect = (files: FileList | File[]) => {
    addFilesToImages(files);
  };

  const handleMangadexUrlChange = (url: string) => {
    setMangadexUrl(url);
  };

  const handleFetchMangadex = async () => {
    await fetchMangadexImages();
  };

  const handleRemoveImage = (id: string) => {
    removeImage(id);
  };

  const handleRetry = async (image: ImageItem) => {
    await translateImages([image.id]);
  };

  const handleDownload = (image: ImageItem) => {
    if (!image.translatedImageUrl) return;

    const link = document.createElement("a");
    link.href = image.translatedImageUrl;
    link.download = `translated-${image.fileName}`;
    link.click();
  };

  return (
    <>
      {/* Aurora Gradient Background */}
      <GradientBackground />

      {/* Main Content */}
      <div className="relative min-h-screen">
        {/* Header */}
        <ReaderHeader />

        {/* Content Container */}
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Global Error Display */}
          {globalError && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-4 backdrop-blur-xl">
                <p className="whitespace-pre-line text-sm font-medium text-red-200">
                  {globalError}
                </p>
              </div>
            </div>
          )}

          {/* Mode-based Content */}
          {mode === "upload" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Upload Zone */}
              <UploadZone
                onFilesSelect={handleFilesSelect}
                onMangadexFetch={handleFetchMangadex}
                mangadexUrl={mangadexUrl}
                onMangadexUrlChange={handleMangadexUrlChange}
                loadingMangadex={loadingMangadex}
                seriesName={seriesName}
                onSeriesNameChange={setSeriesName}
              />

              {/* Image Grid */}
              {images.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                  <ImageGrid
                    images={images}
                    onRemoveImage={handleRemoveImage}
                    onRetry={handleRetry}
                    onDownload={handleDownload}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ReaderView />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
