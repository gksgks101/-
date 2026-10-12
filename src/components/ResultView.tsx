"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ELEMENT_KO } from "@/lib/saju/constants";
import type { AnalyzeResponse, Pillar, SajuCalculation } from "@/lib/saju/types";

const TABS = [
  ["all", "전체 리포트"],
  ["natal", "원국"],
  ["character", "성격"],
  ["wealth", "재물"],
  ["career", "직업"],
  ["love", "연애"],
  ["marriage", "결혼"],
  ["health", "건강"],
  ["family", "가족"],
  ["daeun", "대운"],
  ["seun", "세운"],
  ["sinsal", "신살"],
  ["roast", "팩트폭행"],
  ["talent", "강점"],
  ["advice", "현실 조언"],
] as const;

const ELEMENT_COLOR: Record<string, string> = {
  wood: "var(--wood)",
  fire: "var(--fire)",
  earth: "var(--earth)",
  metal: "var(--metal)",
  water: "var(--water)",
};

function stars(count: number) {
  return "★".repeat(count) + "☆".repeat(Math.max(0, 5 - count));
}

function PillarCard({ title, pillar }: { title: string; pillar: Pillar | null }) {
  if (!pillar) {
    return (
      <article className="rounded-2xl border border-[var(--line)] bg-[#14110e] p-4 text-center">
        <p className="text-xs tracking-[0.2em] text-[var(--muted)]">{title}</p>
        <p className="mt-6 text-[var(--muted)]">미상</p>
      </article>
    );
  }
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[#14110e] p-4 text-center">
      <p className="text-xs tracking-[0.2em] text-[var(--muted)]">{title}</p>
      <p className="pillar-gan mt-3 text-3xl text-[var(--gold)]">{pillar.gan}</p>
      <p className="text-sm text-[var(--muted)]">
        {pillar.ganKorean} · {pillar.ganTenGodKorean}
      </p>
      <div className="gold-line my-3" />
      <p className="pillar-gan text-3xl">{pillar.zhi}</p>
      <p className="text-sm text-[var(--muted)]">
        {pillar.zhiKorean} · {pillar.twelveStageKorean}
      </p>
      <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
        지장간
        <br />
        {pillar.hiddenStems.map((item) => `${item.ganKorean}${item.roleKorean}`).join(" · ")}
      </p>
    </article>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const width = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="grid grid-cols-[2rem_1fr_3rem] items-center gap-3 text-sm">
      <span>{label}</span>
      <div className="h-2 rounded-full bg-[#2a241d]">
        <div className="h-2 rounded-full" style={{ width: `${width}%`, background: color }} />
      </div>
      <span className="text-right text-[var(--muted)]">{Math.round(value)}</span>
    </div>
  );
}

