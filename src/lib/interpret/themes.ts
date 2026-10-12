import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { CAREER_TYPE, ELEMENT_NAME, STRENGTH_NAME, WEALTH_TYPE, tenGod, term } from "@/lib/i18n/terms";
import { CONTROLS, GENERATES } from "@/lib/saju/constants";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { ElementKey, SajuCalculation, SeunItem } from "@/lib/saju/types";

function loc(locale: Locale, ko: string, es: string, pl: string): string {
  if (locale === "es") return es;
  if (locale === "pl") return pl;
  return ko;
}

export const THEME_IDS = [
  "character",
  "career",
  "wealth",
  "love",
  "match",
  "relations",
  "colors",
  "fengshui",
  "health",
  "year",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ColorChip {
  hex: string;
  label: string;
}

export interface ThemeCardData {
  id: ThemeId;
  title: string;
  kicker: string;
  front: string[];
  frontBullets: string[];
  easyHeadline: string;
  easy: string[];
  easyBullets: string[];
  luckyColors?: ColorChip[];
  avoidColors?: ColorChip[];
  disclaimer?: string;
}

const STEM_VOICE: Record<string, Record<Locale, string[]>> = {
  甲: {
    ko: [
      "갑목은 큰 소나무처럼 방향을 먼저 정하고 밀어붙입니다. 시작은 빠르고, 한번 꽂힌 목표는 잘 바꾸지 않습니다.",
      "사람들 앞에서는 책임감이 커지지만, 타인의 속도에 맞추는 일은 연습이 필요합니다.",
      "숲을 혼자 만들려다 지치기 쉽습니다. 가지를 쳐 주는 사람, 즉 조력·시스템을 옆에 두는 편이 오래 갑니다.",
    ],
    es: [
      "Jia es el gran pino: elige dirección y empuja. Empieza rápido y suelta poco un objetivo.",
      "Ante un grupo crece el sentido de responsabilidad, pero adaptar el ritmo a otros pide práctica.",
      "Cansancio si intenta hacer todo el bosque solo. Le sienta bien un sistema y aliados que podan ramas.",
    ],
    pl: [
      "Gap to wielka sosna: najpierw kierunek, potem pęd. Szybki start, niechętnie puszcza cel.",
      "W grupie rośnie poczucie odpowiedzialności, ale dopasowanie tempa do innych wymaga ćwiczenia.",
      "Łatwo się męczy, gdy sam chce zbudować las. Lepiej mieć sojuszników i system, które przycinają gałęzie.",
    ],
  },
  乙: {
    ko: [
      "을목은 매화와 버들처럼 휘어지며 살아남습니다. 분위기와 사람 사이를 읽고, 충돌보다 우회로를 택합니다.",
      "겉은 부드러워도 속은 질깁니다. 거절을 직접 말하기보다 거리를 조절하는 편입니다.",
      "유연함이 강점이지만, 결정을 미루면 스스로도 어디가 본심인지 흐려집니다. 작은 약속을 빨리 고정하는 연습이 필요합니다.",
    ],
    es: [
      "Yi es ciruelo y sauce: sobrevive doblándose. Lee el ambiente y elige el desvío antes que el choque.",
      "Por fuera suave, por dentro tenaz. Más que un no directo, regula la distancia.",
      "La flexibilidad es su don, pero si aplaza decisiones se nubla el deseo real. Conviene fijar pequeños pactos pronto.",
    ],
    pl: [
      "Eul to śliwa i wierzba: przeżywa, uginając się. Czyta nastrój i wybiera objazd zamiast zderzenia.",
      "Na zewnątrz miękkość, w środku wytrwałość. Zamiast ostrego „nie” reguluje dystans.",
      "Elastyczność to atut, ale odwlekanie decyzji zaciemnia własne pragnienie. Ćwicz szybkie małe ustalenia.",
    ],
  },
  丙: {
    ko: [
      "병화는 태양입니다. 자리를 밝히고 사람을 모으며, 감정을 숨기는 쪽이 아닙니다.",
      "열정이 전염됩니다. 대신 그늘이 필요한 사람, 느린 절차, 반복 행정은 금방 지칩니다.",
      "빛은 오래 켜 두면 자신도 탑니다. 공개 성과와 비공개 회복 시간을 한 세트로 설계하는 편이 맞습니다.",
    ],
    es: [
      "Bing es el sol: ilumina el sitio, reúne gente y no esconde del todo la emoción.",
      "Su entusiasmo contagia. Se agota con trámites lentos y con quienes necesitan sombra.",
      "Si deja la luz encendida demasiado, se quema. Combine logros públicos con descanso privado.",
    ],
    pl: [
      "Byeong to słońce: rozświetla miejsce, zbiera ludzi, nie chowa emocji.",
      "Entuzjazm zaraża. Męczy się przy wolnej biurokracji i przy osobach, które potrzebują cienia.",
      "Zbyt długo włączone światło pali też nosiciela. Łącz publiczny wynik z prywatnym odpoczynkiem.",
    ],
  },
  丁: {
    ko: [
      "정화는 연등입니다. 한 사람을, 한 작품을, 한 취향을 오래 데웁니다. 큰 무대보다 밀도 있는 관계가 맞습니다.",
      "섬세한 미감과 기억력이 있습니다. 무시당하거나 대충 취급되면 불이 꺼진 것처럼 입을 닫습니다.",
      "열정을 혼자 품으면 과열이 됩니다. 창작·돌봄·학습처럼 ‘태울 심지’를 정해 두는 것이 건강합니다.",
    ],
    es: [
      "Ding es la linterna: calienta largo a una persona, una obra, un gusto. Prefiere densidad a gran escenario.",
      "Tiene gusto fino y memoria. Si le tratan a la ligera, se apaga y calla.",
      "Si guarda sola la pasión, se sobrecalienta. Conviene un pabilo claro: crear, cuidar, estudiar.",
    ],
    pl: [
      "Jeong to latarnia: długo ogrzewa jedną osobę, jedno dzieło, jeden gust. Gęstość zamiast wielkiej sceny.",
      "Ma cienki smak i pamięć. Gdy traktują ją byle jak, ogień gaśnie i milknie.",
      "Pasja noszona w pojedynkę się przegrzewa. Warto mieć knot: twórczość, opieka, nauka.",
    ],
  },
  戊: {
    ko: [
      "무토는 산입니다. 쉽게 안 움직이고, 한번 맡은 자리는 버팀목이 됩니다.",
      "신뢰와 체면을 중시합니다. 즉흥 약속, 말 바꾸기, 근거 없는 모험은 스트레스를 만듭니다.",
      "산은 무거워서 스스로도 지칩니다. ‘안 해도 세상이 안 무너지는 일’을 내려놓는 훈련이 필요합니다.",
    ],
    es: [
      "Wu es montaña: no se mueve a la ligera y, si asume un puesto, se vuelve pilar.",
      "Valora confianza y honor. Las promesas improvisadas y el cambio de palabra le estresan.",
      "La montaña pesa también a quien la es. Hay que soltar lo que el mundo no necesita que cargue.",
    ],
    pl: [
      "Mu to góra: nie rusza się lekko, a wzięty obowiązek staje się podporą.",
      "Ceni zaufanie i twarz. Improwizowane obietnice i zmiana zdania dają stres.",
      "Góra ciąży też nosicielowi. Ćwicz odkładanie spraw, bez których świat się nie zawali.",
    ],
  },
  己: {
    ko: [
      "기토는 논밭입니다. 사람을 기르고, 일상을 정리하고, 빈 곳을 흙으로 메웁니다.",
      "실무와 돌봄에서 빛을 봅니다. 칭찬보다 ‘이게 필요해’라는 구체적인 부탁에 힘이 납니다.",
      "너무 많이 품으면 밭이 굳습니다. 거절과 위임을 일정처럼 넣는 것이 지속 가능한 운영입니다.",
    ],
    es: [
      "Ji es el arrozal: cría gente, ordena el día, rellena huecos con tierra útil.",
      "Brilla en lo práctico y en el cuidado. Le da fuerza un encargo concreto más que un elogio vago.",
      "Si acoge demasiado, el campo se endurece. El no y la delegación deben entrar en el calendario.",
    ],
    pl: [
      "Gi to pole ryżowe: hoduje ludzi, porządkuje dzień, wypełnia luki ziemią.",
      "Świeci w robocie i w trosce. Bardziej niż pochwała działa konkretna prośba: „to jest potrzebne”.",
      "Zbyt wiele w sobie — pole twardnieje. Odmawianie i delegowanie muszą wejść do kalendarza.",
    ],
  },
  庚: {
    ko: [
      "경금은 쇠와 검입니다. 옳고 그름을 가르고, 말을 짧게 하며, 결론을 원합니다.",
      "원칙이 흔들리면 분노가 됩니다. 반대로 기준이 분명한 조직·기술·품질 일에서는 카리스마가 됩니다.",
      "자를 줄만 알고 붙일 줄을 모르면 사람이 떠납니다. ‘한 줄의 인정’을 의식적으로 보태십시오.",
    ],
    es: [
      "Geng es metal y espada: corta lo justo de lo injusto, habla corto, quiere conclusión.",
      "Si tiembla el principio, sale ira. En un oficio de norma, técnica y calidad, eso es carisma.",
      "Si solo corta y no une, la gente se va. Añada a propósito una línea de reconocimiento.",
    ],
    pl: [
      "Gyeong to metal i miecz: odcina słuszne od niesłusznego, mówi krótko, chce konkluzji.",
      "Gdy chwieje się zasada, pojawia się gniew. W rzemiośle normy, techniki i jakości to charyzma.",
      "Jeśli tylko tnie, a nie spaja — ludzie odchodzą. Świadomie dodaj jedną linijkę uznania.",
    ],
  },
  辛: {
    ko: [
      "신금은 보석입니다. 감각이 예민하고, 품질·품위·디테일에 자존감이 걸려 있습니다.",
      "대충인 환경에서는 기운이 빠집니다. 취향이 같은 소수, 완성도 있는 작업에서 값이 나옵니다.",
      "예민함은 재능이지 결함이 아닙니다. 다만 상처를 비밀로만 깎으면 고립됩니다. 감정을 언어로 세공하십시오.",
    ],
    es: [
      "Xin es joya: sentido fino, y la autoestima se ata a calidad, tono y detalle.",
      "En un entorno chapucero se apaga. Vale en un círculo pequeño con el mismo gusto y en obra bien acabada.",
      "La sensibilidad es don, no defecto. Si talla las heridas solo en secreto, se aísla. Labre la emoción en palabras.",
    ],
    pl: [
      "Sin to klejnot: czuły zmysł, a godność wisi na jakości, tonie i detalu.",
      "W bylejakości gaśnie. Cena wychodzi w małym kręgu gustu i w robocie dociągniętej.",
      "Wrażliwość to dar, nie wada. Jeśli rany szlifuje tylko w tajemnicy — izolacja. Oszlifuj emocję w język.",
    ],
  },
  壬: {
    ko: [
      "임수는 큰 바다입니다. 시야가 넓고, 정보가 많으며, 한 곳에 묶이는 일을 답답해합니다.",
      "지혜와 유머, 판을 키우는 감각이 있습니다. 동시에 깊이를 숨기고 표면만 흘러가기도 합니다.",
      "바다는 형태가 필요합니다. 마감, 한 명의 상대, 한 개의 채널처럼 ‘해안선’을 정하면 재능이 착지합니다.",
    ],
    es: [
      "Ren es el gran mar: mirada ancha, mucha información, y le ahoga lo demasiado atado.",
      "Tiene sabiduría, humor y olfato para agrandar el tablero. A veces fluye solo por la superficie.",
      "El mar necesita costa: un plazo, una persona, un canal. Ahí aterriza el talento.",
    ],
    pl: [
      "Im to wielkie morze: szerokie pole widzenia, dużo informacji, duszą go zbyt ciasne ramy.",
      "Ma mądrość, humor i węch do powiększania planszy. Bywa, że płynie tylko po powierzchni.",
      "Morze potrzebuje brzegu: deadline, jedna osoba, jeden kanał. Tam ląduje talent.",
    ],
  },
  癸: {
    ko: [
      "계수는 이슬과 지하수입니다. 눈에 띄지 않게 스며들어 사람을 읽고, 분위기 아래의 감정을 먼저 알아챕니다.",
      "직관이 빠르고 회복·치유·연구 쪽에 맞습니다. 시끄러운 경쟁 판에서는 자신을 숨깁니다.",
      "스며들기만 하면 경계가 없어집니다. 수면, 물, 혼자 있는 아침처럼 ‘샘을 채우는 의례’가 필수입니다.",
    ],
    es: [
      "Gui es rocío y agua subterránea: se filtra sin ruido, lee a la gente y nota la emoción bajo el ambiente.",
      "Intuición rápida, afinidad con recobrar, cuidar, investigar. En una competición ruidosa se oculta.",
      "Si solo se filtra, pierde borde. Necesita un rito que llene el pozo: sueño, agua, una mañana a solas.",
    ],
    pl: [
      "Gye to rosa i woda gruntowa: wsiąka bez hałasu, czyta ludzi i czuje emocję pod nastrojem.",
      "Szybka intuicja, bliskość odzyskiwania, troski, badań. W głośnej rywalizacji się chowa.",
      "Samo wsiąkanie zmazuje granicę. Potrzeba rytuału napełniającego źródło: sen, woda, samotny poranek.",
    ],
  },
};

function clean(lines: string[]): string[] {
  return lines.map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function currentSeun(calculation: SajuCalculation): SeunItem | undefined {
  const year = new Date().getFullYear();
  return calculation.seun.find((item) => item.year === year) ?? calculation.seun.find((item) => item.year >= year);
}

function currentDaeun(calculation: SajuCalculation) {
  const year = new Date().getFullYear();
  const birthYear = Number(calculation.birth.solarDate.slice(0, 4));
  const age = year - birthYear + 1;
  return calculation.daeun.find((item) => age >= item.startAge && age <= item.endAge) ?? calculation.daeun[0];
}

function weakStrong(calculation: SajuCalculation): { weak: ElementKey[]; strong: ElementKey[] } {
  const entries = Object.entries(calculation.elements.powerScore) as [ElementKey, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  return { strong: sorted.slice(0, 2).map(([key]) => key), weak: sorted.slice(-2).map(([key]) => key) };
}

function godLine(calculation: SajuCalculation, locale: Locale): string {
  return Object.entries(calculation.tenGods)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, value]) => `${tenGod(name, locale)} ${value.toFixed(1)}`)
    .join(" · ");
}

