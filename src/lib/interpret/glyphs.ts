import type { Locale } from "@/lib/i18n/config";
import { BRANCH_META, STEM_KO, STEM_META } from "@/lib/saju/constants";
import type { ElementKey, Pillar, PillarKey } from "@/lib/saju/types";
import { loc } from "./themeContext";

const STEM_EASY: Record<string, Record<Locale, string>> = {
  甲: {
    ko: "큰 소나무처럼, 방향을 정하고 밀어붙이는 사람이에요.",
    es: "Como un pino alto: eliges rumbo y empujas sin rodeos.",
    pl: "Jak wysoka sosna: najpierw kierunek, potem pęd.",
  },
  乙: {
    ko: "매화와 버들 같은 작은 나무, 유연하게 버티는 사람이에요.",
    es: "Como ciruelo y sauce: te doblas y aguantas, no te rompes.",
    pl: "Jak śliwa i wierzba: giętka, ale niełamliwa.",
  },
  丙: {
    ko: "한낮의 태양처럼, 자리를 밝히고 사람을 모으는 사람이에요.",
    es: "Como el sol del mediodía: iluminas el sitio y reúnes gente.",
    pl: "Jak słońce w zenicie: rozświetlasz miejsce i zbierasz ludzi.",
  },
  丁: {
    ko: "촛불과 연등처럼, 한 사람과 한 일을 오래 데우는 사람이에요.",
    es: "Como vela y linterna: calientas largo a una persona o una obra.",
    pl: "Jak świeca i latarnia: długo ogrzewasz jedną osobę albo jedną sprawę.",
  },
  戊: {
    ko: "산처럼, 한번 맡은 자리를 버티는 사람이에요.",
    es: "Como una montaña: si asumes un sitio, te quedas de pilar.",
    pl: "Jak góra: wzięte miejsce staje się podporą.",
  },
  己: {
    ko: "논밭처럼, 빈 곳을 메우고 사람을 기르는 사람이에요.",
    es: "Como un arrozal: rellenas huecos y crías a la gente.",
    pl: "Jak pole ryżowe: wypełniasz luki i hodujesz ludzi.",
  },
  庚: {
    ko: "칼처럼, 옳고 그름을 가르고 결론을 원하는 사람이에요.",
    es: "Como un cuchillo: cortas lo justo y quieres una conclusión.",
    pl: "Jak nóż: odcinasz słuszne i chcesz konkluzji.",
  },
  辛: {
    ko: "보석처럼, 품질과 디테일에 자존감이 걸린 사람이에요.",
    es: "Como una joya: la autoestima vive en la calidad y el detalle.",
    pl: "Jak klejnot: godność wisi na jakości i detalu.",
  },
  壬: {
    ko: "큰 바다처럼, 시야가 넓고 한곳에 묶이면 답답한 사람이에요.",
    es: "Como un gran mar: mirada ancha; lo demasiado atado te ahoga.",
    pl: "Jak wielkie morze: szerokie pole; ciasnota dusi.",
  },
  癸: {
    ko: "이슬과 샘물처럼, 말보다 먼저 분위기를 읽는 사람이에요.",
    es: "Como rocío y manantial: lees el ambiente antes que las palabras.",
    pl: "Jak rosa i źródło: czytasz nastrój wcześniej niż słowa.",
  },
};

