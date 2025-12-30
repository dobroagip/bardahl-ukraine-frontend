
import { GoogleGenAI, Type } from "@google/genai";
import { ExternalProduct } from "../types";

/**
 * Service for interacting with Google Gemini API
 */
export const getGeminiAdvice = async (userQuery: string, productContext: string): Promise<string> => {
  // Always initialize the client right before usage to ensure current API keys are used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const systemInstruction = `
      Вы - экспертный механик и консультант магазина Bardahl Ukraine.
      Ваша цель - помочь клиенту подобрать масло или присадку для его авто.
      
      Доступные товары в магазине (контекст):
      ${productContext}

      Правила:
      1. Отвечайте на русском языке.
      2. Будьте вежливы и профессиональны.
      3. Если спрашивают про подбор масла, спросите марку, модель, год и пробег, если они не указаны.
      4. Рекомендуйте только товары Bardahl.
      5. Ответ должен быть лаконичным (до 100 слов).
    `;

    // Use 'gemini-3-flash-preview' for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    // Directly access the .text property (not a method).
    return response.text || "Не удалось получить ответ.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Извините, возникла техническая ошибка при соединении с AI механиком.";
  }
};

export const getCarRecommendations = async (
  carDetails: { brand: string; model: string; year: string; fuel: string }
): Promise<{ products: ExternalProduct[], rawText: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      Perform a Google Search on site:bardahloils.com/uk-ua to find the best motor oil for a ${carDetails.year} ${carDetails.brand} ${carDetails.model} (${carDetails.fuel}).
      
      Identify 3 specific Bardahl products recommended for this car from that website.
      
      Format the output strictly as a list where each item follows this pattern:
      PRODUCT_START
      Name: [Exact Product Name found on site]
      Viscosity: [Viscosity e.g. 5W-30 or N/A]
      Reason: [Short reason in Russian explaining why this fits the car]
      PRODUCT_END
      
      Do NOT include links. Do NOT include markdown bolding.
    `;

    // Search grounding works best with gemini-3-flash-preview.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.5,
      }
    });

    const text = response.text || "";

    // Extracting grounding chunks URLs is a requirement when using googleSearch.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      console.debug('Search Grounding Chunks:', groundingChunks);
    }

    // Parse the structured text output
    const products: ExternalProduct[] = [];
    const blocks = text.split('PRODUCT_START');
    
    for (const block of blocks) {
      if (block.includes('PRODUCT_END')) {
        const nameMatch = block.match(/Name:\s*(.+)/);
        const viscosityMatch = block.match(/Viscosity:\s*(.+)/);
        const reasonMatch = block.match(/Reason:\s*(.+)/);

        if (nameMatch) {
          products.push({
            name: nameMatch[1].trim(),
            viscosity: viscosityMatch ? viscosityMatch[1].trim() : 'N/A',
            reason: reasonMatch ? reasonMatch[1].split('PRODUCT_END')[0].trim() : 'Рекомендовано для вашего авто',
          });
        }
      }
    }

    return {
      products,
      rawText: text
    };

  } catch (error) {
    console.error("Search Selection Error", error);
    return { products: [], rawText: "Error during search." };
  }
};
