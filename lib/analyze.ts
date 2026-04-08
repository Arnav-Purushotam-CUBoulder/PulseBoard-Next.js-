import type { AnalysisResult, FeedbackItem, ThemeInsight } from "@/lib/types";

const THEME_RULES = [
  { theme: "Performance & Reliability", keywords: ["slow", "freeze", "latency", "load", "hang", "performance", "reliable"] },
  { theme: "Notifications & Alerts", keywords: ["notification", "alert", "email", "reminder"] },
  { theme: "Billing & Plans", keywords: ["billing", "invoice", "seat", "plan", "finance", "pricing"] },
  { theme: "Onboarding & Permissions", keywords: ["onboarding", "permission", "admin", "role", "rollout"] },
  { theme: "Reporting & Exports", keywords: ["report", "export", "csv", "download"] },
  { theme: "AI Features", keywords: ["ai", "summary", "assistant", "copilot"] },
  { theme: "Search & Discovery", keywords: ["search", "find", "query"] }
] as const;

const POSITIVE_HINTS = ["love", "great", "better", "fast", "helpful", "good"];
const NEGATIVE_HINTS = ["slow", "worse", "late", "freeze", "unreliable", "confused", "clunky", "hang"];

export function analyzeFeedback(items: FeedbackItem[]): AnalysisResult {
  const buckets = new Map<string, ThemeInsight>();

  for (const item of items) {
    const lower = item.text.toLowerCase();
    const matched = THEME_RULES.filter((rule) => rule.keywords.some((keyword) => lower.includes(keyword)));
    const rules = matched.length > 0 ? matched : [{ theme: "General Experience", keywords: [] }];

    for (const rule of rules) {
      const existing = buckets.get(rule.theme) ?? {
        theme: rule.theme,
        count: 0,
        sentiment: "mixed",
        urgency: "low",
        summary: "",
        sampleQuotes: [],
        actionItems: []
      };

      existing.count += 1;
      if (existing.sampleQuotes.length < 2) {
        existing.sampleQuotes.push(`${item.customer}: ${item.text}`);
      }

      const positiveScore = POSITIVE_HINTS.filter((hint) => lower.includes(hint)).length;
      const negativeScore = NEGATIVE_HINTS.filter((hint) => lower.includes(hint)).length;
      existing.sentiment = negativeScore > positiveScore ? "negative" : positiveScore > negativeScore ? "positive" : "mixed";
      existing.urgency = lower.includes("freeze") || lower.includes("8 to 10 seconds") || lower.includes("unreliable")
        ? "high"
        : negativeScore > 0
          ? "medium"
          : "low";
      existing.summary = summarizeTheme(rule.theme, existing.sentiment, existing.urgency);
      existing.actionItems = suggestedActions(rule.theme, existing.urgency);
      buckets.set(rule.theme, existing);
    }
  }

  const themes = Array.from(buckets.values()).sort((a, b) => b.count - a.count);
  const topPainPoint = themes.find((theme) => theme.sentiment !== "positive")?.theme ?? themes[0]?.theme ?? "General Experience";
  const strongestPositiveSignal = themes.find((theme) => theme.sentiment === "positive")?.theme ?? "AI Features";

  return {
    totalFeedback: items.length,
    topPainPoint,
    strongestPositiveSignal,
    summary: `Customers are most vocal about ${topPainPoint.toLowerCase()}, while ${strongestPositiveSignal.toLowerCase()} remains the clearest source of positive momentum.`,
    themes
  };
}

function summarizeTheme(theme: string, sentiment: ThemeInsight["sentiment"], urgency: ThemeInsight["urgency"]) {
  if (urgency === "high") {
    return `${theme} is creating immediate friction and likely needs a near-term engineering response.`;
  }
  if (sentiment === "positive") {
    return `${theme} is landing well and should be amplified in roadmap messaging.`;
  }
  if (sentiment === "negative") {
    return `${theme} is a recurring pain point that should be prioritized for cleanup.`;
  }
  return `${theme} shows mixed signals and would benefit from deeper customer interviews.`;
}

function suggestedActions(theme: string, urgency: ThemeInsight["urgency"]) {
  const base = {
    "Performance & Reliability": ["Instrument slow workflows and define a p95 target.", "Compare large-account traces before and after the recent release."],
    "Notifications & Alerts": ["Audit notification delivery latency by channel.", "Add delivery-state visibility to the customer-facing settings page."],
    "Billing & Plans": ["Redesign invoice and seat-change messaging.", "Expose clearer plan diffs before checkout or renewal."],
    "Onboarding & Permissions": ["Expand RBAC presets for admins.", "Add onboarding checkpoints for account setup blockers."],
    "Reporting & Exports": ["Make exports async and add delivery notifications.", "Offer saved weekly report schedules."],
    "AI Features": ["Package the strongest AI wins into launch messaging.", "Gather detailed feedback on where summaries save the most time."],
    "Search & Discovery": ["Track query success and null-result rates.", "Add filter suggestions for ambiguous queries."],
    "General Experience": ["Review broad customer themes in the next product triage." ]
  } as Record<string, string[]>;

  const items = base[theme] ?? base["General Experience"];
  return urgency === "high" ? [items[0], "Escalate this theme into the next sprint planning review."] : items;
}
