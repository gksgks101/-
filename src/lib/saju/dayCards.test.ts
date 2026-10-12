import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n/config";
import { THEME_IDS, buildThemeCards, elementPercents } from "@/lib/interpret/themes";
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

  it("세 언어 모두 열 장을 앞뒤로 만든다", () => {
    for (const locale of LOCALES) {
      const cards = buildThemeCards(calculation, locale);
      expect(cards.map((item) => item.id)).toEqual([...THEME_IDS]);
      for (const card of cards) {
        expect(card.front.length).toBeGreaterThanOrEqual(4);
        expect(card.easyHeadline.length).toBeGreaterThan(4);
        expect(card.easy.length).toBeGreaterThanOrEqual(4);
        expect(card.title.length).toBeGreaterThan(1);
        expect(card.front.join("").length).toBeGreaterThan(220);
        expect(card.easy.join("").length).toBeGreaterThan(180);
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

  it("섹터마다 원국·십성·대운·세운 신호를 겹쳐 쓴다", () => {
    const cards = buildThemeCards(calculation, "ko");
    const byId = Object.fromEntries(cards.map((item) => [item.id, item]));
    const character = `${byId.character.front.join(" ")} ${byId.character.easy.join(" ")}`;
    const career = `${byId.career.front.join(" ")} ${byId.career.easy.join(" ")}`;
    const wealth = `${byId.wealth.front.join(" ")} ${byId.wealth.easy.join(" ")}`;
    const love = `${byId.love.front.join(" ")} ${byId.love.easy.join(" ")}`;
    const year = `${byId.year.front.join(" ")} ${byId.year.easy.join(" ")}`;
    expect(character).toMatch(/격국|용신|십성/);
    expect(career).toMatch(/대운|세운/);
    expect(wealth).toMatch(/식상생재|정재|재미로|잔고/);
    expect(love).toMatch(/배우자궁|12운성|식상/);
    expect(year).toMatch(/세운|대운/);
    expect(byId.year.front.some((line) => /\d{4}년/.test(line))).toBe(true);
  });
});
