import type { Locale } from "@/lib/i18n/config";
import { ELEMENT_NAME, POWER_LABEL } from "@/lib/i18n/terms";
import type { ElementKey, ElementStrength } from "@/lib/saju/types";
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
    ko: "목 = 나무·새싹. 시작, 성장, 계획, 간·힘줄의 기운",
    es: "Madera = árbol y brote. Inicio, crecimiento, plan; hígado y tendón",
    pl: "Drewno = drzewo i pęd. Start, wzrost, plan; wątroba i ścięgno",
  },
  fire: {
    ko: "화 = 불·빛. 표현, 열정, 사교, 심장·수면의 기운",
    es: "Fuego = llama y luz. Expresión, calor, trato; corazón y sueño",
    pl: "Ogień = płomień i światło. Wyraz, żar, towarzystwo; serce i sen",
  },
  earth: {
    ko: "토 = 흙·논밭. 중심, 신뢰, 소화, 돈의 실속",
    es: "Tierra = suelo y arrozal. Centro, confianza, digestión, lo concreto del dinero",
    pl: "Ziemia = gleba i pole. Środek, zaufanie, trawienie, konkret pieniędzy",
  },
  metal: {
    ko: "금 = 쇠·칼. 판단력, 규칙, 결단, 폐·피부의 기운",
    es: "Metal = hierro y cuchillo. Juicio, norma, corte; pulmón y piel",
    pl: "Metal = żelazo i nóż. Osąd, reguła, decyzja; płuca i skóra",
  },
  water: {
    ko: "수 = 물·밤. 지혜, 직관, 휴식, 신장·순환의 기운",
    es: "Agua = agua y noche. Sabiduría, intuición, descanso; riñón y circulación",
    pl: "Woda = woda i noc. Mądrość, intuicja, odpoczynek; nerki i krążenie",
  },
};

const MUCH: Record<ElementKey, Record<Locale, string>> = {
  wood: {
    ko: "많으면 시작이 빠르고 의가 분명해요. 다만 고집이 세지고, 어깨·목이 먼저 굳을 수 있어요.",
    es: "Si hay mucha, el inicio es rápido y hay dirección. Cuidado: terquedad, y se endurecen cuello y hombros.",
    pl: "Gdy dużo — szybki start i jasny kierunek. Uwaga: upór, a kark i barki twardnieją pierwsze.",
  },
  fire: {
    ko: "많으면 자리가 밝아지고 사람이 모여요. 다만 말이 빨라지고 잠이 얕아질 수 있어요.",
    es: "Si hay mucho, ilumina y reúne gente. Cuidado: habla rápida y sueño fino.",
    pl: "Gdy dużo — miejsce się świeci i ludzie się zbierają. Uwaga: szybka mowa i płytki sen.",
  },
  earth: {
    ko: "많으면 신뢰를 주고 일상을 붙들어요. 다만 걱정이 반복되고 소화가 더딜 수 있어요.",
    es: "Si hay mucha, da confianza y sujeta el día. Cuidado: la preocupación da vueltas y la digestión se atrasa.",
    pl: "Gdy dużo — daje zaufanie i trzyma dzień. Uwaga: zmartwienie kręci się w kółko, trawienie zwleka.",
  },
  metal: {
    ko: "많으면 칼처럼 판단이 빨라요. 다만 비판이 날카롭고 피부·호흡이 건조해질 수 있어요.",
    es: "Si hay mucho, el juicio corta como un cuchillo. Cuidado: crítica aguda, piel y respiración secas.",
    pl: "Gdy dużo — osąd tnie jak nóż. Uwaga: ostra krytyka, sucha skóra i oddech.",
  },
  water: {
    ko: "많으면 시야가 넓고 생각이 깊어요. 다만 밤에 생각이 넘치고 몸이 차가워질 수 있어요.",
    es: "Si hay mucha, la mirada es ancha y el pensamiento hondo. Cuidado: de noche se desborda y el cuerpo se enfría.",
    pl: "Gdy dużo — szerokie pole i głęboka myśl. Uwaga: nocą wylewa się myślenie, ciało stygnie.",
  },
};