const KO_ELEMENT: Record<string, ElementKey> = { 목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water" };

function generatedBy(element: ElementKey): ElementKey {
  return (Object.entries(GENERATES) as [ElementKey, ElementKey][]).find(([, value]) => value === element)?.[0] ?? "water";
}

function controlledBy(element: ElementKey): ElementKey {
  return (Object.entries(CONTROLS) as [ElementKey, ElementKey][]).find(([, value]) => value === element)?.[0] ?? "metal";
}

const STEM_HEAD: Record<string, Record<Locale, string>> = {
  甲: {
    ko: "먼저 꽂고, 끝까지 가는 사람이에요.",
    es: "Eliges rumbo pronto y no sueltas fácil.",
    pl: "Szybko bierzesz kurs i nie puszczasz łatwo.",
  },
  乙: {
    ko: "휘어져도 안 꺾이는 사람이에요.",
    es: "Te doblas, pero no te rompes.",
    pl: "Gniesz się, ale nie łamiesz.",
  },
  丙: {
    ko: "자리를 밝히는 사람이에요. 숨기는 타입이 아니에요.",
    es: "Iluminas la sala. No eres de esconderte.",
    pl: "Rozświetlasz miejsce. Nie chowasz się.",
  },
  丁: {
    ko: "한 사람을, 한 일을 오래 데우는 사람이에요.",
    es: "Calientas largo a una persona o una obra.",
    pl: "Długo ogrzewasz jedną osobę albo jedną sprawę.",
  },
  戊: {
    ko: "한번 맡은 자리를 버티는 사람이에요.",
    es: "Si asumes un sitio, te quedas de pilar.",
    pl: "Jak weźmiesz miejsce, stajesz się podporą.",
  },
  己: {
    ko: "빈 곳을 메우고 사람을 챙기는 사람이에요.",
    es: "Rellenas huecos y cuidas a la gente.",
    pl: "Wypełniasz luki i ogarniasz ludzi.",
  },
  庚: {
    ko: "짧게 자르고, 결론을 원하는 사람이에요.",
    es: "Cortas corto y quieres una conclusión.",
    pl: "Tniesz krótko i chcesz konkluzji.",
  },
  辛: {
    ko: "디테일과 품격에 자존감이 걸려 있어요.",
    es: "Tu orgullo vive en el detalle y el tono.",
    pl: "Twoja godność wisi na detalu i tonie.",
  },
  壬: {
    ko: "판을 크게 보는 사람이에요. 좁으면 답답해요.",
    es: "Ves el tablero grande. Lo estrecho te ahoga.",
    pl: "Widzisz szeroką planszę. Ciasnota cię dusi.",
  },
  癸: {
    ko: "말보다 먼저 분위기를 읽는 사람이에요.",
    es: "Lees el ambiente antes que las palabras.",
    pl: "Czytasz nastrój wcześniej niż słowa.",
  },
};

const SWATCH: Record<ElementKey, { hex: string; ko: string; es: string; pl: string }[]> = {
  wood: [
    { hex: "#2f6b3a", ko: "청록", es: "verde bosque", pl: "leśna zieleń" },
    { hex: "#6d8a63", ko: "연두", es: "verde suave", pl: "jasna zieleń" },
    { hex: "#6b4f2a", ko: "나무갈색", es: "marrón madera", pl: "brąz drewna" },
  ],
  fire: [
    { hex: "#c43c28", ko: "주홍", es: "cinabrio", pl: "cynober" },
    { hex: "#8c1c12", ko: "진홍", es: "rojo profundo", pl: "głęboka czerwień" },
    { hex: "#6b2d5b", ko: "자색", es: "púrpura", pl: "purpura" },
  ],
  earth: [
    { hex: "#d4a017", ko: "황금색", es: "ámbar", pl: "bursztyn" },
    { hex: "#c4a574", ko: "베이지", es: "beige", pl: "beż" },
    { hex: "#8c7349", ko: "황토", es: "ocre", pl: "ochra" },
  ],
  metal: [
    { hex: "#f3efe6", ko: "한지 흰빛", es: "blanco hanji", pl: "biel hanji" },
    { hex: "#c4a574", ko: "금색", es: "oro", pl: "złoto" },
    { hex: "#9aa3ad", ko: "은색", es: "plata", pl: "srebro" },
  ],
  water: [
    { hex: "#1d4e89", ko: "남색", es: "azul marino", pl: "granat" },
    { hex: "#6b8498", ko: "회청", es: "azul gris", pl: "szaroniebieski" },
    { hex: "#1a1c20", ko: "먹색", es: "tinta", pl: "czerń tuszu" },
  ],
};

function chipsFor(elements: ElementKey[], locale: Locale, limit: number): ColorChip[] {
  const seen = new Set<string>();
  const chips: ColorChip[] = [];
  for (const element of elements) {
    for (const item of SWATCH[element]) {
      if (seen.has(item.hex)) continue;
      seen.add(item.hex);
      chips.push({ hex: item.hex, label: loc(locale, item.ko, item.es, item.pl) });
      if (chips.length >= limit) return chips;
    }
  }
  return chips;
}

function investStyle(top: string | undefined): "stable" | "aggressive" | "balanced" {
  if (top && ["축적형", "월급형"].includes(top)) return "stable";
  if (top && ["투자형", "사업형", "성과형"].includes(top)) return "aggressive";
  return "balanced";
}

function healthHint(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: {
      ko: "목은 간·근골격·눈의 리듬과 상징적으로 연결됩니다. 스트레칭과 걷기.",
      es: "La madera se asocia al hígado, músculo y ojos. Estirar y caminar.",
      pl: "Drewno łączy się z wątrobą, mięśniami i oczami. Rozciąganie i chód.",
    },
    fire: {
      ko: "화는 심장·염증·수면과 상징적으로 연결됩니다. 과열되면 쉬어야 합니다.",
      es: "El fuego se asocia a corazón, inflamación y sueño. Si hay sobrecalor, parar.",
      pl: "Ogień łączy się z sercem, stanem zapalnym i snem. Przy przegrzaniu — przerwa.",
    },
    earth: {
      ko: "토는 소화·비위·습과 연결됩니다. 규칙적인 식사와 당 조절.",
      es: "La tierra se asocia a digestión y humedad. Comidas regulares y menos azúcar.",
      pl: "Ziemia łączy się z trawieniem i wilgocią. Regularne posiłki i mniej cukru.",
    },
    metal: {
      ko: "금은 폐·피부·호흡과 연결됩니다. 건조함과 과한 비판을 조심.",
      es: "El metal se asocia a pulmón, piel y respiración. Cuidado con sequedad y crítica excesiva.",
      pl: "Metal łączy się z płucami, skórą i oddechem. Uwaga na suchość i nadmierną krytykę.",
    },
    water: {
      ko: "수는 신장·순환·골반 피로와 연결됩니다. 수분과 수면이 기본값.",
      es: "El agua se asocia a riñón, circulación y fatiga pélvica. Agua y sueño como base.",
      pl: "Woda łączy się z nerkami, krążeniem i zmęczeniem miednicy. Woda i sen jako baza.",
    },
  };
  return table[element][locale];
}

