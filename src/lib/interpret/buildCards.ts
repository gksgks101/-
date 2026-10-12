import type { Locale } from "@/lib/i18n/config";
import { josa } from "@/lib/i18n/josa";
import { msg } from "@/lib/i18n/messages";
import { tenGod } from "@/lib/i18n/terms";
import { BRANCH_META, STEM_META } from "@/lib/saju/constants";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import { characterBits, loveTypes } from "./characterBank";
import { gloss } from "./glossary";
import { animalName, ganLabel } from "./glyphs";
import {
  directionOf,
  fashionFor,
  foodFor,
  hobbyFor,
  luckyBits,
  monthAdvice,
  musicFor,
  rankedJobs,
  travelFor,
  unfitJobs,
  workEnv,
} from "./lifeTables";
import { careerWorkEasy, colorMeaning, fengFront, groupEasy, healthLong, loveStyle, twelveEasy } from "./sectorTables";
import { buildThemeCtx, clean, loc, type ThemeCtx } from "./themeContext";
import type { ColorChip, EasySection, GlossChip, ThemeCardData } from "./themes";
import { yongsinLine } from "./yongsin";

function investLabel(style: ThemeCtx["style"], locale: Locale): string {
  return loc(
    locale,
    style === "stable" ? "안정형" : style === "aggressive" ? "공격형" : "균형형",
    style === "stable" ? "conservador" : style === "aggressive" ? "agresivo" : "equilibrado",
    style === "stable" ? "stabilny" : style === "aggressive" ? "agresywny" : "zrównoważony",
  );
}

function koGod(name: string, pair: "은/는" | "이/가" | "을/를", locale: Locale): string {
  const labeled = tenGod(name, locale);
  return locale === "ko" ? josa(labeled, pair) : labeled;
}

function terms(locale: Locale, keys: [string, string][]): GlossChip[] {
  return keys.slice(0, 3).map(([key, word]) => gloss(locale, key, word));
}

function section(title: string, items: string[]): EasySection {
  return { title, items: items.filter(Boolean) };
}

const STEMS_BY_EL: Record<ElementKey, string[]> = {
  wood: ["甲", "乙"],
  fire: ["丙", "丁"],
  earth: ["戊", "己"],
  metal: ["庚", "辛"],
  water: ["壬", "癸"],
};

function stemsOf(element: ElementKey, locale: Locale): string {
  return STEMS_BY_EL[element].map((gan) => (locale === "ko" ? ganLabel(gan) : gan)).join(" · ");
}

function animalsOf(element: ElementKey, locale: Locale): string {
  return Object.entries(BRANCH_META)
    .filter(([, meta]) => meta.element === element)
    .map(([zhi]) => animalName(zhi, locale))
    .join(" · ");
}

function organOf(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "간·담·눈·힘줄", es: "hígado, vesícula, ojos, tendón", pl: "wątroba, pęcherzyk, oczy, ścięgno" },
    fire: { ko: "심장·소장·수면", es: "corazón, intestino delgado, sueño", pl: "serce, jelito cienkie, sen" },
    earth: { ko: "비위·소화", es: "bazo, estómago, digestión", pl: "śledziona, żołądek, trawienie" },
    metal: { ko: "폐·대장·피부", es: "pulmón, intestino grueso, piel", pl: "płuca, jelito grube, skóra" },
    water: { ko: "신장·방광·허리", es: "riñón, vejiga, lumbar", pl: "nerki, pęcherz, lędźwie" },
  };
  return table[element][locale];
}

function colorUse(locale: Locale): string {
  return loc(
    locale,
    "옷 안감, 스카프, 폰 배경, 머그잔처럼 매일 눈에 들어오는 곳에 쓰면 돼요.",
    "Úsalos en el forro, el pañuelo, el fondo del teléfono o una taza: sitios que ves cada día.",
    "Dawaj je na podszewkę, chustę, tapetę telefonu albo kubek — miejsca, które widzisz codziennie.",
  );
}

