"use client";

import { useMemo, useState } from "react";
import { defaultFeedback } from "@/seed/defaultFeedback";
import type { AnalysisResult, FeedbackItem } from "@/lib/types";
import { MetricCard } from "@/components/MetricCard";
import { ThemeCard } from "@/components/ThemeCard";

function parseFeedback(text: string): FeedbackItem[] {
  return text
    .split("\n")
    .map((line, index) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `custom-${index + 1}`,
      source: "manual",
      customer: `Entry ${index + 1}`,
      text: line
    }));
}

export default function HomePage() {
  const [input, setInput] = useState(defaultFeedback.map((item) => item.text).join("\n"));
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const itemCount = useMemo(() => parseFeedback(input).length, [input]);

  async function runAnalysis() {
    const feedback = parseFeedback(input);
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback })
      });
      const data = await response.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-10">
      <section className="rounded-[28px] border border-zinc-800 bg-zinc-950/70 p-8 shadow-2xl shadow-black/20">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-[0.24em] text-cyan-300">AI product analytics</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Product Feedback Intelligence and Theme Discovery Workspace
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            Paste customer feedback, support issues, or app reviews and turn them into themes, pain points, and next-sprint recommendations.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <label className="text-sm font-medium text-zinc-300">Feedback entries ({itemCount})</label>
            <textarea
              className="mt-3 h-[320px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-100 outline-none transition focus:border-cyan-400"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="rounded-xl bg-cyan-400 px-4 py-2 font-medium text-zinc-950" onClick={runAnalysis}>
                {loading ? "Analyzing..." : "Analyze feedback"}
              </button>
              <button className="rounded-xl border border-zinc-700 px-4 py-2 text-zinc-200" onClick={() => setInput(defaultFeedback.map((item) => item.text).join("\n"))}>
                Load demo data
              </button>
            </div>
            {result?.archiveLocation ? (
              <p className="mt-3 text-sm text-zinc-400">
                Archived via <span className="font-medium text-zinc-200">{result.archiveProvider}</span>: {result.archiveLocation}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 self-start md:grid-cols-2 lg:grid-cols-1">
            <MetricCard label="Total feedback" value={result?.totalFeedback ?? itemCount} />
            <MetricCard label="Top pain point" value={result?.topPainPoint ?? "Run an analysis"} />
            <MetricCard label="Strongest positive signal" value={result?.strongestPositiveSignal ?? "Run an analysis"} />
          </div>
        </div>
      </section>

      {result ? (
        <section className="mt-8 space-y-6">
          <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/70 p-8 shadow-2xl shadow-black/20">
            <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">PM summary</div>
            <p className="mt-4 whitespace-pre-wrap text-lg leading-8 text-zinc-100">{result.summary}</p>
          </div>
          <div className="space-y-4">
            {result.themes.map((theme) => (
              <ThemeCard key={theme.theme} theme={theme} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