export function elementPercents(power: Record<ElementKey, number>): Record<ElementKey, number> {
  const total = Object.values(power).reduce((sum, value) => sum + value, 0) || 1;
  const raw = (Object.keys(power) as ElementKey[]).map((key) => ({
    key,
    value: Math.round((power[key] / total) * 100),
  }));
  const drift = 100 - raw.reduce((sum, item) => sum + item.value, 0);
  raw[0].value += drift;
  return Object.fromEntries(raw.map((item) => [item.key, item.value])) as Record<ElementKey, number>;
}

export function buildThemeCards(calculation: SajuCalculation, locale: Locale): ThemeCardData[] {
  const card = dayMasterCard(calculation.dayMaster.gan);
  const voice = STEM_VOICE[calculation.dayMaster.gan]?.[locale] ?? STEM_VOICE["甲"][locale];
  const head = STEM_HEAD[calculation.dayMaster.gan]?.[locale] ?? STEM_HEAD["甲"][locale];
  const strength = term(STRENGTH_NAME, calculation.strength.classification, locale);
  const topWealth = calculation.wealthTypes[0];
  const topCareer = calculation.careerTypes[0];
  const daeun = currentDaeun(calculation);
  const seun = currentSeun(calculation);
  const { weak, strong } = weakStrong(calculation);
  const p = calculation.pillars;
  const day = calculation.dayMaster;
  const yongsinKeys = calculation.useGod.yongsin.map((item) => KO_ELEMENT[item]).filter(Boolean) as ElementKey[];
  const gisinKeys = calculation.useGod.gisin.map((item) => KO_ELEMENT[item]).filter(Boolean) as ElementKey[];
  const support = generatedBy(day.element);
  const pressure = controlledBy(day.element);
  const output = GENERATES[day.element];
  const wealthEl = CONTROLS[day.element];
  const style = investStyle(topWealth?.type);
  const year = new Date().getFullYear();
  const gods = godLine(calculation, locale);
  const yong = calculation.useGod.yongsin.join("·") || "-";
  const hee = calculation.useGod.heesin.join("·") || "-";

  const character: ThemeCardData = {
    id: "character",
    title: msg(locale, "themeCharacter"),
    kicker: card.title[locale],
    front: clean([
      loc(
        locale,
        `일간 ${day.ganKorean}${day.elementKorean}(${day.gan}) · 신강/신약 ${calculation.strength.score}점 ${strength}.`,
        `Tronco diario ${day.gan} (${ELEMENT_NAME.es[day.element]}). Fuerza ${calculation.strength.score} · ${strength}.`,
        `Pień dnia ${day.gan} (${ELEMENT_NAME.pl[day.element]}). Siła ${calculation.strength.score} · ${strength}.`,
      ),
      loc(
        locale,
        `월지 ${p.month.zhiKorean}의 십성은 ${tenGod(p.month.zhiTenGodKorean, locale)}입니다. 사회 첫인상과 가깝습니다.`,
        `La rama del mes ${p.month.zhi} es ${tenGod(p.month.zhiTenGodKorean, locale)}: primera impresión social.`,
        `Gałąź miesiąca ${p.month.zhi} to ${tenGod(p.month.zhiTenGodKorean, locale)}: pierwsze wrażenie społeczne.`,
      ),
      loc(locale, `십성 상위: ${gods}. 용신 ${yong} · 희신 ${hee}.`, `Diez dioses: ${gods}. Yongsin ${yong} · Heesin ${hee}.`, `Dziesięć gwiazd: ${gods}. Yongsin ${yong} · Heesin ${hee}.`),
    ]),
    frontBullets: calculation.strength.reasons.slice(0, 3),
    easyHeadline: head,
    easy: voice,
    easyBullets: calculation.talents.slice(0, 2).map((item) => item.ability),
  };

  const career: ThemeCardData = {
    id: "career",
    title: msg(locale, "themeCareer"),
    kicker: topCareer ? term(CAREER_TYPE, topCareer.type, locale) : "",
    front: clean([
      loc(
        locale,
        `적성 1순위는 ${term(CAREER_TYPE, topCareer?.type ?? "", locale)}입니다. ${topCareer?.reasons[0] ?? ""} 관성+인성은 조직, 식상+재성은 사업, 인성+식상은 전문성으로 읽습니다.`,
        `Vocación 1: ${term(CAREER_TYPE, topCareer?.type ?? "", locale)}. ${topCareer?.reasons[0] ?? ""} Autoridad+impronta = organización; expresión+riqueza = negocio.`,
        `Zawód 1: ${term(CAREER_TYPE, topCareer?.type ?? "", locale)}. ${topCareer?.reasons[0] ?? ""} Autorytet+pieczęć = organizacja; wyraz+majątek = biznes.`,
      ),
      loc(
        locale,
        `상위 유형: ${calculation.careerTypes.slice(0, 5).map((item) => term(CAREER_TYPE, item.type, locale)).join(", ")}.`,
        `Tipos altos: ${calculation.careerTypes.slice(0, 5).map((item) => term(CAREER_TYPE, item.type, locale)).join(", ")}.`,
        `Górne typy: ${calculation.careerTypes.slice(0, 5).map((item) => term(CAREER_TYPE, item.type, locale)).join(", ")}.`,
      ),
      daeun
        ? loc(locale, `현재 대운 직업 키워드: ${daeun.career}.`, `Daeun laboral: ${daeun.career}.`, `Daeun zawodowy: ${daeun.career}.`)
        : "",
    ]),
    frontBullets: calculation.talents.slice(0, 3).map((item) => `${item.title}: ${item.careers.slice(0, 3).join(", ")}`),
    easyHeadline: loc(
      locale,
      `일 잘 되는 모드는 ‘${term(CAREER_TYPE, topCareer?.type ?? "", locale)}’에 가까워요.`,
      `Te va el modo “${term(CAREER_TYPE, topCareer?.type ?? "", locale)}”.`,
      `Najlepiej wchodzisz w tryb „${term(CAREER_TYPE, topCareer?.type ?? "", locale)}”.`,
    ),
    easy: clean([
      loc(
        locale,
        "한 글자로 직업을 못 찍어요. 대신 일하는 리듬은 분명해요.",
        "No te pongo un oficio de una letra. Sí el ritmo de trabajo.",
        "Nie dam ci zawodu jedną literą. Rytm pracy — tak.",
      ),
      loc(
        locale,
        topCareer?.type === "창업형" || topCareer?.type === "콘텐츠형"
          ? "만들어 보여주는 쪽이 맞아요. 지시만 받는 자리는 금방 답답해져요."
          : topCareer?.type === "연구형" || topCareer?.type === "전문직형"
            ? "깊게 파는 일이 맞아요. 매일 사람만 상대하면 방전돼요."
            : "사람과 규칙을 같이 다루는 자리가 오래 가요. 혼자 다 만들려 하지 마세요.",
        topCareer?.type === "창업형" || topCareer?.type === "콘텐츠형"
          ? "Te sienta crear y mostrar. Un puesto solo de órdenes te ahoga."
          : topCareer?.type === "연구형" || topCareer?.type === "전문직형"
            ? "Te sienta profundizar. Si solo atiendes gente todo el día, te vacías."
            : "Te dura un puesto con gente y normas. No intentes hacerlo todo solo.",
        topCareer?.type === "창업형" || topCareer?.type === "콘텐츠형"
          ? "Pasuje ci tworzyć i pokazywać. Samo wykonywanie poleceń cię dusi."
          : topCareer?.type === "연구형" || topCareer?.type === "전문직형"
            ? "Pasuje ci kopać w głąb. Sam kontakt z ludźmi przez cały dzień cię opróżnia."
            : "Dłużej wytrzymasz tam, gdzie są ludzie i zasady. Nie rób wszystkiego sam.",
      ),
      loc(
        locale,
        "프로젝트 하나, 마감 하나, 내가 책임지는 덩어리가 있으면 속도가 나요.",
        "Un proyecto, un plazo, un bloque tuyo: ahí sale velocidad.",
        "Jeden projekt, jeden deadline, jeden twój kawałek — wtedy idzie tempo.",
      ),
    ]),
    easyBullets: [],
  };

  const investLabel = loc(
    locale,
    style === "stable" ? "안정형" : style === "aggressive" ? "공격형" : "균형형",
    style === "stable" ? "conservador" : style === "aggressive" ? "agresivo" : "equilibrado",
    style === "stable" ? "stabilny" : style === "aggressive" ? "agresywny" : "zrównoważony",
  );

  const wealth: ThemeCardData = {
    id: "wealth",
    title: msg(locale, "themeWealth"),
    kicker: investLabel,
    front: clean([
      loc(
        locale,
        `현금흐름 유형 1순위는 ${term(WEALTH_TYPE, topWealth?.type ?? "", locale)}입니다. ${topWealth?.reasons[0] ?? ""} 식상생재는 버는 힘, 정재·인성은 지키는 힘, 겁재·충은 새는 구멍입니다.`,
        `Flujo 1: ${term(WEALTH_TYPE, topWealth?.type ?? "", locale)}. ${topWealth?.reasons[0] ?? ""} Expresión→riqueza = ganar; riqueza estable + impronta = guardar.`,
        `Przepływ 1: ${term(WEALTH_TYPE, topWealth?.type ?? "", locale)}. ${topWealth?.reasons[0] ?? ""} Wyraz→majątek = zarabianie; stały majątek + pieczęć = trzymanie.`,
      ),
      loc(
        locale,
        `재성 점수: ${calculation.wealthTypes.slice(0, 4).map((item) => `${term(WEALTH_TYPE, item.type, locale)} ${item.score}`).join(" · ")}.`,
        `Ranking: ${calculation.wealthTypes.slice(0, 4).map((item) => `${term(WEALTH_TYPE, item.type, locale)} ${item.score}`).join(" · ")}.`,
        `Ranking: ${calculation.wealthTypes.slice(0, 4).map((item) => `${term(WEALTH_TYPE, item.type, locale)} ${item.score}`).join(" · ")}.`,
      ),
      daeun ? loc(locale, `대운 돈 기후: ${daeun.money}.`, `Clima de dinero del daeun: ${daeun.money}.`, `Klimat pieniędzy daeun: ${daeun.money}.`) : "",
    ]),
    frontBullets: calculation.wealthTypes.slice(0, 3).flatMap((item) => item.reasons.slice(0, 1)),
    easyHeadline: loc(locale, `돈 감각은 ${investLabel}에 가까워요.`, `Tu dinero tira a lo ${investLabel}.`, `Twoje pieniądze ciągną ku stylowi ${investLabel}.`),
    easy: clean([
      loc(
        locale,
        style === "stable"
          ? "한 번에 크게 먹기보다, 새는 구멍부터 막는 편이 마음이 편해요."
          : style === "aggressive"
            ? "기회가 보이면 몸이 먼저 반응해요. 대신 한 번에 올인하지 마세요."
            : "벌 때와 지킬 때를 나누면 덜 흔들려요. 반반이 이 사주의 기본값이에요.",
        style === "stable"
          ? "Mejor tapar fugas que apostar a lo grande de un golpe."
          : style === "aggressive"
            ? "Si ves oportunidad, el cuerpo responde. No pongas todo en una carta."
            : "Separa ganar y guardar. Mitad y mitad es tu valor por defecto.",
        style === "stable"
          ? "Lepiej zatkać wycieki, niż jeść wszystko za jednym razem."
          : style === "aggressive"
            ? "Jak widzisz okazję, ciało reaguje pierwsze. Nie stawiaj wszystkiego na jedną kartę."
            : "Oddziel zarabianie od trzymania. Pół na pół to twoja baza.",
      ),
      loc(
        locale,
        "월급·모으기·사업 중 뭐가 ‘맞냐’만 보세요. 종목 찍기는 사주 일이 아니에요.",
        "Mira si te va sueldo, ahorro o negocio. El saju no elige acciones.",
        "Patrz, czy pasuje pensja, odkładanie czy biznes. Saju nie wybiera spółek.",
      ),
    ]),
    easyBullets: [],
    disclaimer: msg(locale, "wealthFunDisclaimer"),
  };

  const love: ThemeCardData = {
    id: "love",
    title: msg(locale, "themeLove"),
    kicker: p.day.zhiKorean,
    front: clean([
      loc(
        locale,
        `배우자궁은 일지 ${p.day.zhiKorean}(${p.day.twelveStageKorean})입니다. 성별 공식만으로 상대를 단정하지 않고, 일지·합충·식상·대운을 같이 봅니다.`,
        `Palacio del cónyuge: rama del día ${p.day.zhi} (${p.day.twelveStageKorean}). No fijamos pareja solo por sexo.`,
        `Pałac współmałżonka: gałąź dnia ${p.day.zhi} (${p.day.twelveStageKorean}). Nie ustalamy partnera samą płcią.`,
      ),
      loc(
        locale,
        "식상이 많으면 표현형, 인성이 많으면 관찰형, 관성이 많으면 조건·책임형으로 나타나는 경우가 많습니다.",
        "Mucha expresión: habla. Mucha impronta: observa. Mucha autoridad: pone condiciones.",
        "Dużo wyrazu: mówi. Dużo pieczęci: obserwuje. Dużo autorytetu: stawia warunki.",
      ),
      daeun ? loc(locale, `현재 대운 관계 키워드: ${daeun.love}.`, `Clave relacional del daeun: ${daeun.love}.`, `Klucz relacji daeun: ${daeun.love}.`) : "",
    ]),
    frontBullets: calculation.relations.slice(0, 3).map((item) => item.description),
    easyHeadline: loc(
      locale,
      "사랑은 분위기부터 읽고, 말로 밀어붙이면 오히려 어색해져요.",
      "En el amor lees el ambiente; si empujas con palabras, se pone raro.",
      "W miłości najpierw czytasz nastrój; pchanie słowami robi się dziwnie.",
    ),
    easy: clean([
      loc(
        locale,
        `관계에서 ${p.day.twelveStageKorean} 리듬이 나와요. 급하게 확정하려고 하면 상대가 숨어요.`,
        `En pareja sale el ritmo ${p.day.twelveStageKorean}. Si cierras demasiado pronto, el otro se esconde.`,
        `W relacji wychodzi rytm ${p.day.twelveStageKorean}. Jak za szybko zamykasz, druga strona się chowa.`,
      ),
      loc(
        locale,
        "좋아하는 티는 작게, 약속은 분명하게. 그게 이 사주의 연애 매너예요.",
        "El gusto, en bajo; la cita, clara. Ese es tu modo.",
        "Sympatia — cicho. Umowa — jasno. Taki masz tryb.",
      ),
      seun ? loc(locale, `${seun.year}년 연애 날씨: ${seun.love}.`, `Clima amoroso ${seun.year}: ${seun.love}.`, `Klimat miłości ${seun.year}: ${seun.love}.`) : "",
    ]),
    easyBullets: [],
  };

  const match: ThemeCardData = {
    id: "match",
    title: msg(locale, "themeMatch"),
    kicker: loc(locale, `${ELEMENT_NAME.ko[support]}생 ${ELEMENT_NAME.ko[day.element]}`, `${ELEMENT_NAME.es[support]} → ${ELEMENT_NAME.es[day.element]}`, `${ELEMENT_NAME.pl[support]} → ${ELEMENT_NAME.pl[day.element]}`),
    front: clean([
      loc(
        locale,
        `나를 생하는 오행은 ${ELEMENT_NAME.ko[support]}(인성), 같은 오행은 ${ELEMENT_NAME.ko[day.element]}(비겁), 나를 극하는 오행은 ${ELEMENT_NAME.ko[pressure]}(관성)입니다.`,
        `Me genera ${ELEMENT_NAME.es[support]} (impronta). Mismo elemento: ${ELEMENT_NAME.es[day.element]}. Me controla ${ELEMENT_NAME.es[pressure]} (autoridad).`,
        `Rodzi mnie ${ELEMENT_NAME.pl[support]} (pieczęć). Ten sam żywioł: ${ELEMENT_NAME.pl[day.element]}. Kontroluje mnie ${ELEMENT_NAME.pl[pressure]} (autorytet).`,
      ),
      loc(
        locale,
        `내가 생하는 쪽은 ${ELEMENT_NAME.ko[output]}(식상), 내가 극하는 쪽은 ${ELEMENT_NAME.ko[wealthEl]}(재성)입니다. 합이 있으면 끌리고, 충이 있으면 리듬이 어긋납니다.`,
        `Yo genero ${ELEMENT_NAME.es[output]} (expresión) y controlo ${ELEMENT_NAME.es[wealthEl]} (riqueza). Unión atrae; choque desajusta el ritmo.`,
        `Ja rodzę ${ELEMENT_NAME.pl[output]} (wyraz) i kontroluję ${ELEMENT_NAME.pl[wealthEl]} (majątek). Połączenie przyciąga; zderzenie psuje rytm.`,
      ),
    ]),
    frontBullets: calculation.relations.slice(0, 3).map((item) => `${item.typeKorean}: ${item.description}`),
    easyHeadline: loc(
      locale,
      `편해요: ${ELEMENT_NAME.ko[support]}·${ELEMENT_NAME.ko[day.element]} 느낌의 사람. 부담: ${ELEMENT_NAME.ko[pressure]}처럼 세게 누르는 사람.`,
      `Cómodo: gente ${ELEMENT_NAME.es[support]}/${ELEMENT_NAME.es[day.element]}. Cuidado: quien aprieta como ${ELEMENT_NAME.es[pressure]}.`,
      `Wygodnie: ludzie ${ELEMENT_NAME.pl[support]}/${ELEMENT_NAME.pl[day.element]}. Uwaga: kto uciska jak ${ELEMENT_NAME.pl[pressure]}.`,
    ),
    easy: clean([
      loc(
        locale,
        "받아주고, 속도 맞춰 주고, 혼자 결정하라고 안 재촉하는 사람이 오래 가요.",
        "Quien te recibe, adapta el ritmo y no te empuja a decidir solo, dura.",
        "Kto cię przyjmuje, dopasowuje tempo i nie pcha do decyzji w pojedynkę — zostaje.",
      ),
      loc(
        locale,
        "내 말을 자르거나, 정답만 던지거나, 자존심 싸움으로 가는 사람은 초반엔 짜릿해도 금방 지쳐요.",
        "Quien te corta, suelta ‘la verdad’ o pelea el orgullo: al inicio pica, luego cansa.",
        "Kto ci przerywa, rzuca „prawdę” albo idzie w honory: na starcie iskrzy, potem męczy.",
      ),
    ]),
    easyBullets: [],
  };

  const relations: ThemeCardData = {
    id: "relations",
    title: msg(locale, "themeRelations"),
    kicker: loc(locale, "년주·월주", "Año · mes", "Rok · miesiąc"),
    front: clean([
      loc(
        locale,
        `년주 ${p.year.ganzhiKorean}은 초년·친구 층, 월주 ${p.month.ganzhiKorean}은 사회·직장 층으로 읽습니다. 월지 십성 ${tenGod(p.month.zhiTenGodKorean, locale)}이 조직에서 보이는 태도입니다.`,
        `Pilar del año ${p.year.ganzhi}: amigos/inicio. Pilar del mes ${p.month.ganzhi}: trabajo. Diez dioses del mes: ${tenGod(p.month.zhiTenGodKorean, locale)}.`,
        `Filar roku ${p.year.ganzhi}: przyjaciele/początek. Filar miesiąca ${p.month.ganzhi}: praca. Gwiazda miesiąca: ${tenGod(p.month.zhiTenGodKorean, locale)}.`,
      ),
      calculation.relations.length
        ? loc(locale, `원국 합충: ${calculation.relations.map((item) => item.typeKorean).join(", ")}.`, `Uniones/choques: ${calculation.relations.map((item) => item.typeKorean).join(", ")}.`, `Połączenia/zderzenia: ${calculation.relations.map((item) => item.typeKorean).join(", ")}.`)
        : loc(locale, "원국 합충이 두드러지지 않아 관계는 대운·세운에서 더 잘 흔들립니다.", "Pocos choques natales: las relaciones se mueven más en daeun/seun.", "Mało zderzeń w karcie: relacje ruszają się bardziej w daeun/seun."),
    ]),
    frontBullets: [],
    easyHeadline: loc(
      locale,
      "친구는 깊게, 직장은 역할이 분명할 때 편해요.",
      "Amigos, en profundidad. Trabajo, cuando el rol está claro.",
      "Przyjaciele — głęboko. Praca — gdy rola jest jasna.",
    ),
    easy: clean([
      loc(
        locale,
        "친구는 많이 사귀기보다, 몇 명과 오래 가는 쪽이 맞아요. 가벼운 모임은 괜찮고, 매일 감정 공유는 부담이에요.",
        "Mejor pocos amigos largos que muchos. Queda bien lo ligero; compartir emoción a diario pesa.",
        "Lepiej kilku przyjaciół na długo niż tłum. Lekkie spotkania OK; codzienne wylewanie emocji ciąży.",
      ),
      loc(
        locale,
        "직장에서는 ‘내가 뭘 맡는지’가 보이면 힘이 나요. 모호한 지시, 갑작스런 역할 변경은 스트레스를 키워요.",
        "En el trabajo te da fuerza ver qué es tuyo. La orden vaga y el cambio brusco de rol estresan.",
        "W pracy dodaje siły, gdy widać, co jest twoje. Mętne polecenie i nagła zmiana roli robią stres.",
      ),
    ]),
    easyBullets: [],
  };

  const lucky = chipsFor(yongsinKeys.length ? yongsinKeys : [support, output], locale, 4);
  const avoid = chipsFor(gisinKeys.length ? gisinKeys : [pressure], locale, 3);

  const colors: ThemeCardData = {
    id: "colors",
    title: msg(locale, "themeColors"),
    kicker: loc(locale, `용신 ${yong}`, `Yongsin ${yong}`, `Yongsin ${yong}`),
    front: clean([
      loc(
        locale,
        `용신 오행 ${yong}은 색으로 보완하는 오행입니다. 희신 ${hee}, 기신 ${calculation.useGod.gisin.join("·") || "-"}.`,
        `Yongsin ${yong}: elementos a reforzar con color. Heesin ${hee}. Gisin ${calculation.useGod.gisin.join("·") || "-"}.`,
        `Yongsin ${yong}: żywioły do wzmocnienia kolorem. Heesin ${hee}. Gisin ${calculation.useGod.gisin.join("·") || "-"}.`,
      ),
      loc(
        locale,
        "오방색 기준으로 용신 계열은 가까이, 기신 계열은 눈앞에 너무 많이 두지 않습니다.",
        "En obangsaek, acerca el yongsin y no satures el gisin delante de los ojos.",
        "W obangsaek trzymaj yongsin blisko, a gisin nie pchaj przed oczy.",
      ),
    ]),
    frontBullets: [],
    easyHeadline: loc(locale, "옷·소품 색깔은 ‘기분 좋아지는 쪽’을 고르면 돼요.", "En ropa y objetos, elige el color que te sienta bien.", "W ubraniu i przedmiotach bierz kolor, przy którym ci dobrze."),
    easy: clean([
      loc(
        locale,
        "행운색은 나를 살리는 오행 색이에요. 피하면 좋은 색은 ‘나쁜 색’이 아니라, 너무 많으면 피곤한 색이에요.",
        "Los colores de suerte nutren tu elemento. Los de evitar no son ‘malos’: cansan si hay demasiados.",
        "Kolory szczęścia karmią twój żywioł. Te do unikania nie są „złe” — męczą, gdy jest ich za dużo.",
      ),
    ]),
    easyBullets: [],
    luckyColors: lucky,
    avoidColors: avoid,
  };

  const fengshui: ThemeCardData = {
    id: "fengshui",
    title: msg(locale, "themeFengshui"),
    kicker: loc(locale, `용신 ${yong}`, `Yongsin ${yong}`, `Yongsin ${yong}`),
    front: clean([
      loc(
        locale,
        `풍수는 용신 오행을 공간에 배치하는 일로 봅니다. 목은 동, 화는 남, 토는 중앙·남서, 금은 서, 수는 북입니다.`,
        `El feng shui aquí coloca el yongsin en el espacio. Madera este, fuego sur, tierra centro/SO, metal oeste, agua norte.`,
        `Feng shui tutaj stawia yongsin w przestrzeni. Drewno wschód, ogień południe, ziemia środek/SW, metal zachód, woda północ.`,
      ),
      loc(
        locale,
        `이 사주의 우선 오행은 ${yong}입니다. 책상·침대·출입구가 그 방향을 막지 않게 합니다.`,
        `Tu elemento prioritario es ${yong}. Que mesa, cama y puerta no lo tapen.`,
        `Twój pierwszy żywioł to ${yong}. Biurko, łóżko i drzwi niech go nie zasłaniają.`,
      ),
    ]),
    frontBullets: (yongsinKeys.length ? yongsinKeys : [day.element]).map((element) =>
      loc(
        locale,
        element === "wood"
          ? "동쪽 · 식물 · 나무 소품 · 직사각 배치"
          : element === "fire"
            ? "남쪽 · 조명 · 촛불 · 따뜻한 직물"
            : element === "earth"
              ? "중앙·남서 · 도자기 · 낮은 수납 · 안정된 바닥"
              : element === "metal"
                ? "서쪽 · 둥근 금속 · 종 · 정리된 선"
                : "북쪽 · 거울·물그릇 · 남색 패브릭 · 곡선",
        element === "wood"
          ? "Este · plantas · madera · líneas rectas"
          : element === "fire"
            ? "Sur · luz · vela · tejidos cálidos"
            : element === "earth"
              ? "Centro/SO · cerámica · mueble bajo · suelo estable"
              : element === "metal"
                ? "Oeste · metal redondo · campana · líneas limpias"
                : "Norte · espejo/cuenco de agua · tela índigo · curva",
        element === "wood"
          ? "Wschód · rośliny · drewno · proste linie"
          : element === "fire"
            ? "Południe · światło · świeca · ciepłe tkaniny"
            : element === "earth"
              ? "Środek/SW · ceramika · niska szafka · stabilna podłoga"
              : element === "metal"
                ? "Zachód · okrągły metal · dzwon · czyste linie"
                : "Północ · lustro/miseczka wody · granat · łuk",
      ),
    ),
    easyHeadline: loc(locale, "집을 ‘용신 쪽으로’ 조금 열어 두면 숨이 트여요.", "Si abres un poco la casa hacia tu yongsin, respiras.", "Jak trochę otworzysz dom w stronę yongsin, łapiesz oddech."),
    easy: clean([
      loc(
        locale,
        "비싼 인테리어가 아니라, 방향 하나와 소품 하나면 충분해요. 책상 앞에 그 색·그 질감을 두세요.",
        "No hace falta un interior caro: una dirección y un objeto. Pon ese color y esa textura delante del escritorio.",
        "Nie trzeba drogiego wnętrza: jeden kierunek i jeden przedmiot. Ten kolor i tę fakturę postaw przed biurkiem.",
      ),
      loc(
        locale,
        "너무 많은 거울, 너무 밝은 조명, 너무 막힌 구석이 있으면 먼저 그것부터 빼세요.",
        "Si hay demasiados espejos, luz dura o un rincón tapado, quita eso primero.",
        "Za dużo luster, ostrego światła albo zatkany kąt — to zdejmij najpierw.",
      ),
    ]),
    easyBullets: [],
  };

  const health: ThemeCardData = {
    id: "health",
    title: msg(locale, "themeHealth"),
    kicker: ELEMENT_NAME[locale][day.element],
    front: clean([
      loc(locale, "사주는 의학적 진단이 아닙니다. 오행-장부의 상징적 대응만 적습니다.", "El saju no es diagnóstico. Solo hay correspondencia simbólica elemento-órgano.", "Saju nie jest diagnozą. Tylko symboliczne powiązanie żywioł–narząd."),
      loc(
        locale,
        `일간 ${day.elementKorean} · 월령 ${calculation.season.monthOrderKorean}. 강한 오행 ${strong.map((key) => ELEMENT_NAME.ko[key]).join("·")}, 약한 오행 ${weak.map((key) => ELEMENT_NAME.ko[key]).join("·")}.`,
        `Tronco ${ELEMENT_NAME.es[day.element]} · mes ${calculation.season.monthOrderKorean}. Fuertes: ${strong.map((key) => ELEMENT_NAME.es[key]).join(", ")}. Débiles: ${weak.map((key) => ELEMENT_NAME.es[key]).join(", ")}.`,
        `Pień ${ELEMENT_NAME.pl[day.element]} · miesiąc ${calculation.season.monthOrderKorean}. Silne: ${strong.map((key) => ELEMENT_NAME.pl[key]).join(", ")}. Słabe: ${weak.map((key) => ELEMENT_NAME.pl[key]).join(", ")}.`,
      ),
      healthHint(day.element, locale),
    ]),
    frontBullets: calculation.weaknesses.slice(0, 3).map((item) => `${item.title} — ${item.remedy}`),
    easyHeadline: loc(locale, "몸이 먼저 보내는 신호는 ‘잠’이랑 ‘긴장’이에요.", "El cuerpo avisa primero con sueño y tensión.", "Ciało najpierw daje znać snem i napięciem."),
    easy: clean([
      loc(
        locale,
        "크게 아프다는 뜻이 아니에요. 과한 오행은 줄이고, 약한 오행은 생활로 보완하면 돼요.",
        "No dice que te vas a enfermar. Baja lo que sobra y refuerza lo flojo en el día a día.",
        "To nie znaczy, że zachorujesz. Ujmij to, czego za dużo, i wspieraj to, co słabe, na co dzień.",
      ),
      healthHint(day.element, locale),
      daeun ? loc(locale, `요즘 구간 메모: ${daeun.health}.`, `Nota de ahora: ${daeun.health}.`, `Notatka na teraz: ${daeun.health}.`) : "",
    ]),
    easyBullets: [],
  };

  const yearCard: ThemeCardData = {
    id: "year",
    title: msg(locale, "themeYear"),
    kicker: seun ? `${seun.year}` : `${year}`,
    front: clean([
      seun
        ? loc(
            locale,
            `${seun.year}년 세운 ${seun.ganzhiKorean}(${seun.ganzhi}) · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary} 별점 ${seun.stars}/5는 상대 평가입니다.`,
            `Seun ${seun.year}: ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary} Estrellas ${seun.stars}/5 (relativo).`,
            `Seun ${seun.year}: ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary} Gwiazdki ${seun.stars}/5 (względnie).`,
          )
        : loc(locale, `${year}년 세운을 계산했습니다.`, `Seun de ${year} calculado.`, `Seun ${year} policzony.`),
      seun ? loc(locale, `직업 ${seun.career} / 돈 ${seun.money} / 연애 ${seun.love}.`, `Trabajo ${seun.career} / dinero ${seun.money} / amor ${seun.love}.`, `Praca ${seun.career} / pieniądze ${seun.money} / miłość ${seun.love}.`) : "",
      daeun
        ? loc(
            locale,
            `올해 대운 ${daeun.startAge}~${daeun.endAge}세 ${daeun.ganzhiKorean}(${tenGod(daeun.tenGodKorean, locale)}).`,
            `Daeun ${daeun.startAge}–${daeun.endAge}: ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}).`,
            `Daeun ${daeun.startAge}–${daeun.endAge}: ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}).`,
          )
        : "",
    ]),
    frontBullets: seun?.relationsWithNatal ?? [],
    easyHeadline: loc(
      locale,
      seun?.relationsWithNatal.length ? "올해는 판이 움직이는 해예요. 한 번에 결정하지 마세요." : "올해는 판을 키우기보다, 있는 판을 다지는 해에 가까워요.",
      seun?.relationsWithNatal.length ? "Este año mueve el tablero. No decidas todo a la vez." : "Este año, más que agrandar, asienta lo que ya tienes.",
      seun?.relationsWithNatal.length ? "Ten rok rusza planszę. Nie decyduj wszystkiego naraz." : "Ten rok raczej utrwala planszę, niż ją powiększa.",
    ),
    easy: clean([
      loc(
        locale,
        "직업·돈·연애를 동시에 갈아엎지 마세요. 하나만 움직이고, 나머지는 유지가 이득이에요.",
        "No vuelques trabajo, dinero y amor a la vez. Mueve uno; el resto, mantenerlo.",
        "Nie wywracaj naraz pracy, pieniędzy i miłości. Rusz jedno; resztę trzymaj.",
      ),
      seun ? loc(locale, `올해 한 줄: 일 ${seun.career} / 돈 ${seun.money} / 마음 ${seun.love}.`, `Este año: trabajo ${seun.career} / dinero ${seun.money} / corazón ${seun.love}.`, `W tym roku: praca ${seun.career} / pieniądze ${seun.money} / serce ${seun.love}.`) : "",
    ]),
    easyBullets: seun?.sinsalChanges ?? [],
  };

  return [character, career, wealth, love, match, relations, colors, fengshui, health, yearCard];
}

export function themeHeadline(card: ThemeCardData): string {
  return card.easyHeadline || card.easy[0] || card.front[0] || "";
}
