import { NextRequest, NextResponse } from "next/server";

/**
 * API để lấy danh sách ảnh từ MangaDex chapter URL
 * Input: MangaDex chapter URL (ví dụ: https://mangadex.org/chapter/5364d445-4774-4af7-8f88-a2d99d66465b/2)
 * Output: Danh sách URLs của các ảnh trong chapter
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterUrl = searchParams.get("url");

    if (!chapterUrl) {
      return NextResponse.json(
        { error: "Chapter URL is required" },
        { status: 400 }
      );
    }

    // Extract chapter ID từ URL
    // Format: https://mangadex.org/chapter/{chapterId}/{page}
    const chapterIdMatch = chapterUrl.match(/\/chapter\/([a-f0-9-]+)/i);
    if (!chapterIdMatch || !chapterIdMatch[1]) {
      return NextResponse.json(
        { error: "Invalid MangaDex chapter URL format" },
        { status: 400 }
      );
    }

    const chapterId = chapterIdMatch[1];

    // Call MangaDex API để lấy thông tin chapter
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
      return NextResponse.json(
        {
          error: `Failed to fetch chapter info: ${response.statusText}`,
          statusCode: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.result !== "ok" || !data.chapter) {
      return NextResponse.json(
        { error: "Invalid response from MangaDex API" },
        { status: 500 }
      );
    }

    const { baseUrl, chapter } = data;
    const { hash, data: imageFiles } = chapter;

    if (!baseUrl || !hash || !imageFiles || !Array.isArray(imageFiles)) {
      return NextResponse.json(
        { error: "Invalid chapter data structure" },
        { status: 500 }
      );
    }

    // Tạo danh sách URLs cho các ảnh
    // Format: {baseUrl}/data/{hash}/{filename}
    const imageUrls = imageFiles.map(
      (filename: string) => `${baseUrl}/data/${hash}/${filename}`
    );

    return NextResponse.json({
      success: true,
      chapterId,
      baseUrl,
      hash,
      imageCount: imageUrls.length,
      imageUrls,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

