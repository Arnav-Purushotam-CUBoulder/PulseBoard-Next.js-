import type { ThemeInsight } from "@/lib/types";

export function ThemeCard({ theme }: { theme: ThemeInsight }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{theme.theme}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{theme.summary}</p>
        </div>
        <div className="text-right text-sm text-zinc-400">
          <div>{theme.count} mentions</div>
          <div>{theme.sentiment}</div>
          <div>{theme.urgency} urgency</div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Representative quotes</div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {theme.sampleQuotes.map((quote) => (
              <li key={quote} className="rounded-xl bg-zinc-900 p-3">{quote}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Recommended actions</div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {theme.actionItems.map((item) => (
              <li key={item} className="rounded-xl bg-zinc-900 p-3">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
