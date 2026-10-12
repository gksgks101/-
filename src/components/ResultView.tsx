"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { prose } from "@/lib/i18n/prose";
import { GENDER_NAME, PILLAR_NAME, STRENGTH_NAME, placeName, tenGod, term } from "@/lib/i18n/terms";
import { currentDaeun } from "@/lib/interpret/themeContext";
import { buildThemeCards } from "@/lib/interpret/themes";
import { buildResultSummary, youAreLine } from "@/lib/interpret/summary";
import { buildTodayMonth } from "@/lib/interpret/today";
import { accentFromYongsin, yongsinLine, yongsinReason } from "@/lib/interpret/yongsin";
import { dayMasterCard } from "@/lib/saju/dayCards";
import { decodeShareQuery, encodeShareQuery } from "@/lib/share/resultUrl";
import { downloadBlob, renderSharePoster, shareOrDownload } from "@/lib/share/renderPoster";
import type { AnalyzeResponse, Pillar, SajuCalculation } from "@/lib/saju/types";
import { DayMasterCard } from "./DayMasterCard";
import { ElementChart } from "./ElementChart";
import { MatchPanel } from "./MatchPanel";
import { SeasonDaeun } from "./SeasonDaeun";
import { ThemeDeck } from "./ThemeDeck";

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
      <p className="pillar-gan mt-3 text-3xl text-[var(--accent)]">{pillar.gan}</p>
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

const SCORE_LABEL: Record<string, string> = {
  love: "love",
  wealth: "money",
  career: "career",
  health: "health",
  relations: "relation",
};