const LITTLE: Record<ElementKey, Record<Locale, string>> = {
  wood: {
    ko: "적으면 유연하고 충돌을 피해요. 다만 시작이 늦고 결정을 미룰 수 있어요.",
    es: "Si hay poca, eres flexible y evitas el choque. Cuidado: el inicio tarda y se aplazan decisiones.",
    pl: "Gdy mało — elastyczność i unikanie zderzeń. Uwaga: spóźniony start i odwlekane decyzje.",
  },
  fire: {
    ko: "적으면 차분하고 과열이 없어요. 다만 표현이 줄고 온기가 떨어질 수 있어요.",
    es: "Si hay poco, hay calma y no te quemas. Cuidado: baja la expresión y el calor.",
    pl: "Gdy mało — spokój i brak przegrzania. Uwaga: mniej wyrazu i ciepła.",
  },
  earth: {
    ko: "적으면 몸이 가볍고 변화에 열려요. 다만 일상이 흔들리고 중심이 없을 수 있어요.",
    es: "Si hay poca, el cuerpo es ligero y te abres al cambio. Cuidado: el día a día tiembla y falta centro.",
    pl: "Gdy mało — lekkie ciało i otwartość na zmianę. Uwaga: chwiejny dzień i brak środka.",
  },
  metal: {
    ko: "적으면 사람에게 부드러워요. 다만 마무리가 늘어지고 경계가 흐려질 수 있어요.",
    es: "Si hay poco, eres suave con la gente. Cuidado: el cierre se alarga y se nubla el borde.",
    pl: "Gdy mało — miękkość wobec ludzi. Uwaga: ciągnące się domknięcie i zamazana granica.",
  },
  water: {
    ko: "적으면 실행이 빠르고 생각이 덜 맴돌아요. 다만 휴식과 직관이 마를 수 있어요.",
    es: "Si hay poca, ejecutas pronto y el pensamiento no da vueltas. Cuidado: descanso e intuición se secan.",
    pl: "Gdy mało — szybkie wykonanie, myśl nie kręci się w kółko. Uwaga: odpoczynek i intuicja mogą wyschnąć.",
  },
};

const TIP: Record<ElementKey, Record<Locale, string>> = {
  wood: {
    ko: "생활 팁: 아침 산책, 초록 채광, 앉은 뒤 목·어깨 풀기.",
    es: "Hábito: paseo de mañana, luz verde, soltar cuello y hombros tras sentarte.",
    pl: "Nawyk: poranny spacer, zielone światło, rozruszanie karku i barków po siedzeniu.",
  },
  fire: {
    ko: "생활 팁: 취침 시각 고정, 저녁 카페인 줄이기, 따뜻한 대화 한 줄.",
    es: "Hábito: hora fija de dormir, menos cafeína de noche, una línea de conversación cálida.",
    pl: "Nawyk: stała pora snu, mniej kofeiny wieczorem, jedna ciepła linijka rozmowy.",
  },
  earth: {
    ko: "생활 팁: 끼니를 거르지 않기, 따뜻한 식사, 바닥 정리.",
    es: "Hábito: no saltar comidas, comida tibia, recoger el suelo.",
    pl: "Nawyk: nie omijaj posiłków, ciepłe jedzenie, porządek na podłodze.",
  },
  metal: {
    ko: "생활 팁: 할 일 한 줄로 끝내기, 가습, 불필요한 말 줄이기.",
    es: "Hábito: cerrar una línea de tarea, humedecer el aire, menos palabras de más.",
    pl: "Nawyk: domykaj jedną linijkę zadań, nawilżaj powietrze, mniej zbędnych słów.",
  },
  water: {
    ko: "생활 팁: 물 마시기, 하체 保温, 혼자 있는 아침 20분.",
    es: "Hábito: beber agua, calor en la parte baja, 20 minutos de mañana a solas.",
    pl: "Nawyk: pić wodę, ciepło dołu ciała, 20 minut samotnego poranka.",
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
  const name = ELEMENT_NAME[locale][key];
  return {
    title: `${name} ${percent}% · ${POWER_LABEL[label]?.[locale] ?? label}`,
    meaning: MEANING[key][locale],
    much: MUCH[key][locale],
    little: LITTLE[key][locale],
    mine: loc(
      locale,
      `내 사주에서는 지금 ${word}이라 이런 뜻이에요.`,
      `En tu saju ahora hay ${word}: eso significa esto.`,
      `W twoim saju jest teraz ${word}: to znaczy właśnie to.`,
    ),
    tip: TIP[key][locale],
  };
}

export function strongestMetaphor(key: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: {
      ko: "목이 많아요 = 나무처럼 방향이 먼저 나와요.",
      es: "Mucha madera = como un árbol, primero sale la dirección.",
      pl: "Dużo drewna = jak drzewo, najpierw wychodzi kierunek.",
    },
    fire: {
      ko: "화가 많아요 = 불처럼 자리를 밝히고 감정이 보여요.",
      es: "Mucho fuego = como la llama, ilumina y se ve la emoción.",
      pl: "Dużo ognia = jak płomień, rozświetla i widać emocję.",
    },
    earth: {
      ko: "토가 많아요 = 흙처럼 중심을 잡고 사람을 품어요.",
      es: "Mucha tierra = como el suelo, sostiene el centro y acoge.",
      pl: "Dużo ziemi = jak gleba, trzyma środek i obejmuje.",
    },
    metal: {
      ko: "금이 많아요 = 칼처럼 판단이 빨라요.",
      es: "Mucho metal = el juicio corta rápido, como un cuchillo.",
      pl: "Dużo metalu = osąd tnie szybko, jak nóż.",
    },
    water: {
      ko: "수가 많아요 = 물처럼 시야가 넓고 생각이 흘러요.",
      es: "Mucha agua = mirada ancha y el pensamiento fluye.",
      pl: "Dużo wody = szerokie pole i myśl płynie.",
    },
  };
  return table[key][locale];
}
