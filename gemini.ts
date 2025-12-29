
import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, professional, and compelling e-commerce product description for a product named "${productName}" in the category "${category}". Keep it under 150 characters.`,
    });
    
    return response.text?.trim() || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Standard professional product. High quality and durable.";
  }
};
