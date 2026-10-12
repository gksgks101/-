import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { CAREER_TYPE, ELEMENT_NAME, STRENGTH_NAME, TEN_GOD_NAME, WEALTH_TYPE, tenGod, term } from "@/lib/i18n/terms";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { ElementKey, SajuCalculation, SeunItem } from "@/lib/saju/types";

export type ThemeId = "character" | "love" | "wealth" | "career" | "health" | "year";

export interface ThemeCardData {
  id: ThemeId;
  title: string;
  kicker: string;
  paragraphs: string[];
  bullets: string[];
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
  const strength = term(STRENGTH_NAME, calculation.strength.classification, locale);
  const topWealth = calculation.wealthTypes[0];
  const topCareer = calculation.careerTypes[0];
  const daeun = currentDaeun(calculation);
  const seun = currentSeun(calculation);
  const { weak, strong } = weakStrong(calculation);
  const p = calculation.pillars;
  const hour = p.hour ? `${p.hour.ganzhiKorean} (${p.hour.ganzhi})` : msg(locale, "timeUnknownLabel");
  const year = new Date().getFullYear();

  const character: ThemeCardData = {
    id: "character",
    title: msg(locale, "themeCharacter"),
    kicker: card.title[locale],
    paragraphs: clean([
      ...voice,
      locale === "ko"
        ? `일간은 ${calculation.dayMaster.ganKorean}${calculation.dayMaster.elementKorean}이고, 신강/신약은 ${calculation.strength.score}점 · ${strength}입니다. 월지 ${p.month.zhiKorean}의 십성(${tenGod(p.month.zhiTenGodKorean, locale)})이 사회에서 보이는 첫인상에 가깝습니다.`
        : locale === "es"
          ? `El tronco diario es ${calculation.dayMaster.gan} (${calculation.dayMaster.elementKorean}). Fuerza ${calculation.strength.score} · ${strength}. La rama del mes ${p.month.zhi} (${tenGod(p.month.zhiTenGodKorean, locale)}) se parece a la primera impresión social.`
          : `Pień dnia to ${calculation.dayMaster.gan} (${calculation.dayMaster.elementKorean}). Siła ${calculation.strength.score} · ${strength}. Gałąź miesiąca ${p.month.zhi} (${tenGod(p.month.zhiTenGodKorean, locale)}) jest bliska pierwszemu wrażeniu społecznemu.`,
      locale === "ko"
        ? `십성 상위는 ${godLine(calculation, locale)}입니다. 이 조합이 말투, 결정 속도, 사람 다루는 방식에 반복됩니다.`
        : locale === "es"
          ? `Diez dioses dominantes: ${godLine(calculation, locale)}. Ese cóctel se repite en el habla, la velocidad de decisión y el trato.`
          : `Dominujące dziesięć gwiazd: ${godLine(calculation, locale)}. Ta mieszanka wraca w mowie, tempie decyzji i sposobie traktowania ludzi.`,
    ]),
    bullets: calculation.talents.slice(0, 3).map((item) => item.ability),
  };

