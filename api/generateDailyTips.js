import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY in environment" });
  }

  try {
    const { userStats } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const tipsSchema = {
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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
    const text = result.response.text();
    
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate daily tips" });
  }
}
