import type { Locale } from "@/lib/i18n/config";
import { josa } from "@/lib/i18n/josa";
import { ELEMENT_NAME } from "@/lib/i18n/terms";
import { BRANCH_CLASH, BRANCH_SIX_COMBINE, CONTROLS, GENERATES, STEM_COMBINE } from "@/lib/saju/constants";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { SajuCalculation } from "@/lib/saju/types";
import { loc } from "./themeContext";

export interface MatchReport {
  score: number;
  headline: string;
  paragraphs: string[];
  bullets: string[];
}

function pairHit(pairs: [string, string][], a: string, b: string): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export function buildMatchReport(self: SajuCalculation, other: SajuCalculation, locale: Locale): MatchReport {
  const a = self.dayMaster;
  const b = other.dayMaster;
  let score = 62;
  const bullets: string[] = [];
  const same = a.element === b.element;
  const generates = GENERATES[a.element] === b.element;
  const generatedBy = GENERATES[b.element] === a.element;
  const controls = CONTROLS[a.element] === b.element;
  const controlledBy = CONTROLS[b.element] === a.element;
  const stemHe = pairHit(STEM_COMBINE, a.gan, b.gan);
  const dayCombine = pairHit(BRANCH_SIX_COMBINE, self.pillars.day.zhi, other.pillars.day.zhi);
  const dayClash = pairHit(BRANCH_CLASH, self.pillars.day.zhi, other.pillars.day.zhi);

  if (stemHe) {
    score += 12;
    bullets.push(loc(locale, "일간이 천간합으로 잘 붙습니다.", "Los troncos diarios se unen (haptición).", "Pnie dnia się łączą (cheon-gan hap)."));
  }
  if (generatedBy) {
    score += 10;
    bullets.push(
      loc(
        locale,
        `상대의 ${josa(ELEMENT_NAME.ko[b.element], "이/가")} 나의 ${josa(ELEMENT_NAME.ko[a.element], "을/를")} 생합니다. 든든히 밀어 주는 짝입니다.`,
        `Su ${ELEMENT_NAME.es[b.element]} genera tu ${ELEMENT_NAME.es[a.element]}: pareja que empuja con amparo.`,
        `Ich ${ELEMENT_NAME.pl[b.element]} rodzi twoje ${ELEMENT_NAME.pl[a.element]}: para, która pcha z osłoną.`,
      ),
    );
  } else if (generates) {
    score += 6;
    bullets.push(
      loc(
        locale,
        `내가 상대를 생합니다. 돌봄은 커지지만 내가 먼저 지칠 수 있습니다.`,
        `Tú generas al otro: crece el cuidado, pero te puedes cansar primero.`,
        `Ty rodzisz drugą stronę: troska rośnie, ale ty możesz zmęczyć się pierwszy.`,
      ),
    );
  }
  if (same) {
    score += 4;
    bullets.push(loc(locale, "같은 오행이라 속도가 비슷합니다. 고집도 겹칠 수 있습니다.", "Mismo elemento: ritmo parecido, y a veces el mismo tesón.", "Ten sam żywioł: podobne tempo i bywa ten sam upór."));
  }
  if (controlledBy) {
    score -= 8;
    bullets.push(loc(locale, "상대가 나를 극하는 오행입니다. 초반엔 짜릿해도 압박으로 느껴질 수 있습니다.", "El otro controla tu elemento: al inicio pica, luego puede pesar.", "Druga strona kontroluje twój żywioł: na starcie iskrzy, potem może ciążyć."));
  } else if (controls) {
    score -= 4;
    bullets.push(loc(locale, "내가 상대를 극합니다. 정답을 너무 자주 주면 관계가 수업이 됩니다.", "Tú controlas al otro: si sueltas ‘la verdad’ a menudo, la relación se vuelve clase.", "Ty kontrolujesz drugą stronę: częste „prawdy” robią z relacji lekcję."));
  }
  if (dayCombine) {
    score += 8;
    bullets.push(loc(locale, "일지가 육합입니다. 생활 리듬이 잘 묶입니다.", "Las ramas del día se combinan: el ritmo cotidiano encaja.", "Gałęzie dnia się łączą: rytm dnia siada."));
  }
  if (dayClash) {
    score -= 10;
    bullets.push(loc(locale, "일지가 충입니다. 사건·이동·말다툼이 반복될 수 있으니 속도 합의가 필요합니다.", "Choque de ramas del día: pueden repetirse lances y discusiones. Hay que pactar el ritmo.", "Zderzenie gałęzi dnia: zdarzenia i spory mogą wracać. Trzeba ustalić tempo."));
  }

  score = Math.max(28, Math.min(96, score));
  const selfCard = dayMasterCard(a.gan);
  const otherCard = dayMasterCard(b.gan);
  const headline =
    score >= 75
      ? loc(locale, "서로 숨을 보태 주는 짝에 가깝습니다.", "Os acercáis a una pareja que se da aire.", "To para, która raczej dodaje sobie oddechu.")
      : score >= 55
        ? loc(locale, "맞춰 가면 오래 가는 짝입니다. 속도만 합의하세요.", "Si acordáis el ritmo, dura. El encaje está en el tempo.", "Jak ustalicie tempo, zostaje. Pasowanie jest w rytmie.")
        : loc(locale, "끌림은 있어도 리듬 충돌이 큽니다. 규칙을 먼저 정하세요.", "Hay atracción, pero el ritmo choca. Fijen reglas primero.", "Jest przyciąganie, ale rytm się zderza. Najpierw zasady.");

  return {
    score,
    headline,
    paragraphs: [
      loc(
        locale,
        `${josa(selfCard.title.ko, "과/와")} ${otherCard.title.ko}의 만남입니다. 점수는 일간 생극·천간합·일지 합충만으로 본 참고값이며, 사람을 확정하지 않습니다.`,
        `Encuentro de ${selfCard.title.es} y ${otherCard.title.es}. La puntuación mira generación/control, unión de troncos y ramas del día; no fija a nadie.`,
        `Spotkanie ${selfCard.title.pl} i ${otherCard.title.pl}. Wynik patrzy na rodzenie/kontrolę, połączenie pni i gałęzi dnia; nikogo nie ustala.`,
      ),
      headline,
      loc(
        locale,
        "좋아하는 티는 작게, 약속은 분명하게. 오행이 달라도 그 매너면 점수가 올라갑니다.",
        "El gusto, en bajo; la cita, clara. Aunque los elementos diferan, ese modo sube el puntaje.",
        "Sympatia cicho, umowa jasno. Nawet przy różnych żywiołach ten tryb podnosi wynik.",
      ),
    ],
    bullets,
  };
}