  const love: ThemeCardData = {
    id: "love",
    title: msg(locale, "themeLove"),
    kicker: p.day.zhiKorean,
    paragraphs: clean([
      locale === "ko"
        ? calculation.birth.gender === "male"
          ? "전통적으로 남성은 재성을 배우자성으로 보지만, 이 사이트는 성별 공식만으로 상대를 단정하지 않습니다. 일지(배우자궁), 합충, 식상, 대운을 함께 봅니다."
          : "전통적으로 여성은 관성을 배우자성으로 보지만, 성별 공식만으로 결혼 상대를 확정하지 않습니다. 일지와 대운의 기후를 같이 읽습니다."
        : locale === "es"
          ? "No fijamos la pareja solo por el sexo. Miramos el palacio del cónyuge (rama del día), uniones y choques, y el clima del daeun."
          : "Nie ustalamy partnera samą płcią. Patrzymy na pałac współmałżonka (gałąź dnia), połączenia i zderzenia oraz klimat daeun.",
      locale === "ko"
        ? `일지는 ${p.day.zhiKorean}(${p.day.twelveStageKorean})이라 관계에서 ${p.day.twelveStageKorean}의 리듬이 잘 드러납니다. 사랑 시작은 식상이 많으면 표현형, 인성이 많으면 관찰형, 관성이 많으면 조건·책임형으로 나타나는 경우가 많습니다.`
        : locale === "es"
          ? `La rama del día es ${p.day.zhi} (${p.day.twelveStageKorean}): ese ritmo sale en la pareja. Mucha expresión (siksang) habla; mucha impronta (in) observa; mucha autoridad (gwan) pone condiciones.`
          : `Gałąź dnia to ${p.day.zhi} (${p.day.twelveStageKorean}): ten rytm widać w relacji. Dużo siksang — wyrażanie; dużo in — obserwacja; dużo gwan — warunki i odpowiedzialność.`,
      daeun
        ? locale === "ko"
          ? `현재 대운의 관계 키워드는 “${daeun.love}”입니다.`
          : locale === "es"
            ? `En el daeun actual, la clave relacional es: “${daeun.love}”.`
            : `W obecnym daeun klucz relacji: „${daeun.love}”.`
        : "",
      seun
        ? locale === "ko"
          ? `${seun.year}년 세운의 연애는 “${seun.love}” 쪽입니다. 별점 ${seun.stars}/5는 상대 평가입니다.`
          : locale === "es"
            ? `En ${seun.year} el amor del seun tiende a “${seun.love}”. ${seun.stars}/5 es valoración relativa.`
            : `W ${seun.year} miłość seun skłania się ku „${seun.love}”. ${seun.stars}/5 to ocena względna.`
        : "",
    ]),
    bullets: calculation.relations.slice(0, 4).map((item) => item.description),
  };

  const wealth: ThemeCardData = {
    id: "wealth",
    title: msg(locale, "themeWealth"),
    kicker: topWealth ? term(WEALTH_TYPE, topWealth.type, locale) : "",
    paragraphs: clean([
      locale === "ko"
        ? `가장 잘 맞는 현금흐름 유형은 ${term(WEALTH_TYPE, topWealth?.type ?? "", locale)}입니다. ${topWealth?.reasons[0] ?? ""} 돈을 버는 힘(식상생재)과 지키는 힘(정재·인성), 새는 구멍(겁재·충)을 나눠 봅니다.`
        : locale === "es"
          ? `El flujo de dinero más afinado es ${term(WEALTH_TYPE, topWealth?.type ?? "", locale)}. ${topWealth?.reasons[0] ?? ""} Separamos ganar, guardar y fugas.`
          : `Najlepiej dopasowany przepływ to ${term(WEALTH_TYPE, topWealth?.type ?? "", locale)}. ${topWealth?.reasons[0] ?? ""} Rozdzielamy zarabianie, trzymanie i wycieki.`,
      locale === "ko"
        ? `재성 점수 상위: ${calculation.wealthTypes
            .slice(0, 4)
            .map((item) => `${term(WEALTH_TYPE, item.type, locale)} ${item.score}`)
            .join(" · ")}.`
        : locale === "es"
          ? `Ranking: ${calculation.wealthTypes
              .slice(0, 4)
              .map((item) => `${term(WEALTH_TYPE, item.type, locale)} ${item.score}`)
              .join(" · ")}.`
          : `Ranking: ${calculation.wealthTypes
              .slice(0, 4)
              .map((item) => `${term(WEALTH_TYPE, item.type, locale)} ${item.score}`)
              .join(" · ")}.`,
      daeun
        ? locale === "ko"
          ? `이번 대운의 돈 기후는 “${daeun.money}”입니다. 부동산·투자는 사주 추천이 아니라, 재성과 인성이 함께 오는 구간에서 공부 후 실행하는 편이 덜 위험합니다.`
          : locale === "es"
            ? `Clima de dinero del daeun: “${daeun.money}”. Esto no es consejo de inversión.`
            : `Klimat pieniędzy daeun: „${daeun.money}”. To nie jest rada inwestycyjna.`
        : "",
    ]),
    bullets: calculation.wealthTypes.slice(0, 3).flatMap((item) => item.reasons.slice(0, 1)),
  };

