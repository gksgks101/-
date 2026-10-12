"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { prose } from "@/lib/i18n/prose";
import { seunKeyword } from "@/lib/interpret/fortuneYears";
import type { SajuCalculation, SeunItem } from "@/lib/saju/types";

function stars(count: number) {
  return "★".repeat(count) + "☆".repeat(Math.max(0, 5 - count));
}

function toneClass(year: number, currentYear: number): string {
  if (year === currentYear) return "border-[var(--accent)] bg-white/70";
  if (year < currentYear) return "border-[var(--line)] bg-white/20 text-[var(--muted)] opacity-70";
  return "border-[var(--line)] bg-white/40";
}

function SeunDetail({ locale, item }: { locale: Locale; item: SeunItem }) {
  return (
    <div className="mt-3 space-y-1 text-sm leading-6">
      <p>
        {msg(locale, "career")} {prose(item.career, locale)}
      </p>
      <p>
        {msg(locale, "money")} {prose(item.money, locale)}
      </p>
      <p>
        {msg(locale, "love")} {prose(item.love, locale)}
      </p>
      {item.summary && <p className="text-[var(--muted)]">{item.summary}</p>}
    </div>
  );
}

export function SeunTimeline({ locale, chart }: { locale: Locale; chart: SajuCalculation }) {
  const currentYear = new Date().getFullYear();
  const [showAll, setShowAll] = useState(false);
  const [openYear, setOpenYear] = useState<number | null>(currentYear);
  const near = chart.seun.filter((item) => item.year >= currentYear - 2 && item.year <= currentYear + 2);
  const visible = showAll ? chart.seun : near;

  return (
    <section className="mt-6 hanji-panel rounded-3xl p-6">
      <h3 className="pillar-gan text-2xl">{msg(locale, "seunTitle")}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{msg(locale, "seunHint")}</p>
      <div className={`mt-5 grid gap-3 sm:grid-cols-2 ${showAll ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
        {visible.map((item) => {
          const open = openYear === item.year;
          return (
            <button
              key={item.year}
              type="button"
              onClick={() => setOpenYear(open ? null : item.year)}
              className={`rounded-xl border p-4 text-left ${toneClass(item.year, currentYear)}`}
            >
              <p className="text-lg font-semibold">{item.year}</p>
              <p className="text-xs text-[var(--muted)]">
                {item.age}
                {locale === "ko" ? "세" : locale === "es" ? " años" : " lat"}
                {item.year === currentYear ? ` · ${msg(locale, "nowLabel")}` : ""}
              </p>
              <p className="mt-1 text-[var(--dancheong)]">{stars(item.stars)}</p>
              <p className="mt-2 text-sm">
                {item.ganzhiKorean} ({item.ganzhi})
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">{seunKeyword(item, locale)}</p>
              {open && <SeunDetail locale={locale} item={item} />}
            </button>
          );
        })}
      </div>
      {chart.seun.length > near.length && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="text-sm text-[var(--dancheong)] underline-offset-4 hover:underline"
          >
            {showAll ? msg(locale, "hideSeun") : msg(locale, "seunAll")}
          </button>
        </div>
      )}
    </section>
  );
}
