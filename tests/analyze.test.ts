import { describe, expect, it } from "vitest";
import { analyzeFeedback } from "../lib/analyze";
import { feedbackRequestSchema } from "../lib/schemas";

describe("analyzeFeedback", () => {
  it("clusters recurring themes and identifies the top pain point", () => {
    const result = analyzeFeedback([
      {
        id: "1",
        source: "gong",
        customer: "Northwind",
        text: "The app is slow and the export hangs for large reports."
      },
      {
        id: "2",
        source: "zendesk",
        customer: "BluePeak",
        text: "Search is good now and the AI summary is helpful."
      }
    ]);

    expect(result.totalFeedback).toBe(2);
    expect(result.topPainPoint).toBe("Performance & Reliability");
    expect(result.themes[0]?.actionItems.length).toBeGreaterThan(0);
  });
});

describe("feedbackRequestSchema", () => {
  it("rejects empty submissions", () => {
    const parsed = feedbackRequestSchema.safeParse({ feedback: [] });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe("No feedback supplied.");
    }
  });

  it("accepts valid feedback payloads", () => {
    const parsed = feedbackRequestSchema.safeParse({
      feedback: [
        {
          id: "42",
          source: "slack",
          customer: "Atlas Freight",
          text: "Billing alerts are confusing during renewal."
        }
      ]
    });

    expect(parsed.success).toBe(true);
  });
});
