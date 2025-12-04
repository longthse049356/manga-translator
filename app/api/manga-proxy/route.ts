import { NextRequest, NextResponse } from "next/server";

/**
 * Chuyển đổi chuỗi Hex thành Node.js Buffer (mảng byte)
 * @param hex - Chuỗi hex cần chuyển đổi
 * @returns Buffer chứa các byte từ hex string
 */
function hex2Bin(hex: string): Buffer {
  // Loại bỏ khoảng trắng và ký tự không hợp lệ
  const cleanHex = hex.replace(/\s+/g, "");
  
  // Kiểm tra độ dài phải là số chẵn
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Hex string must have even length");
  }
  
  // Chuyển đổi từng cặp hex thành byte
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

// Khóa Hex thực tế từ MangaPlus
const ENCRYPTION_HEX_KEY = "9fc7d58a868172d276677675ff6a8cb59457ae83d47523f779735c1acd7d76049f0eea3a6395308350d5853c81af23cd1e2d2fe356bb3bfded280fcbc76a05f9";

/**
 * Giải mã ảnh bị scramble bằng thuật toán Repeating Key XOR
 * @param scrambledBuffer - Buffer đã bị scramble (ArrayBuffer hoặc Buffer)
 * @returns Buffer đã được giải mã
 */
function unscrambleImage(scrambledBuffer: ArrayBuffer | Buffer): Buffer {
  // Chuyển đổi ArrayBuffer thành Buffer Node.js
  // Đảm bảo rằng đầu vào scrambledBuffer (ArrayBuffer) được chuyển đổi thành Buffer
  const buffer = Buffer.isBuffer(scrambledBuffer) 
    ? scrambledBuffer 
    : Buffer.from(new Uint8Array(scrambledBuffer));
  
  // Chuyển ENCRYPTION_HEX_KEY thành mảng byte (keyArray) bằng hàm hex2Bin
  const keyArray = hex2Bin(ENCRYPTION_HEX_KEY);
  const keyLength = keyArray.length;
  
  // Tạo buffer mới cho kết quả giải mã
  const decryptedBuffer = Buffer.from(buffer);
  
  // Sử dụng vòng lặp XOR với phép toán Modulo (%) để khóa lặp lại trên toàn bộ Buffer ảnh
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

    // Fetch ảnh với headers cần thiết để bypass 403
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

    // Nhận dữ liệu dưới dạng ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Giải mã ảnh bằng Repeating Key XOR
    // unscrambleImage sẽ tự sử dụng ENCRYPTION_HEX_KEY bên trong
    const decryptedBuffer = unscrambleImage(arrayBuffer);

    // Trả về ảnh đã giải mã
    // Convert Buffer to Uint8Array for NextResponse
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
