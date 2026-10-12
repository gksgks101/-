import type { Locale } from "@/lib/i18n/config";
import { josa } from "@/lib/i18n/josa";
import { msg } from "@/lib/i18n/messages";
import { tenGod } from "@/lib/i18n/terms";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import { gloss } from "./glossary";
import { careerWorkEasy, groupEasy, loveStyle, twelveEasy, wealthEasyByStyle } from "./sectorTables";
import { buildThemeCtx, clean, loc, type ThemeCtx } from "./themeContext";
import type { ColorChip, GlossChip, ThemeCardData } from "./themes";
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
  const lucky = chipsFor(ctx.yongsinKeys.length ? ctx.yongsinKeys : [ctx.support, ctx.output], locale, 4);
  const avoid = chipsFor(ctx.gisinKeys.length ? ctx.gisinKeys : [ctx.pressure], locale, 3);
  const yong = yongsinLine(c, locale);

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
    easy: clean([voice[0], groupEasy(ctx.dominantGroup, locale), voice[2] ?? voice[1]]),
    easyBullets: [],
  };

  const career: ThemeCardData = {
    id: "career",
    title: msg(locale, "themeCareer"),
    kicker: topCareer ? ctx.careerName(topCareer.type) : "",
    front: clean([
      loc(
        locale,
        `적성 1순위는 ${ctx.careerName(topCareer?.type ?? "")}입니다. ${topCareer?.reasons[0] ?? ""}`,
        `Vocación 1: ${ctx.careerName(topCareer?.type ?? "")}. ${topCareer?.reasons[0] ?? ""}`,
        `Zawód 1: ${ctx.careerName(topCareer?.type ?? "")}. ${topCareer?.reasons[0] ?? ""}`,
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
    easyHeadline: loc(locale, `일은 ‘${ctx.careerName(topCareer?.type ?? "")}’ 리듬이 맞아요.`, `Te va el ritmo “${ctx.careerName(topCareer?.type ?? "")}”.`, `Pasuje ci rytm „${ctx.careerName(topCareer?.type ?? "")}”.`),
    easy: clean([
      careerWorkEasy(topCareer?.type, locale),
      loc(locale, "프로젝트 하나, 마감 하나, 내가 책임지는 덩어리가 있으면 속도가 나요.", "Un proyecto, un plazo, un bloque tuyo: ahí sale velocidad.", "Jeden projekt, jeden deadline, jeden twój kawałek — wtedy tempo."),
      daeun
        ? loc(locale, `요즘 10년은 ${daeun.career}. 한 번에 이직과 이사를 겹치지 마세요.`, `Este decenio: ${daeun.career}. No mudes y cambies de empleo a la vez.`, `Ta dekada: ${daeun.career}. Nie łącz przeprowadzki ze zmianą pracy.`)
        : "",
    ]),
    easyBullets: [],
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
      ...wealthEasyByStyle(ctx.style, locale).slice(0, 2),
      loc(locale, "월급·모으기·사업 중 뭐가 맞는지 보세요. 종목은 사주가 찍지 않아요.", "Mira si te va sueldo, ahorro o negocio. El saju no elige acciones.", "Patrz, czy pasuje pensja, odkładanie czy biznes. Saju nie wybiera spółek."),
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
      loveStyle(ctx.dominantGroup, locale),
      loc(locale, "급하게 확정하면 상대가 숨어요. 세 번 만난 뒤 한 줄을 정하세요.", "Si cierras pronto, el otro se esconde. Una línea clara tras tres encuentros.", "Jak za szybko zamykasz, druga strona się chowa. Jedna linijka po trzech spotkaniach."),
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
      loc(locale, "혼자 결정하라고 안 재촉하는 사람이 편해요.", "Quien no te empuja a decidir solo, sienta bien.", "Kto nie pcha do decyzji w pojedynkę, leży ci."),
      loc(locale, "정답만 던지거나 자존심 싸움으로 가는 사람은 초반엔 짜릿해도 금방 지쳐요.", "Quien suelta ‘la verdad’ o pelea el orgullo: al inicio pica, luego cansa.", "Kto rzuca „prawdę” albo idzie w honory: na starcie iskrzy, potem męczy."),
      loc(locale, `${ctx.elName(ctx.output)}처럼 같이 만들고 노는 짝도 잘 맞아요.`, `También encaja quien crea y juega como ${ctx.elName(ctx.output)}.`, `Pasuje też kto tworzy i bawi się jak ${ctx.elName(ctx.output)}.`),
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
      loc(locale, "친구는 몇 명과 오래 가는 쪽이 맞아요. 매일 감정 공유는 부담이에요.", "Mejor pocos amigos largos. Compartir emoción a diario pesa.", "Lepiej kilku przyjaciół na długo. Codzienne emocje ciązą."),
      loc(locale, "직장에서는 ‘내가 뭘 맡는지’가 보이면 힘이 나요.", "En el trabajo te da fuerza ver qué es tuyo.", "W pracy dodaje siły, gdy widać, co jest twoje."),
      groupEasy(ctx.dominantGroup, locale),
    ]),
    easyBullets: [],
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
      loc(locale, "행운색은 나를 살리는 오행 색이에요. 피할 색은 나쁜 색이 아니라 과하면 피곤한 색이에요.", "Los de suerte nutren. Los de evitar no son malos: cansan si hay demasiados.", "Szczęścia karmią. Te do unikania nie są złe — męczą, gdy za dużo."),
      loc(locale, "점퍼 안감, 폰 케이스, 머그잔 하나면 충분해요.", "Basta un forro, una funda, una taza.", "Wystarczy podszewka, etui, kubek."),
      loc(locale, "핵심 구조에 적힌 용신·희신·기신과 같은 색을 쓰면 됩니다.", "Use los mismos yongsin/heesin/gisin que en la estructura central.", "Użyj tych samych yongsin/heesin/gisin co w głównej strukturze."),
    ]),
    easyBullets: [],
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
    easyHeadline: loc(locale, "집을 용신 쪽으로 조금 열어 두면 숨이 트여요.", "Si abres la casa hacia el yongsin, respiras.", "Jak otworzysz dom ku yongsin, łapiesz oddech."),
    easy: clean([
      loc(locale, "비싼 인테리어가 아니라 방향 하나와 소품 하나면 돼요.", "No hace falta un interior caro: una dirección y un objeto.", "Nie trzeba drogiego wnętrza: jeden kierunek i jeden przedmiot."),
      loc(locale, "너무 많은 거울과 막힌 구석부터 빼세요.", "Quita primero espejos de más y el rincón tapado.", "Najpierw zdejmij nadmiar luster i zatkany kąt."),
      loc(locale, "용신 색 소품을 책상 가까이 두면 매일 눈에 들어옵니다.", "Si acercas un objeto del color yongsin, lo ves cada día.", "Kolor yongsin na biurku wpada w oko codziennie."),
    ]),
    easyBullets: [],
  };

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
      loc(locale, "과한 오행은 줄이고, 약한 오행은 생활로 한 줌 보태면 돼요.", "Baja lo que sobra y refuerza lo flojo en el día.", "Ujmij nadmiar i wspieraj słabe na co dzień."),
      loc(locale, "수면 시각을 고정하는 것만으로도 도움이 됩니다.", "Fijar la hora de dormir ya ayuda.", "Stała pora snu już pomaga."),
      daeun ? loc(locale, `요즘 메모: ${daeun.health}.`, `Nota: ${daeun.health}.`, `Notatka: ${daeun.health}.`) : "",
    ]),
    easyBullets: [],
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
      loc(locale, "직업·돈·연애를 동시에 갈아엎지 마세요. 하나만 움직이면 됩니다.", "No vuelques trabajo, dinero y amor a la vez. Mueve uno.", "Nie wywracaj naraz pracy, pieniędzy i miłości. Rusz jedno."),
      seun
        ? loc(locale, `올해: 일 ${seun.career} / 돈 ${seun.money} / 마음 ${seun.love}.`, `Este año: trabajo ${seun.career} / dinero ${seun.money} / corazón ${seun.love}.`, `W tym roku: praca ${seun.career} / pieniądze ${seun.money} / serce ${seun.love}.`)
        : "",
      loc(locale, "큰 결정은 한 박자 쉬고 하세요. 세운은 날씨일 뿐 원국을 바꾸지 않습니다.", "Pause un tiempo antes de lo grande. El seun es el tiempo, no cambia el hueso natal.", "Zaczekaj chwilę przed wielką decyzją. Seun to pogoda, nie zmienia kości karty."),
    ]),
    easyBullets: [],
  };

  return [character, career, wealth, love, match, relations, colors, fengshui, health, yearCard];
}
