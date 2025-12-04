import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API để fetch ảnh từ MangaDex (không cần giải mã XOR)
 * Image URL format: {baseUrl}/data/{hash}/{filename}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Fetch ảnh với headers cần thiết để bypass CORS và 403
    const response = await fetch(imageUrl, {
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
      let errorMessage = `Failed to fetch image: ${response.statusText}`;

      // Xử lý các lỗi cụ thể
      if (response.status === 410) {
        errorMessage = "Image URL has expired. Please refresh or use a new URL.";
      } else if (response.status === 403) {
        errorMessage = "Access forbidden. The image URL may be invalid or restricted.";
      } else if (response.status === 404) {
        errorMessage = "Image not found. The URL may be incorrect.";
      }

      return NextResponse.json(
        {
          error: errorMessage,
          statusCode: response.status,
          statusText: response.statusText,
        },
        { status: response.status }
      );
    }

    // Nhận dữ liệu dưới dạng ArrayBuffer (MangaDex không cần giải mã)
    const arrayBuffer = await response.arrayBuffer();

    // Xác định Content-Type từ response hoặc từ URL
    const contentType =
      response.headers.get("content-type") ||
      (imageUrl.match(/\.(jpg|jpeg)$/i) ? "image/jpeg" : "image/png");

    // Trả về ảnh trực tiếp (không cần giải mã)
    const uint8Array = new Uint8Array(arrayBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": arrayBuffer.byteLength.toString(),
        "X-Source": "MangaDex",
      },
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

