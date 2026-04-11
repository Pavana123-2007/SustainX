export async function getAIInsights(data: any) {
  const response = await fetch("http://localhost:5000/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}