import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { ELEMENT_NAME, POWER_LABEL, YIN_YANG_NAME, tenGod, term } from "@/lib/i18n/terms";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import {
  colorMeaning,
  careerWorkEasy,
  fengFront,
  fortuneLine,
  groupEasy,
  groupFront,
  groupLabel,
  healthLong,
  loveStyle,
  palaceLine,
  sinsalNotes,
  strengthEasy,
  topGodFront,
  twelveEasy,
  twelveFront,
  twelveLabel,
  wealthEasyByStyle,
} from "./sectorTables";
import { buildThemeCtx, clean, loc, type ThemeCtx } from "./themeContext";
import type { ColorChip, ThemeCardData } from "./themes";

function investLabel(style: ThemeCtx["style"], locale: Locale): string {
  return loc(
    locale,
    style === "stable" ? "안정형" : style === "aggressive" ? "공격형" : "균형형",
    style === "stable" ? "conservador" : style === "aggressive" ? "agresivo" : "equilibrado",
    style === "stable" ? "stabilny" : style === "aggressive" ? "agresywny" : "zrównoważony",
  );
}

function powerLine(ctx: ThemeCtx): string {
  const { c, locale } = ctx;
  const parts = (Object.keys(c.elements.powerLabel) as ElementKey[]).map(
    (key) => `${ELEMENT_NAME[locale][key]} ${term(POWER_LABEL, c.elements.powerLabel[key], locale)}`,
  );
  return loc(locale, `오행 세력: ${parts.join(" · ")}.`, `Fuerza elemental: ${parts.join(" · ")}.`, `Siła żywiołów: ${parts.join(" · ")}.`);
}

