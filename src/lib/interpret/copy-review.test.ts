import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
import { coreHeadline } from "./coreCopy";
import { buildThemeCards } from "./themes";
import { yongsinLine } from "./yongsin";
import { calculateSaju } from "@/lib/saju/engine";

const sample = calculateSaju({
  gender: "male",
  calendar: "solar",
  date: "2001-03-23",
  timeKnowledge: "approximate",
  time: "13:00",
  timeAccuracy: "about_1h",
  country: "대한민국",
  city: "안산",
});

describe("테스트 생일 카피", () => {
  it("ko/es/pl에서 긴 문장이 카드 사이에 그대로 반복되지 않는다", () => {
    for (const locale of LOCALES) {
      const cards = buildThemeCards(sample, locale);
      const yong = yongsinLine(sample, locale);
      const seen = new Map<string, string>();
      for (const card of cards) {
        const blobs = [...card.easy, ...(card.easySections ?? []).flatMap((item) => item.items)];
        for (const line of blobs) {
          const key = line.replace(/\s+/g, " ").trim();
          if (key.length < 18) continue;
          if (key === yong) continue;
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
    const jobs = buildThemeCards(sample, "ko").find((item) => item.id === "career")?.easySections?.[0]?.items ?? [];
    expect(jobs).toHaveLength(5);
    expect(new Set(jobs).size).toBe(5);
  });

  it("한국어 조사 받침을 지킨다", () => {
    const cards = buildThemeCards(sample, "ko");
    const blob = cards
      .flatMap((card) => [card.easyHeadline, ...card.easy, ...(card.easySections ?? []).flatMap((item) => item.items)])
      .join("\n");
    expect(blob).not.toMatch(/화을|수과|목과/);
    expect(coreHeadline(sample, "ko")).toContain("매화라");
  });
});