const BRANCH_EASY: Record<string, Record<Locale, string>> = {
  子: {
    ko: "깊은 밤의 물처럼, 지혜와 쉼이 바탕이에요.",
    es: "Como agua honda de noche: sabiduría y descanso.",
    pl: "Jak głęboka nocna woda: mądrość i odpoczynek.",
  },
  丑: {
    ko: "차가운 흙처럼, 참을성과 저장이 바탕이에요.",
    es: "Como tierra fría: paciencia y almacén.",
    pl: "Jak zimna ziemia: cierpliwość i zapas.",
  },
  寅: {
    ko: "큰 나무처럼, 시작과 용기가 바탕이에요.",
    es: "Como un árbol grande: inicio y coraje.",
    pl: "Jak wielkie drzewo: start i odwaga.",
  },
  卯: {
    ko: "부드러운 나무처럼, 감각과 성장이 바탕이에요.",
    es: "Como madera suave: sentido y crecimiento.",
    pl: "Jak miękkie drewno: zmysł i wzrost.",
  },
  辰: {
    ko: "습기 있는 흙처럼, 전환과 저장이 바탕이에요.",
    es: "Como tierra húmeda: giro y reserva.",
    pl: "Jak wilgotna ziemia: zwrot i zapas.",
  },
  巳: {
    ko: "촛불처럼, 집중과 지혜가 바탕이에요.",
    es: "Como una llama chica: foco y sagacidad.",
    pl: "Jak mały płomień: skupienie i bystrość.",
  },
  午: {
    ko: "한낮의 불처럼, 표현과 속도가 바탕이에요.",
    es: "Como el fuego del mediodía: expresión y velocidad.",
    pl: "Jak ogień południa: wyraz i tempo.",
  },
  未: {
    ko: "따뜻한 흙처럼, 돌봄과 안정이 바탕이에요.",
    es: "Como tierra tibia: cuidado y calma.",
    pl: "Jak ciepła ziemia: troska i spokój.",
  },
  申: {
    ko: "손재주처럼, 변통과 기민함이 바탕이에요.",
    es: "Como una mano lista: maña y recurso.",
    pl: "Jak zręczna ręka: kombinacja i czujność.",
  },
  酉: {
    ko: "잘 벼린 칼처럼, 정리와 결단이 바탕이에요.",
    es: "Como un filo limpio: orden y corte.",
    pl: "Jak czyste ostrze: ład i decyzja.",
  },
  戌: {
    ko: "마른 흙처럼, 지킴과 경계가 바탕이에요.",
    es: "Como tierra seca: guarda y frontera.",
    pl: "Jak sucha ziemia: straż i granica.",
  },
  亥: {
    ko: "큰 물처럼, 포용과 휴식이 바탕이에요.",
    es: "Como un gran agua: acogida y descanso.",
    pl: "Jak wielka woda: objęcie i odpoczynek.",
  },
};

const PILLAR_ROLE: Record<PillarKey, Record<Locale, { title: string; meaning: string }>> = {
  year: {
    ko: { title: "년주", meaning: "태어난 해예요. 집안과 어린 시절의 자리예요." },
    es: { title: "Pilar del año", meaning: "Es el año de nacimiento. Habla de la casa y de la infancia." },
    pl: { title: "Filar roku", meaning: "To rok urodzenia. Mówi o domu i dzieciństwie." },
  },
  month: {
    ko: { title: "월주", meaning: "태어난 달이에요. 사회생활과 타고난 힘의 자리예요." },
    es: { title: "Pilar del mes", meaning: "Es el mes de nacimiento. Habla de la vida social y de la fuerza innata." },
    pl: { title: "Filar miesiąca", meaning: "To miesiąc urodzenia. Mówi o życiu społecznym i wrodzonej sile." },
  },
  day: {
    ko: { title: "일주", meaning: "태어난 날이에요. 나 자신과 배우자 자리예요." },
    es: { title: "Pilar del día", meaning: "Es el día de nacimiento. Habla de ti y del lugar de pareja." },
    pl: { title: "Filar dnia", meaning: "To dzień urodzenia. Mówi o tobie i o miejscu partnera." },
  },
  hour: {
    ko: { title: "시주", meaning: "태어난 시간이에요. 노년·자녀·속마음의 자리예요." },
    es: { title: "Pilar de la hora", meaning: "Es la hora de nacimiento. Habla de la vejez, los hijos y el fuero interno." },
    pl: { title: "Filar godziny", meaning: "To godzina urodzenia. Mówi o późnych latach, dzieciach i tym, co w środku." },
  },
};

const SKY_GROUND: Record<ElementKey, Record<Locale, { sky: string; ground: string }>> = {
  wood: {
    ko: { sky: "방향을 먼저 잡는 성격", ground: "자라고 버티는 바탕" },
    es: { sky: "un carácter que elige rumbo pronto", ground: "un fondo que crece y aguanta" },
    pl: { sky: "charakter, który szybko bierze kurs", ground: "podłoże, które rośnie i trwa" },
  },
  fire: {
    ko: { sky: "마음을 밖으로 밝히는 성격", ground: "온기와 속도의 바탕" },
    es: { sky: "un carácter que saca el ánimo", ground: "un fondo de calor y ritmo" },
    pl: { sky: "charakter, który wyjmuje serce", ground: "podłoże ciepła i tempa" },
  },
  earth: {
    ko: { sky: "약속을 붙드는 성격", ground: "일상과 신뢰의 바탕" },
    es: { sky: "un carácter que sujeta lo pactado", ground: "un fondo de día a día y fe" },
    pl: { sky: "charakter, który trzyma umowę", ground: "podłoże codzienności i zaufania" },
  },
  metal: {
    ko: { sky: "결론을 원하는 성격", ground: "정리와 결단의 바탕" },
    es: { sky: "un carácter que quiere conclusión", ground: "un fondo de orden y corte" },
    pl: { sky: "charakter, który chce konkluzji", ground: "podłoże ładu i decyzji" },
  },
  water: {
    ko: { sky: "넓게 흘러가는 성격", ground: "쉼과 깊이의 바탕" },
    es: { sky: "un carácter que fluye ancho", ground: "un fondo de calma y hondura" },
    pl: { sky: "charakter, który płynie szeroko", ground: "podłoże spokoju i głębi" },
  },
};

