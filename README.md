# AI Product Feedback Intelligence and Theme Discovery Workspace

PulseBoard is a compact Next.js app for turning raw user feedback into product signals. Paste support tickets, app reviews, or customer notes and the app clusters themes, scores sentiment, identifies urgent problems, and drafts PM-facing action items.

## Highlights

- Next.js App Router with TypeScript
- Server-side analysis route for AI-powered theme extraction
- Deterministic fallback clustering when no API key is present
- Clean product analytics dashboard with top themes, quotes, and recommendations

## Quick start

```bash
npm install
npm run dev
```

Optional environment variables:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

## Example use cases

- Group support tickets into recurring themes
- Surface high-severity complaints for PM review
- Summarize what users like, hate, and keep requesting
- Draft next sprint action items from customer input
