import { NextResponse } from "next/server";
import { analyzeFeedback } from "@/lib/analyze";
import { persistAnalysis } from "@/lib/archive";
import { refineSummaryWithOpenAI } from "@/lib/openai";
import { feedbackRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = feedbackRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid analysis request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { feedback } = parsed.data;
  const result = analyzeFeedback(feedback);
  result.summary = await refineSummaryWithOpenAI(result.summary, result.themes.map((theme) => theme.theme));
  const archive = await persistAnalysis(feedback, result);
  result.archiveProvider = archive.provider;
  result.archiveLocation = archive.location;

  return NextResponse.json(result);
}
