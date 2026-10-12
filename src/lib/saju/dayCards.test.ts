import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
import { buildThemeCards, elementPercents } from "@/lib/interpret/themes";
import { calculateSaju } from "./engine";
import { DAY_MASTER_CARDS, dayMasterCard } from "./dayCards";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

describe("일간 카드", () => {
  it("천간 10개마다 이미지가 있다", () => {
    expect(Object.keys(DAY_MASTER_CARDS)).toEqual(STEMS);
    for (const gan of STEMS) {
      const card = dayMasterCard(gan);
      expect(card.image.startsWith("/cards/")).toBe(true);
      for (const locale of LOCALES) {
        expect(card.title[locale].length).toBeGreaterThan(3);
        expect(card.subtitle[locale].length).toBeGreaterThan(8);
      }
    }
  });
});

describe("해석 카드", () => {
  const calculation = calculateSaju({
    gender: "male",
    calendar: "solar",
    date: "2001-03-23",
    timeKnowledge: "exact",
    time: "13:00",
    country: "대한민국",
    city: "안산",
  });

  it("세 언어 모두 여섯 장을 만든다", () => {
    for (const locale of LOCALES) {
      const cards = buildThemeCards(calculation, locale);
      expect(cards.map((item) => item.id)).toEqual(["character", "love", "wealth", "career", "health", "year"]);
      for (const card of cards) {
        expect(card.paragraphs.length).toBeGreaterThanOrEqual(3);
        expect(card.title.length).toBeGreaterThan(1);
      }
    }
  });

  it("오행 비율 합은 100이다", () => {
    const percents = elementPercents(calculation.elements.powerScore);
    const sum = Object.values(percents).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});
