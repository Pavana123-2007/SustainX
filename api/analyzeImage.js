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

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Missing image in request body" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const resultSchema = {
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resultSchema,
      },
    });

    const base64Data = image.split(',')[1] || image;
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
    
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
}
