"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { STRENGTH_NAME, term } from "@/lib/i18n/terms";
import { coreGlossary, coreHeadline } from "@/lib/interpret/coreCopy";
import { yongsinLine, yongsinReason } from "@/lib/interpret/yongsin";
import type { SajuCalculation } from "@/lib/saju/types";

export function CoreFlipCard({ locale, chart }: { locale: Locale; chart: SajuCalculation }) {
  const [flipped, setFlipped] = useState(false);
  const glossary = coreGlossary(chart, locale);
  const headline = coreHeadline(chart, locale);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={() => setFlipped((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFlipped((value) => !value);
        }
      }}
      className="theme-flip h-full min-h-[420px] cursor-pointer text-left"
    >
      <div className={`theme-flip-inner h-full ${flipped ? "is-flipped" : ""}`}>
        <article className="theme-face theme-face-front hanji-panel flex h-full flex-col overflow-y-auto rounded-3xl p-5 sm:p-6">
          <h2 className="mb-3 text-sm tracking-[0.2em] text-[var(--muted)]">{msg(locale, "coreTitle")}</h2>
          <p className="pillar-gan text-2xl">{term(STRENGTH_NAME, chart.strength.classification, locale)}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{chart.pattern.name}</p>
          <p className="mt-4 text-sm">{yongsinLine(chart, locale)}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{yongsinReason(chart, locale)}</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {chart.strength.reasons.slice(0, 4).map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
          <p className="mt-auto pt-4 text-sm font-semibold text-[var(--dancheong)]">{msg(locale, "tapEasy")}</p>
        </article>
        <article className="theme-face theme-face-back hanji-panel flex h-full flex-col overflow-y-auto rounded-3xl p-5 sm:p-6">
          <h2 className="mb-3 text-sm tracking-[0.2em] text-[var(--muted)]">{msg(locale, "coreTitle")}</h2>
          <p className="pillar-gan text-2xl leading-snug text-[var(--ink)] sm:text-3xl">{headline}</p>
          <dl className="mt-5 space-y-3">
            {glossary.map((row) => (
              <div key={row.term} className="grid gap-1 border-b border-[var(--line)] pb-3 last:border-0 sm:grid-cols-[minmax(0,8.5rem)_1fr]">
                <dt className="text-sm font-semibold text-[var(--dancheong)]">{row.term}</dt>
                <dd className="text-[15px] leading-7 text-[var(--ink)]">{row.line}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-[var(--muted)]">{msg(locale, "tapPro")}</p>
        </article>
      </div>
    </div>
  );
}
