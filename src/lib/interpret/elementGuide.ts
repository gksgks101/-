import type { Locale } from "@/lib/i18n/config";
import type { ElementKey, ElementStrength } from "@/lib/saju/types";
import { easyElementName, littleTrait, luckOpensWhen, muchTrait } from "./plainVoice";
import { loc } from "./themeContext";

export type AmountLevel = "많음" | "적당" | "적음";

export interface ElementBalloon {
  title: string;
  meaning: string;
  much: string;
  little: string;
  mine: string;
  tip: string;
}

const MEANING: Record<ElementKey, Record<Locale, string>> = {
  wood: {
    ko: "새로운 일, 성장, 계획을 가리켜요.",
    es: "Habla de empezar, crecer y planear.",
    pl: "Mówi o starcie, wzroście i planie.",
  },
  fire: {
    ko: "표현, 열정, 사람 사이의 온기를 가리켜요.",
    es: "Habla de expresión, calor y trato.",
    pl: "Mówi o wyrazie, cieple i towarzystwie.",
  },
  earth: {
    ko: "중심, 신뢰, 일상의 실속을 가리켜요.",
    es: "Habla de centro, confianza y lo concreto del día.",
    pl: "Mówi o środku, zaufaniu i konkrecie dnia.",
  },
  metal: {
    ko: "판단, 규칙, 마무리를 가리켜요.",
    es: "Habla de criterio, norma y cierre.",
    pl: "Mówi o osądzie, zasadzie i domknięciu.",
  },
  water: {
    ko: "지혜, 직관, 휴식을 가리켜요.",
    es: "Habla de sabiduría, intuición y descanso.",
    pl: "Mówi o mądrości, intuicji i odpoczynku.",
  },
};

const TIP: Record<ElementKey, Record<Locale, string>> = {
  wood: {
    ko: "아침 산책하고, 목·어깨를 자주 풀어 주세요.",
    es: "Pasea de mañana y suelta cuello y hombros.",
    pl: "Poranny spacer i rozruszanie karku i barków.",
  },
  fire: {
    ko: "잠드는 시각을 고정하고, 저녁 카페인을 줄이세요.",
    es: "Fija la hora de dormir y baja la cafeína de noche.",
    pl: "Stała pora snu i mniej kofeiny wieczorem.",
  },
  earth: {
    ko: "끼니를 거르지 말고, 따뜻한 식사를 챙기세요.",
    es: "No saltes comidas y elige comida tibia.",
    pl: "Nie omijaj posiłków i jedz ciepło.",
  },
  metal: {
    ko: "할 일 한 줄로 끝내고, 방을 건조하지 않게 하세요.",
    es: "Cierra una línea de tarea y humedece el aire.",
    pl: "Domknij jedną linijkę zadań i nawilż powietrze.",
  },
  water: {
    ko: "물을 마시고, 혼자 있는 아침 20분을 지키세요.",
    es: "Bebe agua y guarda 20 minutos de mañana a solas.",
    pl: "Pij wodę i strzeż 20 minut samotnego poranka.",
  },
};

export function amountLevel(percent: number, label: ElementStrength[ElementKey]): AmountLevel {
  if (label === "강" || percent >= 28) return "많음";
  if (label === "약" || percent <= 14) return "적음";
  return "적당";
}

export function amountWord(level: AmountLevel, locale: Locale): string {
  if (level === "많음") return loc(locale, "많음", "mucho", "dużo");
  if (level === "적음") return loc(locale, "적음", "poco", "mało");
  return loc(locale, "적당", "en su punto", "w sam raz");
}

export function elementBalloon(
  key: ElementKey,
  percent: number,
  label: ElementStrength[ElementKey],
  locale: Locale,
): ElementBalloon {
  const level = amountLevel(percent, label);
  const word = amountWord(level, locale);
  const name = easyElementName(key, locale);
  const mineBody =
    level === "많음"
      ? muchTrait(key, locale)
      : level === "적음"
        ? littleTrait(key, locale)
        : loc(locale, "지나치지 않은 균형이에요.", "Está en un punto sin pasarse.", "Jest w punkcie bez przesady.");
  return {
    title: `${name} ${percent}%`,
    meaning: MEANING[key][locale],
    much: loc(locale, `많을 때: ${muchTrait(key, locale)}`, `Si hay mucho: ${muchTrait(key, locale)}`, `Gdy dużo: ${muchTrait(key, locale)}`),
    little: loc(locale, `적을 때: ${littleTrait(key, locale)}`, `Si hay poco: ${littleTrait(key, locale)}`, `Gdy mało: ${littleTrait(key, locale)}`),
    mine: loc(
      locale,
      `내 결과에서는 지금 ${word}이라 이런 뜻이에요. ${mineBody}`,
      `En tu carta ahora hay ${word}: eso significa esto. ${mineBody}`,
      `W twojej karcie jest teraz ${word}: to znaczy właśnie to. ${mineBody}`,
    ),
    tip: TIP[key][locale],
  };
}

export function strongestMetaphor(key: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: {
      ko: "나무처럼 방향이 먼저 나오는 사람이에요.",
      es: "Eres de los que eligen rumbo pronto, como un árbol que ya sabe a dónde.",
      pl: "Jak drzewo: najpierw wychodzi kierunek.",
    },
    fire: {
      ko: "자리를 밝히고 감정이 보이는 사람이에요.",
      es: "Iluminas el sitio y se ve la emoción.",
      pl: "Rozświetlasz miejsce i widać emocję.",
    },
    earth: {
      ko: "중심을 잡고 사람을 품는 사람이에요.",
      es: "Sostienes el centro y acoges a la gente.",
      pl: "Trzymasz środek i obejmujesz ludzi.",
    },
    metal: {
      ko: "판단이 칼처럼 빠른 사람이에요.",
      es: "El criterio corta rápido, como un cuchillo.",
      pl: "Osąd tnie szybko, jak nóż.",
    },
    water: {
      ko: "시야가 넓고 생각이 흐르는 사람이에요.",
      es: "Mirada ancha y el pensamiento fluye.",
      pl: "Szerokie pole i myśl płynie.",
    },
  };
  return table[key][locale];
}

export function donutHintLine(key: ElementKey, locale: Locale): string {
  return luckOpensWhen(key, locale);
}