export function assembleThemeCards(
  calculation: SajuCalculation,
  locale: Locale,
  voice: string[],
  head: string,
  chipsFor: (elements: ElementKey[], locale: Locale, limit: number) => ColorChip[],
): ThemeCardData[] {
  const ctx = buildThemeCtx(calculation, locale);
  const card = dayMasterCard(calculation.dayMaster.gan);
  const { c, p, day, daeun, seun, topCareer, topWealth } = ctx;
  const styleName = investLabel(ctx.style, locale);
  const lucky = chipsFor(ctx.yongsinKeys.length ? ctx.yongsinKeys : [ctx.support, ctx.output], locale, 3);
  const avoid = chipsFor(ctx.gisinKeys.length ? ctx.gisinKeys : [ctx.pressure], locale, 2);
  const yong = yongsinLine(c, locale);
  const bits = characterBits(ctx);
  const jobs = rankedJobs(c.careerTypes, locale);
  const badJobs = unfitJobs(c.careerTypes, locale);
  const env = workEnv(topCareer?.type, locale);
  const loves = loveTypes(ctx);
  const fashion = fashionFor(ctx);
  const food = foodFor(ctx);
  const travel = travelFor(ctx);
  const music = musicFor(ctx);
  const hobby = hobbyFor(ctx);
  const luckyBit = luckyBits(ctx);
  const fun = loc(locale, "재미로 보는 참고용이에요.", "Es una referencia de entretenimiento.", "To rozrywkowa wskazówka.");
  const yongKey = ctx.yongsinKeys[0] ?? ctx.support;
  const loveYears = c.seun.filter((item) => item.year >= ctx.year && item.year <= ctx.year + 5 && item.stars >= 4).slice(0, 3);
  const yearKeywords = seun
    ? [seun.career.split(/[·,、]/)[0]?.trim(), seun.money.split(/[·,、]/)[0]?.trim(), seun.love.split(/[·,、]/)[0]?.trim()].filter(
        (item): item is string => Boolean(item),
      )
    : [];

  const character: ThemeCardData = {
    id: "character",
    title: msg(locale, "themeCharacter"),
    kicker: card.title[locale],
    front: clean([
      loc(
        locale,
        `일간 ${day.ganKorean}${day.elementKorean} · ${ctx.strengthLabel} ${c.strength.score}점.`,
        `Tronco ${day.gan} · ${ctx.strengthLabel} (${c.strength.score}).`,
        `Pień ${day.gan} · ${ctx.strengthLabel} (${c.strength.score}).`,
      ),
      loc(
        locale,
        `월지 십성은 ${koGod(p.month.zhiTenGodKorean, "이/가", locale)} 가리키는 첫인상이고, 격국은 ${c.pattern.name}입니다.`,
        `La rama del mes es ${tenGod(p.month.zhiTenGodKorean, locale)}. Patrón: ${c.pattern.name}.`,
        `Gałąź miesiąca to ${tenGod(p.month.zhiTenGodKorean, locale)}. Wzór: ${c.pattern.name}.`,
      ),
      loc(locale, `주도 십성은 ${koGod(ctx.topGod, "이/가", locale)} 말투와 결정 속도의 뼈대입니다.`, `El dios guía es ${tenGod(ctx.topGod, locale)}.`, `Gwiazda wiodąca to ${tenGod(ctx.topGod, locale)}.`),
    ]),
    frontTerms: terms(locale, [
      ["일간", loc(locale, "일간", "tronco diario", "pień dnia")],
      ["십성", loc(locale, "십성", "diez dioses", "dziesięć gwiazd")],
      ["격국", loc(locale, "격국", "patrón", "wzór")],
    ]),
    frontBullets: [],
    easyHeadline: head,
    easy: clean([voice[0], loc(locale, "장점과 단점, 남들이 보는 나와 속마음은 아래와 같아요.", "Abajo: dones, sombras, cómo te ven y cómo eres.", "Niżej: atuty, cienie, jak cię widzą i jaki jesteś.")]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "장점 3가지", "Tres dones", "Trzy atuty"), bits.pros),
      section(loc(locale, "단점 3가지", "Tres sombras", "Trzy cienie"), bits.cons),
      section(loc(locale, "남들이 보는 나와 실제 나", "Cómo te ven / cómo eres", "Jak cię widzą / jaki jesteś"), [bits.public, bits.real]),
      section(loc(locale, "스트레스", "Estrés", "Stres"), [bits.stressAct, bits.stressEase]),
    ],
  };

  const career: ThemeCardData = {
    id: "career",
    title: msg(locale, "themeCareer"),
    kicker: jobs[0]?.name ?? "",
    front: clean([
      loc(
        locale,
        `적성 1순위 계산은 ${ctx.careerName(topCareer?.type ?? "")}입니다. ${topCareer?.reasons[0] ?? ""}`,
        `Vocación 1 (cálculo): ${ctx.careerName(topCareer?.type ?? "")}. ${topCareer?.reasons[0] ?? ""}`,
        `Zawód 1 (liczenie): ${ctx.careerName(topCareer?.type ?? "")}. ${topCareer?.reasons[0] ?? ""}`,
      ),
      daeun
        ? loc(locale, `지금 대운의 일 키워드: ${daeun.career}.`, `Daeun laboral: ${daeun.career}.`, `Daeun zawodowy: ${daeun.career}.`)
        : "",
      loc(locale, `월지 십성 ${koGod(p.month.zhiTenGodKorean, "은/는", locale)} 직장에서 보이는 태도입니다.`, `En el trabajo se ve ${tenGod(p.month.zhiTenGodKorean, locale)}.`, `W pracy widać ${tenGod(p.month.zhiTenGodKorean, locale)}.`),
    ]),
    frontTerms: terms(locale, [
      ["관성", loc(locale, "관성", "autoridad", "autorytet")],
      ["식상", loc(locale, "식상", "expresión", "wyraz")],
      ["대운", loc(locale, "대운", "daeun", "daeun")],
    ]),
    frontBullets: [],
    easyHeadline: loc(locale, `일은 ‘${jobs[0]?.name ?? ""}’ 쪽으로 가면 숨이 트여요.`, `El oficio “${jobs[0]?.name ?? ""}” te abre el pecho.`, `Zawód „${jobs[0]?.name ?? ""}” otwiera ci oddech.`),
    easy: clean([
      loc(locale, "결론: 유형 이름이 아니라, 아래 직업 순서가 이 사주에 맞아요.", "Conclusión: no el tipo, sino estos oficios concretos.", "Wniosek: nie nazwa typu, tylko te konkretne zawody."),
      careerWorkEasy(topCareer?.type, locale),
    ]),
    easyBullets: [],
    easySections: [
      section(
        loc(locale, "잘 맞는 직업 1~5순위", "Oficios que te van, 1–5", "Zawody, które ci pasują, 1–5"),
        jobs.map((item) => loc(locale, `${item.rank}위 ${item.name} — ${item.saju}. ${item.easy}`, `${item.rank}. ${item.name}: ${item.saju}. ${item.easy}`, `${item.rank}. ${item.name}: ${item.saju}. ${item.easy}`)),
      ),
      section(
        loc(locale, "잘 안 맞는 직업", "Oficios que no te van", "Zawody, które nie pasują"),
        badJobs.map((item) => loc(locale, `${item.name} — ${item.why}`, `${item.name}: ${item.why}`, `${item.name}: ${item.why}`)),
      ),
      section(loc(locale, "환경 · 스타일 · 팁", "Entorno · estilo · consejo", "Środowisko · styl · rada"), [env.env, env.style, env.tip]),
    ],
  };

  const wealth: ThemeCardData = {
    id: "wealth",
    title: msg(locale, "themeWealth"),
    kicker: styleName,
    front: clean([
      loc(
        locale,
        `현금흐름 1순위는 ${ctx.wealthName(topWealth?.type ?? "")}입니다. 식상생재는 버는 힘, 정재는 지키는 힘입니다.`,
        `Flujo 1: ${ctx.wealthName(topWealth?.type ?? "")}. Expresión→riqueza gana; riqueza estable guarda.`,
        `Przepływ 1: ${ctx.wealthName(topWealth?.type ?? "")}. Wyraz→majątek zarabia; stały majątek trzyma.`,
      ),
      loc(
        locale,
        `${koGod("편재", "이/가", locale)} 기회형, ${koGod("정재", "은/는", locale)} 저축형에 가깝습니다.`,
        `${tenGod("편재", locale)} tira a oportunidad; ${tenGod("정재", locale)} a ahorro.`,
        `${tenGod("편재", locale)} ciągnie ku okazji; ${tenGod("정재", locale)} ku oszczędzaniu.`,
      ),
      seun ? loc(locale, `${seun.year}년 돈 날씨: ${seun.money}.`, `Dinero ${seun.year}: ${seun.money}.`, `Pieniądze ${seun.year}: ${seun.money}.`) : "",
    ]),
    frontTerms: terms(locale, [
      ["재성", loc(locale, "재성", "riqueza", "majątek")],
      ["식상", loc(locale, "식상생재", "expresión→riqueza", "wyraz→majątek")],
    ]),
    frontBullets: [],
    easyHeadline: loc(locale, `돈 감각은 ${styleName}에 가까워요.`, `Tu dinero tira a lo ${styleName}.`, `Pieniądze ciągną ku stylowi ${styleName}.`),
    easy: clean([
      loc(
        locale,
        `결론: 버는 방식은 ${ctx.wealthName(topWealth?.type ?? "")} 쪽이에요.`,
        `Conclusión: ganas más al modo ${ctx.wealthName(topWealth?.type ?? "")}.`,
        `Wniosek: zarabiasz raczej w trybie ${ctx.wealthName(topWealth?.type ?? "")}.`,
      ),
      loc(
        locale,
        ctx.style === "aggressive"
          ? "이유는 기회에 몸이 먼저 반응하기 때문이에요. 한 번에 올인하면 변동이 손실로 고정돼요."
          : "이유는 새는 구멍을 막는 해가 쌓여야 큰돈이 되기 때문이에요.",
        ctx.style === "aggressive"
          ? "Motivo: el cuerpo responde a la oportunidad. El all-in fija la oscilación como pérdida."
          : "Motivo: los años de tapar fugas suman más que un golpe.",
        ctx.style === "aggressive"
          ? "Powód: ciało reaguje na okazję. All-in zamienia wahanie na stratę."
          : "Powód: lata zatykania wycieków składają się na większe pieniądze.",
      ),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "버는 방식", "Cómo ganas", "Jak zarabiasz"), [
        loc(
          locale,
          topWealth?.type === "사업형" || topWealth?.type === "투자형"
            ? "사업형·부업형에 가깝습니다. 내 이름으로 남는 현금 흐름이 맞아요."
            : "월급형·축적형에 가깝습니다. 약속된 입금이 마음을 안정시켜요.",
          topWealth?.type === "사업형" || topWealth?.type === "투자형"
            ? "Tira a negocio o extra. El flujo con tu nombre te sienta."
            : "Tira a sueldo y acumulación. El ingreso prometido te calma.",
          topWealth?.type === "사업형" || topWealth?.type === "투자형"
            ? "Ciągnie ku biznesowi albo dodatkowej pracy. Przepływ z nazwiskiem ci leży."
            : "Ciągnie ku pensji i gromadzeniu. Obiecany wpływ uspokaja.",
        ),
      ]),
      section(loc(locale, "돈이 새는 곳", "Por dónde se fuga", "Gdzie ucieka kasa"), [
        loc(
          locale,
          ctx.style === "aggressive" ? "정산 없는 공동투자, 보증, ‘이번만’ 한 방이 구멍이에요." : "충동 소비와 구독, 남을 위한 큰 약속이 구멍이에요.",
          ctx.style === "aggressive" ? "Inversión conjunta sin liquidar, aval, el “solo esta vez”." : "Gasto impulsivo, suscripciones, grandes promesas por otros.",
          ctx.style === "aggressive" ? "Wspólna inwestycja bez rozliczenia, poręczenie, „tylko tym razem”." : "Impulsywne wydatki, subskrypcje, wielkie obietnice za innych.",
        ),
      ]),
      section(loc(locale, "모으는 팁 · 투자 성향", "Ahorro · estilo de inversión", "Oszczędzanie · styl inwestycji"), [
        loc(locale, `성향은 ${styleName}, ${ctx.style === "stable" ? "장기·분산" : ctx.style === "aggressive" ? "작은 실험 여러 개" : "반 실험·반 고정"}이 맞아요. 종목은 찍지 않아요.`, `Estilo ${styleName}. No elegimos acciones ni criptos.`, `Styl ${styleName}. Nie wybieramy spółek ani krypto.`),
        loc(locale, "자동이체 하루를 월급날에 붙이면 이 사주의 기본 장비가 됩니다.", "Una transferencia automática el día de cobro es tu equipo de serie.", "Automatyczny przelew w dzień wypłaty to twoje fabryczne wyposażenie."),
      ]),
    ],
    disclaimer: msg(locale, "wealthFunDisclaimer"),
  };

  const love: ThemeCardData = {
    id: "love",
    title: msg(locale, "themeLove"),
    kicker: p.day.zhiKorean,
    front: clean([
      loc(
        locale,
        `배우자궁은 일지 ${p.day.zhiKorean}(${p.day.twelveStageKorean})입니다.`,
        `Palacio de pareja: rama del día ${p.day.zhi} (${p.day.twelveStageKorean}).`,
        `Pałac pary: gałąź dnia ${p.day.zhi} (${p.day.twelveStageKorean}).`,
      ),
      loveStyle(ctx.dominantGroup, locale),
      seun ? loc(locale, `${seun.year}년 연애: ${seun.love}.`, `Amor ${seun.year}: ${seun.love}.`, `Miłość ${seun.year}: ${seun.love}.`) : "",
    ]),
    frontTerms: terms(locale, [
      ["배우자궁", loc(locale, "배우자궁", "palacio de pareja", "pałac pary")],
      ["12운성", loc(locale, "12운성", "12 etapas", "12 etapów")],
    ]),
    frontBullets: [],
    easyHeadline: loc(locale, "좋아하는 티는 작게, 약속은 분명하게.", "El gusto, en bajo; la cita, clara.", "Sympatia cicho, umowa jasno."),
    easy: clean([
      twelveEasy(p.day.twelveStageKorean, locale),
      loc(locale, "이유는 일지 리듬이 관계의 기본값이기 때문이에요.", "Motivo: el ritmo de la rama del día es el valor por defecto del vínculo.", "Powód: rytm gałęzi dnia to baza relacji."),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "연애할 때 습관", "Hábito en el amor", "Nawyk w miłości"), [loveStyle(ctx.dominantGroup, locale)]),
      section(loc(locale, "매력 포인트", "Encanto", "Urok"), [voice[1] ?? voice[0]]),
      section(loc(locale, "잘 맞는 상대 3유형", "Tres tipos que te van", "Trzy typy, które pasują"), loves.fit),
      section(loc(locale, "조심할 상대 2유형", "Dos tipos de cuidado", "Dwa typy ostrożności"), loves.caution),
      section(
        loc(locale, "연애가 잘 풀리는 시기 (세운)", "Cuándo fluye (seun)", "Kiedy płynie (seun)"),
        loveYears.length
          ? loveYears.map((item) => loc(locale, `${item.year}년 (${item.ganzhiKorean}) · ${item.love}`, `${item.year} (${item.ganzhi}): ${item.love}`, `${item.year} (${item.ganzhi}): ${item.love}`))
          : [loc(locale, "올해는 서두르기보다 한 줄을 분명히 하는 해가 맞아요.", "Este año, más que prisa, una línea clara.", "W tym roku raczej jasna linijka niż pośpiech.")],
      ),
    ],
  };

  const match: ThemeCardData = {
    id: "match",
    title: msg(locale, "themeMatch"),
    kicker: loc(locale, `${ctx.elName(ctx.support)}생 ${ctx.elName(day.element)}`, `${ctx.elName(ctx.support)} → ${ctx.elName(day.element)}`, `${ctx.elName(ctx.support)} → ${ctx.elName(day.element)}`),
    front: clean([
      loc(
        locale,
        `편해요: ${ctx.elName(ctx.support)}·${ctx.elName(day.element)}. 부담: ${ctx.elName(ctx.pressure)}.`,
        `Cómodo: ${ctx.elName(ctx.support)}/${ctx.elName(day.element)}. Cuidado: ${ctx.elName(ctx.pressure)}.`,
        `Wygodnie: ${ctx.elName(ctx.support)}/${ctx.elName(day.element)}. Uwaga: ${ctx.elName(ctx.pressure)}.`,
      ),
      loc(locale, `합은 묶임, 충은 사건입니다. ${ctx.relationLine}`, `Unión ata; choque eventúa. ${ctx.relationLine}`, `Połączenie wiąże; zderzenie robi zdarzenie. ${ctx.relationLine}`),
    ]),
    frontTerms: terms(locale, [
      ["인성", loc(locale, "인성", "impronta", "pieczęć")],
      ["관성", loc(locale, "관성", "autoridad", "autorytet")],
    ]),
    frontBullets: [],
    easyHeadline: loc(
      locale,
      `받아 주고 속도 맞추는 ${ctx.elName(ctx.support)} 느낌의 사람이 오래 가요.`,
      `Quien te recibe al ritmo ${ctx.elName(ctx.support)} dura.`,
      `Kto cię przyjmuje w rytmie ${ctx.elName(ctx.support)} — zostaje.`,
    ),
    easy: clean([
      loc(locale, `결론: 잘 맞는 일간은 ${stemsOf(ctx.support, locale)}, ${stemsOf(day.element, locale)}예요.`, `Conclusión: troncos que te van: ${stemsOf(ctx.support, locale)}, ${stemsOf(day.element, locale)}.`, `Wniosek: pasujące pnie: ${stemsOf(ctx.support, locale)}, ${stemsOf(day.element, locale)}.`),
      loc(locale, "이유는 나를 생조하거나 결이 같아서 속도 싸움이 적기 때문이에요.", "Motivo: te nutren o tienen el mismo temple, así hay menos pelea de ritmo.", "Powód: karmią cię albo mają ten sam temper — mniej walki o tempo."),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "잘 맞는 일간 · 띠", "Troncos y animales que te van", "Pnie i zwierzęta, które pasują"), [
        loc(locale, `일간 ${stemsOf(ctx.support, locale)} · ${stemsOf(day.element, locale)}`, `Troncos ${stemsOf(ctx.support, locale)} · ${stemsOf(day.element, locale)}`, `Pnie ${stemsOf(ctx.support, locale)} · ${stemsOf(day.element, locale)}`),
        loc(locale, `띠 ${animalsOf(ctx.support, locale)} · ${animalsOf(day.element, locale)}`, `Animales ${animalsOf(ctx.support, locale)} · ${animalsOf(day.element, locale)}`, `Zwierzęta ${animalsOf(ctx.support, locale)} · ${animalsOf(day.element, locale)}`),
      ]),
      section(loc(locale, "부딪히기 쉬운 일간 · 띠", "Troncos y animales de roce", "Pnie i zwierzęta tarcia"), [
        loc(locale, `일간 ${stemsOf(ctx.pressure, locale)} — 정답만 던지거나 속도가 안 맞아요.`, `Troncos ${stemsOf(ctx.pressure, locale)}: sueltan “la verdad” o no pegan el ritmo.`, `Pnie ${stemsOf(ctx.pressure, locale)}: rzucają „prawdę” albo nie trafiają w tempo.`),
        loc(locale, `띠 ${animalsOf(ctx.pressure, locale)}`, `Animales ${animalsOf(ctx.pressure, locale)}`, `Zwierzęta ${animalsOf(ctx.pressure, locale)}`),
      ]),
    ],
  };

  const relations: ThemeCardData = {
    id: "relations",
    title: msg(locale, "themeRelations"),
    kicker: loc(locale, "년주·월주", "Año · mes", "Rok · miesiąc"),
    front: clean([
      loc(
        locale,
        `년주 ${josa(p.year.ganzhiKorean, "은/는")} 초년·친구, 월주 ${josa(p.month.ganzhiKorean, "은/는")} 직장 층입니다.`,
        `Año ${p.year.ganzhi}: amigos. Mes ${p.month.ganzhi}: trabajo.`,
        `Rok ${p.year.ganzhi}: przyjaciele. Miesiąc ${p.month.ganzhi}: praca.`,
      ),
      loc(locale, `월지 십성 ${koGod(p.month.zhiTenGodKorean, "은/는", locale)} 조직에서 보이는 태도입니다.`, `En el trabajo se ve ${tenGod(p.month.zhiTenGodKorean, locale)}.`, `W organizacji widać ${tenGod(p.month.zhiTenGodKorean, locale)}.`),
    ]),
    frontTerms: terms(locale, [
      ["십성", loc(locale, "십성", "diez dioses", "dziesięć gwiazd")],
      ["비겁", loc(locale, "비겁", "compañeros", "towarzysze")],
    ]),
    frontBullets: [],
    easyHeadline: loc(locale, "친구는 깊게, 직장은 역할이 분명할 때 편해요.", "Amigos, en profundidad. Trabajo, con el rol claro.", "Przyjaciele głęboko. Praca, gdy rola jasna."),
    easy: clean([
      loc(locale, "결론: 사람 수는 적게, 역할은 분명하게.", "Conclusión: menos gente, rol más claro.", "Wniosek: mniej ludzi, jaśniejsza rola."),
      loc(locale, "이유는 년주가 친구 층, 월주가 직장 층이라 결이 다르기 때문이에요.", "Motivo: el año es amigos, el mes es trabajo: no es el mismo temple.", "Powód: rok to przyjaciele, miesiąc to praca — inny temper."),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "친구", "Amigos", "Przyjaciele"), [
        loc(locale, "몇 명과 오래 가는 쪽이 맞아요. 매일 감정 공유는 부담이에요.", "Mejor pocos amigos largos. Compartir emoción a diario pesa.", "Lepiej kilku przyjaciół na długo. Codzienne emocje ciążą."),
      ]),
      section(loc(locale, "직장", "Trabajo", "Praca"), [
        loc(locale, "직장에서는 ‘내가 뭘 맡는지’가 보이면 힘이 나요.", "En el trabajo te da fuerza ver qué es tuyo.", "W pracy dodaje siły, gdy widać, co jest twoje."),
      ]),
      section(loc(locale, "가족", "Familia", "Rodzina"), [
        loc(locale, `${STEM_META[p.year.gan] ? ganLabel(p.year.gan) : p.year.gan} 년간의 결이 초년 집안의 말투와 닮아 있어요. 잔소리로 들리면 한 줄만 받아 적으세요.`, `El tronco del año marca el tono de la casa. Si suena a sermón, anota una sola línea.`, `Pień roku ustawia ton domu. Jak brzmi jak kazanie — zapisz jedną linijkę.`),
      ]),
      section(loc(locale, "관계 팁", "Consejo de vínculo", "Rada relacji"), [groupEasy(ctx.dominantGroup, locale)]),
    ],
  };

  const colors: ThemeCardData = {
    id: "colors",
    title: msg(locale, "themeColors"),
    kicker: yong.split(" · ")[0] ?? "",
    front: clean([
      yong,
      loc(locale, "용신 색은 가까이, 기신 색은 눈앞에 너무 많이 두지 않습니다.", "Acerca el color yongsin; no satures el gisin.", "Trzymaj kolor yongsin blisko; nie zalewaj gisin."),
    ]),
    frontTerms: terms(locale, [
      ["용신", loc(locale, "용신", "yongsin", "yongsin")],
      ["희신", loc(locale, "희신", "heesin", "heesin")],
      ["기신", loc(locale, "기신", "gisin", "gisin")],
    ]),
    frontBullets: [],
    easyHeadline: loc(locale, "옷·소품은 기분 좋아지는 쪽을 고르면 돼요.", "En ropa, elige el color que te sienta bien.", "W ubraniu bierz kolor, przy którym ci dobrze."),
    easy: clean([
      loc(locale, "결론: 행운색 3개, 피할 색 2개를 동그라미로 보면 돼요.", "Conclusión: tres de suerte, dos a evitar, en círculos.", "Wniosek: trzy szczęścia, dwa do unikania, w kółkach."),
      colorMeaning(yongKey, locale),
      loc(locale, "조언: 핵심 구조에 적힌 용신·희신·기신과 같은 색을 쓰면 됩니다.", "Consejo: los mismos yongsin/heesin/gisin que en la estructura central.", "Rada: te same yongsin/heesin/gisin co w głównej strukturze."),
    ]),
    easyBullets: [],
    easySections: [section(loc(locale, "활용 예시", "Cómo usarlo", "Jak tego użyć"), [colorUse(locale)])],
    luckyColors: lucky,
    avoidColors: avoid,
  };

  const fengshui: ThemeCardData = {
    id: "fengshui",
    title: msg(locale, "themeFengshui"),
    kicker: yong.split(" · ")[0] ?? "",
    front: clean([
      yong,
      loc(locale, "목은 동, 화는 남, 토는 중앙, 금은 서, 수는 북입니다. 책상 앞에 용신 질감을 두세요.", "Madera este, fuego sur, tierra centro, metal oeste, agua norte.", "Drewno wschód, ogień południe, ziemia środek, metal zachód, woda północ."),
    ]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: loc(locale, `집을 ${directionOf(yongKey, locale)}쪽으로 조금 열어 두면 숨이 트여요.`, `Si abres la casa hacia el ${directionOf(yongKey, locale)}, respiras.`, `Jak otworzysz dom ku ${directionOf(yongKey, locale)}, łapiesz oddech.`),
    easy: clean([
      loc(locale, "결론: 비싼 인테리어가 아니라 방향 하나와 소품 하나면 돼요.", "Conclusión: no un interior caro, una dirección y un objeto.", "Wniosek: nie drogie wnętrze — jeden kierunek i jeden przedmiot."),
      fengFront(yongKey, locale),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "좋은 방향", "Buena dirección", "Dobry kierunek"), [
        loc(locale, `용신 ${ctx.elName(yongKey)} = ${directionOf(yongKey, locale)}`, `Yongsin ${ctx.elName(yongKey)} = ${directionOf(yongKey, locale)}`, `Yongsin ${ctx.elName(yongKey)} = ${directionOf(yongKey, locale)}`),
      ]),
      section(loc(locale, "침대 · 책상", "Cama · escritorio", "Łóżko · biurko"), [
        loc(locale, `머리와 의자 등받이는 ${directionOf(yongKey, locale)}을 등지지 않게, 창을 약간 그쪽으로 열어 두세요.`, `Cabecera y respaldo: no de espaldas al ${directionOf(yongKey, locale)}. Abre un poco la ventana hacia ahí.`, `Wezgłowie i oparcie: nie plecami do ${directionOf(yongKey, locale)}. Otwórz trochę okno w tę stronę.`),
      ]),
      section(loc(locale, "추천 소품", "Objetos", "Przedmioty"), [
        loc(locale, "용신 색 소품을 책상 가까이 두면 매일 눈에 들어옵니다.", "Si acercas un objeto del color yongsin, lo ves cada día.", "Kolor yongsin na biurku wpada w oko codziennie."),
      ]),
      section(loc(locale, "피하면 좋은 것", "Qué evitar", "Czego unikać"), [
        loc(locale, "너무 많은 거울과 막힌 구석, 기신 색으로만 칠한 방은 빼세요.", "Quita espejos de más, el rincón tapado y una sala solo del color gisin.", "Zdejmij nadmiar luster, zatkany kąt i pokój pomalowany samym kolorem gisin."),
      ]),
    ],
  };

  const healthEl = ctx.weak[0] ?? day.element;
  const health: ThemeCardData = {
    id: "health",
    title: msg(locale, "themeHealth"),
    kicker: ctx.elName(day.element),
    front: clean([
      loc(locale, "사주는 의학적 진단이 아닙니다. 오행-장부의 상징만 적습니다.", "El saju no es diagnóstico. Solo hay símbolo elemento-órgano.", "Saju nie jest diagnozą. Tylko symbol żywioł–narząd."),
      loc(
        locale,
        `강한 오행 ${ctx.strong.map((key) => ctx.elName(key)).join("·")}, 약한 오행 ${ctx.weak.map((key) => ctx.elName(key)).join("·")}.`,
        `Fuertes: ${ctx.strong.map((key) => ctx.elName(key)).join(", ")}. Débiles: ${ctx.weak.map((key) => ctx.elName(key)).join(", ")}.`,
        `Silne: ${ctx.strong.map((key) => ctx.elName(key)).join(", ")}. Słabe: ${ctx.weak.map((key) => ctx.elName(key)).join(", ")}.`,
      ),
    ]),
    frontTerms: terms(locale, [["일간", loc(locale, "일간", "tronco", "pień")]]),
    frontBullets: [],
    easyHeadline: loc(locale, "몸이 먼저 보내는 신호는 잠과 긴장이에요.", "El cuerpo avisa con sueño y tensión.", "Ciało daje znać snem i napięciem."),
    easy: clean([
      loc(locale, `결론: 약해지기 쉬운 곳은 ${organOf(healthEl, locale)} 쪽 상징이에요.`, `Conclusión: lo que se debilita (símbolo) es ${organOf(healthEl, locale)}.`, `Wniosek: to, co słabnie (symbol), to ${organOf(healthEl, locale)}.`),
      healthLong(healthEl, locale)[0],
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "생활 습관", "Hábitos", "Nawyki"), [healthLong(healthEl, locale)[2] ?? healthLong(healthEl, locale)[1]]),
      section(loc(locale, "좋은 운동", "Movimiento que sienta", "Ruch, który leży"), [hobby.sport, daeun ? loc(locale, `요즘 메모: ${daeun.health}.`, `Nota: ${daeun.health}.`, `Notatka: ${daeun.health}.`) : ""]),
    ],
    disclaimer: loc(locale, "의료 판단을 대체하지 않습니다.", "No sustituye una decisión médica.", "Nie zastępuje decyzji medycznej."),
  };

  const yearCard: ThemeCardData = {
    id: "year",
    title: msg(locale, "themeYear"),
    kicker: seun ? `${seun.year}` : `${ctx.year}`,
    front: clean([
      seun
        ? loc(
            locale,
            `${seun.year}년 세운 ${seun.ganzhiKorean} · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary}`,
            `Seun ${seun.year}: ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary}`,
            `Seun ${seun.year}: ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)}. ${seun.summary}`,
          )
        : "",
      daeun
        ? loc(locale, `대운 ${daeun.ganzhiKorean}(${tenGod(daeun.tenGodKorean, locale)})이 올해의 기후입니다.`, `El daeun ${daeun.ganzhi} es el clima de este año.`, `Daeun ${daeun.ganzhi} to klimat tego roku.`)
        : "",
    ]),
    frontTerms: terms(locale, [
      ["세운", loc(locale, "세운", "seun", "seun")],
      ["대운", loc(locale, "대운", "daeun", "daeun")],
    ]),
    frontBullets: [],
    easyHeadline: loc(
      locale,
      seun?.relationsWithNatal.length ? "올해는 판이 움직이는 해예요. 한 번에 결정하지 마세요." : "올해는 있는 판을 다지는 해에 가까워요.",
      seun?.relationsWithNatal.length ? "Este año mueve el tablero. No decidas todo a la vez." : "Este año asienta lo que ya tienes.",
      seun?.relationsWithNatal.length ? "Ten rok rusza planszę. Nie decyduj wszystkiego naraz." : "Ten rok raczej utrwala planszę.",
    ),
    easy: clean([
      loc(locale, "결론: 직업·돈·연애를 동시에 갈아엎지 마세요. 하나만 움직이면 됩니다.", "Conclusión: no vuelques trabajo, dinero y amor a la vez. Mueve uno.", "Wniosek: nie wywracaj naraz pracy, pieniędzy i miłości. Rusz jedno."),
      seun
        ? loc(locale, `이유: 올해 일 ${seun.career} / 돈 ${seun.money} / 마음 ${seun.love}.`, `Motivo: trabajo ${seun.career} / dinero ${seun.money} / corazón ${seun.love}.`, `Powód: praca ${seun.career} / pieniądze ${seun.money} / serce ${seun.love}.`)
        : "",
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "올해 키워드 3개", "Tres claves del año", "Trzy słowa roku"), yearKeywords.slice(0, 3)),
      section(loc(locale, "상반기 · 하반기", "Primer / segundo semestre", "Pierwsze / drugie półrocze"), [
        loc(locale, "상반기는 판을 읽고 한 가지를 고르는 때예요.", "El primer semestre: leer el tablero y elegir una cosa.", "Pierwsze półrocze: czytaj planszę i wybierz jedno."),
        loc(locale, "하반기는 고른 것을 루틴으로 고정하는 때예요.", "El segundo: fijar lo elegido como rutina.", "Drugie: utrwal wybrane jako rutynę."),
      ]),
      section(loc(locale, "좋은 달 · 조심할 달", "Meses buenos y de cuidado", "Dobre miesiące i ostrożne"), [
        monthAdvice(ctx.yongsinKeys, locale, true),
        monthAdvice(ctx.gisinKeys, locale, false),
      ]),
      section(loc(locale, "올해 조언", "Consejo del año", "Rada roku"), [
        loc(locale, "큰 결정은 한 박자 쉬고 하세요. 세운은 날씨일 뿐 원국을 바꾸지 않습니다.", "Pause un tiempo antes de lo grande. El seun es el tiempo, no cambia el hueso natal.", "Zaczekaj chwilę przed wielką decyzją. Seun to pogoda, nie zmienia kości karty."),
      ]),
    ],
  };

  const fashionCard: ThemeCardData = {
    id: "fashion",
    title: msg(locale, "themeFashion"),
    kicker: ctx.elName(yongKey),
    front: clean([yong, loc(locale, `용신 ${ctx.elName(yongKey)} 색·질감이 옷의 기본값입니다.`, `Color y textura ${ctx.elName(yongKey)} son el valor por defecto de la ropa.`, `Kolor i faktura ${ctx.elName(yongKey)} to baza ubrania.`)]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: loc(locale, fashion.style, fashion.style, fashion.style),
    easy: clean([
      loc(locale, `결론: ${fashion.style}.`, `Conclusión: ${fashion.style}.`, `Wniosek: ${fashion.style}.`),
      loc(locale, `이유: 핵심 구조의 ${yong}과 같은 오행을 입는 일입니다.`, `Motivo: vestir el mismo elemento que ${yong}.`, `Powód: ubierać ten sam żywioł co ${yong}.`),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "색", "Color", "Kolor"), [fashion.color]),
      section(loc(locale, "소재", "Tela", "Materiał"), [fashion.fabric]),
      section(loc(locale, "액세서리", "Accesorio", "Dodatek"), [fashion.acc]),
      section(loc(locale, "피하면 좋은 스타일", "Qué evitar", "Czego unikać"), [fashion.avoid]),
    ],
    disclaimer: fun,
  };

  const foodCard: ThemeCardData = {
    id: "food",
    title: msg(locale, "themeFood"),
    kicker: ctx.elName(yongKey),
    front: clean([yong, loc(locale, "오행의 맛은 상징입니다. 식단 처방이 아닙니다.", "El sabor del elemento es símbolo, no una dieta.", "Smak żywiołu to symbol, nie dieta.")]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: loc(locale, `도움이 되는 맛은 ${food.help} 쪽이에요.`, `Te sienta el sabor de ${food.help}.`, `Leży ci smak ${food.help}.`),
    easy: clean([
      loc(locale, `결론: ${food.help}가 이 사주를 돕습니다.`, `Conclusión: ${food.help} ayuda a esta carta.`, `Wniosek: ${food.help} pomaga tej karcie.`),
      loc(locale, `이유: 용신 ${ctx.elName(yongKey)}을 생활로 한 줌 보태는 일입니다.`, `Motivo: sumar un puñado de ${ctx.elName(yongKey)} al día.`, `Powód: dodać garść ${ctx.elName(yongKey)} do dnia.`),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "도움이 되는 음식 · 맛", "Comida y sabor que ayudan", "Jedzenie i smak, które pomagają"), [food.help]),
      section(loc(locale, "줄이면 좋은 음식", "Qué bajar", "Co ograniczyć"), [food.cut]),
      section(loc(locale, "추천 차", "Té", "Herbata"), [food.tea]),
    ],
    disclaimer: fun,
  };

  const travelCard: ThemeCardData = {
    id: "travel",
    title: msg(locale, "themeTravel"),
    kicker: directionOf(yongKey, locale),
    front: clean([yong, loc(locale, `용신 방향은 ${directionOf(yongKey, locale)}입니다.`, `La dirección yongsin es ${directionOf(yongKey, locale)}.`, `Kierunek yongsin to ${directionOf(yongKey, locale)}.`)]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: loc(locale, `${directionOf(yongKey, locale)} 기운의 도시가 숨을 트이게 해요.`, `Las ciudades de ${directionOf(yongKey, locale)} te abren el pecho.`, `Miasta ${directionOf(yongKey, locale)} otwierają ci oddech.`),
    easy: clean([
      loc(locale, "결론: 여행지 3곳, 살기·일하기 좋은 곳 2곳을 오행 방향으로 골랐어요.", "Conclusión: tres viajes y dos sitios para vivir/trabajar, según la dirección.", "Wniosek: trzy podróże i dwa miejsca do życia/pracy według kierunku."),
      loc(locale, `이유: ${yong}`, `Motivo: ${yong}`, `Powód: ${yong}`),
    ]),
    easyBullets: [],
    easySections: [
      section(
        loc(locale, "여행지 3곳", "Tres viajes", "Trzy podróże"),
        travel.trips.map(([name, why]) => `${name} — ${why}`),
      ),
      section(
        loc(locale, "살거나 일하기 좋은 곳", "Dónde vivir o trabajar", "Gdzie mieszkać albo pracować"),
        travel.live.map(([name, why]) => `${name} — ${why}`),
      ),
    ],
    disclaimer: fun,
  };

  const musicCard: ThemeCardData = {
    id: "music",
    title: msg(locale, "themeMusic"),
    kicker: music.genre.split(",")[0]?.trim() ?? "",
    front: clean([
      loc(locale, `용신 ${ctx.elName(yongKey)}의 리듬이 소리의 기본값입니다.`, `El ritmo de ${ctx.elName(yongKey)} es el valor por defecto del sonido.`, `Rytm ${ctx.elName(yongKey)} to baza dźwięku.`),
      yong,
    ]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: music.mood,
    easy: clean([
      loc(locale, `결론: ${music.genre}가 맞아요.`, `Conclusión: te va ${music.genre}.`, `Wniosek: pasuje ci ${music.genre}.`),
      loc(locale, `이유: ${music.mood}`, `Motivo: ${music.mood}`, `Powód: ${music.mood}`),
    ]),
    easyBullets: [],
    easySections: [section(loc(locale, "추천 상황", "Cuándo", "Kiedy"), [music.when])],
    disclaimer: fun,
  };

  const hobbyCard: ThemeCardData = {
    id: "hobby",
    title: msg(locale, "themeHobby"),
    kicker: hobby.sport.split(",")[0]?.trim() ?? "",
    front: clean([
      loc(locale, `약한 오행 ${ctx.elName(healthEl)}을 생활 움직임으로 보탭니다.`, `El elemento flojo ${ctx.elName(healthEl)} se suma con movimiento.`, `Słaby żywioł ${ctx.elName(healthEl)} dodaje się ruchem.`),
      yong,
    ]),
    frontTerms: terms(locale, [["오행", loc(locale, "오행", "cinco elementos", "pięć żywiołów")]]),
    frontBullets: [],
    easyHeadline: loc(locale, `${hobby.hobby}가 오래 가요.`, `${hobby.hobby} te dura.`, `${hobby.hobby} wytrzyma długo.`),
    easy: clean([
      loc(locale, `결론: 취미는 ${hobby.hobby}, 운동은 ${hobby.sport}.`, `Conclusión: ocio ${hobby.hobby}; movimiento ${hobby.sport}.`, `Wniosek: hobby ${hobby.hobby}; ruch ${hobby.sport}.`),
      loc(locale, "이유는 용신을 즐겁게, 약한 오행을 몸으로 채우기 때문이에요.", "Motivo: el yongsin se llena con gusto; lo flojo, con el cuerpo.", "Powód: yongsin napełniasz przyjemnością, słabe — ciałem."),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "취미", "Ocio", "Hobby"), [hobby.hobby]),
      section(loc(locale, "운동", "Movimiento", "Ruch"), [hobby.sport]),
    ],
    disclaimer: fun,
  };

  const luckyCard: ThemeCardData = {
    id: "lucky",
    title: msg(locale, "themeLucky"),
    kicker: luckyBit.numbers.join(" · "),
    front: clean([
      yong,
      loc(locale, `용신 ${ctx.elName(yongKey)}의 숫자·요일·계절 상징입니다.`, `Símbolos de número, día y estación de ${ctx.elName(yongKey)}.`, `Symbole liczby, dnia i pory ${ctx.elName(yongKey)}.`),
    ]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: loc(locale, `행운의 숫자는 ${luckyBit.numbers.join(", ")}예요.`, `Números de suerte: ${luckyBit.numbers.join(", ")}.`, `Szczęśliwe liczby: ${luckyBit.numbers.join(", ")}.`),
    easy: clean([
      loc(locale, `결론: 숫자 ${luckyBit.numbers.join("·")}, 요일 ${luckyBit.weekday}, 계절 ${luckyBit.season}.`, `Conclusión: números ${luckyBit.numbers.join("·")}, día ${luckyBit.weekday}, estación ${luckyBit.season}.`, `Wniosek: liczby ${luckyBit.numbers.join("·")}, dzień ${luckyBit.weekday}, pora ${luckyBit.season}.`),
      loc(locale, `이유: 핵심 구조의 ${yong}과 같은 오행 상징이에요.`, `Motivo: el mismo elemento que ${yong}.`, `Powód: ten sam żywioł co ${yong}.`),
    ]),
    easyBullets: [],
    easySections: [
      section(loc(locale, "행운의 숫자", "Números", "Liczby"), [luckyBit.numbers.join(" · ")]),
      section(loc(locale, "행운의 요일", "Día", "Dzień"), [luckyBit.weekday]),
      section(loc(locale, "행운의 계절", "Estación", "Pora"), [luckyBit.season]),
    ],
    disclaimer: fun,
  };

  return [character, career, wealth, love, match, relations, colors, fengshui, health, yearCard, fashionCard, foodCard, travelCard, musicCard, hobbyCard, luckyCard];
}
