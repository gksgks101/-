import type { Locale } from "@/lib/i18n/config";
import { josa } from "@/lib/i18n/josa";
import { msg } from "@/lib/i18n/messages";
import { tenGod } from "@/lib/i18n/terms";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import { characterBits } from "./characterBank";
import { gloss } from "./glossary";
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
import { careerWorkEasy, groupEasy, loveStyle } from "./sectorTables";
import { cautionTrait, easyElementName, luckOpensWhen, personCaution, personFit } from "./plainVoice";
import { buildThemeCtx, clean, loc, type ThemeCtx } from "./themeContext";
import type { ColorChip, ContrastItem, ContrastPair, GlossChip, LifestyleTab, ThemeCardData } from "./themes";
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

function pair(goodTitle: string, cautionTitle: string, good: ContrastItem[], caution: ContrastItem[]): ContrastPair {
  return {
    goodTitle,
    cautionTitle,
    good: good.filter((item) => item.label && item.why).slice(0, 5),
    caution: caution.filter((item) => item.label && item.why).slice(0, 3),
  };
}

function organOf(element: ElementKey, locale: Locale): string {
  const table: Record<ElementKey, Record<Locale, string>> = {
    wood: { ko: "눈·목·어깨", es: "ojos, cuello, hombros", pl: "oczy, kark, barki" },
    fire: { ko: "잠·가슴·말의 속도", es: "sueño, pecho, ritmo del habla", pl: "sen, klatka, tempo mowy" },
    earth: { ko: "소화·허리", es: "digestión y lumbar", pl: "trawienie i lędźwie" },
    metal: { ko: "숨·피부", es: "respiración y piel", pl: "oddech i skóra" },
    water: { ko: "허리·순환·밤의 생각", es: "lumbar, circulación, pensamiento nocturno", pl: "lędźwie, krążenie, nocna myśl" },
  };
  return table[element][locale];
}

function colorUse(locale: Locale): string {
  return loc(
    locale,
    "옷 안감, 스카프, 폰 배경처럼 매일 눈에 들어오는 곳에 쓰면 돼요.",
    "Úsalos en el forro, el pañuelo o el fondo del teléfono: sitios que ves cada día.",
    "Dawaj je na podszewkę, chustę albo tapetę telefonu — miejsca, które widzisz codziennie.",
  );
}

function titles(locale: Locale) {
  return {
    fitPeople: loc(locale, "잘 맞는 사람", "Gente que te va", "Ludzie, którzy pasują"),
    unfitPeople: loc(locale, "안 맞는 사람", "Gente que no te va", "Ludzie, którzy nie pasują"),
    fitJobs: loc(locale, "잘 맞는 직업", "Oficios que te van", "Zawody, które pasują"),
    unfitJobs: loc(locale, "안 맞는 직업", "Oficios que no te van", "Zawody, które nie pasują"),
    pros: loc(locale, "장점", "Dones", "Atuty"),
    cons: loc(locale, "단점", "Sombras", "Cienie"),
    luckyColor: loc(locale, "행운의 색", "Colores de suerte", "Kolory szczęścia"),
    avoidColor: loc(locale, "피할 색", "Colores a evitar", "Kolory do unikania"),
    goodFood: loc(locale, "좋은 음식", "Comida que sienta", "Jedzenie, które leży"),
    cutFood: loc(locale, "줄일 음식", "Comida a bajar", "Jedzenie do ograniczenia"),
    moneyIn: loc(locale, "돈이 들어오는 곳", "Por dónde entra", "Skąd wchodzą pieniądze"),
    moneyOut: loc(locale, "돈이 새는 곳", "Por dónde se fuga", "Gdzie ucieka kasa"),
    goodMonth: loc(locale, "좋은 달", "Meses buenos", "Dobre miesiące"),
    careMonth: loc(locale, "조심할 달", "Meses de cuidado", "Miesiące ostrożności"),
    help: loc(locale, "나를 돕는 것", "Lo que te ayuda", "Co ci pomaga"),
    care: loc(locale, "조심할 것", "Lo que conviene cuidar", "Czego pilnować"),
  };
}

