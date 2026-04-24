import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({ insights: "You're doing great! Keep improving your habits 🌱" });
  }
  const client = new OpenAI({ apiKey });
  const { score, co2, goodActions, badActions } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a sustainability AI assistant.",
        },
        {
          role: "user",
          content: `
User data:
Score: ${score}
CO2: ${co2}
Good Actions: ${goodActions}
Bad Actions: ${badActions}

Generate 3 short sustainability insights.
          `,
        },
      ],
    });

    res.json({
      insights: completion.choices[0].message.content,
    });
  } catch (err) {
    res.json({
      insights: "You're doing great! Keep improving your habits 🌱",
    });
  }
}
