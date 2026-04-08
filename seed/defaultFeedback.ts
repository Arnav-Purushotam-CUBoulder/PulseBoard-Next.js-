import type { FeedbackItem } from "@/lib/types";

export const defaultFeedback: FeedbackItem[] = [
  {
    id: "fb-1",
    source: "support",
    customer: "Northwind Labs",
    text: "Search feels much better after the last release, but the dashboard still takes 8 to 10 seconds to load on large accounts."
  },
  {
    id: "fb-2",
    source: "app-store",
    customer: "Anonymous",
    text: "I keep missing notifications because the email alerts arrive late. Great UI overall, but reminders are unreliable."
  },
  {
    id: "fb-3",
    source: "sales-call",
    customer: "Borealis Health",
    text: "We love the AI summary feature, though exporting weekly reports is clunky and too manual for our ops team."
  },
  {
    id: "fb-4",
    source: "support",
    customer: "Redwood Retail",
    text: "Billing confused our finance team after seat changes. We need clearer invoices and self-serve plan visibility."
  },
  {
    id: "fb-5",
    source: "survey",
    customer: "Atlas Freight",
    text: "Onboarding was fast, but role permissions are limited. We want better admin controls before wider rollout."
  },
  {
    id: "fb-6",
    source: "support",
    customer: "Evergreen AI",
    text: "Performance got worse this week. Saving filters hangs and the page freezes when we switch between workspaces."
  }
];
