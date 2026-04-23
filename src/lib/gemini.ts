import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";

// Ensure there's a fallback if key not set during testing (it'll error on client, but won't crash import)
const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface DailyTip {
  emoji: string;
  text: string;
}

export interface DailyTipsResponse {
  tips: DailyTip[];
  summary: string;
}

export interface ScanResult {
  title: string;
  description: string;
  ecoScore: number;
  suggestions: string[];
}

const tipsSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    tips: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          emoji: {
            type: SchemaType.STRING,
            description: "A single emoji representing the tip",
          },
          text: {
            type: SchemaType.STRING,
            description: "A short, actionable sustainability tip with an estimated CO2 saving (e.g. 'Walk instead of driving — save 1.2 kg CO₂')",
          },
        },
        required: ["emoji", "text"],
      },
      description: "A list of 3 random sustainability tips",
    },
    summary: {
      type: SchemaType.STRING,
      description: "A concluding sentence summarizing the total impact. e.g. 'That's equivalent to keeping a light off for 12 hours!'",
    },
  },
  required: ["tips", "summary"],
};

const resultSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "Name of the object identified",
    },
    description: {
      type: SchemaType.STRING,
      description: "Brief explanation of its composition and general impact on the environment.",
    },
    ecoScore: {
      type: SchemaType.INTEGER,
      description: "A score from 0 to 100 representing how eco-friendly this object is (100 = very eco friendly, 0 = terrible for the environment)",
    },
    suggestions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
      description: "Two or three highly specific suggestions on sustainable alternatives or how to properly recycle/dispose of it.",
    },
  },
  required: ["title", "description", "ecoScore", "suggestions"],
};

export async function analyzeImageWithGemini(base64Image: string): Promise<ScanResult> {
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Please add it to your .env.local file.");
  }

  // Use the recommended model for vision tasks
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: resultSchema,
    },
  });

  // Base64 string might contain data url prefix, strip it if present
  const base64Data = base64Image.split(',')[1] || base64Image;

  const prompt = `Analyze this image and identify the primary object. Evaluate its environmental impact. Provide the name, a description of its composition and impact, an eco score from 0 to 100, and actionable suggestions to improve sustainability.`;

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: "image/jpeg"
    }
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text) as ScanResult;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON", text);
    throw new Error("Invalid response format from Gemini");
  }
}

export async function generateDailyTips(userStats?: any): Promise<DailyTipsResponse> {
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY. Please add it to your .env.local file.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // Use flash as it's quick and reliable for text
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: tipsSchema,
    },
  });

  let contextStr = "The user has no recorded data yet.";
  if (userStats) {
      contextStr = `The user's current sustainability stats: 
      Total Points: ${userStats.totalPoints}
      Good Actions: ${userStats.goodActionsCount}
      Bad Actions: ${userStats.badActionsCount}. 
      Use this context to give highly tailored and encouraging tips.`;
  }

  const prompt = `Based on the following user data: ${contextStr}

Generate 3 highly diverse, random, and specific daily sustainability tips tailored for this user. Each tip should include a realistic estimate of CO2 saved if the user does it. Also generate a fun summary sentence that translates the total combined CO2 savings into a relatable real-world equivalent (like hours of a lightbulb, smartphone charges, etc.). Format strictly as a JSON object with 'tips' array and 'summary' string.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text) as DailyTipsResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON", text);
    throw new Error("Invalid response format from Gemini");
  }
}
