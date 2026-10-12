import type { Locale } from "@/lib/i18n/config";
import { josa } from "@/lib/i18n/josa";
import { BRANCH_META } from "@/lib/saju/constants";
import type { DaeunItem, ElementKey, SajuCalculation, SeunItem } from "@/lib/saju/types";
import { tenGodEasy } from "./plainVoice";
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
  const keyword = tenGodEasy(item.tenGodKorean, locale);
  const clash = item.caution.includes("충") || item.keywords.includes("변동");
  return {
    keyword,
    lines: [
      loc(
        locale,
        clash
          ? `${item.startAge}~${item.endAge}세에는 판이 자주 움직여요. 일과 집을 한 번에 바꾸지 마세요.`
          : `${item.startAge}~${item.endAge}세에는 ${keyword} 쪽으로 길이 열려요. 그 결을 일로 붙이면 돼요.`,
        clash
          ? `Entre los ${item.startAge} y ${item.endAge} años el tablero se mueve. No cambies trabajo y casa a la vez.`
          : `Entre los ${item.startAge} y ${item.endAge} años se abre el camino hacia ${keyword}. Pegalo al oficio.`,
        clash
          ? `Między ${item.startAge}. a ${item.endAge}. rokiem plansza często się rusza. Nie zmieniaj pracy i domu naraz.`
          : `Między ${item.startAge}. a ${item.endAge}. rokiem droga idzie ku ${keyword}. Przyklej to do fachu.`,
      ),
      loc(
        locale,
        clash
          ? "마음은 속도가 빨라져요. 큰 약속은 한 박자 쉬고 하세요."
          : "일상 리듬만 지키면 몸도 마음이 덜 흔들려요.",
        clash
          ? "El ánimo se acelera. Pause un tiempo antes de un pacto grande."
          : "Si guardas el ritmo del día, cuerpo y corazón tiemblan menos.",
        clash
          ? "Serce przyspiesza. Zaczekaj chwilę przed wielką obietnicą."
          : "Jak strzeżesz rytmu dnia, ciało i serce mniej się chwieją.",
      ),
    ],
  };
}

export function seunKeyword(item: SeunItem, locale: Locale): string {
  return tenGodEasy(item.tenGodKorean, locale) || loc(locale, "흐름", "ritmo", "rytm");
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
    const keyword = picked ? tenGodEasy(picked.tenGodKorean, locale) : loc(locale, "흐름", "ritmo", "rytm");
    const high = (picked?.stars ?? 3) >= 4;
    return {
      ...range,
      keyword,
      height: Math.min(100, Math.max(24, height)),
      lines: picked
        ? [
            loc(
              locale,
              high
                ? `이 시기는 ${josa(keyword, "이/가")} 잘 붙어요. 눈에 남는 일을 하나 키우면 돼요.`
                : `이 시기는 판을 키우기보다 자리를 다지는 때예요. ${keyword}만 가까이 두세요.`,
              high
                ? `En esta etapa ${keyword} se pega bien. Basta con criar un oficio que se vea.`
                : `Mejor asentar el sitio que agrandar el tablero. Acerca solo ${keyword}.`,
              high
                ? `W tym odcinku ${keyword} dobrze się klei. Wystarczy wyhodować jeden widoczny fach.`
                : `Raczej utrwalać miejsce niż powiększać planszę. Trzymaj blisko tylko ${keyword}.`,
            ),
            loc(
              locale,
              high
                ? "사람과 기회를 한 번에 넓히지 말고, 한 줄만 깊게 가세요."
                : "서두르면 몸부터 반응해요. 하루 리듬을 먼저 지키세요.",
              high
                ? "No diversifiques gente y oportunidad a la vez. Ve hondo en una sola línea."
                : "Si te prisas, responde el cuerpo. Guarda primero el ritmo del día.",
              high
                ? "Nie mieszaj ludzi i okazji naraz. Idź głęboko jedną linijką."
                : "Jak się spieszysz, reaguje ciało. Najpierw rytm dnia.",
            ),
          ]
        : [],
    };
  });
}
