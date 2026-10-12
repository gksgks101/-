"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { prose } from "@/lib/i18n/prose";
import { GENDER_NAME, PILLAR_NAME, STRENGTH_NAME, placeName, tenGod, term } from "@/lib/i18n/terms";
import { buildThemeCards } from "@/lib/interpret/themes";
import { dayMasterCard } from "@/lib/saju/dayCards";
import { downloadBlob, renderSharePoster, shareOrDownload } from "@/lib/share/renderPoster";
import type { AnalyzeResponse, Pillar, SajuCalculation } from "@/lib/saju/types";
import { DayMasterCard } from "./DayMasterCard";
import { ElementChart } from "./ElementChart";
import { MotifIcon } from "./MotifIcon";

function stars(count: number) {
  return "★".repeat(count) + "☆".repeat(Math.max(0, 5 - count));
}

function PillarCard({ title, pillar, locale }: { title: string; pillar: Pillar | null; locale: Locale }) {
  if (!pillar) {
    return (
      <article className="hanji-panel rounded-2xl p-4 text-center">
        <p className="text-xs tracking-[0.2em] text-[var(--muted)]">{title}</p>
        <p className="mt-6 text-[var(--muted)]">{msg(locale, "unknown")}</p>
      </article>
    );
  }
  return (
    <article className="hanji-panel rounded-2xl p-4 text-center">
      <p className="text-xs tracking-[0.2em] text-[var(--muted)]">{title}</p>
      <p className="pillar-gan mt-3 text-3xl text-[var(--gold)]">{pillar.gan}</p>
      <p className="text-sm text-[var(--muted)]">
        {pillar.ganKorean} · {tenGod(pillar.ganTenGodKorean, locale)}
      </p>
      <div className="gold-line my-3" />
      <p className="pillar-gan text-3xl">{pillar.zhi}</p>
      <p className="text-sm text-[var(--muted)]">
        {pillar.zhiKorean} · {pillar.twelveStageKorean}
      </p>
      <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
        {msg(locale, "hiddenStem")}
        <br />
        {pillar.hiddenStems.map((item) => `${item.ganKorean}${item.roleKorean}`).join(" · ")}
      </p>
    </article>
  );
}

