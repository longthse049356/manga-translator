import { NextRequest, NextResponse } from "next/server";

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

    // Fetch image from external URL
    const response = await fetch(imageUrl, {
      headers: {
        accept: "*/*",
        "accept-language": "vi,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        origin: "https://mangaplus.shueisha.co.jp",
        referer: "https://mangaplus.shueisha.co.jp/",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get content type from original response
    const contentType = response.headers.get("content-type") || "image/jpeg";
    console.log("Original Content-Type:", contentType);

    // Get image as arrayBuffer directly (more reliable)
    const arrayBuffer = await response.arrayBuffer();
    console.log("ArrayBuffer size:", arrayBuffer.byteLength);

    // Verify it's an image by content type
    if (!contentType.startsWith("image/")) {
      console.error("Response is not an image. Content-Type:", contentType);
      return NextResponse.json(
        { error: `Invalid image format. Expected image/*, got ${contentType}` },
        { status: 400 }
      );
    }

    // Convert to buffer
    const buffer = Buffer.from(arrayBuffer);

    // Return image with proper content type and headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Content-Length": buffer.length.toString(),
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Fetch image error:", error);
    
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

