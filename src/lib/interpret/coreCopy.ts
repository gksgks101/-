import type { Locale } from "@/lib/i18n/config";
import { hasBatchim, josa } from "@/lib/i18n/josa";
import { STRENGTH_NAME, term } from "@/lib/i18n/terms";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import { seasonWord, stemNick } from "./glyphs";
import { loc } from "./themeContext";
import { yongsinLine } from "./yongsin";

export interface CoreGlossRow {
  term: string;
  line: string;
}

const STRENGTH_GLOSS: Record<string, Record<Locale, string>> = {
  "강한 신강": {
    ko: "기운이 아주 센 편이에요. 혼자 밀고 가는 힘이 커요.",
    es: "La fuerza es alta: empujas mucho por ti mismo.",
    pl: "Siła jest duża: mocno pchasz sam.",
  },
  중강: {
    ko: "기운이 적당히 센 편이에요.",
    es: "La fuerza es bastante buena, sin pasarse.",
    pl: "Siły jest dość, bez przesady.",
  },
  중화: {
    ko: "기운이 한쪽으로 치우치지 않은 편이에요.",
    es: "La fuerza está más o menos en el medio.",
    pl: "Siła jest mniej więcej pośrodku.",
  },
  중약: {
    ko: "기운이 조금 약한 편이라, 사람·환경의 도움이 실력의 일부예요.",
    es: "La fuerza es un poco baja: el entorno y la gente son parte de tu oficio.",
    pl: "Siły trochę brakuje: otoczenie i ludzie są częścią warsztatu.",
  },
  "약한 신약": {
    ko: "기운이 약한 편이라, 돕는 오행을 먼저 채운 뒤에 큰일이 맞아요.",
    es: "La fuerza es baja: primero llena el elemento que te ayuda, luego lo grande.",
    pl: "Siły jest mało: najpierw napełnij żywioł, który pomaga, potem wielkie sprawy.",
  },
};

const PATTERN_GLOSS: Record<string, Record<Locale, string>> = {
  건록격: {
    ko: "남에게 기대기보다 자기 힘으로 서는 타입이에요.",
    es: "Tipo que se sostiene solo, más que apoyarse en otros.",
    pl: "Typ, który staje własną siłą, zamiast opierać się na innych.",
  },
  양인격: {
    ko: "행동이 빠르고, 경쟁과 나눔이 한끝 차이인 타입이에요.",
    es: "Actúa pronto: compartir y competir están a un filo.",
    pl: "Szybki ruch: dzielenie i rywalizacja są o ostrze.",
  },
  정관격: {
    ko: "역할과 규칙이 보이면 실력이 나오는 타입이에요.",
    es: "Rinde cuando el rol y la norma se ven claros.",
    pl: "Daje radę, gdy widać rolę i zasadę.",
  },
  편관격: {
    ko: "압박을 연료로 쓰되, 적이 너무 많으면 지치는 타입이에요.",
    es: "Usa la presión de combustible, pero demasiados enemigos lo agotan.",
    pl: "Presja jest paliwem, ale nadmiar wrogów męczy.",
  },
  정재격: {
    ko: "약속된 돈과 일상을 지키는 쪽에서 마음이 놓이는 타입이에요.",
    es: "Se calma con el dinero prometido y la vida cotidiana.",
    pl: "Spokój przy obiecanych pieniądzach i codzienności.",
  },
  편재격: {
    ko: "기회와 움직이는 돈에 감각이 있는 타입이에요.",
    es: "Olfato para la oportunidad y el dinero que se mueve.",
    pl: "Węch do okazji i pieniędzy w ruchu.",
  },
  식신격: {
    ko: "만들고 베푸는 여유가 재능인 타입이에요.",
    es: "Su don es crear y dar con holgura.",
    pl: "Talentem jest tworzyć i dawać z luzem.",
  },
  상관격: {
    ko: "표현·비판·재능이 한 세트인 타입이에요.",
    es: "Expresión, crítica y talento llegan juntos.",
    pl: "Wyraz, krytyka i talent idą w komplecie.",
  },
  정인격: {
    ko: "배우고 보호받은 뒤에 움직이는 타입이에요.",
    es: "Se mueve después de aprender y sentirse amparado.",
    pl: "Rusza po nauce i poczuciu osłony.",
  },
  편인격: {
    ko: "정석보다 직관과 비정통 학습이 맞는 타입이에요.",
    es: "Le sienta más la intuición que el canon.",
    pl: "Bliżej intuicji niż kanonu.",
  },
};