export function stemEasy(gan: string, locale: Locale): string {
  return STEM_EASY[gan]?.[locale] ?? STEM_EASY["甲"][locale];
}

export function branchEasy(zhi: string, locale: Locale): string {
  return BRANCH_EASY[zhi]?.[locale] ?? BRANCH_EASY["子"][locale];
}

export function pillarRole(key: PillarKey, locale: Locale): { title: string; meaning: string } {
  return PILLAR_ROLE[key][locale];
}

export function stemNick(gan: string, locale: Locale): string {
  const table: Record<string, Record<Locale, string>> = {
    甲: { ko: "큰 소나무", es: "gran pino", pl: "wielka sosna" },
    乙: { ko: "매화", es: "ciruelo", pl: "śliwa" },
    丙: { ko: "태양", es: "sol", pl: "słońce" },
    丁: { ko: "연등", es: "linterna", pl: "latarnia" },
    戊: { ko: "산", es: "montaña", pl: "góra" },
    己: { ko: "논밭", es: "arrozal", pl: "pole ryżowe" },
    庚: { ko: "칼", es: "cuchillo", pl: "nóż" },
    辛: { ko: "보석", es: "joya", pl: "klejnot" },
    壬: { ko: "바다", es: "mar", pl: "morze" },
    癸: { ko: "이슬", es: "rocío", pl: "rosa" },
  };
  return table[gan]?.[locale] ?? table["甲"][locale];
}

export function monthSeason(zhi: string): "spring" | "summer" | "autumn" | "winter" | "earth" {
  if ("寅卯".includes(zhi)) return "spring";
  if ("巳午".includes(zhi)) return "summer";
  if ("申酉".includes(zhi)) return "autumn";
  if ("亥子".includes(zhi)) return "winter";
  return "earth";
}

export function seasonWord(zhi: string, locale: Locale): string {
  const season = monthSeason(zhi);
  if (season === "spring") return loc(locale, "봄", "primavera", "wiosną");
  if (season === "summer") return loc(locale, "여름", "verano", "latem");
  if (season === "autumn") return loc(locale, "가을", "otoño", "jesienią");
  if (season === "winter") return loc(locale, "겨울", "invierno", "zimą");
  return loc(locale, "환절기", "el cambio de estación", "w przesileniu");
}

export function animalName(zhi: string, locale: Locale): string {
  const ko = BRANCH_META[zhi]?.animal ?? zhi;
  const table: Record<string, Record<Locale, string>> = {
    쥐: { ko: "쥐", es: "rata", pl: "szczur" },
    소: { ko: "소", es: "buey", pl: "wół" },
    호랑이: { ko: "호랑이", es: "tigre", pl: "tygrys" },
    토끼: { ko: "토끼", es: "conejo", pl: "królik" },
    용: { ko: "용", es: "dragón", pl: "smok" },
    뱀: { ko: "뱀", es: "serpiente", pl: "wąż" },
    말: { ko: "말", es: "caballo", pl: "koń" },
    양: { ko: "양", es: "cabra", pl: "koza" },
    원숭이: { ko: "원숭이", es: "mono", pl: "małpa" },
    닭: { ko: "닭", es: "gallo", pl: "kogut" },
    개: { ko: "개", es: "perro", pl: "pies" },
    돼지: { ko: "돼지", es: "cerdo", pl: "świnia" },
  };
  return table[ko]?.[locale] ?? ko;
}

export function ganLabel(gan: string): string {
  return `${STEM_KO[gan] ?? gan}(${gan})`;
}

export function pillarEasyLines(pillar: Pillar, key: PillarKey, locale: Locale): string[] {
  const role = pillarRole(key, locale);
  const ganEl = STEM_META[pillar.gan]?.element ?? "wood";
  const zhiEl = BRANCH_META[pillar.zhi]?.element ?? "earth";
  const sky = SKY_GROUND[ganEl][locale].sky;
  const ground = SKY_GROUND[zhiEl][locale].ground;
  return [
    role.meaning,
    stemEasy(pillar.gan, locale),
    branchEasy(pillar.zhi, locale),
    loc(
      locale,
      `위쪽 글자는 ${sky}이에요. 아래쪽 글자는 ${ground}이에요.`,
      `Arriba: ${sky}. Abajo: ${ground}.`,
      `U góry: ${sky}. Na dole: ${ground}.`,
    ),
  ];
}