  const career: ThemeCardData = {
    id: "career",
    title: msg(locale, "themeCareer"),
    kicker: topCareer ? term(CAREER_TYPE, topCareer.type, locale) : "",
    paragraphs: clean([
      locale === "ko"
        ? `직업 적성 1순위는 ${term(CAREER_TYPE, topCareer?.type ?? "", locale)}입니다. ${topCareer?.reasons[0] ?? ""} 한 글자로 직업을 확정하지 않습니다.`
        : locale === "es"
          ? `Vocación primera: ${term(CAREER_TYPE, topCareer?.type ?? "", locale)}. ${topCareer?.reasons[0] ?? ""} No fijamos un oficio de una sola letra.`
          : `Pierwszy trop zawodu: ${term(CAREER_TYPE, topCareer?.type ?? "", locale)}. ${topCareer?.reasons[0] ?? ""} Nie zamykamy zawodu jednym znakiem.`,
      locale === "ko"
        ? `상위 유형: ${calculation.careerTypes
            .slice(0, 5)
            .map((item) => term(CAREER_TYPE, item.type, locale))
            .join(", ")}. 승진은 관성+인성+해당 대운, 사업은 식상+재성, 전문성은 인성+식상으로 읽습니다.`
        : locale === "es"
          ? `Tipos altos: ${calculation.careerTypes
              .slice(0, 5)
              .map((item) => term(CAREER_TYPE, item.type, locale))
              .join(", ")}.`
          : `Górne typy: ${calculation.careerTypes
              .slice(0, 5)
              .map((item) => term(CAREER_TYPE, item.type, locale))
              .join(", ")}.`,
      daeun
        ? locale === "ko"
          ? `현재 대운의 직업 키워드는 “${daeun.career}”입니다. ${daeun.opportunity}`
          : locale === "es"
            ? `Clave laboral del daeun: “${daeun.career}”. ${daeun.opportunity}`
            : `Klucz zawodowy daeun: „${daeun.career}”. ${daeun.opportunity}`
        : "",
    ]),
    bullets: calculation.talents.slice(0, 3).map((item) => `${item.title}: ${item.careers.slice(0, 3).join(", ")}`),
  };

  const health: ThemeCardData = {
    id: "health",
    title: msg(locale, "themeHealth"),
    kicker: ELEMENT_NAME[locale][calculation.dayMaster.element],
    paragraphs: clean([
      locale === "ko"
        ? "사주는 의학적 진단이 아닙니다. 아래는 명리학적으로 취약하게 보는 경향이며, 증상은 의사와 상의해야 합니다."
        : locale === "es"
          ? "El saju no es un diagnóstico médico. Lo que sigue es una tendencia simbólica de myeongri."
          : "Saju nie jest diagnozą medyczną. Poniżej symboliczna tendencja myeongri.",
      locale === "ko"
        ? `일간 ${calculation.dayMaster.elementKorean}과 월령 ${calculation.season.monthOrderKorean} 조합에서는 수면·스트레스·피로 관리가 기본값이 됩니다.`
        : locale === "es"
          ? `Con tronco ${calculation.dayMaster.elementKorean} y mes ${calculation.season.monthOrderKorean}, sueño, estrés y fatiga son la base.`
          : `Przy pniu ${calculation.dayMaster.elementKorean} i miesiącu ${calculation.season.monthOrderKorean} bazą są sen, stres i zmęczenie.`,
      healthHint(calculation.dayMaster.element, locale),
      locale === "ko"
        ? `세력이 큰 오행은 ${strong.map((key) => ELEMENT_NAME.ko[key]).join("·")}, 약한 오행은 ${weak.map((key) => ELEMENT_NAME.ko[key]).join("·")}입니다. 과한 쪽은 줄이고 약한 쪽은 생활 습관으로 보완합니다.`
        : locale === "es"
          ? `Elementos fuertes: ${strong.map((key) => ELEMENT_NAME.es[key]).join(", ")}. Débiles: ${weak.map((key) => ELEMENT_NAME.es[key]).join(", ")}.`
          : `Silne żywioły: ${strong.map((key) => ELEMENT_NAME.pl[key]).join(", ")}. Słabe: ${weak.map((key) => ELEMENT_NAME.pl[key]).join(", ")}.`,
      daeun
        ? locale === "ko"
          ? `대운 건강 메모: ${daeun.health}`
          : locale === "es"
            ? `Nota de salud del daeun: ${daeun.health}`
            : `Notatka zdrowia daeun: ${daeun.health}`
        : "",
    ]),
    bullets: calculation.weaknesses.slice(0, 3).map((item) => `${item.title} — ${item.remedy}`),
  };