export function ResultView() {
  const [data] = useState<AnalyzeResponse | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("saju-result");
    return raw ? (JSON.parse(raw) as AnalyzeResponse) : null;
  });
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("all");
  const [selectedDaeun, setSelectedDaeun] = useState(0);
  const [compareIndex, setCompareIndex] = useState(0);
  const [cleared, setCleared] = useState(false);

  const chart: SajuCalculation | undefined = useMemo(() => {
    if (!data) return undefined;
    if (data.calculation.alternatives?.length) {
      return compareIndex === 0 ? data.calculation : data.calculation.alternatives[compareIndex - 1];
    }
    return data.calculation;
  }, [data, compareIndex]);

  if (cleared) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p>입력값과 결과를 이 브라우저에서 삭제했습니다.</p>
        <Link href="/" className="mt-6 inline-block text-[var(--gold)]">
          다시 분석하기
        </Link>
      </div>
    );
  }

  if (!data || !chart) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p>아직 분석 결과가 없습니다.</p>
        <Link href="/" className="mt-6 inline-block text-[var(--gold)]">
          생년월일 입력하기
        </Link>
      </div>
    );
  }

  const maxPower = Math.max(...Object.values(chart.elements.powerScore), 1);
  const currentYear = new Date().getFullYear();
  const visibleSeun = chart.seun.filter((item) => item.year >= currentYear && item.year <= currentYear + 20);
  const daeun = chart.daeun[selectedDaeun] ?? chart.daeun[0];
  const visibleSections =
    tab === "all"
      ? data.report.sections
      : data.report.sections.filter((section) => section.id === tab || (tab === "character" && section.id === "natal"));

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-[var(--gold)]">SAJU CHART</p>
          <h1 className="pillar-gan mt-2 text-3xl sm:text-4xl">{chart.birth.displayName}님의 사주</h1>
          <p className="mt-2 text-[var(--muted)]">
            {chart.birth.solarDate} {chart.birth.time ?? "시간 미상"} · {chart.birth.location} · {chart.birth.gender === "male" ? "남성" : "여성"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("saju-result");
            setCleared(true);
          }}
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"
        >
          입력값 삭제
        </button>
      </div>

      {chart.hourBoundary?.crossesBoundary && (
        <section className="mb-8 rounded-2xl border border-[var(--gold)]/40 bg-[#1c1812] p-5">
          <p className="text-[var(--gold)]">시간이 경계에 걸쳐 있습니다.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{chart.hourBoundary.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCompareIndex(0)}
              className={`rounded-full px-4 py-2 text-sm ${compareIndex === 0 ? "bg-[var(--gold)] text-[#1a140e]" : "border border-[var(--line)]"}`}
            >
              기본 결과
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

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <PillarCard title="년주" pillar={chart.pillars.year} />
        <PillarCard title="월주" pillar={chart.pillars.month} />
        <PillarCard title="일주" pillar={chart.pillars.day} />
        <PillarCard title="시주" pillar={chart.pillars.hour} />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-[var(--line)] bg-[#14110e] p-5">
          <h2 className="mb-4 text-sm tracking-[0.2em] text-[var(--muted)]">오행 실제 세력</h2>
          <div className="space-y-3">
            {(Object.keys(ELEMENT_KO) as Array<keyof typeof ELEMENT_KO>).map((key) => (
              <Bar key={key} label={ELEMENT_KO[key]} value={chart.elements.powerScore[key]} max={maxPower} color={ELEMENT_COLOR[key]} />
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            단순 개수 목{chart.elements.simpleCount.wood} 화{chart.elements.simpleCount.fire} 토{chart.elements.simpleCount.earth} 금
            {chart.elements.simpleCount.metal} 수{chart.elements.simpleCount.water} / 세력 목{chart.elements.powerLabel.wood} 화
            {chart.elements.powerLabel.fire} 토{chart.elements.powerLabel.earth} 금{chart.elements.powerLabel.metal} 수{chart.elements.powerLabel.water}
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-[#14110e] p-5">
          <h2 className="mb-3 text-sm tracking-[0.2em] text-[var(--muted)]">이 사람의 핵심 구조</h2>
          <p className="pillar-gan text-2xl">{chart.strength.classification}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{chart.pattern.name}</p>
          <p className="mt-4 text-sm">
            용신 {chart.useGod.yongsin.join("·")} · 희신 {chart.useGod.heesin.join("·")}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {chart.strength.reasons.slice(0, 4).map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${tab === id ? "bg-[var(--gold)] text-[#1a140e]" : "border border-[var(--line)] text-[var(--muted)]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {visibleSections.map((section) => (
          <article key={section.id} className="rounded-2xl border border-[var(--line)] bg-[#14110e] p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="pillar-gan text-2xl">{section.title}</h3>
              {section.locked && <span className="text-xs text-[var(--gold)]">상세 리포트</span>}
            </div>
            {section.locked ? (
              <p className="text-[var(--muted)]">무료 구간에서는 사주팔자, 오행, 핵심 구조만 열립니다. 이 데모에서는 상세 리포트가 함께 계산되어 있습니다.</p>
            ) : (
              <>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mb-3 leading-7 text-[#ddd6c8]">
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
              </>
            )}
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--line)] bg-[#14110e] p-6">
        <h3 className="pillar-gan text-2xl">10년 대운</h3>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-3">
          {chart.daeun.map((item, index) => (
            <button
              key={item.ganzhi + item.startAge}
              type="button"
              onClick={() => setSelectedDaeun(index)}
              className={`min-w-28 rounded-2xl border px-3 py-3 text-left ${selectedDaeun === index ? "border-[var(--gold)] bg-[#221b14]" : "border-[var(--line)]"}`}
            >
              <p className="text-xs text-[var(--muted)]">
                {item.startAge}–{item.endAge}세
              </p>
              <p className="pillar-gan text-xl">{item.ganzhi}</p>
              <p className="text-xs text-[var(--gold)]">{stars(item.stars)}</p>
            </button>
          ))}
        </div>
        {daeun && (
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p>
              대운 {daeun.ganzhiKorean} · {daeun.tenGodKorean}
            </p>
            <p>키워드 {daeun.keywords.join(" · ")}</p>
            <p>돈 {daeun.money}</p>
            <p>직업 {daeun.career}</p>
            <p>연애 {daeun.love}</p>
            <p>건강 {daeun.health}</p>
            <p>인간관계 {daeun.relationship}</p>
            <p>주의 {daeun.caution}</p>
            <p className="sm:col-span-2">기회 {daeun.opportunity}</p>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-[#14110e] p-6">
        <h3 className="pillar-gan text-2xl">세운 타임라인</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">별점은 명리학적 상대 평가이며 확정적인 미래 예측이 아닙니다.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibleSeun.map((item) => (
            <article key={item.year} className="rounded-xl border border-[var(--line)] p-4">
              <p className="text-lg">{item.year}</p>
              <p className="text-[var(--gold)]">{stars(item.stars)}</p>
              <p className="mt-2 text-sm">
                {item.ganzhi} · {item.tenGodKorean}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">직업 {item.career}</p>
              <p className="text-xs text-[var(--muted)]">돈 {item.money}</p>
              <p className="text-xs text-[var(--muted)]">연애 {item.love}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-[#14110e] p-6">
        <h3 className="pillar-gan text-2xl">계산 근거</h3>
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
