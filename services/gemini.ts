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
 * @returns Base64 encoded translated image
 */
export async function translateMangaImage(
  imageFile: File
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // Initialize Gemini client
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  // Convert image file to base64
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString("base64");
  const mimeType = imageFile.type || "image/png";

  // Create the prompt for translation
  const prompt = `Analyze this comic page image. Detect all speech bubbles in English, translate them accurately into Vietnamese, and generate a new image with the Vietnamese text replacing the original English text inside the bubbles. Return the new image.`;

  try {
    // Call Gemini 3 Pro Preview Image model
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
            },
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
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("Unknown error occurred while translating image");
  }
}