export function assembleThemeCards(
  calculation: SajuCalculation,
  locale: Locale,
  _voice: string[],
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
  const fashion = fashionFor(ctx);
  const food = foodFor(ctx);
  const travel = travelFor(ctx);
  const music = musicFor(ctx);
  const hobby = hobbyFor(ctx);
  const luckyBit = luckyBits(ctx);
  const fun = loc(locale, "재미로 보는 참고용이에요.", "Es una referencia de entretenimiento.", "To rozrywkowa wskazówka.");
  const yongKey = ctx.yongsinKeys[0] ?? ctx.support;
  const t = titles(locale);
  const seed = c.strength.score + day.gan.charCodeAt(0);
  const openAt = (n: number) => luckOpensWhen(yongKey, locale, seed + n);

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
    easy: clean([
      loc(locale, `결론: ${head}`, `Conclusión: ${head}`, `Wniosek: ${head}`),
      loc(locale, `이유: ${bits.public.replace(/요\.?$/, " 편이에요.")}`, `Motivo: ${bits.public}`, `Powód: ${bits.public}`),
      loc(locale, `조언: ${bits.stressEase.replace(/^푸는 법:\s*/, "")}`, `Consejo: ${bits.stressEase.replace(/^Alivio:\s*/, "")}`, `Rada: ${bits.stressEase.replace(/^Ulga:\s*/, "")}`),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        t.pros,
        t.cons,
        bits.pros.map((label, index) => ({
          label,
          why: [
            loc(locale, "이 결이 오래 버티게 해요.", "Ese temple te hace durar.", "Ten temperament każe trwać."),
            loc(locale, "사람들이 그 점을 먼저 믿어요.", "La gente cree primero eso.", "Ludzie najpierw wierzą w to."),
            loc(locale, "작은 약속도 이 힘으로 지켜져요.", "Hasta un pacto chico se cumple con eso.", "Nawet mała umowa trzyma się tą siłą."),
          ][index] ?? bits.public,
        })),
        bits.cons.map((label, index) => ({
          label,
          why: [
            loc(locale, "과하면 스스로 먼저 지쳐요.", "Si se pasa, te cansas tú primero.", "Jak przesadzi, męczysz się pierwszy."),
            loc(locale, "관계가 짧아지는 지점이에요.", "Ahí se acorta el vínculo.", "Tu relacja się skraca."),
            loc(locale, "한 줄을 나눠 주면 덜해요.", "Si partes una línea, baja.", "Jak podzielisz linijkę, słabnie."),
          ][index] ?? bits.stressAct,
        })),
      ),
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
      daeun ? loc(locale, `지금 대운의 일 키워드: ${daeun.career}.`, `Daeun laboral: ${daeun.career}.`, `Daeun zawodowy: ${daeun.career}.`) : "",
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
      loc(locale, `결론: ${jobs[0]?.name ?? ""} 쪽으로 가면 숨이 트여요.`, `Conclusión: el oficio ${jobs[0]?.name ?? ""} te abre el pecho.`, `Wniosek: zawód ${jobs[0]?.name ?? ""} otwiera oddech.`),
      loc(locale, `이유: ${careerWorkEasy(topCareer?.type, locale).split(/[.。]/)[0] ?? env.style}.`, `Motivo: ${careerWorkEasy(topCareer?.type, locale).split(/[.。]/)[0] ?? env.style}.`, `Powód: ${careerWorkEasy(topCareer?.type, locale).split(/[.。]/)[0] ?? env.style}.`),
      loc(locale, `조언: ${env.tip}`, `Consejo: ${env.tip}`, `Rada: ${env.tip}`),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        t.fitJobs,
        t.unfitJobs,
        jobs.map((item) => ({ label: loc(locale, `${item.rank}위 ${item.name}`, `${item.rank}. ${item.name}`, `${item.rank}. ${item.name}`), why: item.easy })),
        badJobs.map((item) => ({ label: item.name, why: item.why })),
      ),
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
      loc(locale, `결론: 버는 방식은 ${styleName} 쪽이에요.`, `Conclusión: ganas más al modo ${styleName}.`, `Wniosek: zarabiasz raczej w trybie ${styleName}.`),
      loc(
        locale,
        ctx.style === "aggressive" ? "이유는 기회에 몸이 먼저 반응하기 때문이에요." : "이유는 새는 구멍을 막는 해가 쌓여야 큰돈이 되기 때문이에요.",
        ctx.style === "aggressive" ? "Motivo: el cuerpo responde a la oportunidad." : "Motivo: los años de tapar fugas suman más que un golpe.",
        ctx.style === "aggressive" ? "Powód: ciało reaguje na okazję." : "Powód: lata zatykania wycieków składają się na większe pieniądze.",
      ),
      loc(locale, "조언: 자동이체를 월급날에 붙이세요. 종목은 찍지 않아요.", "Consejo: una transferencia el día de cobro. No elegimos acciones.", "Rada: przelew w dzień wypłaty. Nie wybieramy spółek."),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        t.moneyIn,
        t.moneyOut,
        [
          {
            label: loc(locale, ctx.style === "aggressive" ? "내 이름 현금 흐름" : "약속된 입금", ctx.style === "aggressive" ? "flujo con tu nombre" : "ingreso prometido", ctx.style === "aggressive" ? "przepływ z nazwiskiem" : "obiecany wpływ"),
            why: loc(locale, "눈에 남는 결과가 돈이 돼요.", "El resultado que se ve se vuelve dinero.", "Widoczny wynik staje się pieniędzmi."),
          },
          {
            label: loc(locale, "작게 반복하는 부업", "un extra chico que se repite", "mała dodatkowa praca w powtórce"),
            why: loc(locale, "한 방보다 주기가 마음을 놓게 해요.", "Más que un golpe, el ciclo te calma.", "Bardziej niż strzał uspokaja cykl."),
          },
          {
            label: loc(locale, "정산이 있는 협력", "una colaboración con liquidación", "współpraca z rozliczeniem"),
            why: loc(locale, "숫자가 보이면 관계가 안 꼬여요.", "Si se ve la cifra, el vínculo no se enreda.", "Gdy widać cyfrę, relacja się nie plącze."),
          },
        ],
        [
          {
            label: loc(locale, ctx.style === "aggressive" ? "정산 없는 공동투자" : "충동 소비", ctx.style === "aggressive" ? "inversión conjunta sin liquidar" : "gasto impulsivo", ctx.style === "aggressive" ? "wspólna inwestycja bez rozliczenia" : "impulsywne wydatki"),
            why: loc(locale, "구멍은 크게 한 번에 열려요.", "La fuga se abre de un golpe.", "Dziura otwiera się jednym ruchem."),
          },
          {
            label: loc(locale, "보증과 ‘이번만’", "avales y el “solo esta vez”", "poręczenia i „tylko tym razem”"),
            why: loc(locale, "남을 위한 큰 약속이 잔고를 흔들어요.", "Una gran promesa por otros mueve el saldo.", "Wielka obietnica za innych rusza saldo."),
          },
          {
            label: loc(locale, "구독처럼 안 보이는 새는 곳", "fugas invisibles como suscripciones", "niewidoczne wycieki jak subskrypcje"),
            why: loc(locale, "작아 보여도 매달 쌓여요.", "Aunque se vea chico, se apila cada mes.", "Choć małe, co miesiąc się składa."),
          },
        ],
      ),
    ],
    disclaimer: msg(locale, "wealthFunDisclaimer"),
  };

  const loveFit = [personFit(ctx.support, locale, "love"), personFit(ctx.output, locale, "love"), personFit(day.element, locale, "love")];
  const loveCare = [personCaution(ctx.pressure, locale, "love"), { label: loc(locale, "밀당만 하는 사람", "Quien solo tira y afloja", "Kto tylko gra na zwłokę"), why: loc(locale, "약속이 흐리면 마음이 먼저 지쳐요.", "Si se nubla la cita, el ánimo se cansa primero.", "Jak zmętnieje umowa, serce męczy się pierwsze.") }];

  const love: ThemeCardData = {
    id: "love",
    title: msg(locale, "themeLove"),
    kicker: p.day.zhiKorean,
    front: clean([
      loc(locale, `배우자궁은 일지 ${p.day.zhiKorean}(${p.day.twelveStageKorean})입니다.`, `Palacio de pareja: rama del día ${p.day.zhi} (${p.day.twelveStageKorean}).`, `Pałac pary: gałąź dnia ${p.day.zhi} (${p.day.twelveStageKorean}).`),
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
      loc(locale, "결론: 좋아하는 티는 작게, 약속은 분명하게.", "Conclusión: el gusto en bajo, la cita clara.", "Wniosek: sympatia cicho, umowa jasno."),
      loc(locale, "이유는 속도가 맞아야 마음이 오래가기 때문이에요.", "Motivo: el vínculo dura si encaja el ritmo.", "Powód: relacja trwa, gdy zgadza się tempo."),
      loc(locale, "조언: 밀당보다 한 줄을 먼저 정하세요.", "Consejo: antes que el tira y afloja, una línea clara.", "Rada: zamiast gry na zwłokę — jedna jasna linijka."),
    ]),
    easyBullets: [],
    contrast: [pair(t.fitPeople, t.unfitPeople, loveFit, loveCare)],
  };

  const match: ThemeCardData = {
    id: "match",
    title: msg(locale, "themeMatch"),
    kicker: loc(locale, `${easyElementName(ctx.support, locale)} 결`, `temple ${easyElementName(ctx.support, locale)}`, `temperament ${easyElementName(ctx.support, locale)}`),
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
    easyHeadline: loc(locale, "받아 주고 속도를 맞추는 사람이 오래 가요.", "Quien te recibe al ritmo dura.", "Kto przyjmuje twoje tempo — zostaje."),
    easy: clean([
      loc(locale, "결론: 받아 주고 속도를 맞추는 사람이 오래 가요.", "Conclusión: quien te recibe al ritmo dura.", "Wniosek: kto przyjmuje tempo — zostaje."),
      loc(locale, "이유는 결이 같으면 자존심 싸움이 적기 때문이에요.", "Motivo: si el temple encaja, hay menos pelea de orgullo.", "Powód: gdy temperament się zgadza, mniej sporu o honor."),
      loc(locale, "조언: 정답만 던지는 사람과는 거리를 두세요.", "Consejo: distancia con quien solo suelta “la verdad”.", "Rada: dystans wobec tego, kto rzuca samą „prawdę”."),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        t.fitPeople,
        t.unfitPeople,
        [personFit(ctx.support, locale), personFit(day.element, locale), personFit(ctx.output, locale)],
        [personCaution(ctx.pressure, locale), { label: loc(locale, "속도가 안 맞는 사람", "Quien no pega el ritmo", "Kto nie trafia w tempo"), why: loc(locale, "밀어붙이면 관계가 짧아져요.", "Si empuja, el vínculo se acorta.", "Jak pcha, relacja się skraca.") }],
      ),
    ],
  };

  const relations: ThemeCardData = {
    id: "relations",
    title: msg(locale, "themeRelations"),
    kicker: loc(locale, "친구와 직장", "Amigos y trabajo", "Przyjaciele i praca"),
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
      loc(locale, "이유는 친구와 직장의 결이 다르기 때문이에요.", "Motivo: amigos y trabajo no tienen el mismo temple.", "Powód: przyjaciele i praca to inny temperament."),
      loc(locale, `조언: ${groupEasy(ctx.dominantGroup, locale).split(/[.。]/)[0] ?? ""}.`, `Consejo: ${groupEasy(ctx.dominantGroup, locale).split(/[.。]/)[0] ?? ""}.`, `Rada: ${groupEasy(ctx.dominantGroup, locale).split(/[.。]/)[0] ?? ""}.`),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        loc(locale, "잘 맞는 자리", "Sitios que te van", "Miejsca, które pasują"),
        loc(locale, "조심할 자리", "Sitios de cuidado", "Miejsca ostrożności"),
        [
          { label: loc(locale, "오래 가는 소수 친구", "pocos amigos largos", "kilkoro przyjaciół na długo"), why: loc(locale, "매일 감정 공유보다 깊이가 맞아요.", "Más que emoción diaria, te sienta la hondura.", "Bardziej niż codzienne emocje leży ci głębia.") },
          { label: loc(locale, "역할이 보이는 팀", "un equipo con rol visible", "zespół z widoczną rolą"), why: loc(locale, "내가 뭘 맡는지 보이면 힘이 나요.", "Ver qué es tuyo te da fuerza.", "Widok tego, co twoje, dodaje siły.") },
          { label: loc(locale, "한 줄만 받아 적는 가족 대화", "familia con una línea anotada", "rodzina z jedną zapisaną linijką"), why: loc(locale, "잔소리로 들리면 짧게 받아 적으세요.", "Si suena a sermón, anota una línea.", "Jak brzmi jak kazanie — zapisz jedną linijkę.") },
        ],
        [
          { label: loc(locale, "매일 감정 공유", "compartir emoción a diario", "codzienne dzielenie emocji"), why: loc(locale, "사람 수가 많으면 금방 닳아요.", "Si hay mucha gente, te desgastas pronto.", "Przy tłumie szybko się ścierasz.") },
          { label: loc(locale, "역할이 모호한 자리", "un puesto de rol vago", "stanowisko z mglistą rolą"), why: loc(locale, "모호하면 화가 먼저 나요.", "Si es vago, sale ira primero.", "Gdy mgła — najpierw złość.") },
          { label: loc(locale, "간섭이 많은 모임", "un grupo de mucha intromisión", "grupa z dużą ingerencją"), why: loc(locale, "속도를 맞추라는 말이 싸움이 돼요.", "Que te pidan ritmo se vuelve pelea.", "Prośba o tempo staje się kłótnią.") },
        ],
      ),
    ],
  };

  const colors: ThemeCardData = {
    id: "colors",
    title: msg(locale, "themeColors"),
    kicker: easyElementName(yongKey, locale),
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
      loc(locale, "결론: 기분 좋아지는 색을 가까이에 두세요.", "Conclusión: acerca el color que te sienta bien.", "Wniosek: trzymaj blisko kolor, przy którym ci dobrze."),
      loc(locale, `이유: ${openAt(0)}`, `Motivo: ${openAt(0)}`, `Powód: ${openAt(0)}`),
      loc(locale, `조언: ${colorUse(locale)}`, `Consejo: ${colorUse(locale)}`, `Rada: ${colorUse(locale)}`),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        t.luckyColor,
        t.avoidColor,
        lucky.map((item, index) => ({
          label: item.label,
          why: [
            loc(locale, "가까이에 두면 하루가 먼저 풀려요.", "Si lo acercas, el día se abre primero.", "Jak zbliżysz, dzień otwiera się pierwszy."),
            loc(locale, "포인트로만 써도 기분이 밝아져요.", "Aunque sea un acento, el ánimo se ilumina.", "Nawet jako akcent nastrój się świeci."),
            loc(locale, "매일 눈에 들어오는 작은 점이면 돼요.", "Basta un punto chico que veas cada día.", "Wystarczy mały punkt, który widzisz codziennie."),
          ][index] ?? openAt(7),
        })),
        avoid.map((item, index) => ({
          label: item.label,
          why: loc(locale, `${cautionTrait(ctx.gisinKeys[index] ?? ctx.pressure, locale)} 쪽으로 기울어요.`, `Tira hacia ${cautionTrait(ctx.gisinKeys[index] ?? ctx.pressure, locale)}.`, `Ciągnie ku: ${cautionTrait(ctx.gisinKeys[index] ?? ctx.pressure, locale)}.`),
        })),
      ),
    ],
    luckyColors: lucky,
    avoidColors: avoid,
  };

  const fengshui: ThemeCardData = {
    id: "fengshui",
    title: msg(locale, "themeFengshui"),
    kicker: directionOf(yongKey, locale),
    front: clean([
      yong,
      loc(locale, "목은 동, 화는 남, 토는 중앙, 금은 서, 수는 북입니다. 책상 앞에 용신 질감을 두세요.", "Madera este, fuego sur, tierra centro, metal oeste, agua norte.", "Drewno wschód, ogień południe, ziemia środek, metal zachód, woda północ."),
    ]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: loc(locale, `집을 ${directionOf(yongKey, locale)}쪽으로 조금 열어 두면 숨이 트여요.`, `Si abres la casa hacia el ${directionOf(yongKey, locale)}, respiras.`, `Jak otworzysz dom ku ${directionOf(yongKey, locale)}, łapiesz oddech.`),
    easy: clean([
      loc(locale, "결론: 방향 하나와 소품 하나면 돼요.", "Conclusión: basta una dirección y un objeto.", "Wniosek: wystarczy jeden kierunek i jeden przedmiot."),
      loc(locale, `이유: ${openAt(1)}`, `Motivo: ${openAt(1)}`, `Powód: ${openAt(1)}`),
      loc(locale, `조언: 머리와 등받이가 ${directionOf(yongKey, locale)} 반대가 되지 않게 하세요.`, `Consejo: que cabecera y respaldo no queden de espaldas al ${directionOf(yongKey, locale)}.`, `Rada: wezgłowie i oparcie niech nie stoją plecami do ${directionOf(yongKey, locale)}.`),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        loc(locale, "좋은 방향", "Buena dirección", "Dobry kierunek"),
        loc(locale, "피하면 좋은 것", "Qué evitar", "Czego unikać"),
        [
          { label: loc(locale, `${directionOf(yongKey, locale)}쪽 창`, `ventana al ${directionOf(yongKey, locale)}`, `okno ku ${directionOf(yongKey, locale)}`), why: loc(locale, "숨을 트이게 하는 쪽이에요.", "Es el lado que te abre el pecho.", "To strona, która otwiera oddech.") },
          { label: loc(locale, "책상 앞 작은 소품", "un objeto chico en el escritorio", "mały przedmiot na biurku"), why: loc(locale, "매일 눈에 들어오면 충분해요.", "Basta con verlo cada día.", "Wystarczy, że wpada w oko codziennie.") },
          { label: loc(locale, "정리된 바닥", "suelo recogido", "posprzątana podłoga"), why: loc(locale, "바닥이 가라앉아야 마음이 붙어요.", "Si el suelo se asienta, el ánimo se pega.", "Gdy podłoga siada, serce się klei.") },
        ],
        [
          { label: loc(locale, "너무 많은 거울", "espejos de más", "nadmiar luster"), why: loc(locale, "생각이 흩어지기 쉬워요.", "El pensamiento se dispersa fácil.", "Myśl łatwo się rozprasza.") },
          { label: loc(locale, "막힌 구석", "el rincón tapado", "zatkany kąt"), why: loc(locale, "답답함이 방으로 스며요.", "El ahogo se filtra a la sala.", "Duszenie wsiąka w pokój.") },
          { label: loc(locale, "한 색으로만 칠한 방", "una sala de un solo color", "pokój w jednym kolorze"), why: loc(locale, "과하면 기분도 한쪽으로 기울어요.", "Si se pasa, el ánimo también se sesga.", "Jak przesadzi, nastrój też się przechyla.") },
        ],
      ),
    ],
  };

  const healthEl = ctx.weak[0] ?? day.element;
  const health: ThemeCardData = {
    id: "health",
    title: msg(locale, "themeHealth"),
    kicker: easyElementName(day.element, locale),
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
      loc(locale, "이유는 무리가 쌓이면 잠과 긴장이 먼저 말하기 때문이에요.", "Motivo: si se acumula el exceso, avisan sueño y tensión.", "Powód: gdy zbiera się nadmiar, najpierw mówią sen i napięcie."),
      loc(locale, `조언: ${hobby.sport}처럼 과하지 않게 몸을 푸세요.`, `Consejo: muévete sin pasarte, hacia ${hobby.sport}.`, `Rada: ruszaj się bez przesady, ku ${hobby.sport}.`),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        loc(locale, "좋은 습관", "Hábitos que sientan", "Nawyki, które leżą"),
        loc(locale, "줄일 습관", "Hábitos a bajar", "Nawyki do ograniczenia"),
        [
          { label: loc(locale, "잠드는 시각 고정", "hora fija de dormir", "stała pora snu"), why: loc(locale, "리듬이 붙으면 몸이 먼저 고마워해요.", "Si se pega el ritmo, el cuerpo agradece primero.", "Gdy rytm się klei, ciało dziękuje pierwsze.") },
          { label: loc(locale, hobby.sport, hobby.sport, hobby.sport), why: loc(locale, "과하지 않은 움직임이 맞아요.", "Te sienta un movimiento sin pasarte.", "Pasuje ruch bez przesady.") },
          { label: loc(locale, "따뜻한 식사", "comida tibia", "ciepły posiłek"), why: loc(locale, "끼니를 거르면 긴장이 남아요.", "Si saltas comidas, queda tensión.", "Jak ominiesz posiłek, zostaje napięcie.") },
        ],
        [
          { label: loc(locale, "밤늦은 카페인", "cafeína de madrugada", "kofeina na późną noc"), why: loc(locale, "잠이 얕아지면 말이 빨라져요.", "Si el sueño se vuelve fino, el habla se acelera.", "Gdy sen płytczeje, mowa przyspiesza.") },
          { label: loc(locale, "하루 종일 앉기", "estar sentado el día entero", "siedzenie przez cały dzień"), why: loc(locale, "목·어깨가 먼저 굳어요.", "Cuello y hombros se endurecen primero.", "Kark i barki twardnieją pierwsze.") },
          { label: loc(locale, "과한 야식", "cena excesiva", "nadmiar kolacji"), why: loc(locale, "소화가 늦으면 다음 날이 무거워요.", "Si tarda la digestión, el día siguiente pesa.", "Gdy trawienie zwleka, następny dzień ciąży.") },
        ],
      ),
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
      loc(locale, "결론: 직업·돈·연애를 동시에 갈아엎지 마세요.", "Conclusión: no vuelques trabajo, dinero y amor a la vez.", "Wniosek: nie wywracaj naraz pracy, pieniędzy i miłości."),
      loc(locale, "이유는 하나만 움직여도 올해는 충분하기 때문이에요.", "Motivo: este año basta con mover una cosa.", "Powód: w tym roku wystarczy ruszyć jedno."),
      loc(locale, "조언: 큰 결정은 한 박자 쉬고 하세요.", "Consejo: pause un tiempo antes de lo grande.", "Rada: zaczekaj chwilę przed wielką decyzją."),
    ]),
    easyBullets: [],
    contrast: [
      pair(
        t.goodMonth,
        t.careMonth,
        (ctx.yongsinKeys.length ? ctx.yongsinKeys : [yongKey]).slice(0, 3).map((key) => ({
          label: monthAdvice([key], locale, true).replace(/^좋은 달:\s*/, "").replace(/^Meses buenos:\s*/, "").replace(/^Dobre miesiące:\s*/, ""),
          why: loc(locale, "이달에는 작은 결정을 밀어 보세요.", "Este mes empuja una decisión chica.", "W tym miesiącu pchnij małą decyzję."),
        })),
        (ctx.gisinKeys.length ? ctx.gisinKeys : [ctx.pressure]).slice(0, 3).map((key) => ({
          label: monthAdvice([key], locale, false).replace(/^조심할 달:\s*/, "").replace(/^Meses de cuidado:\s*/, "").replace(/^Miesiące ostrożności:\s*/, ""),
          why: loc(locale, `${josa(cautionTrait(key, locale), "이/가")} 커지기 쉬워요.`, `Crece fácil ${cautionTrait(key, locale)}.`, `Łatwo rośnie: ${cautionTrait(key, locale)}.`),
        })),
      ),
    ],
  };

  const fashionTab: LifestyleTab = {
    id: "fashion",
    title: msg(locale, "tabFashion"),
    easy: clean([
      loc(locale, `결론: ${fashion.style}.`, `Conclusión: ${fashion.style}.`, `Wniosek: ${fashion.style}.`),
      loc(locale, `이유: ${openAt(3)}`, `Motivo: ${openAt(3)}`, `Powód: ${openAt(3)}`),
      loc(locale, `조언: ${josa(fashion.color, "을/를")} 포인트로만 쓰세요.`, `Consejo: usa ${fashion.color} solo de acento.`, `Rada: ${fashion.color} tylko jako akcent.`),
    ]),
    contrast: pair(
      loc(locale, "잘 맞는 스타일", "Estilo que te va", "Styl, który pasuje"),
      loc(locale, "피할 스타일", "Estilo a evitar", "Styl do unikania"),
      [
        { label: fashion.style, why: fashion.fabric },
        { label: fashion.color, why: loc(locale, "매일 눈에 들어오는 점이면 돼요.", "Basta un punto que veas cada día.", "Wystarczy punkt, który widzisz codziennie.") },
        { label: fashion.acc, why: loc(locale, "작은 소품이 옷을 살려요.", "Un accesorio chico sostiene la ropa.", "Mały dodatek niesie ubranie.") },
      ],
      [{ label: fashion.avoid, why: loc(locale, "과하면 기분이 한쪽으로 기울어요.", "Si se pasa, el ánimo se sesga.", "Jak przesadzi, nastrój się przechyla.") }],
    ),
  };

  const foodTab: LifestyleTab = {
    id: "food",
    title: msg(locale, "tabFood"),
    easy: clean([
      loc(locale, `결론: ${food.help} 쪽이 몸을 편하게 해요.`, `Conclusión: te sienta ${food.help}.`, `Wniosek: leży ci ${food.help}.`),
      loc(locale, `이유: ${openAt(4)}`, `Motivo: ${openAt(4)}`, `Powód: ${openAt(4)}`),
      loc(locale, `조언: ${josa(food.tea, "을/를")} 루틴으로 두세요.`, `Consejo: haz del ${food.tea} una rutina.`, `Rada: zrób z ${food.tea} rutynę.`),
    ]),
    contrast: pair(
      t.goodFood,
      t.cutFood,
      [
        { label: food.help, why: loc(locale, "따뜻하고 담백한 쪽이 오래 가요.", "Lo tibio y suave te dura.", "Ciepłe i łagodne wytrzyma długo.") },
        { label: food.tea, why: loc(locale, "매일 한 잔이 리듬이 돼요.", "Una taza al día se vuelve ritmo.", "Jedna filiżanka dziennie staje się rytmem.") },
      ],
      [{ label: food.cut, why: loc(locale, "과하면 잠과 소화가 먼저 반응해요.", "Si se pasa, responden sueño y digestión.", "Jak przesadzi, najpierw reagują sen i trawienie.") }],
    ),
  };

  const travelTab: LifestyleTab = {
    id: "travel",
    title: msg(locale, "tabTravel"),
    easy: clean([
      loc(locale, `결론: ${directionOf(yongKey, locale)}쪽 도시가 숨을 트이게 해요.`, `Conclusión: las ciudades hacia el ${directionOf(yongKey, locale)} te abren el pecho.`, `Wniosek: miasta ku ${directionOf(yongKey, locale)} otwierają oddech.`),
      loc(locale, `이유: ${openAt(5)}`, `Motivo: ${openAt(5)}`, `Powód: ${openAt(5)}`),
      loc(locale, "조언: 여행은 세 곳 중 한 곳만 골라도 충분해요.", "Consejo: basta elegir una de las tres.", "Rada: wystarczy wybrać jedno z trzech."),
    ]),
    extra: travel.trips.map(([name, why]) => `${name} — ${why}`),
    contrast: pair(
      loc(locale, "잘 맞는 도시", "Ciudades que te van", "Miasta, które pasują"),
      loc(locale, "덜 맞는 리듬", "Ritmo que no te va", "Rytm, który nie leży"),
      travel.trips.slice(0, 3).map(([name, why]) => ({ label: name, why })),
      travel.live.slice(0, 2).map(([name, why]) => ({ label: name, why })),
    ),
  };

  const musicTab: LifestyleTab = {
    id: "music",
    title: msg(locale, "tabMusic"),
    easy: clean([
      loc(locale, `결론: ${josa(music.genre, "이/가")} 맞아요.`, `Conclusión: te va ${music.genre}.`, `Wniosek: pasuje ci ${music.genre}.`),
      loc(locale, `이유: ${music.mood}`, `Motivo: ${music.mood}`, `Powód: ${music.mood}`),
      loc(locale, `조언: ${music.when} 들을 때 제일 잘 붙어요.`, `Consejo: se pega mejor ${music.when}.`, `Rada: najlepiej klei się ${music.when}.`),
    ]),
    contrast: pair(
      loc(locale, "잘 맞는 음악", "Música que te va", "Muzyka, która pasuje"),
      loc(locale, "안 맞는 분위기", "Ambiente que no te va", "Nastrój, który nie leży"),
      [
        { label: music.genre, why: music.mood },
        { label: music.when, why: loc(locale, "그 시간에 들으면 하루가 열려요.", "Si la oyes entonces, se abre el día.", "Jak wtedy słuchasz, otwiera się dzień.") },
      ],
      [{ label: loc(locale, "너무 붐비는 소음", "un ruido demasiado lleno", "zbyt tłoczny hałas"), why: loc(locale, "생각이 흩어지면 쉬이 지쳐요.", "Si se dispersa el pensamiento, te cansas pronto.", "Jak myśl się rozproszy, szybko się męczysz.") }],
    ),
  };

  const luckyTab: LifestyleTab = {
    id: "lucky",
    title: msg(locale, "tabLucky"),
    easy: clean([
      loc(locale, `결론: 행운의 숫자는 ${luckyBit.numbers.join(", ")}예요.`, `Conclusión: números de suerte ${luckyBit.numbers.join(", ")}.`, `Wniosek: szczęśliwe liczby ${luckyBit.numbers.join(", ")}.`),
      loc(locale, `이유: ${openAt(6)}`, `Motivo: ${openAt(6)}`, `Powód: ${openAt(6)}`),
      loc(locale, `조언: ${luckyBit.weekday}, ${josa(luckyBit.season, "을/를")} 작은 의식처럼 쓰세요.`, `Consejo: usa ${luckyBit.weekday} y ${luckyBit.season} como un rito chico.`, `Rada: ${luckyBit.weekday} i ${luckyBit.season} jak mały rytuał.`),
    ]),
    extra: [
      loc(locale, `요일 ${luckyBit.weekday}`, `Día ${luckyBit.weekday}`, `Dzień ${luckyBit.weekday}`),
      loc(locale, `계절 ${luckyBit.season}`, `Estación ${luckyBit.season}`, `Pora ${luckyBit.season}`),
    ],
    contrast: pair(
      loc(locale, "가까이 둘 숫자", "Números a acercar", "Liczby, które trzymać blisko"),
      loc(locale, "과하게 믿지 말 것", "No creer de más", "Nie wierzyć za mocno"),
      luckyBit.numbers.map((num) => ({
        label: String(num),
        why: loc(locale, "작은 선택에만 재미로 붙이세요.", "Úsalo de juego en elecciones chicas.", "Doklejaj dla zabawy do małych wyborów."),
      })),
      [{ label: loc(locale, "큰 베팅의 근거", "base de una apuesta grande", "podstawa wielkiego zakładu"), why: loc(locale, "숫자는 재미이지 판단이 아니에요.", "El número es juego, no un juicio.", "Liczba to zabawa, nie osąd.") }],
    ),
  };

  const lifestyle: ThemeCardData = {
    id: "lifestyle",
    title: msg(locale, "themeLifestyle"),
    kicker: easyElementName(yongKey, locale),
    front: clean([
      yong,
      loc(locale, "패션·음식·여행·음악·숫자는 핵심 구조와 같은 흐름을 생활로 옮긴 값입니다.", "Moda, comida, viaje, música y números traducen la misma estructura al día.", "Moda, jedzenie, podróż, muzyka i liczby przenoszą tę samą strukturę na dzień."),
      loc(locale, `용신 ${ctx.elName(yongKey)}의 생활 상징입니다.`, `Símbolos cotidianos de ${ctx.elName(yongKey)}.`, `Codzienne symbole ${ctx.elName(yongKey)}.`),
    ]),
    frontTerms: terms(locale, [["용신", loc(locale, "용신", "yongsin", "yongsin")]]),
    frontBullets: [],
    easyHeadline: loc(locale, "옷·밥·여행·음악·숫자를 한 장에서 고르면 돼요.", "Elige ropa, comida, viaje, música y número en una sola carta.", "Wybierz ubranie, jedzenie, podróż, muzykę i liczbę na jednej karcie."),
    easy: clean([
      loc(locale, "결론: 나를 편하게 하는 쪽을 탭으로 보면 돼요.", "Conclusión: mira en pestañas lo que te sienta.", "Wniosek: w kartach zobacz, co ci leży."),
      loc(locale, `이유: ${openAt(2)}`, `Motivo: ${openAt(2)}`, `Powód: ${openAt(2)}`),
      loc(locale, "조언: 재미로 고르고, 큰 결정은 따로 하세요.", "Consejo: elige de juego; lo grande, aparte.", "Rada: wybieraj dla zabawy; wielkie decyzje osobno."),
    ]),
    easyBullets: [],
    lifestyleTabs: [fashionTab, foodTab, travelTab, musicTab, luckyTab],
    disclaimer: fun,
  };

  return [character, career, wealth, love, match, relations, colors, fengshui, health, yearCard, lifestyle];
}
