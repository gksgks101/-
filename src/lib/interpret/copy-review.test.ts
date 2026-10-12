import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
import { coreContrast, coreHeadline } from "./coreCopy";
import { elementBalloon, strongestMetaphor } from "./elementGuide";
import { daeunEasy, lifeStages } from "./fortuneYears";
import { assertEasyCopy, findForbiddenTerms } from "./forbidden";
import { pillarEasyLines } from "./glyphs";
import { sharePosterCopy } from "@/lib/share/renderPoster";
import { buildThemeCards, elementPercents } from "./themes";
import { calculateSaju } from "@/lib/saju/engine";
import type { BirthInputPayload } from "@/lib/saju/schema";
import type { SajuCalculation } from "@/lib/saju/types";

const BIRTHS: BirthInputPayload[] = [
  { gender: "male", calendar: "solar", date: "2001-03-23", timeKnowledge: "approximate", time: "13:00", timeAccuracy: "about_1h", country: "대한민국", city: "안산" },
  { gender: "female", calendar: "solar", date: "1998-08-08", timeKnowledge: "exact", time: "09:00", country: "대한민국", city: "서울" },
  { gender: "male", calendar: "solar", date: "1995-11-12", timeKnowledge: "exact", time: "22:00", country: "대한민국", city: "부산" },
  { gender: "female", calendar: "solar", date: "1990-01-05", timeKnowledge: "exact", time: "07:30", country: "대한민국", city: "대구" },
  { gender: "female", calendar: "solar", date: "1988-04-18", timeKnowledge: "exact", time: "15:00", country: "대한민국", city: "광주" },
  { gender: "male", calendar: "solar", date: "2003-06-21", timeKnowledge: "exact", time: "11:00", country: "대한민국", city: "인천" },
  { gender: "female", calendar: "solar", date: "1985-09-30", timeKnowledge: "exact", time: "18:00", country: "대한민국", city: "대전" },
  { gender: "male", calendar: "solar", date: "1978-12-25", timeKnowledge: "exact", time: "04:00", country: "대한민국", city: "수원" },
  { gender: "male", calendar: "solar", date: "1992-02-14", timeKnowledge: "exact", time: "08:00", country: "대한민국", city: "제주" },
  { gender: "female", calendar: "solar", date: "2000-07-07", timeKnowledge: "exact", time: "20:00", country: "대한민국", city: "울산" },
];

function easyLines(calculation: SajuCalculation, locale: (typeof LOCALES)[number]): string[] {
  const cards = buildThemeCards(calculation, locale);
  const percents = elementPercents(calculation.elements.powerScore);
  const balloons = (["wood", "fire", "earth", "metal", "water"] as const).flatMap((key) => {
    const balloon = elementBalloon(key, percents[key], calculation.elements.powerLabel[key], locale);
    return [balloon.title, balloon.meaning, balloon.much, balloon.little, balloon.mine, balloon.tip];
  });
  const pillars = (["year", "month", "day", "hour"] as const).flatMap((key) => {
    const pillar = calculation.pillars[key];
    return pillar ? pillarEasyLines(pillar, key, locale) : [];
  });
  const contrast = coreContrast(calculation, locale);
  const daeun = calculation.daeun.flatMap((item) => {
    const easy = daeunEasy(item, locale);
    return [easy.keyword, ...easy.lines];
  });
  return [
    coreHeadline(calculation, locale),
    ...contrast.good.flatMap((item) => [item.label, item.why]),
    ...contrast.caution.flatMap((item) => [item.label, item.why]),
    strongestMetaphor(calculation.dayMaster.element, locale),
    ...balloons,
    ...pillars,
    ...lifeStages(calculation, locale).flatMap((stage) => [stage.keyword, ...stage.lines]),
    ...daeun,
    ...sharePosterCopy(calculation, locale, cards),
    ...cards.flatMap((card) => [
      card.easyHeadline,
      ...card.easy,
      ...(card.easySections ?? []).flatMap((block) => block.items),
      ...(card.contrast ?? []).flatMap((block) => [
        block.goodTitle,
        block.cautionTitle,
        ...block.good.flatMap((item) => [item.label, item.why]),
        ...block.caution.flatMap((item) => [item.label, item.why]),
      ]),
      ...(card.lifestyleTabs ?? []).flatMap((tab) => [
        tab.title,
        ...tab.easy,
        ...(tab.extra ?? []),
        ...(tab.contrast
          ? [
              tab.contrast.goodTitle,
              tab.contrast.cautionTitle,
              ...tab.contrast.good.flatMap((item) => [item.label, item.why]),
              ...tab.contrast.caution.flatMap((item) => [item.label, item.why]),
            ]
          : []),
      ]),
    ]),
  ];
}

const sample = calculateSaju(BIRTHS[0]);

describe("테스트 생일 카피", () => {
  it("ko/es/pl에서 긴 문장이 카드 사이에 그대로 반복되지 않는다", () => {
    for (const locale of LOCALES) {
      const cards = buildThemeCards(sample, locale);
      const seen = new Map<string, string>();
      for (const card of cards) {
        const blobs = [
          ...card.easy,
          ...(card.easySections ?? []).flatMap((item) => item.items),
          ...(card.contrast ?? []).flatMap((block) => [...block.good, ...block.caution].map((item) => item.why)),
          ...(card.lifestyleTabs ?? []).flatMap((tab) => tab.easy),
        ];
        for (const line of blobs) {
          const key = line.replace(/\s+/g, " ").trim();
          if (key.length < 18) continue;
          const prev = seen.get(key);
          if (prev && prev !== card.id) {
            expect(prev, `${locale} repeat on ${card.id} and ${prev}: ${key}`).toBe(card.id);
          }
          seen.set(key, card.id);
        }
      }
      expect(coreHeadline(sample, locale).length).toBeGreaterThan(20);
    }
  });

  it("직업 5순위 이유가 서로 다르다", () => {
    const jobs = buildThemeCards(sample, "ko").find((item) => item.id === "career")?.contrast?.[0]?.good ?? [];
    expect(jobs).toHaveLength(5);
    expect(new Set(jobs.map((item) => item.why)).size).toBe(5);
  });

  it("한국어 조사 받침을 지킨다", () => {
    const cards = buildThemeCards(sample, "ko");
    const blob = easyLines(sample, "ko").join("\n");
    expect(blob).not.toMatch(/화을|수과|목과/);
    expect(coreHeadline(sample, "ko")).toContain("매화라");
    expect(blob).toContain("태어난 해");
    expect(blob).not.toMatch(/(^|[^가-힣])년주([^가-힣]|$)/);
    expect(cards.find((item) => item.id === "lifestyle")?.lifestyleTabs).toHaveLength(5);
  });

  it("생일 10개의 뒷면 전체가 서로 다르다", () => {
    const blobs = BIRTHS.map((birth) => easyLines(calculateSaju(birth), "ko").join("\n"));
    expect(new Set(blobs).size).toBe(10);
  });
});

describe("뒷면 금지어", () => {
  it("생일 10개·세 언어 뒷면에 전문용어가 없다", () => {
    expect(BIRTHS).toHaveLength(10);
    for (const birth of BIRTHS) {
      const calculation = calculateSaju(birth);
      for (const locale of LOCALES) {
        const lines = easyLines(calculation, locale);
        const hits = findForbiddenTerms(lines.join("\n"));
        expect(hits, `${birth.date} ${birth.gender} ${locale}: ${hits.map((hit) => hit.term).join(",")}`).toEqual([]);
        assertEasyCopy(`${birth.date} ${locale}`, lines, locale);
      }
    }
  });
});
