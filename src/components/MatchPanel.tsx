"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { buildMatchReport } from "@/lib/interpret/match";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { AnalyzeResponse, GenderType } from "@/lib/saju/types";
import { DayMasterCard } from "./DayMasterCard";

async function analyze(payload: object): Promise<AnalyzeResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "fail");
  return data as AnalyzeResponse;
}

function DateFields({
  date,
  onChange,
  locale,
}: {
  date: string;
  onChange: (value: string) => void;
  locale: Locale;
}) {
  const [year, month, day] = date.split("-");
  const years = Array.from({ length: 151 }, (_, index) => String(1900 + index));
  const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
  const selectClass =
    "w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-3 outline-none focus:border-[var(--accent)]";
  function setPart(part: "year" | "month" | "day", value: string) {
    const next = { year, month, day, [part]: value };
    onChange(`${next.year}-${next.month}-${next.day}`);
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      <select value={year} onChange={(event) => setPart("year", event.target.value)} className={selectClass}>
        {years.map((item) => (
          <option key={item} value={item}>
            {item}
            {locale === "ko" ? "년" : ""}
          </option>
        ))}
      </select>
      <select value={month} onChange={(event) => setPart("month", event.target.value)} className={selectClass}>
        {months.map((item) => (
          <option key={item} value={item}>
            {Number(item)}
            {locale === "ko" ? "월" : ""}
          </option>
        ))}
      </select>
      <select value={day} onChange={(event) => setPart("day", event.target.value)} className={selectClass}>
        {days.map((item) => (
          <option key={item} value={item}>
            {Number(item)}
            {locale === "ko" ? "일" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

export function MatchPanel({
  locale,
  self,
  standalone = false,
}: {
  locale: Locale;
  self?: AnalyzeResponse | null;
  standalone?: boolean;
}) {
  const [selfDate, setSelfDate] = useState("1995-06-15");
  const [selfGender, setSelfGender] = useState<GenderType>("female");
  const [partnerDate, setPartnerDate] = useState("1993-11-02");
  const [partnerGender, setPartnerGender] = useState<GenderType>("male");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mine, setMine] = useState<AnalyzeResponse | null>(self ?? null);
  const [other, setOther] = useState<AnalyzeResponse | null>(null);

  const report = useMemo(() => {
    if (!mine || !other) return null;
    return buildMatchReport(mine.calculation, other.calculation, locale);
  }, [mine, other, locale]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const partner = await analyze({
        gender: partnerGender,
        calendar: "solar",
        date: partnerDate,
        timeKnowledge: "unknown",
        country: "대한민국",
        city: "서울",
        locale,
        unlockFull: true,
      });
      let left = mine ?? self ?? null;
      if (!left) {
        left = await analyze({
          gender: selfGender,
          calendar: "solar",
          date: selfDate,
          timeKnowledge: "unknown",
          country: "대한민국",
          city: "서울",
          locale,
          unlockFull: true,
        });
        setMine(left);
      }
      setOther(partner);
    } catch (err) {
      setError(err instanceof Error ? err.message : msg(locale, "analyzeFail"));
    } finally {
      setLoading(false);
    }
  }

  const myCard = mine ? dayMasterCard(mine.calculation.dayMaster.gan) : null;
  const otherCard = other ? dayMasterCard(other.calculation.dayMaster.gan) : null;

  return (
    <section className="mt-10 hanji-panel rounded-3xl p-6">
      <h3 className="pillar-gan text-2xl">{msg(locale, "matchTitle")}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{msg(locale, "matchLead")}</p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        {(standalone || !self) && (
          <fieldset>
            <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">{msg(locale, "selfBirth")}</legend>
            <div className="mb-2 grid grid-cols-2 gap-2">
              {(["male", "female"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelfGender(value)}
                  className={`rounded-xl border px-3 py-2 ${selfGender === value ? "border-[var(--accent)] text-[var(--dancheong)]" : "border-[var(--line)]"}`}
                >
                  {msg(locale, value)}
                </button>
              ))}
            </div>
            <DateFields date={selfDate} onChange={setSelfDate} locale={locale} />
          </fieldset>
        )}
        <fieldset>
          <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">{msg(locale, "partnerBirth")}</legend>
          <div className="mb-2 grid grid-cols-2 gap-2">
            {(["male", "female"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPartnerGender(value)}
                className={`rounded-xl border px-3 py-2 ${partnerGender === value ? "border-[var(--accent)] text-[var(--dancheong)]" : "border-[var(--line)]"}`}
              >
                {msg(locale, value)}
              </button>
            ))}
          </div>
          <DateFields date={partnerDate} onChange={setPartnerDate} locale={locale} />
        </fieldset>
        {error && <p className="text-sm text-[var(--dancheong)]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--ivory)] disabled:opacity-50"
        >
          {loading ? msg(locale, "submitting") : msg(locale, "matchSubmit")}
        </button>
      </form>

      {report && mine && other && myCard && otherCard && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <DayMasterCard
              card={myCard}
              locale={locale}
              gan={mine.calculation.dayMaster.gan}
              ganKorean={mine.calculation.dayMaster.ganKorean}
            />
            <DayMasterCard
              card={otherCard}
              locale={locale}
              gan={other.calculation.dayMaster.gan}
              ganKorean={other.calculation.dayMaster.ganKorean}
            />
          </div>
          <div className="text-center">
            <p className="text-sm tracking-[0.2em] text-[var(--muted)]">{msg(locale, "matchScore")}</p>
            <p className="pillar-gan mt-1 text-5xl text-[var(--dancheong)]">{report.score}</p>
            <p className="mt-3 text-xl font-semibold">{report.headline}</p>
          </div>
          <div className="space-y-3 text-[17px] leading-7">
            {report.paragraphs.map((line) => (
              <p key={line.slice(0, 24)}>{line}</p>
            ))}
            <ul className="space-y-2 text-[var(--muted)]">
              {report.bullets.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
