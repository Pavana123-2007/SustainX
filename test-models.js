// test-models.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Read API key manually from .env.local since we are in node, not vite
const envContent = fs.readFileSync(".env.local", "utf-8");
const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : "";

if (!apiKey) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function check() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      data.models.filter(m => m.name.includes("gemini")).forEach(m => console.log(m.name, m.supportedGenerationMethods));
    } else {
       console.log("Response:", data);
    }
  } catch (err) {
    console.error(err);
  }
}

check();
