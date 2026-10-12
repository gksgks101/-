import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
import { THEME_IDS, buildThemeCards, elementPercents } from "@/lib/interpret/themes";
import { yongsinLine } from "@/lib/interpret/yongsin";
import { calculateSaju } from "./engine";
import { DAY_MASTER_CARDS, dayMasterCard } from "./dayCards";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

describe("일간 카드", () => {
  it("천간 10개마다 이미지와 키워드 3개가 있다", () => {
    expect(Object.keys(DAY_MASTER_CARDS)).toEqual(STEMS);
    for (const gan of STEMS) {
      const card = dayMasterCard(gan);
      expect(card.image.startsWith("/cards/")).toBe(true);
      for (const locale of LOCALES) {
        expect(card.title[locale].length).toBeGreaterThan(3);
        expect(card.subtitle[locale].length).toBeGreaterThan(8);
        expect(card.keywords[locale]).toHaveLength(3);
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

  it("세 언어 모두 열 장을 앞 2~3줄, 뒤 결론+문장으로 만든다", () => {
    for (const locale of LOCALES) {
      const cards = buildThemeCards(calculation, locale);
      expect(cards.map((item) => item.id)).toEqual([...THEME_IDS]);
      for (const card of cards) {
        expect(card.front.length).toBeGreaterThanOrEqual(2);
        expect(card.front.length).toBeLessThanOrEqual(3);
        expect(card.frontTerms.length).toBeLessThanOrEqual(3);
        expect(card.easyHeadline.length).toBeGreaterThan(4);
        expect(card.easy.length).toBeGreaterThanOrEqual(2);
        expect(card.easy.length).toBeLessThanOrEqual(4);
        expect(card.title.length).toBeGreaterThan(1);
      }
      const wealth = cards.find((item) => item.id === "wealth");
      expect(wealth?.disclaimer).toContain(locale === "ko" ? "재미로" : locale === "es" ? "entretenimiento" : "rozrywkowa");
      const colors = cards.find((item) => item.id === "colors");
      expect(colors?.luckyColors?.length).toBeGreaterThan(0);
      expect(colors?.avoidColors?.length).toBeGreaterThan(0);
    }
  });

  it("오행 비율 합은 100이다", () => {
    const percents = elementPercents(calculation.elements.powerScore);
    const sum = Object.values(percents).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it("카드마다 주제만 쓰고 용신은 핵심 구조와 같은 문장이다", () => {
    const cards = buildThemeCards(calculation, "ko");
    const byId = Object.fromEntries(cards.map((item) => [item.id, item]));
    const yong = yongsinLine(calculation, "ko");
    expect(byId.colors.front.join(" ")).toContain(yong);
    expect(byId.fengshui.front.join(" ")).toContain(yong);
    expect(byId.character.front.join(" ")).not.toContain(yong);
    expect(byId.character.front.join(" ")).toMatch(/격국|십성|일간/);
    expect(byId.career.front.join(" ")).toMatch(/대운|적성|십성/);
    expect(byId.wealth.front.join(" ")).toMatch(/정재|편재|식상/);
    expect(byId.love.front.join(" ")).toMatch(/배우자궁|12운성|일지/);
    expect(byId.year.front.join(" ")).toMatch(/세운|대운/);
    expect(byId.year.front.some((line) => /\d{4}년/.test(line))).toBe(true);
  });
});
