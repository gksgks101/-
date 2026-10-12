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
          : `Entre los ${item.startAge} y ${item.endAge} años se abre el camino hacia ${keyword}. Pégalo al oficio.`,
        clash
          ? `Między ${item.startAge}. a ${item.endAge}. rokiem plansza często się rusza. Nie zmieniaj pracy i domu naraz.`
          : `Między ${item.startAge}. a ${item.endAge}. rokiem droga idzie ku ${keyword}. Przyklej to do fachu.`,
      ),
      loc(
        locale,
        clash
          ? "마음은 속도가 빨라져요. 큰 약속은 한 박자 쉬고 하세요."
          : "일상 리듬만 지키면 몸과 마음이 덜 흔들려요.",
        clash
          ? "El ánimo se acelera. Espera un poco antes de un pacto grande."
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
              {
                child: "어른 눈치보다 내가 좋아하는 놀이를 지키세요.",
                youth: "한 분야의 실력을 깊게 쌓으면 돼요.",
                adult: high ? "집과 일을 한 번에 키우지 마세요." : "서두르면 몸부터 반응해요. 하루 리듬을 먼저 지키세요.",
                mid: "사람을 늘리기보다 남는 관계를 지키세요.",
                elder: "가르치는 한 줄이 다음을 남겨요.",
              }[range.id],
              {
                child: "Más que el ojo adulto, guarda el juego que te gusta.",
                youth: "Basta con criar hondo un solo oficio.",
                adult: high ? "No agrandes casa y trabajo a la vez." : "Si te prisas, responde el cuerpo. Guarda primero el ritmo del día.",
                mid: "Más que sumar gente, guarda el vínculo que queda.",
                elder: "Una línea que enseñas deja lo que sigue.",
              }[range.id],
              {
                child: "Raczej niż oko dorosłych, strzeż zabawy, którą lubisz.",
                youth: "Wystarczy głęboko ułożyć jeden fach.",
                adult: high ? "Nie powiększaj domu i pracy naraz." : "Jak się spieszysz, reaguje ciało. Najpierw rytm dnia.",
                mid: "Raczej niż mnożyć ludzi, strzeż więzi, która zostaje.",
                elder: "Jedna linijka nauki zostawia to, co dalej.",
              }[range.id],
            ),
          ]
        : [],
    };
  });
}
