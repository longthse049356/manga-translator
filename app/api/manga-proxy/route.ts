import { NextRequest, NextResponse } from "next/server";

function hex2Bin(hex: string): Buffer {
  const cleanHex = hex.replace(/\s+/g, "");
  
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Hex string must have even length");
  }
  
  const bytes: number[] = [];
  for (let i = 0; i < cleanHex.length; i += 2) {
    const byte = parseInt(cleanHex.substring(i, i + 2), 16);
    if (isNaN(byte)) {
      throw new Error(`Invalid hex character at position ${i}`);
    }
    bytes.push(byte);
  }
  
  return Buffer.from(bytes);
}

const ENCRYPTION_HEX_KEY = "9fc7d58a868172d276677675ff6a8cb59457ae83d47523f779735c1acd7d76049f0eea3a6395308350d5853c81af23cd1e2d2fe356bb3bfded280fcbc76a05f9";

function unscrambleImage(scrambledBuffer: ArrayBuffer | Buffer): Buffer {
  const buffer = Buffer.isBuffer(scrambledBuffer) 
    ? scrambledBuffer 
    : Buffer.from(new Uint8Array(scrambledBuffer));
  
  const keyArray = hex2Bin(ENCRYPTION_HEX_KEY);
  const keyLength = keyArray.length;
  const decryptedBuffer = Buffer.from(buffer);
  
  for (let i = 0; i < decryptedBuffer.length; i++) {
    const keyIndex = i % keyLength;
    decryptedBuffer[i] = decryptedBuffer[i] ^ keyArray[keyIndex];
  }
  
  return decryptedBuffer;
}

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

    const response = await fetch(imageUrl, {
      headers: {
        accept: "*/*",
        "accept-language": "vi,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        referer: "https://mangaplus.shueisha.co.jp/",
        origin: "https://mangaplus.shueisha.co.jp",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch image: ${response.statusText}`;
      
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

    const arrayBuffer = await response.arrayBuffer();
    const decryptedBuffer = unscrambleImage(arrayBuffer);
    const uint8Array = new Uint8Array(decryptedBuffer);
    
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": decryptedBuffer.length.toString(),
        "X-Decryption-Method": "Repeating-Key-XOR",
        "X-Key-Length": hex2Bin(ENCRYPTION_HEX_KEY).length.toString(),
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