  const yearCard: ThemeCardData = {
    id: "year",
    title: msg(locale, "themeYear"),
    kicker: seun ? `${seun.year}` : `${year}`,
    paragraphs: clean([
      seun
        ? locale === "ko"
          ? `${seun.year}년은 ${seun.ganzhiKorean}(${seun.ganzhi}) · ${tenGod(seun.tenGodKorean, locale)} 세운입니다. ${seun.summary} 별점 ${seun.stars}/5는 상대 평가입니다.`
          : locale === "es"
            ? `${seun.year} es seun ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary} Estrellas ${seun.stars}/5 (relativo).`
            : `${seun.year} to seun ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary} Gwiazdki ${seun.stars}/5 (względnie).`
        : locale === "ko"
          ? `${year}년 세운 데이터를 계산했습니다.`
          : `${year}`,
      seun
        ? locale === "ko"
          ? `직업: ${seun.career} / 돈: ${seun.money} / 연애: ${seun.love}`
          : locale === "es"
            ? `Trabajo: ${seun.career} / Dinero: ${seun.money} / Amor: ${seun.love}`
            : `Praca: ${seun.career} / Pieniądze: ${seun.money} / Miłość: ${seun.love}`
        : "",
      daeun
        ? locale === "ko"
          ? `올해가 속한 대운은 ${daeun.startAge}~${daeun.endAge}세 ${daeun.ganzhiKorean}(${tenGod(daeun.tenGodKorean, locale)})입니다. ${daeun.opportunity} 주의: ${daeun.caution}`
          : locale === "es"
            ? `El daeun de este año: ${daeun.startAge}–${daeun.endAge} ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}). ${daeun.opportunity}`
            : `Daeun tego roku: ${daeun.startAge}–${daeun.endAge} ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}). ${daeun.opportunity}`
        : "",
      seun && seun.relationsWithNatal.length
        ? locale === "ko"
          ? `원국과의 관계: ${seun.relationsWithNatal.join(", ")}. 충이 있으면 이동·계약·이별을 한꺼번에 결정하지 않는 해가 됩니다.`
          : locale === "es"
            ? `Relación con la carta natal: ${seun.relationsWithNatal.join(", ")}.`
            : `Relacja z kartą urodzenia: ${seun.relationsWithNatal.join(", ")}.`
        : locale === "ko"
          ? "올해는 원국과 큰 충이 겹치지 않으면 기존 판을 다지는 해로 읽습니다."
          : locale === "es"
            ? "Si no hay choque fuerte con la carta natal, el año sirve para consolidar el tablero."
            : "Jeśli nie ma mocnego zderzenia z kartą urodzenia, rok służy do utrwalenia planszy.",
    ]),
    bullets: seun?.sinsalChanges?.length ? seun.sinsalChanges : calculation.sinsal.slice(0, 3).map((item) => item.name),
  };

  return [character, love, wealth, career, health, yearCard];
}

export function themeHeadline(card: ThemeCardData): string {
  return card.paragraphs[0] ?? "";
}
