export async function refineSummaryWithOpenAI(rawSummary: string, themeNames: string[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return rawSummary;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: `Rewrite this PM summary into 3 concise bullets. Themes: ${themeNames.join(", ")}. Draft summary: ${rawSummary}`
    })
  });

  if (!response.ok) {
    return rawSummary;
  }

  const data = await response.json();
  return data.output_text ?? rawSummary;
}
