"use server";

export interface FetchMangadexChapterResponse {
  success: boolean;
  chapterId?: string;
  baseUrl?: string;
  hash?: string;
  imageCount?: number;
  imageUrls?: string[];
  error?: string;
}

export async function fetchMangadexChapterAction(
  chapterUrl: string
): Promise<FetchMangadexChapterResponse> {
  try {
    // Validate URL is provided
    if (!chapterUrl?.trim()) {
      return {
        success: false,
        error: "Chapter URL is required",
      };
    }

    // Extract chapter ID from URL
    // Format: https://mangadex.org/chapter/{chapterId}/{page}
    const chapterIdMatch = chapterUrl.match(/\/chapter\/([a-f0-9-]+)/i);
    if (!chapterIdMatch || !chapterIdMatch[1]) {
      return {
        success: false,
        error: "Invalid MangaDex chapter URL format",
      };
    }

    const chapterId = chapterIdMatch[1];

    // Call MangaDex API to fetch chapter info
    const apiUrl = `https://api.mangadex.org/at-home/server/${chapterId}?forcePort443=false`;

    const response = await fetch(apiUrl, {
      headers: {
        accept: "*/*",
        "accept-language": "vi,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        origin: "https://mangadex.org",
        pragma: "no-cache",
        referer: "https://mangadex.org/",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch chapter info: ${response.statusText}`,
      };
    }

    const data = await response.json();

    // Validate response structure
    if (data.result !== "ok" || !data.chapter) {
      return {
        success: false,
        error: "Invalid response from MangaDex API",
      };
    }

    const { baseUrl, chapter } = data;
    const { hash, data: imageFiles } = chapter;

    // Validate chapter data
    if (!baseUrl || !hash || !imageFiles || !Array.isArray(imageFiles)) {
      return {
        success: false,
        error: "Invalid chapter data structure from MangaDex",
      };
    }

    // Build image URLs
    const imageUrls = imageFiles.map(
      (filename: string) => `${baseUrl}/data/${hash}/${filename}`
    );

    return {
      success: true,
      chapterId,
      baseUrl,
      hash,
      imageCount: imageUrls.length,
      imageUrls,
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
      error: "An unknown error occurred while fetching chapter",
    };
  }
}

