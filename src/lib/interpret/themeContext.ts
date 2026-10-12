import type { Locale } from "@/lib/i18n/config";
import { CAREER_TYPE, ELEMENT_NAME, STRENGTH_NAME, WEALTH_TYPE, tenGod, term } from "@/lib/i18n/terms";
import { CONTROLS, GENERATES } from "@/lib/saju/constants";
import type { DaeunItem, ElementKey, SajuCalculation, SeunItem, TypeScore } from "@/lib/saju/types";

export type GodGroup = "비겁" | "식상" | "재성" | "관성" | "인성";
export type InvestStyle = "stable" | "aggressive" | "balanced";

export function loc(locale: Locale, ko: string, es: string, pl: string): string {
  if (locale === "es") return es;
  if (locale === "pl") return pl;
  return ko;
}

export function clean(lines: (string | false | null | undefined)[]): string[] {
  return lines
    .filter((line): line is string => Boolean(line))
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const KO_ELEMENT: Record<string, ElementKey> = { 목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water" };

export function generatedBy(element: ElementKey): ElementKey {
  return (Object.entries(GENERATES) as [ElementKey, ElementKey][]).find(([, value]) => value === element)?.[0] ?? "water";
}

export function controlledBy(element: ElementKey): ElementKey {
  return (Object.entries(CONTROLS).find(([, value]) => value === element)?.[0] ?? "metal") as ElementKey;
}

export function currentSeun(calculation: SajuCalculation): SeunItem | undefined {
  const year = new Date().getFullYear();
  return calculation.seun.find((item) => item.year === year) ?? calculation.seun.find((item) => item.year >= year);
}

export function currentDaeun(calculation: SajuCalculation): DaeunItem | undefined {
  const year = new Date().getFullYear();
  const birthYear = Number(calculation.birth.solarDate.slice(0, 4));
  const age = year - birthYear + 1;
  return calculation.daeun.find((item) => age >= item.startAge && age <= item.endAge) ?? calculation.daeun[0];
}

function god(tally: Record<string, number>, name: string): number {
  return tally[name] ?? 0;
}

export interface ThemeCtx {
  locale: Locale;
  c: SajuCalculation;
  p: SajuCalculation["pillars"];
  day: SajuCalculation["dayMaster"];
  strengthLabel: string;
  topWealth: TypeScore | undefined;
  topCareer: TypeScore | undefined;
  daeun: DaeunItem | undefined;
  seun: SeunItem | undefined;
  nearSeun: SeunItem[];
  weak: ElementKey[];
  strong: ElementKey[];
  godsLine: string;
  groupLine: string;
  yong: string;
  hee: string;
  gi: string;
  gu: string;
  yongsinKeys: ElementKey[];
  heesinKeys: ElementKey[];
  gisinKeys: ElementKey[];
  support: ElementKey;
  pressure: ElementKey;
  output: ElementKey;
  wealthEl: ElementKey;
  style: InvestStyle;
  year: number;
  groups: Record<GodGroup, number>;
  dominantGroup: GodGroup;
  topGod: string;
  hasClash: boolean;
  hasCombine: boolean;
  hasHarm: boolean;
  hasWonjin: boolean;
  relationLine: string;
  sinsalNames: string[];
  gwiinNames: string[];
  hiddenDay: string;
  hiddenMonth: string;
  hourLine: string;
  elName: (key: ElementKey) => string;
  careerName: (type: string) => string;
  wealthName: (type: string) => string;
}

export function investStyle(top: string | undefined): InvestStyle {
  if (top && ["축적형", "월급형"].includes(top)) return "stable";
  if (top && ["투자형", "사업형", "성과형"].includes(top)) return "aggressive";
  return "balanced";
}

export function buildThemeCtx(calculation: SajuCalculation, locale: Locale): ThemeCtx {
  const entries = Object.entries(calculation.elements.powerScore) as [ElementKey, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const groups: Record<GodGroup, number> = {
    비겁: god(calculation.tenGods, "비견") + god(calculation.tenGods, "겁재"),
    식상: god(calculation.tenGods, "식신") + god(calculation.tenGods, "상관"),
    재성: god(calculation.tenGods, "정재") + god(calculation.tenGods, "편재"),
    관성: god(calculation.tenGods, "정관") + god(calculation.tenGods, "편관"),
    인성: god(calculation.tenGods, "정인") + god(calculation.tenGods, "편인"),
  };
  const dominantGroup = (Object.entries(groups) as [GodGroup, number][]).sort((a, b) => b[1] - a[1])[0][0];
  const topGod = Object.entries(calculation.tenGods).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "비견";
  const year = new Date().getFullYear();
  const seun = currentSeun(calculation);
  const day = calculation.dayMaster;
  const p = calculation.pillars;
  const topWealth = calculation.wealthTypes[0];
  const yongsinKeys = calculation.useGod.yongsin.map((item) => KO_ELEMENT[item]).filter(Boolean) as ElementKey[];
  const heesinKeys = calculation.useGod.heesin.map((item) => KO_ELEMENT[item]).filter(Boolean) as ElementKey[];
  const gisinKeys = calculation.useGod.gisin.map((item) => KO_ELEMENT[item]).filter(Boolean) as ElementKey[];
  const elName = (key: ElementKey) => ELEMENT_NAME[locale][key];
  const groupLine = (Object.entries(groups) as [GodGroup, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => `${name} ${value.toFixed(1)}`)
    .join(" · ");

  const hiddenDay = p.day.hiddenStems
    .map((item) => `${item.ganKorean}${item.roleKorean}·${tenGod(item.tenGodKorean, locale)}`)
    .join(" / ");
  const hiddenMonth = p.month.hiddenStems
    .map((item) => `${item.ganKorean}${item.roleKorean}·${tenGod(item.tenGodKorean, locale)}`)
    .join(" / ");
  const hour = p.hour;
  const hourLine = hour
    ? loc(
        locale,
        `시주 ${hour.ganzhiKorean}(${hour.ganzhi}) · 천간 ${tenGod(hour.ganTenGodKorean, locale)} · 지지 ${tenGod(hour.zhiTenGodKorean, locale)} · 12운성 ${hour.twelveStageKorean}.`,
        `Hora ${hour.ganzhi}: tronco ${tenGod(hour.ganTenGodKorean, locale)}, rama ${tenGod(hour.zhiTenGodKorean, locale)}, 12 etapas ${hour.twelveStageKorean}.`,
        `Godzina ${hour.ganzhi}: pień ${tenGod(hour.ganTenGodKorean, locale)}, gałąź ${tenGod(hour.zhiTenGodKorean, locale)}, 12 etapów ${hour.twelveStageKorean}.`,
      )
    : loc(
        locale,
        "시주가 없어 자녀·말년·하루 리듬은 확정하지 않습니다. 시간만 보완하면 이 층이 열립니다.",
        "Sin hora no fijamos hijos, vejez ni ritmo diario. Completar la hora abre esta capa.",
        "Bez godziny nie ustalamy dzieci, późnych lat ani rytmu dnia. Uzupełnienie godziny otwiera tę warstwę.",
      );

  return {
    locale,
    c: calculation,
    p,
    day,
    strengthLabel: term(STRENGTH_NAME, calculation.strength.classification, locale),
    topWealth,
    topCareer: calculation.careerTypes[0],
    daeun: currentDaeun(calculation),
    seun,
    nearSeun: calculation.seun.filter((item) => item.year >= year && item.year <= year + 3),
    weak: sorted.slice(-2).map(([key]) => key),
    strong: sorted.slice(0, 2).map(([key]) => key),
    godsLine: Object.entries(calculation.tenGods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => `${tenGod(name, locale)} ${value.toFixed(1)}`)
      .join(" · "),
    groupLine,
    yong: calculation.useGod.yongsin.join("·") || "-",
    hee: calculation.useGod.heesin.join("·") || "-",
    gi: calculation.useGod.gisin.join("·") || "-",
    gu: calculation.useGod.gusin.join("·") || "-",
    yongsinKeys,
    heesinKeys,
    gisinKeys,
    support: generatedBy(day.element),
    pressure: controlledBy(day.element),
    output: GENERATES[day.element],
    wealthEl: CONTROLS[day.element],
    style: investStyle(topWealth?.type),
    year,
    groups,
    dominantGroup,
    topGod,
    hasClash: calculation.relations.some((item) => item.type === "clash"),
    hasCombine: calculation.relations.some((item) => ["gan-combine", "six-combine", "triple", "direction"].includes(item.type)),
    hasHarm: calculation.relations.some((item) => item.type === "harm" || item.type === "break"),
    hasWonjin: calculation.relations.some((item) => item.type === "wonjin"),
    relationLine: calculation.relations.length
      ? calculation.relations.map((item) => `${item.typeKorean}(${item.items.join(",")})`).join(" · ")
      : loc(locale, "원국 합충이 두드러지지 않음", "Pocos choques/uniones natales", "Mało zderzeń/połączeń w karcie"),
    sinsalNames: calculation.sinsal.map((item) => item.name),
    gwiinNames: calculation.gwiin.map((item) => item.name),
    hiddenDay,
    hiddenMonth,
    hourLine,
    elName,
    careerName: (type: string) => term(CAREER_TYPE, type, locale),
    wealthName: (type: string) => term(WEALTH_TYPE, type, locale),
  };
}
