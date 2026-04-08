export type FeedbackItem = {
  id: string;
  source: string;
  customer: string;
  text: string;
};

export type ThemeInsight = {
  theme: string;
  count: number;
  sentiment: "positive" | "mixed" | "negative";
  urgency: "low" | "medium" | "high";
  summary: string;
  sampleQuotes: string[];
  actionItems: string[];
};

export type AnalysisResult = {
  totalFeedback: number;
  topPainPoint: string;
  strongestPositiveSignal: string;
  summary: string;
  themes: ThemeInsight[];
};
