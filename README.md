# AI Product Feedback Intelligence and Theme Discovery Workspace

PulseBoard is a compact Next.js app for turning raw user feedback into product signals. Paste support tickets, app reviews, or customer notes and the app clusters themes, scores sentiment, identifies urgent problems, and drafts PM-facing action items.

## Highlights

- Next.js App Router with TypeScript
- Server-side analysis route for AI-powered theme extraction
- Optional AWS S3 archival for completed feedback analyses
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
AWS_REGION=us-east-1
AWS_S3_BUCKET=pulseboard-analysis-archives
AWS_S3_PREFIX=pulseboard-analyses
```

If `AWS_S3_BUCKET` is configured, the analysis route writes each completed report to Amazon S3 and surfaces the object location in the UI. The repo also includes `amplify.yml` for AWS deployment.

## Example use cases

- Group support tickets into recurring themes
- Surface high-severity complaints for PM review
- Summarize what users like, hate, and keep requesting
- Draft next sprint action items from customer input
