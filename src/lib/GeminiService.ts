import { GoogleGenAI } from "@google/genai";
import { Shipment } from "../types";

// The hard cache and cooldown window
const narrativeCache = new Map<string, string>();
const lastCallTime = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000;

// Initialize Gemni using the API key
// Assuming the user provides it in the environment variable `GEMINI_API_KEY`
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.warn("Gemini API key missing or invalid.");
}

export async function getNarrative(shipment: Shipment): Promise<string> {
  const cacheKey = `${shipment.id}-${shipment.tier}`;
  
  if (narrativeCache.has(cacheKey)) {
    return narrativeCache.get(cacheKey)!;
  }

  const now = Date.now();
  const lastCall = lastCallTime.get(shipment.id) || 0;
  
  // Highest factor
  const sortedFactors = Object.entries(shipment.factors).sort((a, b) => b[1] - a[1]);
  const topFactor = sortedFactors[0][0];
  const top2Factors = `${sortedFactors[0][0]}, ${sortedFactors[1][0]}`;

  const fallback = `This shipment is at ${shipment.tier} risk due to elevated ${topFactor}. Immediate review of alternate routes is recommended.`;

  // Apply cooldown
  if (now - lastCall < COOLDOWN_MS) {
    return fallback;
  }

  if (!ai) {
    return fallback;
  }

  try {
    lastCallTime.set(shipment.id, now);
    
    // Succinct prompt as requested
    const prompt = `You are a supply chain analyst. Explain in 2 sentences:
Shipment ${shipment.id}, risk ${shipment.drs.toFixed(2)}, main factors: ${top2Factors}.
Give cause + action.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
      config: {
        maxOutputTokens: 80,
        temperature: 0.3,
      }
    });

    const text = response.text?.trim() || fallback;
    narrativeCache.set(cacheKey, text);
    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallback;
  }
}
