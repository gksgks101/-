import type { Locale } from "@/lib/i18n/config";
import { STRENGTH_NAME, term } from "@/lib/i18n/terms";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import { seasonWord, stemNick } from "./glyphs";
import { josa } from "@/lib/i18n/josa";
import { helpAction, helpClause, ira } from "./plainVoice";
import type { ContrastItem, ContrastPair } from "./themes";
import { loc } from "./themeContext";
import { yongsinLine } from "./yongsin";

export interface CoreGlossRow {
  term: string;
  line: string;
}

const KO_ELEMENT: Record<string, ElementKey> = { 목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water" };

function keysOf(names: string[]): ElementKey[] {
  return names.map((item) => KO_ELEMENT[item]).filter(Boolean) as ElementKey[];
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
    ko: "기운이 약한 편이라, 돕는 흐름을 먼저 채운 뒤에 큰일이 맞아요.",
    es: "La fuerza es baja: primero llena lo que te ayuda, luego lo grande.",
    pl: "Siły jest mało: najpierw napełnij to, co pomaga, potem wielkie sprawy.",
  },
};

export function coreHeadline(calculation: SajuCalculation, locale: Locale): string {
  const day = calculation.dayMaster;
  const nick = stemNick(day.gan, locale);
  const season = seasonWord(calculation.pillars.month.zhi, locale);
  const strong = calculation.strength.score >= 55;
  const help = helpClause(keysOf(calculation.useGod.yongsin), locale);
  const bornPl = calculation.birth.gender === "female" ? "Urodziłaś się" : "Urodziłeś się";
  if (locale === "es") {
    return strong
      ? `Naciste en ${season} como un ${nick} con fuerza de sobra. ${help} la carta se abre.`
      : `Naciste en ${season} como un ${nick} que necesita amparo. ${help} la fuerza alcanza.`;
  }
  if (locale === "pl") {
    return strong
      ? `${bornPl} ${season} jak ${nick} z zapasem siły. ${help} wszystko się otwiera.`
      : `${bornPl} ${season} jak ${nick}, który potrzebuje osłony. ${help} siły starczy.`;
  }
  const force = strong ? "힘이 충분해요" : "주변의 도움이 힘이 돼요";
  const action = keysOf(calculation.useGod.yongsin).length
    ? `그 힘으로 ${help} 잘 풀려요.`
    : "그 힘을 재능으로 표현하면 잘 풀려요.";
  return `${season}에 태어난 ${strong ? "튼튼한 " : ""}${nick}${ira(nick)} ${force}. ${action}`;
}

function uniqueItems(items: ContrastItem[]): ContrastItem[] {
  const seen = new Set<string>();
  const out: ContrastItem[] = [];
  for (const item of items) {
    if (seen.has(item.label)) continue;
    seen.add(item.label);
    out.push(item);
    if (out.length >= 3) break;
  }
  return out;
}

export function coreContrast(calculation: SajuCalculation, locale: Locale): ContrastPair {
  const yong = keysOf(calculation.useGod.yongsin);
  const hee = keysOf(calculation.useGod.heesin);
  const gi = keysOf(calculation.useGod.gisin);
  const rooted = calculation.strength.rooted;
  const command = calculation.strength.monthCommand;
  const gained = calculation.strength.gainedPower;

  const good: ContrastItem[] = [
    ...yong.map((key) => ({
      label: helpAction(key, locale),
      why: loc(
        locale,
        `${josa(helpAction(key, locale), "을/를")} 가까이 두면 숨이 트여요.`,
        `Si acercas ${helpAction(key, locale)}, respiras.`,
        `Jak zbliżysz ${helpAction(key, locale)}, łapiesz oddech.`,
      ),
    })),
    ...hee.map((key) => ({
      label: helpAction(key, locale),
      why: loc(
        locale,
        `${josa(helpAction(key, locale), "은/는")} 적당히 있으면 도움이 돼요.`,
        `${helpAction(key, locale)} ayuda si no se pasa.`,
        `${helpAction(key, locale)} pomaga, gdy nie przesadza.`,
      ),
    })),
    {
      label: loc(locale, "곁의 조력", "un aliado cerca", "sojusznik obok"),
      why: gained
        ? loc(locale, "주변에 도와주는 사람이 있어요.", "Hay gente alrededor que te ayuda.", "Wokół są ludzie, którzy ci pomagają.")
        : loc(locale, "조력자를 의식적으로 옆에 두세요.", "Pon a propósito un aliado al lado.", "Świadomie postaw sojusznika obok."),
    },
    {
      label: loc(locale, "가까운 관계의 중심", "el centro en el vínculo cercano", "środek w bliskiej relacji"),
      why: rooted
        ? loc(locale, "가까운 관계에서도 내가 중심을 잡을 수 있어요.", "En el vínculo cercano también puedes sostener el centro.", "W bliskiej relacji też uniesiesz środek.")
        : loc(locale, "가까운 관계에서 스스로 중심을 잡아야 해요.", "En el vínculo cercano tienes que sostener tú el centro.", "W bliskiej relacji sam musisz trzymać środek."),
    },
  ];

  const caution: ContrastItem[] = [
    ...gi.map((key) => ({
      label: helpAction(key, locale),
      why: loc(
        locale,
        `${josa(helpAction(key, locale), "이/가")} 더 많아지면 고집이 세져요.`,
        `Si crece ${helpAction(key, locale)}, aparece terquedad.`,
        `Jak przybędzie ${helpAction(key, locale)}, rośnie upór.`,
      ),
    })),
    {
      label: loc(locale, "혼자 다 쥐기", "agarrarlo todo solo", "chwytanie wszystkiego samemu"),
      why: loc(
        locale,
        "힘이 있어도 혼자 숲을 만들면 지쳐요.",
        "Aunque haya fuerza, si haces todo el bosque solo, te cansas.",
        "Nawet przy sile, las w pojedynkę męczy.",
      ),
    },
    {
      label: loc(locale, "계절을 무시하기", "ignorar tu estación", "ignorowanie pory"),
      why: command
        ? loc(locale, "지금 계절은 힘이 붙는 편이에요. 과하게 밀지만 마세요.", "Esta estación te suma fuerza. No empujes de más.", "Ta pora dodaje siły. Nie pchaj za mocno.")
        : loc(locale, "가장 힘센 계절은 아니에요. 환경을 먼저 챙기세요.", "No es tu estación más fuerte: cuida primero el entorno.", "To nie twoja najsilniejsza pora: najpierw otoczenie."),
    },
  ];

  return {
    goodTitle: loc(locale, "나를 돕는 것", "Lo que te ayuda", "Co ci pomaga"),
    cautionTitle: loc(locale, "조심할 것", "Lo que conviene cuidar", "Czego pilnować"),
    good: uniqueItems(good),
    caution: uniqueItems(caution),
  };
}

export function coreGlossary(calculation: SajuCalculation, locale: Locale): CoreGlossRow[] {
  const pair = coreContrast(calculation, locale);
  const strength = term(STRENGTH_NAME, calculation.strength.classification, locale);
  return [
    {
      term: strength,
      line: STRENGTH_GLOSS[calculation.strength.classification]?.[locale] ?? STRENGTH_GLOSS["중화"][locale],
    },
    ...pair.good.map((item) => ({ term: item.label, line: item.why })),
    ...pair.caution.map((item) => ({ term: item.label, line: item.why })),
  ];
}

export function coreYongsinSame(calculation: SajuCalculation, locale: Locale): string {
  return yongsinLine(calculation, locale);
}
