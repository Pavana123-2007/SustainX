import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.json({ insights: "You're doing great! Keep improving your habits 🌱" });
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});