import type { Locale } from "@/lib/i18n/config";
import { BRANCH_META } from "@/lib/saju/constants";
import type { DaeunItem, ElementKey, SajuCalculation, SeunItem } from "@/lib/saju/types";
import { loc } from "./themeContext";

export function daeunYearRange(birthYear: number, startAge: number, endAge: number): { from: number; to: number } {
  return { from: birthYear + startAge - 1, to: birthYear + endAge - 1 };
}

export function birthYearOf(calculation: SajuCalculation): number {
  return Number(calculation.birth.solarDate.slice(0, 4));
}

export type SeasonKey = "spring" | "summer" | "earth" | "autumn" | "winter";

export function seasonOfElement(element: ElementKey): SeasonKey {
  if (element === "wood") return "spring";
  if (element === "fire") return "summer";
  if (element === "earth") return "earth";
  if (element === "metal") return "autumn";
  return "winter";
}

export function daeunSeason(item: DaeunItem): SeasonKey {
  const element = (BRANCH_META[item.zhi]?.element ?? "earth") as ElementKey;
  return seasonOfElement(element);
}

export function daeunEasy(item: DaeunItem, locale: Locale): { keyword: string; lines: string[] } {
  const keyword = item.keywords[0] ?? item.ganzhiKorean;
  return {
    keyword,
    lines: [
      loc(
        locale,
        `${item.startAge}~${item.endAge}세에는 ${item.career} 흐름이 일자리에 먼저 보여요. 돈은 ${item.money}.`,
        `Entre los ${item.startAge} y ${item.endAge} años, el trabajo se ve así: ${item.career}. Dinero: ${item.money}.`,
        `Między ${item.startAge}. a ${item.endAge}. rokiem pracy widać tak: ${item.career}. Pieniądze: ${item.money}.`,
      ),
      loc(
        locale,
        `마음과 관계는 ${item.love}. 몸은 ${item.health}. 한 번에 이직과 이사를 겹치지 마세요.`,
        `Corazón y vínculo: ${item.love}. Cuerpo: ${item.health}. No mudes y cambies de empleo a la vez.`,
        `Serce i relacja: ${item.love}. Ciało: ${item.health}. Nie łącz przeprowadzki ze zmianą pracy.`,
      ),
    ],
  };
}

export function seunKeyword(item: SeunItem, locale: Locale): string {
  const raw = item.summary.split(/[.。]/)[0]?.trim();
  if (raw && raw.length > 2 && raw.length < 28) return raw;
  return loc(locale, item.career.split(" ")[0] ?? "흐름", item.career.split(" ")[0] ?? "ritmo", item.career.split(" ")[0] ?? "rytm");
}

export interface LifeStage {
  id: "child" | "youth" | "adult" | "mid" | "elder";
  from: number;
  to: number | null;
  title: string;
  keyword: string;
  lines: string[];
  height: number;
}

export function lifeStages(calculation: SajuCalculation, locale: Locale): LifeStage[] {
  const ranges: { id: LifeStage["id"]; from: number; to: number | null; title: string }[] = [
    { id: "child", from: 0, to: 15, title: loc(locale, "유년기", "Infancia", "Dzieciństwo") },
    { id: "youth", from: 16, to: 30, title: loc(locale, "청년기", "Juventud", "Młodość") },
    { id: "adult", from: 31, to: 45, title: loc(locale, "장년기", "Plenitud", "Lata dojrzałe") },
    { id: "mid", from: 46, to: 60, title: loc(locale, "중년기", "Madurez", "Wiek średni") },
    { id: "elder", from: 61, to: null, title: loc(locale, "노년기", "Vejez", "Późne lata") },
  ];
  return ranges.map((range) => {
    const overlap = calculation.daeun.filter((item) => {
      const end = range.to ?? 120;
      return item.startAge <= end && item.endAge >= range.from;
    });
    const picked = overlap.sort((a, b) => b.stars - a.stars)[0] ?? calculation.daeun[0];
    const height = overlap.length
      ? Math.round((overlap.reduce((sum, item) => sum + item.stars, 0) / overlap.length) * 20)
      : 50;
    const keyword = picked?.keywords[0] ?? loc(locale, "흐름", "ritmo", "rytm");
    return {
      ...range,
      keyword,
      height: Math.min(100, Math.max(24, height)),
      lines: picked
        ? [
            loc(locale, `이 시기의 일 흐름은 ${picked.career}.`, `El trabajo de esta etapa: ${picked.career}.`, `Praca tego odcinka: ${picked.career}.`),
            loc(locale, `돈은 ${picked.money}. 마음은 ${picked.love}.`, `Dinero: ${picked.money}. Corazón: ${picked.love}.`, `Pieniądze: ${picked.money}. Serce: ${picked.love}.`),
            loc(locale, `조언: ${picked.opportunity} 다만 ${picked.caution}.`, `Consejo: ${picked.opportunity} Pero ${picked.caution}.`, `Rada: ${picked.opportunity} Ale ${picked.caution}.`),
          ]
        : [],
    };
  });
}
