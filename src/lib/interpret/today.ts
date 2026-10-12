import { SolarDay } from "tyme4ts";
import type { Locale } from "@/lib/i18n/config";
import { tenGod } from "@/lib/i18n/terms";
import { tenGodOf } from "@/lib/saju/pillars";
import type { SajuCalculation } from "@/lib/saju/types";
import { loc } from "./themeContext";

export interface ShortFortune {
  title: string;
  line: string;
  stars: number;
}

function godStars(god: string): number {
  if (["정재", "편재", "식신", "정관", "정인"].includes(god)) return 4;
  if (["상관", "편관"].includes(god)) return 3;
  return 3;
}

function lineFor(god: string, locale: Locale, scope: "day" | "month"): string {
  const label = tenGod(god, locale);
  if (god.includes("재")) {
    return loc(
      locale,
      scope === "day" ? `${label} 날: 돈·거래는 정산이 먼저입니다.` : `${label} 달: 수입과 지출을 한 장에 적어두세요.`,
      scope === "day" ? `Día ${label}: primero liquidar dinero y tratos.` : `Mes ${label}: anote ingreso y gasto en una hoja.`,
      scope === "day" ? `Dzień ${label}: najpierw rozlicz pieniądze i transakcje.` : `Miesiąc ${label}: zapisz przychód i wydatek na jednej kartce.`,
    );
  }
  if (god.includes("관")) {
    return loc(
      locale,
      scope === "day" ? `${label} 날: 책임·평가가 앞에 나옵니다. 말보다 결과.` : `${label} 달: 역할이 선명해집니다. 직함을 정리하세요.`,
      scope === "day" ? `Día ${label}: salen cargo y evaluación. Resultado antes que palabras.` : `Mes ${label}: el rol se aclara. Ordene el título.`,
      scope === "day" ? `Dzień ${label}: wychodzą obowiązek i ocena. Wynik przed słowami.` : `Miesiąc ${label}: rola się wyostrza. Uporządkuj tytuł.`,
    );
  }
  if (god === "식신" || god === "상관") {
    return loc(
      locale,
      scope === "day" ? `${label} 날: 만들고 말하는 날이 이득입니다.` : `${label} 달: 작품·말을 밖으로 내보내세요.`,
      scope === "day" ? `Día ${label}: conviene crear y hablar.` : `Mes ${label}: saque obra y palabra afuera.`,
      scope === "day" ? `Dzień ${label}: opłaca się tworzyć i mówić.` : `Miesiąc ${label}: wynieś dzieło i słowo na zewnątrz.`,
    );
  }
  if (god.includes("인")) {
    return loc(
      locale,
      scope === "day" ? `${label} 날: 배우거나 쉬는 쪽이 맞습니다.` : `${label} 달: 자격·휴식·정리를 우선하세요.`,
      scope === "day" ? `Día ${label}: mejor estudiar o descansar.` : `Mes ${label}: priorice título, descanso y orden.`,
      scope === "day" ? `Dzień ${label}: lepiej się uczyć albo odpocząć.` : `Miesiąc ${label}: najpierw kwalifikacja, odpoczynek, porządek.`,
    );
  }
  return loc(
    locale,
    scope === "day" ? `${label} 날: 내 페이스를 지키는 날입니다.` : `${label} 달: 비교보다 내 판을 다지세요.`,
    scope === "day" ? `Día ${label}: un día para guardar tu ritmo.` : `Mes ${label}: asiente tu tablero, no compares.`,
    scope === "day" ? `Dzień ${label}: dzień na własny rytm.` : `Miesiąc ${label}: utrwal swoją planszę, nie porównuj.`,
  );
}

export function buildTodayMonth(calculation: SajuCalculation, locale: Locale): { today: ShortFortune; month: ShortFortune } {
  const now = new Date();
  const lunar = SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate()).getLunarDay();
  const dayGan = lunar.getSixtyCycle().getHeavenStem().getName();
  const monthGan = lunar.getMonthSixtyCycle().getHeavenStem().getName();
  const dayGod = tenGodOf(calculation.dayMaster.gan, dayGan).korean;
  const monthGod = tenGodOf(calculation.dayMaster.gan, monthGan).korean;
  return {
    today: {
      title: loc(locale, "오늘의 운세", "Suerte de hoy", "Dzisiejsza wróżba"),
      line: lineFor(dayGod, locale, "day"),
      stars: godStars(dayGod),
    },
    month: {
      title: loc(locale, "이번 달 운세", "Suerte de este mes", "Wróżba tego miesiąca"),
      line: lineFor(monthGod, locale, "month"),
      stars: godStars(monthGod),
    },
  };
}