export function ResultView({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [ready, setReady] = useState(false);
  const [selectedDaeun, setSelectedDaeun] = useState<number | null>(null);
  const [compareIndex, setCompareIndex] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSeunMore, setShowSeunMore] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
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
  const summary = chart ? buildResultSummary(chart, locale) : null;
  const fortunes = chart ? buildTodayMonth(chart, locale) : null;
  const accent = chart ? accentFromYongsin(chart) : "#c41e3a";

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const raw = sessionStorage.getItem("saju-result");
      if (raw) {
        if (!cancelled) {
          setData(JSON.parse(raw) as AnalyzeResponse);
          setReady(true);
        }
        return;
      }
      const share = decodeShareQuery(searchParams);
      if (!share) {
        if (!cancelled) setReady(true);
        return;
      }
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...share, locale, unlockFull: true }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error);
        sessionStorage.setItem("saju-result", JSON.stringify(json));
        if (!cancelled) setData(json as AnalyzeResponse);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [locale, searchParams]);

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

  async function copyShareLink() {
    if (!data?.shareInput) return;
    const url = `${window.location.origin}/${locale}/result?${encodeShareQuery(data.shareInput)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareState(msg(locale, "shareLinkCopied"));
    } catch {
      setShareState(url);
    }
  }

  if (!ready) {
    return <div className="mx-auto max-w-xl px-5 py-24 text-center text-[var(--muted)]">{msg(locale, "analyzing")}</div>;
  }

  if (cleared) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p>{msg(locale, "cleared")}</p>
        <Link href={`/${locale}`} className="mt-6 inline-block text-[var(--dancheong)]">
          {msg(locale, "analyzeAgain")}
        </Link>
      </div>
    );
  }

  if (!data || !chart || !card || !summary) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p>{msg(locale, "noResult")}</p>
        <Link href={`/${locale}`} className="mt-6 inline-block text-[var(--dancheong)]">
          {msg(locale, "enterBirth")}
        </Link>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const nearSeun = chart.seun.filter((item) => item.year >= currentYear - 2 && item.year <= currentYear + 2);
  const extraSeun = chart.seun.filter((item) => item.year < currentYear - 2 || item.year > currentYear + 2);
  const displayName =
    !chart.birth.displayName || chart.birth.displayName === "익명" ? msg(locale, "anonymous") : chart.birth.displayName;
  const location = chart.birth.location
    .split(" ")
    .map((part) => placeName(part, locale))
    .join(" ");
  const hourCandidates = data.hourCandidates ?? [];
  const nowDaeun = currentDaeun(chart);
  const currentDaeunIndex = chart.daeun.findIndex(
    (item) => item.ganzhi === nowDaeun?.ganzhi && item.startAge === nowDaeun.startAge,
  );
  const daeunIndex = selectedDaeun ?? (currentDaeunIndex >= 0 ? currentDaeunIndex : 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10" style={{ ["--accent" as string]: accent }}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--accent)]">{msg(locale, "resultKicker")}</p>
          <h1 className="pillar-gan mt-2 text-4xl leading-tight sm:text-5xl">{youAreLine(summary.typeName, locale)}</h1>
          <p className="mt-2 text-[var(--muted)]">
            {chart.birth.solarDate} {chart.birth.time ?? msg(locale, "timeUnknownLabel")} · {location} ·{" "}
            {GENDER_NAME[chart.birth.gender][locale]}
            {displayName !== msg(locale, "anonymous") ? ` · ${displayName}` : ""}
          </p>
          <p className="mt-4 text-sm tracking-[0.18em] text-[var(--muted)]">{msg(locale, "yearKeywords")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {summary.yearKeywords.map((word) => (
              <span
                key={word}
                className="rounded-full border border-[var(--line)] bg-white/50 px-4 py-2 text-lg font-semibold text-[var(--ink)]"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyShareLink()}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-[var(--ivory)]"
          >
            {msg(locale, "shareLink")}
          </button>
          <button
            type="button"
            onClick={async () => {
              const blob = await makeImage();
              if (!blob) return;
              const file = `saju-${chart.dayMaster.gan}-${chart.birth.solarDate}.png`;
              await downloadBlob(blob, file);
              setShareState(msg(locale, "shareCopied"));
            }}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
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
      {shareState && <p className="mb-6 text-sm text-[var(--dancheong)]">{shareState}</p>}

      <section className="mb-8 grid grid-cols-5 gap-2 rounded-3xl border border-[var(--line)] bg-white/40 p-4">
        {summary.scores.map((item) => (
          <div key={item.id} className="text-center">
            <p className="text-xs text-[var(--muted)] sm:text-sm">{msg(locale, SCORE_LABEL[item.id])}</p>
            <p className="mt-1 text-base text-[var(--dancheong)] sm:text-xl" aria-label={`${item.stars}/5`}>
              {stars(item.stars)}
            </p>
          </div>
        ))}
      </section>

      {fortunes && (
        <section className="mb-8 grid gap-3 sm:grid-cols-2">
          {[fortunes.today, fortunes.month].map((item) => (
            <article key={item.title} className="hanji-panel rounded-2xl p-5">
              <p className="text-xs tracking-[0.2em] text-[var(--muted)]">{msg(locale, "todayHint")}</p>
              <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
              <p className="mt-1 text-[var(--dancheong)]">{stars(item.stars)}</p>
              <p className="mt-2 leading-7">{item.line}</p>
            </article>
          ))}
        </section>
      )}

      {hourCandidates.length > 1 && (
        <section className="mb-8 rounded-2xl border border-[var(--accent)]/40 bg-white/50 p-5">
          <p className="font-semibold text-[var(--dancheong)]">{msg(locale, "hourMaybeTitle")}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{msg(locale, "hourMaybeLead")}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {hourCandidates.map((item) => (
              <li key={`${item.ganzhi}-${item.time}`}>
                {item.ganzhiKorean} ({item.zhiKorean}) · {item.time}
                {item.isCurrent ? ` · ${msg(locale, "hourCurrent")}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {chart.hourBoundary?.crossesBoundary && (
        <section className="mb-8 rounded-2xl border border-[var(--accent)]/40 bg-white/50 p-5">
          <p className="text-[var(--dancheong)]">{msg(locale, "boundaryTitle")}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{chart.hourBoundary.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCompareIndex(0)}
              className={`rounded-full px-4 py-2 text-sm ${compareIndex === 0 ? "bg-[var(--accent)] text-[var(--ivory)]" : "border border-[var(--line)]"}`}
            >
              {msg(locale, "defaultResult")}
            </button>
            {chart.hourBoundary.cases.map((item, index) => (
              <button
                key={item.time}
                type="button"
                onClick={() => setCompareIndex(index + 1)}
                className={`rounded-full px-4 py-2 text-sm ${compareIndex === index + 1 ? "bg-[var(--accent)] text-[var(--ivory)]" : "border border-[var(--line)]"}`}
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
          <p className="mt-4 text-sm">{yongsinLine(chart, locale)}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{yongsinReason(chart, locale)}</p>
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
        <ThemeDeck themes={themes} locale={locale} />
      </section>

      <SeasonDaeun locale={locale} chart={chart} selected={daeunIndex} onSelect={setSelectedDaeun} />

      <section className="mt-6 hanji-panel rounded-3xl p-6">
        <h3 className="pillar-gan text-2xl">{msg(locale, "seunTitle")}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{msg(locale, "seunHint")}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {nearSeun.map((item) => (
            <article
              key={item.year}
              className={`rounded-xl border p-4 ${item.year === currentYear ? "border-[var(--accent)] bg-white/50" : "border-[var(--line)]"}`}
            >
              <p className="text-lg">{item.year}</p>
              <p className="text-[var(--dancheong)]">{stars(item.stars)}</p>
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
        {extraSeun.length > 0 && (
          <div className="mt-4 text-center">
            <button type="button" onClick={() => setShowSeunMore((value) => !value)} className="text-sm text-[var(--dancheong)] underline-offset-4 hover:underline">
              {showSeunMore ? msg(locale, "hideSeun") : msg(locale, "moreSeun")}
            </button>
          </div>
        )}
        {showSeunMore && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {extraSeun.map((item) => (
              <article key={item.year} className="rounded-xl border border-[var(--line)] p-4">
                <p className="text-lg">{item.year}</p>
                <p className="text-[var(--dancheong)]">{stars(item.stars)}</p>
                <p className="mt-2 text-sm">
                  {item.ganzhi} · {tenGod(item.tenGodKorean, locale)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <MatchPanel locale={locale} self={data} />

      <div className="mt-10 space-y-3 text-center">
        <button type="button" onClick={() => setShowMore((value) => !value)} className="block w-full text-sm text-[var(--dancheong)] underline-offset-4 hover:underline">
          {showMore ? msg(locale, "hideReport") : msg(locale, "moreReport")}
        </button>
        <button type="button" onClick={() => setShowEvidence((value) => !value)} className="block w-full text-sm text-[var(--dancheong)] underline-offset-4 hover:underline">
          {showEvidence ? msg(locale, "hideEvidence") : msg(locale, "moreEvidence")}
        </button>
      </div>

      {showMore && (
        <div className="mt-6 space-y-6">
          {data.report.sections.map((section) => (
            <article key={section.id} className="hanji-panel rounded-3xl p-6">
              <h3 className="pillar-gan text-2xl">{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 20)} className="mb-3 mt-3 leading-7 text-[var(--ink)]">
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

      {showEvidence && (
        <section className="mt-6 hanji-panel rounded-3xl p-6">
          <h3 className="pillar-gan text-2xl">{msg(locale, "evidenceTitle")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {chart.evidence.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-[var(--muted)]">{data.report.disclaimer}</p>
        </section>
      )}
    </div>
  );
}
