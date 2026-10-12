import type { Locale } from "@/lib/i18n/config";
import { CAREER_TYPE, term } from "@/lib/i18n/terms";
import { prose } from "@/lib/i18n/prose";
import { currentDaeun, currentSeun, loc, type GodGroup } from "./themeContext";
import { buildThemeCtx } from "./themeContext";
import type { SajuCalculation } from "@/lib/saju/types";

export interface LifeScore {
  id: "love" | "wealth" | "career" | "health" | "relations";
  stars: number;
}

export interface ResultSummary {
  typeName: string;
  yearKeywords: string[];
  scores: LifeScore[];
}

const TYPE_BY_GROUP: Record<GodGroup, Record<Locale, string>> = {
  비겁: { ko: "자립형", es: "tipo independiente", pl: "typ samodzielny" },
  식상: { ko: "표현형", es: "tipo expresivo", pl: "typ wyrazisty" },
  재성: { ko: "현실형", es: "tipo práctico", pl: "typ praktyczny" },
  관성: { ko: "책임형", es: "tipo responsable", pl: "typ odpowiedzialny" },
  인성: { ko: "학습형", es: "tipo de estudio", pl: "typ uczący się" },
};

function clampStars(value: number): number {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function keyword(text: string, locale: Locale): string {
  const translated = prose(text, locale);
  return translated.split(/[·,/]/)[0]?.trim().slice(0, 18) || translated.slice(0, 18);
}

export function buildResultSummary(calculation: SajuCalculation, locale: Locale): ResultSummary {
  const ctx = buildThemeCtx(calculation, locale);
  const seun = currentSeun(calculation);
  const daeun = currentDaeun(calculation);
  const typeName = TYPE_BY_GROUP[ctx.dominantGroup][locale];
  const yearKeywords = [
    seun ? keyword(seun.career, locale) : term(CAREER_TYPE, ctx.topCareer?.type ?? "조직형", locale),
    seun ? keyword(seun.money, locale) : loc(locale, "정산", "liquidar", "rozliczenie"),
    seun ? keyword(seun.love, locale) : loc(locale, "관계", "vínculo", "więź"),
  ];
  const clashPenalty = ctx.hasClash ? 0.8 : 0;
  const scores: LifeScore[] = [
    {
      id: "love",
      stars: clampStars((seun?.stars ?? 3) - clashPenalty + (ctx.groups.식상 > 1 ? 0.4 : 0)),
    },
    {
      id: "wealth",
      stars: clampStars(((ctx.topWealth?.score ?? 40) / 20) - (ctx.hasClash ? 0.6 : 0)),
    },
    {
      id: "career",
      stars: clampStars(((ctx.topCareer?.score ?? 40) / 18) + (daeun && daeun.stars >= 4 ? 0.4 : 0)),
    },
    {
      id: "health",
      stars: clampStars(4.2 - Math.min(2, calculation.weaknesses.reduce((sum, item) => sum + item.severity, 0) / 6)),
    },
    {
      id: "relations",
      stars: clampStars(3.4 + (ctx.hasCombine ? 0.8 : 0) - (ctx.hasWonjin || ctx.hasHarm ? 0.8 : 0)),
    },
  ];
  return { typeName, yearKeywords, scores };
}

export function youAreLine(typeName: string, locale: Locale): string {
  return loc(locale, `당신은 ${typeName}`, `Eres ${typeName}`, `Jesteś: ${typeName}`);
}
