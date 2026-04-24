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
    const { selections } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const tipsSchema = {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          emoji: { type: SchemaType.STRING, description: "A single relevant emoji" },
          text:  { type: SchemaType.STRING, description: "A short actionable sustainability tip with estimated CO₂ saving" },
        },
        required: ["emoji", "text"],
      },
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", responseSchema: tipsSchema },
    });

    const summary = Object.entries(selections || {})
      .map(([cat, { tier }]) => `${cat}: ${tier}`)
      .join(", ");

    const prompt = `A user made these eco choices today: ${summary}.
Based on their choices, generate exactly 3 personalized sustainability tips to improve their day.
Each tip should be specific to their choices, actionable, and include an estimated CO₂ saving.
Return a JSON array of 3 objects with "emoji" and "text" fields.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate day tips", details: error.message, stack: error.stack });
  }
}
