import { NextResponse } from "next/server";
import { analyzeFeedback } from "@/lib/analyze";
import { persistAnalysis } from "@/lib/archive";
import { refineSummaryWithOpenAI } from "@/lib/openai";
import type { FeedbackItem } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { feedback: FeedbackItem[] };
  const feedback = body.feedback ?? [];

  if (feedback.length === 0) {
    return NextResponse.json({ error: "No feedback supplied." }, { status: 400 });
  }

  const result = analyzeFeedback(feedback);
  result.summary = await refineSummaryWithOpenAI(result.summary, result.themes.map((theme) => theme.theme));
  const archive = await persistAnalysis(feedback, result);
  result.archiveProvider = archive.provider;
  result.archiveLocation = archive.location;

  return NextResponse.json(result);
}
