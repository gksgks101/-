import type { Locale } from "@/lib/i18n/config";
import { BRANCH_META, STEM_KO, STEM_META } from "@/lib/saju/constants";
import type { ElementKey, Pillar, PillarKey } from "@/lib/saju/types";
import { loc } from "./themeContext";

const STEM_EASY: Record<string, Record<Locale, string>> = {
  甲: {
    ko: "갑(甲) = 큰 소나무, 방향을 정하고 밀어붙이는 사람",
    es: "Jia (甲) = un pino alto: elige rumbo y empuja sin rodeos",
    pl: "Gap (甲) = wysoka sosna: najpierw kierunek, potem pęd",
  },
  乙: {
    ko: "을(乙) = 매화와 버들 같은 작은 나무, 유연하게 버티는 사람",
    es: "Yi (乙) = ciruelo y sauce: se dobla y aguanta, no se rompe",
    pl: "Eul (乙) = śliwa i wierzba: giętka, ale niełamliwa",
  },
  丙: {
    ko: "병(丙) = 한낮의 태양, 자리를 밝히고 사람을 모으는 사람",
    es: "Bing (丙) = el sol del mediodía: ilumina el sitio y reúne gente",
    pl: "Byeong (丙) = słońce w zenicie: rozświetla miejsce i zbiera ludzi",
  },
  丁: {
    ko: "정(丁) = 촛불과 연등, 한 사람과 한 일을 오래 데우는 사람",
    es: "Ding (丁) = vela y linterna: calienta largo a una persona o una obra",
    pl: "Jeong (丁) = świeca i latarnia: długo ogrzewa jedną osobę albo jedną sprawę",
  },
  戊: {
    ko: "무(戊) = 산, 한번 맡은 자리를 버티는 사람",
    es: "Wu (戊) = montaña: si asume un sitio, se queda de pilar",
    pl: "Mu (戊) = góra: wzięte miejsce staje się podporą",
  },
  己: {
    ko: "기(己) = 논밭, 빈 곳을 메우고 사람을 기르는 사람",
    es: "Ji (己) = arrozal: rellena huecos y cría a la gente",
    pl: "Gi (己) = pole ryżowe: wypełnia luki i hoduje ludzi",
  },
  庚: {
    ko: "경(庚) = 쇠와 칼, 옳고 그름을 가르고 결론을 원하는 사람",
    es: "Geng (庚) = metal y cuchillo: corta lo justo y quiere conclusión",
    pl: "Gyeong (庚) = metal i nóż: odcina słuszne i chce konkluzji",
  },
  辛: {
    ko: "신(辛) = 보석, 품질과 디테일에 자존감이 걸린 사람",
    es: "Xin (辛) = joya: la autoestima vive en la calidad y el detalle",
    pl: "Sin (辛) = klejnot: godność wisi na jakości i detalu",
  },
  壬: {
    ko: "임(壬) = 큰 바다, 시야가 넓고 한곳에 묶이면 답답한 사람",
    es: "Ren (壬) = gran mar: mirada ancha; lo demasiado atado le ahoga",
    pl: "Im (壬) = wielkie morze: szerokie pole; ciasnota dusi",
  },
  癸: {
    ko: "계(癸) = 이슬과 샘물, 말보다 먼저 분위기를 읽는 사람",
    es: "Gui (癸) = rocío y manantial: lee el ambiente antes que las palabras",
    pl: "Gye (癸) = rosa i źródło: czyta nastrój wcześniej niż słowa",
  },
};