function yongsinLine(ctx: ThemeCtx): string {
  const { c, locale, yong, hee, gi, gu } = ctx;
  const reason = c.useGod.reasons[1] ?? c.useGod.reasons[0] ?? "";
  return loc(
    locale,
    `용신 ${yong} · 희신 ${hee} · 기신 ${gi} · 구신 ${gu}. ${reason} 조후(월령)와 십성 용신을 겹쳐 읽습니다.`,
    `Yongsin ${yong} · Heesin ${hee} · Gisin ${gi} · Gusin ${gu}. ${reason} Se cruza con el mes y los diez dioses.`,
    `Yongsin ${yong} · Heesin ${hee} · Gisin ${gi} · Gusin ${gu}. ${reason} Nakłada się na miesiąc i dziesięć gwiazd.`,
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
  const yinYang = term(YIN_YANG_NAME, day.yinYang, locale);
  const stage = p.day.twelveStageKorean;
  const styleName = investLabel(ctx.style, locale);
  const lucky = chipsFor(ctx.yongsinKeys.length ? ctx.yongsinKeys : [ctx.support, ctx.output], locale, 4);
  const avoid = chipsFor(ctx.gisinKeys.length ? ctx.gisinKeys : [ctx.pressure], locale, 3);
  const gwiinLine = ctx.gwiinNames.length
    ? loc(locale, `길성: ${ctx.gwiinNames.join("·")}.`, `Estrellas favorables: ${ctx.gwiinNames.join("·")}.`, `Gwiazdy sprzyjające: ${ctx.gwiinNames.join("·")}.`)
    : loc(locale, "두드러진 귀인은 적습니다. 조력은 대운에서 더 잘 열립니다.", "Pocas estrellas de ayuda: el amparo se abre más en el daeun.", "Mało gwiazd pomocy: wsparcie otwiera się bardziej w daeun.");

  const character: ThemeCardData = {
    id: "character",
    title: msg(locale, "themeCharacter"),
    kicker: card.title[locale],
    front: clean([
      loc(
        locale,
        `일간 ${day.ganKorean}${day.elementKorean}(${day.gan}) · ${yinYang} · 신강/신약 ${c.strength.score}점 ${ctx.strengthLabel}. 격국은 ${c.pattern.name}입니다. ${c.pattern.basis} ${c.pattern.summary}`,
        `Tronco diario ${day.gan} (${ctx.elName(day.element)}, ${yinYang}). Fuerza ${c.strength.score} · ${ctx.strengthLabel}. Patrón ${c.pattern.name}. ${c.pattern.basis}`,
        `Pień dnia ${day.gan} (${ctx.elName(day.element)}, ${yinYang}). Siła ${c.strength.score} · ${ctx.strengthLabel}. Wzór ${c.pattern.name}. ${c.pattern.basis}`,
      ),
      loc(
        locale,
        `월지 ${p.month.zhiKorean}의 십성은 ${tenGod(p.month.zhiTenGodKorean, locale)}이라 사회 첫인상과 가깝고, 일지 ${p.day.zhiKorean}의 12운성은 ${twelveLabel(stage, locale)}입니다. 월지 지장간: ${ctx.hiddenMonth}.`,
        `La rama del mes ${p.month.zhi} es ${tenGod(p.month.zhiTenGodKorean, locale)} (impresión social). La rama del día ${p.day.zhi} está en ${twelveLabel(stage, locale)}. Tallos ocultos del mes: ${ctx.hiddenMonth}.`,
        `Gałąź miesiąca ${p.month.zhi} to ${tenGod(p.month.zhiTenGodKorean, locale)} (wrażenie społeczne). Gałąź dnia ${p.day.zhi} w etapie ${twelveLabel(stage, locale)}. Ukryte pnie miesiąca: ${ctx.hiddenMonth}.`,
      ),
      twelveFront(stage, locale),
      loc(locale, `십성 상위: ${ctx.godsLine}. 그룹 합산 ${ctx.groupLine}.`, `Diez dioses: ${ctx.godsLine}. Grupos: ${ctx.groupLine}.`, `Dziesięć gwiazd: ${ctx.godsLine}. Grupy: ${ctx.groupLine}.`),
      groupFront(ctx.dominantGroup, locale),
      topGodFront(ctx.topGod, locale),
      yongsinLine(ctx),
      powerLine(ctx),
      ...sinsalNotes([...ctx.gwiinNames, ...ctx.sinsalNames], locale, 2),
    ]),
    frontBullets: clean([...c.strength.reasons.slice(0, 4), c.guimun.present ? loc(locale, `귀문 활성도 ${c.guimun.natalActivation}: ${c.guimun.traits[0]}`, `Guimun ${c.guimun.natalActivation}: ${c.guimun.traits[0]}`, `Gwimun ${c.guimun.natalActivation}: ${c.guimun.traits[0]}`) : ""]),
    easyHeadline: head,
    easy: clean([
      ...voice,
      strengthEasy(c.strength.classification, locale),
      groupEasy(ctx.dominantGroup, locale),
      twelveEasy(stage, locale),
      loc(
        locale,
        `나를 살리는 쪽은 ${ctx.elName(ctx.support)}·${ctx.elName(ctx.output)}, 과하면 지치는 쪽은 ${ctx.elName(ctx.pressure)}입니다. 성격도 이 오행 리듬을 따라갑니다.`,
        `Te nutre ${ctx.elName(ctx.support)} y ${ctx.elName(ctx.output)}; te cansa el exceso de ${ctx.elName(ctx.pressure)}. El carácter sigue ese ritmo.`,
        `Karmi cię ${ctx.elName(ctx.support)} i ${ctx.elName(ctx.output)}; męczy nadmiar ${ctx.elName(ctx.pressure)}. Charakter idzie tym rytmem.`,
      ),
    ]),
    easyBullets: clean(c.talents.slice(0, 3).map((item) => `${item.title} — ${item.ability}`)),
  };

  const career: ThemeCardData = {
    id: "career",
    title: msg(locale, "themeCareer"),
    kicker: topCareer ? ctx.careerName(topCareer.type) : "",
    front: clean([
      loc(
        locale,
        `적성 1순위는 ${ctx.careerName(topCareer?.type ?? "")}(${topCareer?.score ?? 0}점)입니다. ${topCareer?.reasons[0] ?? ""} 관성+인성은 조직·승진, 식상+재성은 사업·매출, 인성+식상은 전문성, 편재+편관은 기회·리스크 축입니다.`,
        `Vocación 1: ${ctx.careerName(topCareer?.type ?? "")} (${topCareer?.score ?? 0}). ${topCareer?.reasons[0] ?? ""} Autoridad+impronta = organización; expresión+riqueza = negocio; impronta+expresión = oficio.`,
        `Zawód 1: ${ctx.careerName(topCareer?.type ?? "")} (${topCareer?.score ?? 0}). ${topCareer?.reasons[0] ?? ""} Autorytet+pieczęć = organizacja; wyraz+majątek = biznes; pieczęć+wyraz = fach.`,
      ),
      loc(
        locale,
        `상위 유형: ${c.careerTypes.slice(0, 6).map((item) => `${ctx.careerName(item.type)} ${item.score}`).join(" · ")}. 한 글자로 직업을 확정하지 않고, 일하는 방식의 순위로 읽습니다.`,
        `Ranking: ${c.careerTypes.slice(0, 6).map((item) => `${ctx.careerName(item.type)} ${item.score}`).join(" · ")}. No fijamos un oficio de una letra; es un orden de modo de trabajar.`,
        `Ranking: ${c.careerTypes.slice(0, 6).map((item) => `${ctx.careerName(item.type)} ${item.score}`).join(" · ")}. Nie ustalamy zawodu jedną literą — to kolejność sposobu pracy.`,
      ),
      loc(
        locale,
        `월주 ${p.month.ganzhiKorean}의 십성 ${tenGod(p.month.zhiTenGodKorean, locale)}이 직장에서 보이는 태도입니다. 지장간 ${ctx.hiddenMonth}.`,
        `El mes ${p.month.ganzhi} (${tenGod(p.month.zhiTenGodKorean, locale)}) es la actitud en el trabajo. Tallos ocultos: ${ctx.hiddenMonth}.`,
        `Miesiąc ${p.month.ganzhi} (${tenGod(p.month.zhiTenGodKorean, locale)}) to postawa w pracy. Ukryte pnie: ${ctx.hiddenMonth}.`,
      ),
      groupFront(ctx.dominantGroup, locale),
      daeun
        ? loc(
            locale,
            `현재 대운 ${daeun.startAge}~${daeun.endAge}세 ${daeun.ganzhiKorean}(${tenGod(daeun.tenGodKorean, locale)}). 직업 기후: ${fortuneLine(daeun.career, locale)}. 기회: ${fortuneLine(daeun.opportunity, locale)} 주의: ${fortuneLine(daeun.caution, locale)}`,
            `Daeun ${daeun.startAge}–${daeun.endAge} ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}). Oficio: ${fortuneLine(daeun.career, locale)}. Oportunidad: ${fortuneLine(daeun.opportunity, locale)} Cuidado: ${fortuneLine(daeun.caution, locale)}`,
            `Daeun ${daeun.startAge}–${daeun.endAge} ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}). Zawód: ${fortuneLine(daeun.career, locale)}. Szansa: ${fortuneLine(daeun.opportunity, locale)} Uwaga: ${fortuneLine(daeun.caution, locale)}`,
          )
        : "",
      seun
        ? loc(
            locale,
            `${seun.year}년 세운 직업: ${fortuneLine(seun.career, locale)}. ${fortuneLine(seun.summary, locale)}`,
            `Seun ${seun.year} laboral: ${fortuneLine(seun.career, locale)}. ${fortuneLine(seun.summary, locale)}`,
            `Seun ${seun.year} zawodowy: ${fortuneLine(seun.career, locale)}. ${fortuneLine(seun.summary, locale)}`,
          )
        : "",
      ctx.hourLine,
    ]),
    frontBullets: clean([
      ...c.talents.slice(0, 3).map((item) => `${item.title}: ${item.careers.slice(0, 4).join(", ")} / ${item.amplify}`),
      ...c.careerTypes.slice(0, 3).flatMap((item) => item.reasons.slice(0, 1)),
    ]),
    easyHeadline: loc(
      locale,
      `일 잘 되는 모드는 ‘${ctx.careerName(topCareer?.type ?? "")}’에 가까워요.`,
      `Te va el modo “${ctx.careerName(topCareer?.type ?? "")}”.`,
      `Najlepiej wchodzisz w tryb „${ctx.careerName(topCareer?.type ?? "")}”.`,
    ),
    easy: clean([
      loc(
        locale,
        "한 글자로 직업을 못 찍어요. 대신 십성·격국·대운이 가리키는 일하는 리듬은 분명합니다.",
        "No te pongo un oficio de una letra. Sí el ritmo que marcan diez dioses, patrón y daeun.",
        "Nie dam ci zawodu jedną literą. Rytm pracy z gwiazd, wzoru i daeun — tak.",
      ),
      careerWorkEasy(topCareer?.type, locale),
      groupEasy(ctx.dominantGroup, locale),
      loc(
        locale,
        "프로젝트 하나, 마감 하나, 내가 책임지는 덩어리가 있으면 속도가 나요. 모호한 잡무가 늘면 십성의 장점이 안 보입니다.",
        "Un proyecto, un plazo, un bloque tuyo: ahí sale velocidad. Si crece lo vago, no se ve el don de tus dioses.",
        "Jeden projekt, jeden deadline, jeden twój kawałek — wtedy tempo. Jak rośnie mgła, dar gwiazd znika.",
      ),
      c.talents[0]
        ? loc(locale, `재능을 키우려면: ${c.talents[0].amplify} 부작용은 ${c.talents[0].sideEffect}`, `Para amplificar: ${c.talents[0].amplify} Efecto secundario: ${c.talents[0].sideEffect}`, `By wzmocnić: ${c.talents[0].amplify} Skutek uboczny: ${c.talents[0].sideEffect}`)
        : "",
      daeun
        ? loc(locale, `요즘 10년은 ‘${fortuneLine(daeun.career, locale)}’ 쪽이 일이 잘 붙어요. 한꺼번에 이직·이사는 주의(${fortuneLine(daeun.caution, locale)}).`, `Este decenio pega el trabajo en “${fortuneLine(daeun.career, locale)}”. Cuidado con mudar y cambiar de empleo a la vez (${fortuneLine(daeun.caution, locale)}).`, `Ta dekada klei robotę w stronę „${fortuneLine(daeun.career, locale)}”. Uwaga na przeprowadzkę i zmianę pracy naraz (${fortuneLine(daeun.caution, locale)}).`)
        : "",
    ]),
    easyBullets: clean(c.careerTypes.slice(1, 4).map((item) => loc(locale, `차순위 ${ctx.careerName(item.type)} ${item.score}점 — ${item.reasons[0] ?? ""}`, `Siguiente ${ctx.careerName(item.type)} ${item.score} — ${item.reasons[0] ?? ""}`, `Następny ${ctx.careerName(item.type)} ${item.score} — ${item.reasons[0] ?? ""}`))),
  };

  const wealth: ThemeCardData = {
    id: "wealth",
    title: msg(locale, "themeWealth"),
    kicker: styleName,
    front: clean([
      loc(
        locale,
        `현금흐름 1순위는 ${ctx.wealthName(topWealth?.type ?? "")}(${topWealth?.score ?? 0}점)입니다. ${topWealth?.reasons[0] ?? ""} 식상생재는 버는 힘, 정재·인성은 지키는 힘, 겁재·충은 새는 구멍입니다.`,
        `Flujo 1: ${ctx.wealthName(topWealth?.type ?? "")} (${topWealth?.score ?? 0}). ${topWealth?.reasons[0] ?? ""} Expresión→riqueza = ganar; riqueza estable+impronta = guardar; rival+choque = fuga.`,
        `Przepływ 1: ${ctx.wealthName(topWealth?.type ?? "")} (${topWealth?.score ?? 0}). ${topWealth?.reasons[0] ?? ""} Wyraz→majątek = zarabianie; stały majątek+pieczęć = trzymanie; rywal+zderzenie = wyciek.`,
      ),
      loc(
        locale,
        `재성 점수: ${c.wealthTypes.slice(0, 6).map((item) => `${ctx.wealthName(item.type)} ${item.score}`).join(" · ")}. 그룹 합산 ${ctx.groupLine}.`,
        `Ranking: ${c.wealthTypes.slice(0, 6).map((item) => `${ctx.wealthName(item.type)} ${item.score}`).join(" · ")}. Grupos: ${ctx.groupLine}.`,
        `Ranking: ${c.wealthTypes.slice(0, 6).map((item) => `${ctx.wealthName(item.type)} ${item.score}`).join(" · ")}. Grupy: ${ctx.groupLine}.`,
      ),
      loc(
        locale,
        `일간이 극하는 오행(재성)은 ${ctx.elName(ctx.wealthEl)}, 비겁은 ${ctx.elName(day.element)}입니다. 비겁이 재성보다 세면 나눠 쓰거나 공동 지출이 커지고, 재성이 안정되면 저축이 붙습니다.`,
        `El elemento que controlas (riqueza) es ${ctx.elName(ctx.wealthEl)}; los compañeros son ${ctx.elName(day.element)}. Si el compañero gana a la riqueza, crece el gasto compartido.`,
        `Żywioł, który kontrolujesz (majątek), to ${ctx.elName(ctx.wealthEl)}; towarzysze to ${ctx.elName(day.element)}. Gdy towarzysz silniejszy od majątku — wspólne wydatki rosną.`,
      ),
      ctx.hasClash
        ? loc(locale, `원국에 충이 있어 돈의 이동·정산 이슈가 반복될 수 있습니다. ${ctx.relationLine}`, `Hay choque natal: puede repetirse el movimiento de dinero. ${ctx.relationLine}`, `Jest zderzenie w karcie: ruch pieniędzy może się powtarzać. ${ctx.relationLine}`)
        : loc(locale, `원국 충이 크지 않아 현금은 ‘한 방’보다 습관으로 쌓입니다. ${ctx.relationLine}`, `Poco choque natal: el efectivo se acumula por hábito más que por un golpe. ${ctx.relationLine}`, `Mało zderzenia: gotówka zbiera się nawykiem, nie jednym strzałem. ${ctx.relationLine}`),
      daeun
        ? loc(locale, `대운 돈 기후: ${fortuneLine(daeun.money, locale)}. ${fortuneLine(daeun.opportunity, locale)}`, `Clima de dinero del daeun: ${fortuneLine(daeun.money, locale)}. ${fortuneLine(daeun.opportunity, locale)}`, `Klimat pieniędzy daeun: ${fortuneLine(daeun.money, locale)}. ${fortuneLine(daeun.opportunity, locale)}`)
        : "",
      seun
        ? loc(locale, `${seun.year}년 세운 돈: ${fortuneLine(seun.money, locale)}.`, `Dinero del seun ${seun.year}: ${fortuneLine(seun.money, locale)}.`, `Pieniądze seun ${seun.year}: ${fortuneLine(seun.money, locale)}.`)
        : "",
      loc(
        locale,
        "부동산·투자 권유가 아닙니다. 대운에서 재성과 인성이 동시에 올 때 ‘공부 후 실행’이 상대적으로 덜 위험합니다.",
        "No es consejo de inversión. Cuando en el daeun coinciden riqueza e impronta, estudiar y luego actuar es menos peligroso.",
        "To nie rada inwestycyjna. Gdy w daeun zbiegną się majątek i pieczęć, nauka a potem ruch jest względnie mniej ryzykowny.",
      ),
    ]),
    frontBullets: clean(c.wealthTypes.slice(0, 4).flatMap((item) => item.reasons.slice(0, 1).map((reason) => `${ctx.wealthName(item.type)}: ${reason}`))),
    easyHeadline: loc(locale, `돈 감각은 ${styleName}에 가까워요.`, `Tu dinero tira a lo ${styleName}.`, `Twoje pieniądze ciągną ku stylowi ${styleName}.`),
    easy: clean([
      ...wealthEasyByStyle(ctx.style, locale),
      loc(
        locale,
        "월급·모으기·사업 중 뭐가 ‘맞냐’만 보세요. 종목 찍기는 사주 일이 아니에요. 이건 재미로 보는 참고용입니다.",
        "Mira si te va sueldo, ahorro o negocio. El saju no elige acciones. Es entretenimiento de referencia.",
        "Patrz, czy pasuje pensja, odkładanie czy biznes. Saju nie wybiera spółek. To rozrywkowa wskazówka.",
      ),
      groupEasy(ctx.dominantGroup, locale),
      daeun
        ? loc(locale, `요즘 10년 돈 날씨: ${fortuneLine(daeun.money, locale)}. 새는 곳(보증·공동 지출·정산 안 된 투자)부터 막으면 이 구간의 점수가 실제로 남아요.`, `Clima de este decenio: ${fortuneLine(daeun.money, locale)}. Si tapas fugas (aval, gasto conjunto, inversión sin liquidar), el puntaje de este tramo sí queda.`, `Pogoda pieniędzy dekady: ${fortuneLine(daeun.money, locale)}. Jak zatykasz wycieki (poręczenie, wspólny wydatek, inwestycja bez rozliczenia), punkty odcinka naprawdę zostają.`)
        : "",
      c.weaknesses.find((item) => item.type === "재성")
        ? loc(locale, `주의 패턴: ${c.weaknesses.find((item) => item.type === "재성")?.title}. ${c.weaknesses.find((item) => item.type === "재성")?.remedy}`, `Patrón a vigilar: ${c.weaknesses.find((item) => item.type === "재성")?.title}. ${c.weaknesses.find((item) => item.type === "재성")?.remedy}`, `Wzorzec do uwagi: ${c.weaknesses.find((item) => item.type === "재성")?.title}. ${c.weaknesses.find((item) => item.type === "재성")?.remedy}`)
        : loc(locale, "버는 힘과 남는 힘은 다릅니다. 수입이 늘어도 자동 저장이 없으면 이 사주는 잔고가 안 붙어요.", "Ganar y quedar no son lo mismo. Si el ingreso crece sin depósito automático, no se pega el saldo.", "Zarabianie i zostawanie to nie to samo. Jak przychód rośnie bez automatycznego depozytu, saldo nie przylega."),
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
        `배우자궁은 일지 ${p.day.zhiKorean}(${twelveLabel(stage, locale)})입니다. 지장간 ${ctx.hiddenDay}. ${
          c.birth.gender === "male"
            ? "전통적으로 남성은 재성을 배우자성으로 보지만, 이 사이트는 성별 공식만으로 상대를 단정하지 않고 일지·합충·식상·대운을 같이 봅니다."
            : "전통적으로 여성은 관성을 배우자성으로 보지만, 성별 공식만으로 결혼 상대를 확정하지 않습니다."
        }`,
        `Palacio del cónyuge: rama del día ${p.day.zhi} (${twelveLabel(stage, locale)}). Tallos ocultos: ${ctx.hiddenDay}. No fijamos pareja solo por sexo; se leen rama del día, uniones/choques, expresión y daeun.`,
        `Pałac współmałżonka: gałąź dnia ${p.day.zhi} (${twelveLabel(stage, locale)}). Ukryte pnie: ${ctx.hiddenDay}. Nie ustalamy partnera samą płcią; czytamy gałąź dnia, połączenia/zderzenia, wyraz i daeun.`,
      ),
      twelveFront(stage, locale),
      loveStyle(ctx.dominantGroup, locale),
      loc(
        locale,
        `연애 채널 십성: 식상 ${ctx.groups.식상.toFixed(1)}(표현) · 인성 ${ctx.groups.인성.toFixed(1)}(관찰) · 관성 ${ctx.groups.관성.toFixed(1)}(조건) · 재성 ${ctx.groups.재성.toFixed(1)}(생활) · 비겁 ${ctx.groups.비겁.toFixed(1)}(독립). 우세 그룹은 ${groupLabel(ctx.dominantGroup, locale)}입니다.`,
        `Canales: expresión ${ctx.groups.식상.toFixed(1)} · observación ${ctx.groups.인성.toFixed(1)} · condición ${ctx.groups.관성.toFixed(1)} · vida ${ctx.groups.재성.toFixed(1)} · independencia ${ctx.groups.비겁.toFixed(1)}. Grupo alto: ${groupLabel(ctx.dominantGroup, locale)}.`,
        `Kanały: wyraz ${ctx.groups.식상.toFixed(1)} · obserwacja ${ctx.groups.인성.toFixed(1)} · warunek ${ctx.groups.관성.toFixed(1)} · życie ${ctx.groups.재성.toFixed(1)} · niezależność ${ctx.groups.비겁.toFixed(1)}. Grupa górna: ${groupLabel(ctx.dominantGroup, locale)}.`,
      ),
      ctx.hasWonjin || ctx.hasHarm
        ? loc(locale, `원진·해·파가 있어 끌리면서도 불편한 패턴, 오해, 느슨해짐이 관계에 섞일 수 있습니다. ${ctx.relationLine}`, `Hay yuanjin/daño/quiebre: atracción incómoda, malentendido o aflojamiento. ${ctx.relationLine}`, `Jest wonjin/szkoda/pęknięcie: przyciąganie niewygodne, nieporozumienie lub poluzowanie. ${ctx.relationLine}`)
        : loc(locale, `합충 메모: ${ctx.relationLine}. 합은 묶임, 충은 사건화로 읽되 반드시 이별은 아닙니다.`, `Uniones/choques: ${ctx.relationLine}. Unión ata; choque eventúa, no es ruptura fija.`, `Połączenia/zderzenia: ${ctx.relationLine}. Połączenie wiąże; zderzenie robi zdarzenie, nie wyrok rozstania.`),
      ...sinsalNotes(ctx.sinsalNames.filter((name) => ["도화", "화개", "역마", "괴강살"].includes(name)), locale, 2),
      daeun
        ? loc(locale, `현재 대운 관계: ${fortuneLine(daeun.love, locale)} / ${fortuneLine(daeun.relationship, locale)}.`, `Daeun relacional: ${fortuneLine(daeun.love, locale)} / ${fortuneLine(daeun.relationship, locale)}.`, `Daeun relacji: ${fortuneLine(daeun.love, locale)} / ${fortuneLine(daeun.relationship, locale)}.`)
        : "",
      seun
        ? loc(locale, `${seun.year}년 세운 연애: ${fortuneLine(seun.love, locale)}.`, `Amor del seun ${seun.year}: ${fortuneLine(seun.love, locale)}.`, `Miłość seun ${seun.year}: ${fortuneLine(seun.love, locale)}.`)
        : "",
      c.guimun.present
        ? loc(locale, `귀문이 있어 직관은 빠르지만 확인 없이 스토리를 완성할 수 있습니다. ${c.guimun.disclaimer}`, `Hay guimun: la intuición es rápida, pero puede completar una historia sin comprobar. ${c.guimun.disclaimer}`, `Jest gwimun: intuicja szybka, ale może domknąć historię bez sprawdzenia. ${c.guimun.disclaimer}`)
        : "",
    ]),
    frontBullets: clean(c.relations.slice(0, 4).map((item) => `${item.typeKorean}: ${item.description}`)),
    easyHeadline: loc(
      locale,
      "사랑은 분위기부터 읽고, 말로 밀어붙이면 오히려 어색해져요.",
      "En el amor lees el ambiente; si empujas con palabras, se pone raro.",
      "W miłości najpierw czytasz nastrój; pchanie słowami robi się dziwnie.",
    ),
    easy: clean([
      twelveEasy(stage, locale),
      loveStyle(ctx.dominantGroup, locale),
      loc(
        locale,
        "좋아하는 티는 작게, 약속은 분명하게. 그게 이 사주의 연애 매너예요. 침묵을 거절로 단정하지 마세요.",
        "El gusto, en bajo; la cita, clara. Ese es tu modo. No tomes el silencio por un no fijo.",
        "Sympatia — cicho. Umowa — jasno. Taki masz tryb. Nie bierz milczenia za stałe „nie”.",
      ),
      loc(
        locale,
        ctx.hasClash
          ? "변동이 있는 사주라 관계를 ‘리셋’으로 풀고 싶어질 수 있어요. 큰 결정은 대운 단위로, 올해 충에는 유지를 기본값으로 두세요."
          : "급하게 확정하려고 하면 상대가 숨어요. 세 번의 만남 뒤에 한 줄을 정하는 속도가 맞습니다.",
        ctx.hasClash
          ? "Con choque, apetece resetear la relación. Las decisiones grandes, a escala de daeun; este año, mantener por defecto."
          : "Si cierras demasiado pronto, el otro se esconde. El ritmo sano es una línea clara tras tres encuentros.",
        ctx.hasClash
          ? "Przy zderzeniu chce się resetować relację. Wielkie decyzje w skali daeun; w tym roku domyślnie utrzymuj."
          : "Jak za szybko zamykasz, druga strona się chowa. Zdrowy rytm to jedna linijka po trzech spotkaniach.",
      ),
      seun
        ? loc(locale, `${seun.year}년 연애 날씨: ${fortuneLine(seun.love, locale)}. 직업·돈·연애를 동시에 갈아엎지 마세요.`, `Clima amoroso ${seun.year}: ${fortuneLine(seun.love, locale)}. No vuelques trabajo, dinero y amor a la vez.`, `Klimat miłości ${seun.year}: ${fortuneLine(seun.love, locale)}. Nie wywracaj naraz pracy, pieniędzy i miłości.`)
        : "",
    ]),
    easyBullets: [],
  };

  const match: ThemeCardData = {
    id: "match",
    title: msg(locale, "themeMatch"),
    kicker: loc(locale, `${ctx.elName(ctx.support)}생 ${ctx.elName(day.element)}`, `${ctx.elName(ctx.support)} → ${ctx.elName(day.element)}`, `${ctx.elName(ctx.support)} → ${ctx.elName(day.element)}`),
    front: clean([
      loc(
        locale,
        `생극으로 읽으면 나를 생하는 오행은 ${ctx.elName(ctx.support)}(인성), 같은 오행은 ${ctx.elName(day.element)}(비겁), 나를 극하는 오행은 ${ctx.elName(ctx.pressure)}(관성), 내가 생하는 쪽은 ${ctx.elName(ctx.output)}(식상), 내가 극하는 쪽은 ${ctx.elName(ctx.wealthEl)}(재성)입니다.`,
        `Me genera ${ctx.elName(ctx.support)} (impronta). Mismo elemento: ${ctx.elName(day.element)}. Me controla ${ctx.elName(ctx.pressure)} (autoridad). Yo genero ${ctx.elName(ctx.output)} y controlo ${ctx.elName(ctx.wealthEl)}.`,
        `Rodzi mnie ${ctx.elName(ctx.support)} (pieczęć). Ten sam żywioł: ${ctx.elName(day.element)}. Kontroluje mnie ${ctx.elName(ctx.pressure)} (autorytet). Ja rodzę ${ctx.elName(ctx.output)} i kontroluję ${ctx.elName(ctx.wealthEl)}.`,
      ),
      loc(
        locale,
        `신강 판정이 ${ctx.strengthLabel}(${c.strength.score}점)이라 ${
          c.strength.score >= 55
            ? "같은 오행(비겁) 과잉은 고집이 충돌하기 쉽고, 인성·식상이 조율자가 됩니다."
            : "인성·비겁처럼 나를 생조하는 사람이 오래 가고, 관성·재성이 한꺼번에 밀면 쉽게 지칩니다."
        }`,
        c.strength.score >= 55
          ? `Con fuerza ${ctx.strengthLabel}, el exceso de compañero choca; impronta y expresión afinan.`
          : `Con fuerza ${ctx.strengthLabel}, quien te genera dura; autoridad y riqueza juntas te agotan.`,
        c.strength.score >= 55
          ? `Przy sile ${ctx.strengthLabel} nadmiar towarzysza zderza się; pieczęć i wyraz stroją.`
          : `Przy sile ${ctx.strengthLabel} kto cię rodzi — zostaje; autorytet i majątek naraz cię męczą.`,
      ),
      loc(
        locale,
        `합이 있으면 끌리고 묶이며, 충이 있으면 리듬이 어긋나고, 원진은 끌리면서 불편합니다. 현재 원국: ${ctx.relationLine}.`,
        `La unión atrae y ata; el choque desajusta el ritmo; el yuanjin atrae con incomodidad. Natal: ${ctx.relationLine}.`,
        `Połączenie przyciąga i wiąże; zderzenie psuje rytm; wonjin przyciąga z niewygodą. Karta: ${ctx.relationLine}.`,
      ),
      loc(
        locale,
        `일간은 ${yinYang}이라 ${day.yinYang === "yang" ? "먼저 방향을 정하는 사람" : "분위기와 결을 읽는 사람"}과 짝을 이룰 때 마찰이 적습니다. 음양 대립 자체가 나쁜 것은 아니고, 속도 합의가 핵심입니다.`,
        `Tu tronco es ${yinYang}: encaja con quien ${day.yinYang === "yang" ? "fija rumbo" : "lee el tono"}, si acuerdan el ritmo. El contraste yin-yang no es malo en sí.`,
        `Twój pień to ${yinYang}: pasuje do kogoś, kto ${day.yinYang === "yang" ? "bierze kurs" : "czyta ton"}, gdy ustalicie tempo. Sam kontrast yin-yang nie jest zły.`,
      ),
      ...sinsalNotes(ctx.sinsalNames.filter((name) => ["도화", "원진", "괴강살", "화개"].includes(name)), locale, 2),
      daeun ? loc(locale, `이 10년 관계 키워드: ${fortuneLine(daeun.relationship, locale)}.`, `Clave de este decenio: ${fortuneLine(daeun.relationship, locale)}.`, `Klucz tej dekady: ${fortuneLine(daeun.relationship, locale)}.`) : "",
    ]),
    frontBullets: clean(c.relations.slice(0, 4).map((item) => `${item.typeKorean} ${item.items.join(" ")}: ${item.description}`)),
    easyHeadline: loc(
      locale,
      `편해요: ${ctx.elName(ctx.support)}·${ctx.elName(day.element)} 느낌의 사람. 부담: ${ctx.elName(ctx.pressure)}처럼 세게 누르는 사람.`,
      `Cómodo: gente ${ctx.elName(ctx.support)}/${ctx.elName(day.element)}. Cuidado: quien aprieta como ${ctx.elName(ctx.pressure)}.`,
      `Wygodnie: ludzie ${ctx.elName(ctx.support)}/${ctx.elName(day.element)}. Uwaga: kto uciska jak ${ctx.elName(ctx.pressure)}.`,
    ),
    easy: clean([
      loc(
        locale,
        "받아주고, 속도 맞춰 주고, 혼자 결정하라고 안 재촉하는 사람이 오래 가요. 나를 가르쳐야 직성이 풀리는 사람은 초반엔 든든해도 금방 무겁습니다.",
        "Quien te recibe, adapta el ritmo y no te empuja a decidir solo, dura. Quien necesita enseñarte pesa pronto, aunque al inicio sostenga.",
        "Kto cię przyjmuje, dopasowuje tempo i nie pcha do decyzji w pojedynkę — zostaje. Kto musi cię uczyć, szybko ciąży, nawet jeśli na starcie podpiera.",
      ),
      loc(
        locale,
        "내 말을 자르거나, 정답만 던지거나, 자존심 싸움으로 가는 사람은 초반엔 짜릿해도 금방 지쳐요. 합은 편안함, 충은 사건입니다.",
        "Quien te corta, suelta ‘la verdad’ o pelea el orgullo: al inicio pica, luego cansa. Unión = confort; choque = suceso.",
        "Kto ci przerywa, rzuca „prawdę” albo idzie w honory: na starcie iskrzy, potem męczy. Połączenie = wygoda; zderzenie = zdarzenie.",
      ),
      groupEasy(ctx.dominantGroup, locale),
      loc(
        locale,
        `잘 맞는 사람의 오행 힌트는 ${ctx.elName(ctx.support)}(든든히 밀어 주는)와 ${ctx.elName(ctx.output)}(같이 만들고 노는)입니다. ${ctx.elName(ctx.wealthEl)} 느낌은 설레지만 실무·돈 갈등이 따라올 수 있어요.`,
        `Pista elemental: ${ctx.elName(ctx.support)} (te empuja con amparo) y ${ctx.elName(ctx.output)} (crean y juegan). ${ctx.elName(ctx.wealthEl)} ilusiona, pero puede traer roce de dinero y faena.`,
        `Wskazówka żywiołu: ${ctx.elName(ctx.support)} (pcha z osłoną) i ${ctx.elName(ctx.output)} (tworzą i bawią się). ${ctx.elName(ctx.wealthEl)} kręci, ale może nieść tarcie o pieniądze i robotę.`,
      ),
    ]),
    easyBullets: [],
  };

  const relations: ThemeCardData = {
    id: "relations",
    title: msg(locale, "themeRelations"),
    kicker: loc(locale, "년주·월주", "Año · mes", "Rok · miesiąc"),
    front: clean([
      palaceLine(ctx),
      loc(
        locale,
        `월지 십성 ${tenGod(p.month.zhiTenGodKorean, locale)}이 조직에서 보이는 태도이고, 년주 ${tenGod(p.year.ganTenGodKorean, locale)}/${tenGod(p.year.zhiTenGodKorean, locale)}는 초년 친구·집안 공기의 뼈대입니다.`,
        `Diez dioses del mes ${tenGod(p.month.zhiTenGodKorean, locale)} = actitud en la organización. Año ${tenGod(p.year.ganTenGodKorean, locale)}/${tenGod(p.year.zhiTenGodKorean, locale)} = aire de amigos y casa al inicio.`,
        `Gwiazda miesiąca ${tenGod(p.month.zhiTenGodKorean, locale)} = postawa w organizacji. Rok ${tenGod(p.year.ganTenGodKorean, locale)}/${tenGod(p.year.zhiTenGodKorean, locale)} = powietrze przyjaciół i domu na starcie.`,
      ),
      ctx.hourLine,
      c.relations.length
        ? loc(locale, `원국 합충: ${ctx.relationLine}. 가족·직장에서도 이 패턴(묶임/충돌/오해)이 반복될 수 있습니다.`, `Uniones/choques: ${ctx.relationLine}. El patrón (atar/chocar/malentender) puede repetirse en casa y trabajo.`, `Połączenia/zderzenia: ${ctx.relationLine}. Wzorzec (wiązanie/zderzenie/nieporozumienie) może wracać w domu i pracy.`)
        : loc(locale, "원국 합충이 두드러지지 않아 관계 기복은 대운·세운에서 더 잘 보입니다.", "Pocos choques natales: las relaciones se mueven más en daeun/seun.", "Mało zderzeń w karcie: relacje ruszają się bardziej w daeun/seun."),
      gwiinLine,
      groupFront(ctx.dominantGroup, locale),
      daeun ? loc(locale, `대운 관계: ${fortuneLine(daeun.relationship, locale)}.`, `Relación del daeun: ${fortuneLine(daeun.relationship, locale)}.`, `Relacja daeun: ${fortuneLine(daeun.relationship, locale)}.`) : "",
    ]),
    frontBullets: clean(c.relations.slice(0, 4).map((item) => `${item.typeKorean}: ${item.description}`)),
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
      groupEasy(ctx.dominantGroup, locale),
      loc(
        locale,
        "가족은 년·월이 만든 공기라, 고치려 하기보다 ‘나는 이 패턴을 반복하지 않겠다’가 실전입니다. 시주가 있으면 말년·자녀 층도 같이 보세요.",
        "La familia es el aire de año y mes: más que arreglarla, la práctica es no repetir el patrón. Si hay hora, mira también vejez e hijos.",
        "Rodzina to powietrze roku i miesiąca: raczej nie powtarzać wzorca, niż ją naprawiać. Gdy jest godzina, zobacz też późne lata i dzieci.",
      ),
      ctx.gwiinNames.length
        ? loc(locale, `조력 힌트: ${ctx.gwiinNames.join("·")}이 있어, 어려울 때 사람 구멍을 닫지 마세요.`, `Amparo: ${ctx.gwiinNames.join("·")}. En apuro, no cierres el hueco de la gente.`, `Wsparcie: ${ctx.gwiinNames.join("·")}. W tarapatach nie zamykaj luki na ludzi.`)
        : loc(locale, "조력은 원국 귀인보다 대운에서 더 잘 열립니다. 도움을 요청하는 연습을 루틴으로 두세요.", "El amparo se abre más en el daeun que en estrellas natales. Haz rutina de pedir ayuda.", "Wsparcie otwiera się bardziej w daeun niż w gwiazdach karty. Zrób rutynę proszenia o pomoc."),
    ]),
    easyBullets: sinsalNotes([...ctx.gwiinNames, ...ctx.sinsalNames], locale, 2),
  };

  const colors: ThemeCardData = {
    id: "colors",
    title: msg(locale, "themeColors"),
    kicker: loc(locale, `용신 ${ctx.yong}`, `Yongsin ${ctx.yong}`, `Yongsin ${ctx.yong}`),
    front: clean([
      yongsinLine(ctx),
      loc(
        locale,
        "색은 오방색(목 청·화 적·토 황·금 백·수 흑)으로 용신을 보완하는 상징입니다. 기신 색은 ‘불운색’이 아니라 과잉일 때 피곤한 색입니다.",
        "El color complementa el yongsin con obangsaek (madera verde, fuego rojo, tierra amarillo, metal blanco, agua negro). El gisin no es ‘color de mala suerte’: cansa en exceso.",
        "Kolor uzupełnia yongsin w obangsaek (drewno zieleń, ogień czerwień, ziemia żółć, metal biel, woda czerń). Gisin to nie „kolor pecha” — męczy w nadmiarze.",
      ),
      ...ctx.yongsinKeys.map((key) => colorMeaning(key, locale)),
      ...ctx.gisinKeys.slice(0, 1).map((key) =>
        loc(
          locale,
          `기신 ${ctx.elName(key)} 계열은 눈앞에 너무 넓게 깔지 않습니다. 발표·결단이 필요할 때만 소량으로 쓰는 편이 맞습니다.`,
          `El gisin ${ctx.elName(key)} no debe saturar el campo visual. Úsalo en dosis cuando hace falta presentar o cortar.`,
          `Gisin ${ctx.elName(key)} nie powinien zalewać pola widzenia. Dawka tylko, gdy trzeba wystąpić albo uciąć.`,
        ),
      ),
      loc(
        locale,
        `희신 ${ctx.hee}은 용신을 돕는 보조색, 구신 ${ctx.gu}은 약하게 섞이면 약이 되는 색입니다. 옷깃·노트·잠자리처럼 매일 닿는 면에 먼저 두십시오.`,
        `Heesin ${ctx.hee} es color auxiliar; gusin ${ctx.gu} es útil en mezcla débil. Ponlo primero en cuello, libreta, cama.`,
        `Heesin ${ctx.hee} to kolor pomocniczy; gusin ${ctx.gu} pomaga w słabej mieszance. Najpierw kołnierz, notes, łóżko.`,
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
      loc(
        locale,
        "매일 입는 것부터 바꾸세요. 점퍼 안감, 폰 케이스, 머그잔 하나면 충분합니다. 방을 통째로 칠할 필요는 없어요.",
        "Empieza por lo de cada día: forro, funda, una taza. No hace falta pintar toda la sala.",
        "Zacznij od codzienności: podszewka, etui, jeden kubek. Nie trzeba malować całego pokoju.",
      ),
      ...ctx.yongsinKeys.slice(0, 2).map((key) => colorMeaning(key, locale)),
      loc(
        locale,
        "중요한 날에는 용신 색을 포인트로, 쉬는 날에는 기신 색을 줄이세요. 색은 운을 강제하지 않고 리듬만 돕습니다.",
        "En un día clave, un acento de yongsin; en descanso, menos gisin. El color no fuerza la suerte: solo ayuda al ritmo.",
        "W dniu ważnym akcent yongsin; w odpoczynku mniej gisin. Kolor nie wymusza szczęścia — tylko pomaga rytmowi.",
      ),
    ]),
    easyBullets: [],
    luckyColors: lucky,
    avoidColors: avoid,
  };

  const fengshui: ThemeCardData = {
    id: "fengshui",
    title: msg(locale, "themeFengshui"),
    kicker: loc(locale, `용신 ${ctx.yong}`, `Yongsin ${ctx.yong}`, `Yongsin ${ctx.yong}`),
    front: clean([
      loc(
        locale,
        `풍수는 용신 오행을 공간에 배치하는 일로 봅니다. 목은 동, 화는 남, 토는 중앙·남서, 금은 서, 수는 북입니다. 이 사주의 우선 오행은 ${ctx.yong}입니다.`,
        `El feng shui aquí coloca el yongsin. Madera este, fuego sur, tierra centro/SO, metal oeste, agua norte. Tu prioridad es ${ctx.yong}.`,
        `Feng shui tutaj stawia yongsin. Drewno wschód, ogień południe, ziemia środek/SW, metal zachód, woda północ. Twój priorytet to ${ctx.yong}.`,
      ),
      ...(ctx.yongsinKeys.length ? ctx.yongsinKeys : [day.element]).map((key) => fengFront(key, locale)),
      loc(
        locale,
        "책상·침대 머리·출입구가 용신 방향을 막지 않게 합니다. 현관이 막히면 인성(도움)이 들어오기 어렵고, 침대 머리가 기신 과잉이면 수면이 얕아집니다.",
        "Que mesa, cabecero y puerta no tapen el yongsin. Entrada tapada = difícil que entre amparo. Cabecero saturado de gisin = sueño fino.",
        "Biurko, wezgłowie i drzwi niech nie zasłaniają yongsin. Zatkane wejście = trudniej wejść wsparciu. Wezgłowie zalane gisin = płytki sen.",
      ),
      loc(
        locale,
        `기신 ${ctx.gi} 방향에는 큰 거울·강한 조명·날카로운 더미를 두지 마십시오. 없애기보다 ‘한 단계 낮추는 것’이 풍수입니다.`,
        `En la dirección gisin ${ctx.gi}, nada de espejo grande, luz dura ni pila de filos. Feng shui es bajar un peldaño, no borrar.`,
        `W kierunku gisin ${ctx.gi} bez wielkiego lustra, ostrego światła i stosu ostrzy. Feng shui to zejście o szczebel, nie wymazanie.`,
      ),
      powerLine(ctx),
    ]),
    frontBullets: (ctx.yongsinKeys.length ? ctx.yongsinKeys : [day.element]).map((element) => fengFront(element, locale)),
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
        "너무 많은 거울, 너무 밝은 조명, 너무 막힌 구석이 있으면 먼저 그것부터 빼세요. 비운 자리가 곧 용신이 들어오는 길입니다.",
        "Si hay demasiados espejos, luz dura o un rincón tapado, quita eso primero. El hueco es el camino del yongsin.",
        "Za dużo luster, ostrego światła albo zatkany kąt — to zdejmij najpierw. Pusta dziura to droga yongsin.",
      ),
      ...(ctx.yongsinKeys.length ? ctx.yongsinKeys : [day.element]).slice(0, 2).map((key) => fengFront(key, locale)),
      loc(
        locale,
        "침대는 ‘쉬는 자리’라 기신 색·금속 과잉을 피하고, 책상은 ‘쓰는 자리’라 용신 소품을 가까이 두세요. 현관은 신발을 줄이는 것만으로도 공기가 바뀝니다.",
        "La cama es descanso: menos gisin y metal de más. El escritorio es uso: acerca el objeto yongsin. En la entrada, menos zapatos ya cambia el aire.",
        "Łóżko to odpoczynek: mniej gisin i nadmiaru metalu. Biurko to użytek: zbliż przedmiot yongsin. W wejściu samo mniej butów zmienia powietrze.",
      ),
    ]),
    easyBullets: [],
  };

  const health: ThemeCardData = {
    id: "health",
    title: msg(locale, "themeHealth"),
    kicker: ELEMENT_NAME[locale][day.element],
    front: clean([
      loc(locale, "사주는 의학적 진단이 아닙니다. 오행-장부의 상징적 대응과 조후(계절)만 적습니다. 증상은 의료 전문가와 보십시오.", "El saju no es diagnóstico. Solo hay correspondencia simbólica y el mes. Los síntomas, con un profesional.", "Saju nie jest diagnozą. Tylko symboliczne powiązanie i miesiąc. Objawy — ze specjalistą."),
      loc(
        locale,
        `일간 ${day.elementKorean} · 월령 ${c.season.monthOrderKorean}(${c.season.currentJieqiKorean}). 강한 오행 ${ctx.strong.map((key) => ctx.elName(key)).join("·")}, 약한 오행 ${ctx.weak.map((key) => ctx.elName(key)).join("·")}.`,
        `Tronco ${ctx.elName(day.element)} · mes ${c.season.monthOrderKorean} (${c.season.currentJieqiKorean}). Fuertes: ${ctx.strong.map((key) => ctx.elName(key)).join(", ")}. Débiles: ${ctx.weak.map((key) => ctx.elName(key)).join(", ")}.`,
        `Pień ${ctx.elName(day.element)} · miesiąc ${c.season.monthOrderKorean} (${c.season.currentJieqiKorean}). Silne: ${ctx.strong.map((key) => ctx.elName(key)).join(", ")}. Słabe: ${ctx.weak.map((key) => ctx.elName(key)).join(", ")}.`,
      ),
      powerLine(ctx),
      ...healthLong(day.element, locale),
      ...ctx.strong.slice(0, 1).flatMap((key) => (key === day.element ? [] : healthLong(key, locale).slice(0, 1))),
      ...sinsalNotes(ctx.sinsalNames.filter((name) => name === "백호대살" || name === "괴강살"), locale, 1),
      daeun ? loc(locale, `대운 건강 메모: ${fortuneLine(daeun.health, locale)}.`, `Nota de salud del daeun: ${fortuneLine(daeun.health, locale)}.`, `Notatka zdrowia daeun: ${fortuneLine(daeun.health, locale)}.`) : "",
    ]),
    frontBullets: clean(c.weaknesses.slice(0, 4).map((item) => `${item.title} — ${item.remedy}`)),
    easyHeadline: loc(locale, "몸이 먼저 보내는 신호는 ‘잠’이랑 ‘긴장’이에요.", "El cuerpo avisa primero con sueño y tensión.", "Ciało najpierw daje znać snem i napięciem."),
    easy: clean([
      loc(
        locale,
        "크게 아프다는 뜻이 아니에요. 과한 오행은 줄이고, 약한 오행은 생활로 보완하면 돼요.",
        "No dice que te vas a enfermar. Baja lo que sobra y refuerza lo flojo en el día a día.",
        "To nie znaczy, że zachorujesz. Ujmij to, czego za dużo, i wspieraj to, co słabe, na co dzień.",
      ),
      strengthEasy(c.strength.classification, locale),
      healthLong(day.element, locale)[2] ?? healthLong(day.element, locale)[0],
      loc(
        locale,
        `강한 ${ctx.strong.map((key) => ctx.elName(key)).join("·")}은 ‘너무 켜 두지 않기’, 약한 ${ctx.weak.map((key) => ctx.elName(key)).join("·")}은 ‘생활로 한 줌 보태기’가 숙제예요.`,
        `Lo fuerte (${ctx.strong.map((key) => ctx.elName(key)).join(", ")}) no lo dejes siempre encendido. Lo flojo (${ctx.weak.map((key) => ctx.elName(key)).join(", ")}) se añade en el día.`,
        `Silne (${ctx.strong.map((key) => ctx.elName(key)).join(", ")}) nie trzymaj zawsze włączone. Słabe (${ctx.weak.map((key) => ctx.elName(key)).join(", ")}) dokładaj w dniu.`,
      ),
      daeun ? loc(locale, `요즘 구간 메모: ${fortuneLine(daeun.health, locale)}. 수면 시각을 고정하는 것만으로도 용신을 돕는 일입니다.`, `Nota de ahora: ${fortuneLine(daeun.health, locale)}. Fijar la hora de dormir ya ayuda al yongsin.`, `Notatka na teraz: ${fortuneLine(daeun.health, locale)}. Stała pora snu już pomaga yongsin.`) : "",
    ]),
    easyBullets: clean(c.weaknesses.slice(0, 3).map((item) => `${item.realLife[0] ?? item.title} → ${item.remedy}`)),
  };

  const yearCard: ThemeCardData = {
    id: "year",
    title: msg(locale, "themeYear"),
    kicker: seun ? `${seun.year}` : `${ctx.year}`,
    front: clean([
      seun
        ? loc(
            locale,
            `${seun.year}년 세운 ${seun.ganzhiKorean}(${seun.ganzhi}) · ${tenGod(seun.tenGodKorean, locale)} · ${ctx.elName(seun.element)}. ${fortuneLine(seun.summary, locale)} 별점 ${seun.stars}/5는 상대 평가입니다. 원국이 뼈대, 대운이 기후, 세운이 날씨입니다.`,
            `Seun ${seun.year}: ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)} · ${ctx.elName(seun.element)}. ${fortuneLine(seun.summary, locale)} Estrellas ${seun.stars}/5 (relativo). Natal = hueso, daeun = clima, seun = tiempo.`,
            `Seun ${seun.year}: ${seun.ganzhi} · ${tenGod(seun.tenGodKorean, locale)} · ${ctx.elName(seun.element)}. ${fortuneLine(seun.summary, locale)} Gwiazdki ${seun.stars}/5 (względnie). Karta = kość, daeun = klimat, seun = pogoda.`,
          )
        : loc(locale, `${ctx.year}년 세운을 계산했습니다.`, `Seun de ${ctx.year} calculado.`, `Seun ${ctx.year} policzony.`),
      seun
        ? loc(
            locale,
            `올해 직업 ${fortuneLine(seun.career, locale)} / 돈 ${fortuneLine(seun.money, locale)} / 연애 ${fortuneLine(seun.love, locale)}. 원국과 ${seun.relationsWithNatal.length ? seun.relationsWithNatal.join(", ") : "충 없음"}${seun.relationsWithDaeun.length ? `, 대운과 ${seun.relationsWithDaeun.join(", ")}` : ""}.`,
            `Trabajo ${fortuneLine(seun.career, locale)} / dinero ${fortuneLine(seun.money, locale)} / amor ${fortuneLine(seun.love, locale)}. Con natal: ${seun.relationsWithNatal.join(", ") || "sin choque"}.`,
            `Praca ${fortuneLine(seun.career, locale)} / pieniądze ${fortuneLine(seun.money, locale)} / miłość ${fortuneLine(seun.love, locale)}. Z kartą: ${seun.relationsWithNatal.join(", ") || "bez zderzenia"}.`,
          )
        : "",
      daeun
        ? loc(
            locale,
            `올해를 덮는 대운 ${daeun.startAge}~${daeun.endAge}세 ${daeun.ganzhiKorean}(${tenGod(daeun.tenGodKorean, locale)}, 별 ${daeun.stars}). 기회: ${fortuneLine(daeun.opportunity, locale)} 주의: ${fortuneLine(daeun.caution, locale)}`,
            `Daeun que cubre el año: ${daeun.startAge}–${daeun.endAge} ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}, ${daeun.stars}★). ${fortuneLine(daeun.opportunity, locale)} ${fortuneLine(daeun.caution, locale)}`,
            `Daeun nakrywający rok: ${daeun.startAge}–${daeun.endAge} ${daeun.ganzhi} (${tenGod(daeun.tenGodKorean, locale)}, ${daeun.stars}★). ${fortuneLine(daeun.opportunity, locale)} ${fortuneLine(daeun.caution, locale)}`,
          )
        : "",
      loc(
        locale,
        `앞 3년: ${ctx.nearSeun.map((item) => `${item.year} ${item.ganzhiKorean} ${tenGod(item.tenGodKorean, locale)}(${item.stars}★)`).join(" · ")}. 한 해 길흉으로 평생을 단정하지 않습니다.`,
        `Próximos 3 años: ${ctx.nearSeun.map((item) => `${item.year} ${item.ganzhi} ${tenGod(item.tenGodKorean, locale)}(${item.stars}★)`).join(" · ")}. Un año no fija la vida.`,
        `Najbliższe 3 lata: ${ctx.nearSeun.map((item) => `${item.year} ${item.ganzhi} ${tenGod(item.tenGodKorean, locale)}(${item.stars}★)`).join(" · ")}. Jeden rok nie ustala życia.`,
      ),
      yongsinLine(ctx),
      seun?.sinsalChanges.length
        ? loc(locale, `올해 신살/충 변화: ${seun.sinsalChanges.join(", ")}.`, `Cambios de este año: ${seun.sinsalChanges.join(", ")}.`, `Zmiany roku: ${seun.sinsalChanges.join(", ")}.`)
        : loc(locale, "올해는 원국 신살이 세운에서 특별히 크게 켜지지 않습니다. 기후(대운)를 기준으로 한 가지만 움직이십시오.", "Este año no enciende de más un sinsal natal. Mueve solo una cosa según el clima del daeun.", "W tym roku sinsal karty nie włącza się mocno. Rusz jedną rzecz według klimatu daeun."),
    ]),
    frontBullets: clean([...(seun?.relationsWithNatal ?? []), ...(seun?.relationsWithDaeun ?? []), ...(ctx.nearSeun.slice(1, 3).map((item) => `${item.year}: ${fortuneLine(item.summary, locale)}`))]),
    easyHeadline: loc(
      locale,
      seun?.relationsWithNatal.length ? "올해는 판이 움직이는 해예요. 한 번에 결정하지 마세요." : "올해는 판을 키우기보다, 있는 판을 다지는 해에 가까워요.",
      seun?.relationsWithNatal.length ? "Este año mueve el tablero. No decidas todo a la vez." : "Este año, más que agrandar, asienta lo que ya tienes.",
      seun?.relationsWithNatal.length ? "Ten rok rusza planszę. Nie decyduj wszystkiego naraz." : "Ten rok raczej utrwala planszę, niż ją powiększa.",
    ),
    easy: clean([
      loc(
        locale,
        "직업·돈·연애를 동시에 갈아엎지 마세요. 하나만 움직이고, 나머지는 유지가 이득이에요. 원국은 안 바뀌고, 바뀌는 것은 날씨입니다.",
        "No vuelques trabajo, dinero y amor a la vez. Mueve uno; el resto, mantenerlo. El natal no cambia: cambia el tiempo.",
        "Nie wywracaj naraz pracy, pieniędzy i miłości. Rusz jedno; resztę trzymaj. Karta się nie zmienia — zmienia się pogoda.",
      ),
      seun
        ? loc(locale, `올해 한 줄: 일 ${fortuneLine(seun.career, locale)} / 돈 ${fortuneLine(seun.money, locale)} / 마음 ${fortuneLine(seun.love, locale)}.`, `Este año: trabajo ${fortuneLine(seun.career, locale)} / dinero ${fortuneLine(seun.money, locale)} / corazón ${fortuneLine(seun.love, locale)}.`, `W tym roku: praca ${fortuneLine(seun.career, locale)} / pieniądze ${fortuneLine(seun.money, locale)} / serce ${fortuneLine(seun.love, locale)}.`)
        : "",
      daeun
        ? loc(locale, `10년 기후를 잊지 마세요. 올해는 그 기후 위의 날씨일 뿐이에요. 기회: ${fortuneLine(daeun.opportunity, locale)}`, `No olvides el clima de 10 años. Este año es solo el tiempo encima. Oportunidad: ${fortuneLine(daeun.opportunity, locale)}`, `Nie zapomnij klimatu 10 lat. Ten rok to tylko pogoda na nim. Szansa: ${fortuneLine(daeun.opportunity, locale)}`)
        : "",
      loc(
        locale,
        ctx.hasClash
          ? "충이 있는 해에는 이사·이직·관계 정리를 한 번에 하지 마세요. 한 가지를 고르면 나머지가 따라옵니다."
          : "큰 변동이 없는 해에는 자격·저장·관계의 질을 한 단계 올리는 쪽이 점수입니다.",
        ctx.hasClash
          ? "En año de choque, no mudes, cambies de empleo y cortes el vínculo a la vez. Elige una cosa y el resto sigue."
          : "En un año sin gran choque, el puntaje está en subir un peldaño título, ahorro y calidad del vínculo.",
        ctx.hasClash
          ? "W roku zderzenia nie rób naraz przeprowadzki, zmiany pracy i cięcia relacji. Wybierz jedno — reszta dojdzie."
          : "W roku bez wielkiego zderzenia punkty są za podniesienie o szczebel kwalifikacji, oszczędności i jakości więzi.",
      ),
      ctx.nearSeun[1]
        ? loc(locale, `내년(${ctx.nearSeun[1].year}) 미리보기: ${fortuneLine(ctx.nearSeun[1].summary, locale)}. 올해 마무리가 내년 출발선입니다.`, `Avance ${ctx.nearSeun[1].year}: ${fortuneLine(ctx.nearSeun[1].summary, locale)}. El cierre de este año es la raya de salida del siguiente.`, `Zapowiedź ${ctx.nearSeun[1].year}: ${fortuneLine(ctx.nearSeun[1].summary, locale)}. Domknięcie tego roku to linia startu następnego.`)
        : "",
    ]),
    easyBullets: seun?.sinsalChanges ?? [],
  };

  return [character, career, wealth, love, match, relations, colors, fengshui, health, yearCard];
}
