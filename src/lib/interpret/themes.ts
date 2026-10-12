import type { Locale } from "@/lib/i18n/config";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import { assembleThemeCards } from "./buildCards";
import { loc } from "./themeContext";

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
  "fashion",
  "food",
  "travel",
  "music",
  "hobby",
  "lucky",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ColorChip {
  hex: string;
  label: string;
}

export interface GlossChip {
  word: string;
  gloss: string;
}

export interface EasySection {
  title: string;
  items: string[];
}

export interface ThemeCardData {
  id: ThemeId;
  title: string;
  kicker: string;
  front: string[];
  frontTerms: GlossChip[];
  frontBullets: string[];
  easyHeadline: string;
  easy: string[];
  easyBullets: string[];
  easySections?: EasySection[];
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

export function stemEasyLine(gan: string, locale: Locale): string {
  return STEM_HEAD[gan]?.[locale] ?? STEM_HEAD["甲"][locale];
}

export function stemVoice(gan: string, locale: Locale): string[] {
  return STEM_VOICE[gan]?.[locale] ?? STEM_VOICE["甲"][locale];
}

export function buildThemeCards(calculation: SajuCalculation, locale: Locale): ThemeCardData[] {
  const voice = stemVoice(calculation.dayMaster.gan, locale);
  const head = stemEasyLine(calculation.dayMaster.gan, locale);
  return assembleThemeCards(calculation, locale, voice, head, chipsFor);
}

export function themeHeadline(card: ThemeCardData): string {
  return card.easyHeadline || card.easy[0] || card.front[0] || "";
}