const BRANCH_EASY: Record<string, Record<Locale, string>> = {
  子: {
    ko: "자(子) = 쥐·깊은 물, 지혜와 밤의 기운",
    es: "Zi (子) = rata y agua honda: sabiduría y ritmo nocturno",
    pl: "Ja (子) = szczur i głęboka woda: mądrość i nocny rytm",
  },
  丑: {
    ko: "축(丑) = 소·차가운 흙, 참을성과 저장의 기운",
    es: "Chou (丑) = buey y tierra fría: paciencia y almacén",
    pl: "Chuk (丑) = wół i zimna ziemia: cierpliwość i magazyn",
  },
  寅: {
    ko: "인(寅) = 호랑이·큰 나무, 시작과 용기의 기운",
    es: "Yin (寅) = tigre y árbol grande: inicio y coraje",
    pl: "In (寅) = tygrys i wielkie drzewo: start i odwaga",
  },
  卯: {
    ko: "묘(卯) = 토끼·부드러운 나무, 감각과 성장의 기운",
    es: "Mao (卯) = conejo y madera suave: sentido y crecimiento",
    pl: "Myo (卯) = królik i miękkie drewno: zmysł i wzrost",
  },
  辰: {
    ko: "진(辰) = 용·습기 있는 흙, 전환과 저장의 기운",
    es: "Chen (辰) = dragón y tierra húmeda: giro y reserva",
    pl: "Jin (辰) = smok i wilgotna ziemia: zwrot i zapas",
  },
  巳: {
    ko: "사(巳) = 뱀·촛불, 집중과 지혜의 기운",
    es: "Si (巳) = serpiente y llama: foco y sagacidad",
    pl: "Sa (巳) = wąż i płomień: skupienie i bystrość",
  },
  午: {
    ko: "오(午) = 말·한낮의 불, 표현과 속도의 기운",
    es: "Wu (午) = caballo y fuego del mediodía: expresión y velocidad",
    pl: "O (午) = koń i ogień południa: wyraz i tempo",
  },
  未: {
    ko: "미(未) = 양·따뜻한 흙, 돌봄과 안정의 기운",
    es: "Wei (未) = cabra y tierra tibia: cuidado y calma",
    pl: "Mi (未) = koza i ciepła ziemia: troska i spokój",
  },
  申: {
    ko: "신(申) = 원숭이·쇠, 손재주와 변통의 기운",
    es: "Shen (申) = mono y metal: maña y recurso",
    pl: "Sin (申) = małpa i metal: zręczność i kombinacja",
  },
  酉: {
    ko: "유(酉) = 닭·잘 벼린 쇠, 정리와 결단의 기운",
    es: "You (酉) = gallo y metal afilado: orden y corte",
    pl: "Yu (酉) = kogut i ostry metal: ład i decyzja",
  },
  戌: {
    ko: "술(戌) = 개·마른 흙, 지킴과 경계의 기운",
    es: "Xu (戌) = perro y tierra seca: guarda y frontera",
    pl: "Sul (戌) = pies i sucha ziemia: straż i granica",
  },
  亥: {
    ko: "해(亥) = 돼지·큰 물, 포용과 휴식의 기운",
    es: "Hai (亥) = cerdo y gran agua: acogida y descanso",
    pl: "Hae (亥) = świnia i wielka woda: objęcie i odpoczynek",
  },
};

const PILLAR_ROLE: Record<PillarKey, Record<Locale, { title: string; meaning: string }>> = {
  year: {
    ko: { title: "년주", meaning: "태어난 해 · 집안과 어린 시절" },
    es: { title: "Pilar del año", meaning: "El año de nacimiento · familia e infancia" },
    pl: { title: "Filar roku", meaning: "Rok urodzenia · dom i dzieciństwo" },
  },
  month: {
    ko: { title: "월주", meaning: "태어난 달 · 사회생활과 타고난 힘" },
    es: { title: "Pilar del mes", meaning: "El mes de nacimiento · vida social y fuerza innata" },
    pl: { title: "Filar miesiąca", meaning: "Miesiąc urodzenia · życie społeczne i wrodzona siła" },
  },
  day: {
    ko: { title: "일주", meaning: "태어난 날 · 나 자신과 배우자 자리" },
    es: { title: "Pilar del día", meaning: "El día de nacimiento · tú mismo y el lugar de pareja" },
    pl: { title: "Filar dnia", meaning: "Dzień urodzenia · ty sam i miejsce partnera" },
  },
  hour: {
    ko: { title: "시주", meaning: "태어난 시간 · 노년과 자녀와 속마음" },
    es: { title: "Pilar de la hora", meaning: "La hora de nacimiento · vejez, hijos y el fuero interno" },
    pl: { title: "Filar godziny", meaning: "Godzina urodzenia · późne lata, dzieci i to, co w środku" },
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
  return [
    role.meaning,
    stemEasy(pillar.gan, locale),
    branchEasy(pillar.zhi, locale),
    loc(
      locale,
      `하늘 글자 ${ganLabel(pillar.gan)}는 ${elWord(ganEl, locale)}, 땅 글자 ${pillar.zhiKorean}(${pillar.zhi})는 ${elWord(zhiEl, locale)} 기운입니다.`,
      `Letra del cielo ${ganLabel(pillar.gan)}: ${elWord(ganEl, locale)}. Letra de la tierra ${pillar.zhi}: ${elWord(zhiEl, locale)}.`,
      `Znak nieba ${ganLabel(pillar.gan)}: ${elWord(ganEl, locale)}. Znak ziemi ${pillar.zhi}: ${elWord(zhiEl, locale)}.`,
    ),
  ];
}

function elWord(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "나무", es: "madera", pl: "drewno" },
    fire: { ko: "불", es: "fuego", pl: "ogień" },
    earth: { ko: "흙", es: "tierra", pl: "ziemia" },
    metal: { ko: "쇠", es: "metal", pl: "metal" },
    water: { ko: "물", es: "agua", pl: "woda" },
  };
  return table[element][locale];
}