export function ResultView({ locale }: { locale: Locale }) {
  const [data] = useState<AnalyzeResponse | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("saju-result");
    return raw ? (JSON.parse(raw) as AnalyzeResponse) : null;
  });
  const [selectedDaeun, setSelectedDaeun] = useState(0);
  const [compareIndex, setCompareIndex] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [shareState, setShareState] = useState("");

  const chart: SajuCalculation | undefined = useMemo(() => {
    if (!data) return undefined;
    if (data.calculation.alternatives?.length) {
      return compareIndex === 0 ? data.calculation : data.calculation.alternatives[compareIndex - 1];
    }
    return data.calculation;
  }, [data, compareIndex]);

  const themes = useMemo(() => (chart ? buildThemeCards(chart, locale) : []), [chart, locale]);
  const card = chart ? dayMasterCard(chart.dayMaster.gan) : null;

  async function makeImage() {
    if (!chart) return null;
    setShareState(msg(locale, "sharing"));
    try {
      return await renderSharePoster(chart, themes, locale);
    } catch {
      setShareState(msg(locale, "shareFail"));
      return null;
    }
  }

  if (cleared) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p>{msg(locale, "cleared")}</p>
        <Link href={`/${locale}`} className="mt-6 inline-block text-[var(--gold)]">
          {msg(locale, "analyzeAgain")}
        </Link>
      </div>
    );
  }

  if (!data || !chart || !card) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p>{msg(locale, "noResult")}</p>
        <Link href={`/${locale}`} className="mt-6 inline-block text-[var(--gold)]">
          {msg(locale, "enterBirth")}
        </Link>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const visibleSeun = chart.seun.filter((item) => item.year >= currentYear && item.year <= currentYear + 20);
  const daeun = chart.daeun[selectedDaeun] ?? chart.daeun[0];
  const displayName = chart.birth.displayName || msg(locale, "anonymous");
  const location = chart.birth.location
    .split(" ")
    .map((part) => placeName(part, locale))
    .join(" ");

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--gold)]">{msg(locale, "resultKicker")}</p>
          <h1 className="pillar-gan mt-2 text-3xl sm:text-4xl">{msg(locale, "resultTitle", { name: displayName })}</h1>
          <p className="mt-2 text-[var(--muted)]">
            {chart.birth.solarDate} {chart.birth.time ?? msg(locale, "timeUnknownLabel")} · {location} ·{" "}
            {GENDER_NAME[chart.birth.gender][locale]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              const blob = await makeImage();
              if (!blob) return;
              const file = `saju-${chart.dayMaster.gan}-${chart.birth.solarDate}.png`;
              await downloadBlob(blob, file);
              setShareState(msg(locale, "shareCopied"));
            }}
            className="rounded-full bg-[var(--gold)] px-4 py-2 text-sm text-[#1a140e]"
          >
            {msg(locale, "shareSave")}
          </button>
          <button
            type="button"
            onClick={async () => {
              const blob = await makeImage();
              if (!blob) return;
              const file = `saju-${chart.dayMaster.gan}-${chart.birth.solarDate}.png`;
              await shareOrDownload(blob, file, msg(locale, "shareBrand"), card.title[locale]);
              setShareState(msg(locale, "shareCopied"));
            }}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
          >
            {msg(locale, "shareSend")}
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("saju-result");
              setCleared(true);
            }}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"
          >
            {msg(locale, "clearData")}
          </button>
        </div>
      </div>
      {shareState && <p className="mb-6 text-sm text-[var(--gold)]">{shareState}</p>}

      {chart.hourBoundary?.crossesBoundary && (
        <section className="mb-8 rounded-2xl border border-[var(--gold)]/40 bg-[#1c1812] p-5">
          <p className="text-[var(--gold)]">{msg(locale, "boundaryTitle")}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{chart.hourBoundary.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCompareIndex(0)}
              className={`rounded-full px-4 py-2 text-sm ${compareIndex === 0 ? "bg-[var(--gold)] text-[#1a140e]" : "border border-[var(--line)]"}`}
            >
              {msg(locale, "defaultResult")}
            </button>
            {chart.hourBoundary.cases.map((item, index) => (
              <button
                key={item.time}
                type="button"
                onClick={() => setCompareIndex(index + 1)}
                className={`rounded-full px-4 py-2 text-sm ${compareIndex === index + 1 ? "bg-[var(--gold)] text-[#1a140e]" : "border border-[var(--line)]"}`}
              >
                {item.hourBranchKorean}시 {item.time}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <DayMasterCard card={card} locale={locale} gan={chart.dayMaster.gan} ganKorean={chart.dayMaster.ganKorean} />
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <PillarCard title={PILLAR_NAME.year[locale]} pillar={chart.pillars.year} locale={locale} />
        <PillarCard title={PILLAR_NAME.month[locale]} pillar={chart.pillars.month} locale={locale} />
        <PillarCard title={PILLAR_NAME.day[locale]} pillar={chart.pillars.day} locale={locale} />
        <PillarCard title={PILLAR_NAME.hour[locale]} pillar={chart.pillars.hour} locale={locale} />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <ElementChart
          locale={locale}
          power={chart.elements.powerScore}
          simple={chart.elements.simpleCount}
          labels={chart.elements.powerLabel}
        />
        <article className="hanji-panel rounded-3xl p-5 sm:p-6">
          <h2 className="mb-3 text-sm tracking-[0.2em] text-[var(--muted)]">{msg(locale, "coreTitle")}</h2>
          <p className="pillar-gan text-2xl">{term(STRENGTH_NAME, chart.strength.classification, locale)}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{chart.pattern.name}</p>
          <p className="mt-4 text-sm">
            {msg(locale, "yongsin")} {chart.useGod.yongsin.join("·")} · {msg(locale, "heesin")} {chart.useGod.heesin.join("·")}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {chart.strength.reasons.slice(0, 4).map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-12">
        <h2 className="pillar-gan text-3xl">{msg(locale, "themesTitle")}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{msg(locale, "themesLead")}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {themes.map((theme) => (
            <article key={theme.id} className="hanji-panel rounded-3xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <MotifIcon id={theme.id} />
                <div>
                  <p className="text-xs tracking-[0.2em] text-[var(--gold)]">{theme.kicker}</p>
                  <h3 className="pillar-gan text-2xl">{theme.title}</h3>
                </div>
              </div>
              {theme.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mb-3 leading-7 text-[#ddd6c8]">
                  {paragraph}
                </p>
              ))}
              {theme.bullets.length > 0 && (
                <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                  {theme.bullets.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 hanji-panel rounded-3xl p-6">
        <h3 className="pillar-gan text-2xl">{msg(locale, "daeunTitle")}</h3>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-3">
          {chart.daeun.map((item, index) => (
            <button
              key={item.ganzhi + item.startAge}
              type="button"
              onClick={() => setSelectedDaeun(index)}
              className={`min-w-28 rounded-2xl border px-3 py-3 text-left ${selectedDaeun === index ? "border-[var(--gold)] bg-[#221b14]" : "border-[var(--line)]"}`}
            >
              <p className="text-xs text-[var(--muted)]">
                {item.startAge}–{item.endAge}
              </p>
              <p className="pillar-gan text-xl">{item.ganzhi}</p>
              <p className="text-xs text-[var(--gold)]">{stars(item.stars)}</p>
            </button>
          ))}
        </div>
        {daeun && (
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p>
              {daeun.ganzhiKorean} · {tenGod(daeun.tenGodKorean, locale)}
            </p>
            <p>
              {msg(locale, "keywords")} {daeun.keywords.join(" · ")}
            </p>
            <p>
              {msg(locale, "money")} {prose(daeun.money, locale)}
            </p>
            <p>
              {msg(locale, "career")} {prose(daeun.career, locale)}
            </p>
            <p>
              {msg(locale, "love")} {prose(daeun.love, locale)}
            </p>
            <p>
              {msg(locale, "health")} {prose(daeun.health, locale)}
            </p>
            <p>
              {msg(locale, "relation")} {prose(daeun.relationship, locale)}
            </p>
            <p>
              {msg(locale, "caution")} {prose(daeun.caution, locale)}
            </p>
            <p className="sm:col-span-2">
              {msg(locale, "opportunity")} {prose(daeun.opportunity, locale)}
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 hanji-panel rounded-3xl p-6">
        <h3 className="pillar-gan text-2xl">{msg(locale, "seunTitle")}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{msg(locale, "seunHint")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibleSeun.map((item) => (
            <article key={item.year} className="rounded-xl border border-[var(--line)] p-4">
              <p className="text-lg">{item.year}</p>
              <p className="text-[var(--gold)]">{stars(item.stars)}</p>
              <p className="mt-2 text-sm">
                {item.ganzhi} · {tenGod(item.tenGodKorean, locale)}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {msg(locale, "career")} {prose(item.career, locale)}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {msg(locale, "money")} {prose(item.money, locale)}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {msg(locale, "love")} {prose(item.love, locale)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 text-center">
        <button type="button" onClick={() => setShowMore((value) => !value)} className="text-sm text-[var(--gold)] underline-offset-4 hover:underline">
          {showMore ? msg(locale, "hideReport") : msg(locale, "moreReport")}
        </button>
      </div>

      {showMore && (
        <div className="mt-6 space-y-6">
          {data.report.sections.map((section) => (
            <article key={section.id} className="hanji-panel rounded-3xl p-6">
              <h3 className="pillar-gan text-2xl">{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 20)} className="mb-3 mt-3 leading-7 text-[#ddd6c8]">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  {section.bullets.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}

      <section className="mt-6 hanji-panel rounded-3xl p-6">
        <h3 className="pillar-gan text-2xl">{msg(locale, "evidenceTitle")}</h3>
        <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
          {chart.evidence.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-[var(--muted)]">{data.report.disclaimer}</p>
      </section>
    </div>
  );
}
