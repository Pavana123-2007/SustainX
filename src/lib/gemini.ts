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

export interface DayTip {
  emoji: string;
  text: string;
}

export async function generateDayTips(
  selections: Record<string, { points: number; tier: "best" | "better" | "least" }>
): Promise<DayTip[]> {
  const response = await fetch("/api/generateDayTips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selections }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate day tips from server");
  }

  return response.json();
}

export async function analyzeImageWithGemini(base64Image: string): Promise<ScanResult> {
  const response = await fetch("/api/analyzeImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze image from server");
  }

  return response.json();
}

export async function generateDailyTips(userStats?: any): Promise<DailyTipsResponse> {
  const response = await fetch("/api/generateDailyTips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userStats }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate daily tips from server");
  }

  return response.json();
}
