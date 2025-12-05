import { GoogleGenAI } from "@google/genai";

/**
 * List all available Gemini models
 * @returns Array of available model information
 */
export async function listAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  try {
    // List all available models
    const response = await ai.models.list();
    
    const models: Array<{ name: string; displayName?: string; description?: string }> = [];
    for await (const model of response) {
      models.push({
        name: model.name || "",
        displayName: model.displayName,
        description: model.description,
      });
    }
    
    return models;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
    throw new Error("Unknown error occurred while listing models");
  }
}

/**
 * Translates manga image from English to Vietnamese using Gemini 3 Pro
 * @param imageFile - The image file to translate
 * @param seriesName - Optional series name for better context
 * @returns Base64 encoded translated image
 */
export async function translateMangaImage(
  imageFile: File,
  seriesName?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // Initialize Gemini client with v1alpha API for mediaResolution support
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      apiVersion: "v1alpha",
    },
  });

  // Convert image file to base64
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString("base64");
  const mimeType = imageFile.type || "image/png";

  // Define the dynamic context (This should change per chapter/scene)
const contextDescription = seriesName 
  ? `Series: ${seriesName}. Use appropriate character pronouns and tone based on the series context.`
  : `DETECT the context automatically based on visual cues (character age, relationship, setting, tone)...`;

const prompt = `
*** TASK: MANGA LOCALIZATION & IMAGE EDITING ***

1. IMAGE QUALITY REQUIREMENTS (HIGHEST PRIORITY):
   - Analyze the uploaded high-resolution comic page.
   - DETECT all speech bubbles containing English text.
   - GENERATE a new image that is visually IDENTICAL to the original in terms of line art style, shading, contrast, and resolution.
   - DO NOT apply any filters, compression, or style transfer. The artwork must remain crisp and sharp.
   - ONLY modify the pixels inside the speech bubbles.

2. TRANSLATION & LOCALIZATION RULES (VIETNAMESE):
   - Role: Professional Vietnamese Manga Editor.
   - Target Language: Vietnamese (Natural, Expressive).
   - Tone/Vibe:
     + PRIORITIZE SPOKEN LANGUAGE (Văn nói) over written language.
     + Use appropriate pronouns based on the context: "${contextDescription}".
     + For Gamer/Youth characters: Use slang, aggressive, and fun tone.
     + For Serious/Legendary characters: Use Sino-Vietnamese (Hán Việt) words for power/authority.
   - Sound Effects (SFX): If possible, translate SFX to Vietnamese equivalents (e.g., "Crunch" -> "Rộp/Ngoạm", "Bam" -> "Bùm").

3. TEXT FITTING & TYPOGRAPHY:
   - Fit the Vietnamese translation perfectly inside the original speech bubbles.
   - If the translation is too long, shorten it to fit natural speech patterns (Text Fitting).
   - Use a font style that matches typical Manga aesthetics (Upper case for shouting, standard sans-serif for dialogue).

*** EXECUTION ***
Replace the English text in the bubbles with the localized Vietnamese text based on the rules above. Return the final high-quality image.
`;

  try {
    // Call Gemini 3 Pro Preview Image model with high quality settings
    // Using type assertion for mediaResolution as it may not be in type definitions yet
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
              // Set high media resolution for better image quality
              // Note: mediaResolution may require v1alpha API version
              mediaResolution: {
                level: "MEDIA_RESOLUTION_HIGH",
              },
            } as any, // Type assertion for mediaResolution support
          ],
        },
      ],
    });

    // Extract the translated image from response
    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content) {
      throw new Error("No response from Gemini API");
    }

    const parts = candidate.content.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content parts in Gemini API response");
    }

    // Find the image part in the response
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data in Gemini API response");
  } catch (error) {
    // Parse Gemini API error response
    if (error instanceof Error) {
      let errorMessage = error.message;
      
      // Try to parse JSON error response
      try {
        const errorJson = JSON.parse(error.message);
        if (errorJson.error) {
          const geminiError = errorJson.error;
          
          // Handle specific error codes
          if (geminiError.code === 503 || geminiError.status === "UNAVAILABLE") {
            errorMessage = "Model đang quá tải. Vui lòng thử lại sau vài giây.";
          } else if (geminiError.code === 429) {
            errorMessage = "Đã vượt quá giới hạn API. Vui lòng thử lại sau.";
          } else if (geminiError.code === 400) {
            errorMessage = geminiError.message || "Yêu cầu không hợp lệ.";
          } else if (geminiError.code === 401 || geminiError.code === 403) {
            errorMessage = "Lỗi xác thực API. Vui lòng kiểm tra API key.";
          } else {
            errorMessage = geminiError.message || "Lỗi từ Gemini API.";
          }
        }
      } catch {
        // If not JSON, check if message contains common error patterns
        if (error.message.includes("503") || error.message.includes("overloaded")) {
          errorMessage = "Model đang quá tải. Vui lòng thử lại sau vài giây.";
        } else if (error.message.includes("429") || error.message.includes("rate limit")) {
          errorMessage = "Đã vượt quá giới hạn API. Vui lòng thử lại sau.";
        } else {
          errorMessage = error.message;
        }
      }
      
      throw new Error(errorMessage);
    }
    throw new Error("Lỗi không xác định khi dịch ảnh");
  }
}