const EL_HELP: Record<ElementKey, Record<Locale, string>> = {
  wood: { ko: "나무(시작·성장)", es: "madera (inicio y crecimiento)", pl: "drewno (start i wzrost)" },
  fire: { ko: "불(표현)", es: "fuego (expresión)", pl: "ogień (wyraz)" },
  earth: { ko: "흙(돈·실속)", es: "tierra (dinero y lo concreto)", pl: "ziemia (pieniądze i konkret)" },
  metal: { ko: "쇠(규칙·조직)", es: "metal (norma y orden)", pl: "metal (reguła i ład)" },
  water: { ko: "물(지혜·휴식)", es: "agua (sabiduría y descanso)", pl: "woda (mądrość i odpoczynek)" },
};

const KO_ELEMENT: Record<string, ElementKey> = { 목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water" };

function keysOf(names: string[]): ElementKey[] {
  return names.map((item) => KO_ELEMENT[item]).filter(Boolean) as ElementKey[];
}

function helpLine(names: string[], locale: Locale): string {
  const keys = keysOf(names);
  if (!keys.length) return "-";
  return keys.map((key) => EL_HELP[key][locale]).join(loc(locale, "과 ", " y ", " i "));
}

function patternGloss(name: string, locale: Locale): string {
  for (const [key, value] of Object.entries(PATTERN_GLOSS)) {
    if (name.includes(key.replace("격", ""))) return value[locale];
  }
  return loc(
    locale,
    `${josa(name, "은/는")} 이 사주의 간판이에요. 용신과 맞을 때 장점이 열려요.`,
    `${name} es el letrero de esta carta. El don se abre cuando encaja con el yongsin.`,
    `${name} to szyld tej karty. Talent otwiera się, gdy zgadza się z yongsin.`,
  );
}

export function coreHeadline(calculation: SajuCalculation, locale: Locale): string {
  const day = calculation.dayMaster;
  const nick = stemNick(day.gan, locale);
  const season = seasonWord(calculation.pillars.month.zhi, locale);
  const strong = calculation.strength.score >= 55;
  const yong = keysOf(calculation.useGod.yongsin);
  const help = helpLine(calculation.useGod.yongsin, locale);
  if (locale === "es") {
    return strong
      ? `Naciste en ${season} como un ${nick} con fuerza de sobra. Si canalizas esa fuerza hacia ${help}, la carta se abre.`
      : `Naciste en ${season} como un ${nick} que necesita amparo. Si acercas ${help}, la fuerza alcanza.`;
  }
  if (locale === "pl") {
    return strong
      ? `Urodziłeś się ${season} jak ${nick} z zapasem siły. Jak skierujesz ją ku ${help}, karta się otwiera.`
      : `Urodziłeś się ${season} jak ${nick}, który potrzebuje osłony. Jak zbliżysz ${help}, siły starczy.`;
  }
  const force = strong ? "힘이 충분해요" : "주변의 도움이 힘이 돼요";
  const ira = hasBatchim(nick) ? "이라" : "라";
  const action = yong.length ? `그 힘을 ${help} 쪽으로 쓰면 잘 풀려요.` : "그 힘을 재능으로 표현하면 잘 풀려요.";
  return `${season}에 태어난 ${strong ? "튼튼한 " : ""}${nick}${ira} ${force}. ${action}`;
}

export function coreGlossary(calculation: SajuCalculation, locale: Locale): CoreGlossRow[] {
  const strength = term(STRENGTH_NAME, calculation.strength.classification, locale);
  const pattern = calculation.pattern.name;
  const yong = calculation.useGod.yongsin.join("·") || "-";
  const hee = calculation.useGod.heesin.join("·") || "-";
  const gi = calculation.useGod.gisin.join("·") || "-";
  const rooted = calculation.strength.rooted;
  const command = calculation.strength.monthCommand;
  const gained = calculation.strength.gainedPower;
  return [
    {
      term: strength,
      line: STRENGTH_GLOSS[calculation.strength.classification]?.[locale] ?? STRENGTH_GLOSS["중화"][locale],
    },
    { term: pattern, line: patternGloss(pattern, locale) },
    {
      term: loc(locale, `용신 ${yong}`, `Yongsin ${yong}`, `Yongsin ${yong}`),
      line: loc(
        locale,
        `나를 돕는 기운은 ${helpLine(calculation.useGod.yongsin, locale)}이에요.`,
        `Lo que te ayuda es ${helpLine(calculation.useGod.yongsin, locale)}.`,
        `To, co ci pomaga, to ${helpLine(calculation.useGod.yongsin, locale)}.`,
      ),
    },
    {
      term: loc(locale, `희신 ${hee}`, `Heesin ${hee}`, `Heesin ${hee}`),
      line: loc(
        locale,
        `${helpLine(calculation.useGod.heesin, locale)}도 적당하면 도움이 돼요.`,
        `${helpLine(calculation.useGod.heesin, locale)} también ayuda si no se pasa.`,
        `${helpLine(calculation.useGod.heesin, locale)} też pomaga, gdy nie przesadza.`,
      ),
    },
    {
      term: loc(locale, `기신 ${gi}`, `Gisin ${gi}`, `Gisin ${gi}`),
      line: loc(
        locale,
        `${josa(helpLine(calculation.useGod.gisin, locale), "은/는")} 이미 충분해서, 더 많아지면 오히려 고집이 세지거나 생각이 많아져요.`,
        `${helpLine(calculation.useGod.gisin, locale)} ya está de más: si crece, aparece terquedad o exceso de pensamiento.`,
        `${helpLine(calculation.useGod.gisin, locale)} już wystarcza: jak przybędzie, rośnie upór albo nadmiar myśli.`,
      ),
    },
    {
      term: loc(locale, "득령", "Deukryeong", "Deukryeong"),
      line: command
        ? loc(locale, "가장 힘센 계절에 태어났어요.", "Naciste en la estación más fuerte para ti.", "Urodziłeś się w najsilniejszej dla siebie porze.")
        : loc(locale, "가장 힘센 계절은 아니에요. 환경으로 힘을 보태야 해요.", "No es tu estación más fuerte: el entorno tiene que sumar.", "To nie twoja najsilniejsza pora: otoczenie musi dodać siły."),
    },
    {
      term: loc(locale, rooted ? "통근" : "통근 약함", rooted ? "Raíz" : "Raíz débil", rooted ? "Korzeń" : "Słaby korzeń"),
      line: rooted
        ? loc(locale, "가까운 관계에서도 내가 중심을 잡을 수 있어요.", "En el vínculo cercano también puedes sostener el centro.", "W bliskiej relacji też uniesiesz środek.")
        : loc(locale, "가까운 관계에서 스스로 중심을 잡아야 해요.", "En el vínculo cercano tienes que sostener tú el centro.", "W bliskiej relacji sam musisz trzymać środek."),
    },
    {
      term: loc(locale, "득세", "Deukse", "Deukse"),
      line: gained
        ? loc(locale, "나를 도와주는 사람이나 기운이 주변에 있어요.", "Hay gente o fuerza alrededor que te ayuda.", "Wokół są ludzie albo siła, która ci pomaga.")
        : loc(locale, "주변의 도움이 적어요. 조력자를 의식적으로 옆에 두세요.", "Hay poca ayuda alrededor. Pon a propósito un aliado al lado.", "Mało pomocy wokół. Świadomie postaw sojusznika obok."),
    },
  ];
}

export function coreYongsinSame(calculation: SajuCalculation, locale: Locale): string {
  return yongsinLine(calculation, locale);
}
