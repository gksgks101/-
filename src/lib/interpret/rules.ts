import type { InterpretationReport, ReportSection, SajuCalculation } from "@/lib/saju/types";

const FREE_IDS = new Set(["summary", "natal", "character", "advice"]);

function section(id: string, title: string, paragraphs: string[], bullets?: string[]): ReportSection {
  return { id, title, locked: !FREE_IDS.has(id), paragraphs, bullets };
}

function godLine(calculation: SajuCalculation): string {
  return Object.entries(calculation.tenGods)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => `${name} ${value.toFixed(1)}`)
    .join(", ");
}

export function buildRuleReport(calculation: SajuCalculation): InterpretationReport {
  const p = calculation.pillars;
  const hour = p.hour ? `${p.hour.ganzhiKorean}(${p.hour.ganzhi})` : "시주 미상";
  const topWealth = calculation.wealthTypes[0];
  const topCareer = calculation.careerTypes[0];
  const currentYear = new Date().getFullYear();
  const nearSeun = calculation.seun.filter((item) => item.year >= currentYear && item.year <= currentYear + 7);
  const nowDaeun = calculation.daeun.find((item) => {
    const age = currentYear - Number(calculation.birth.solarDate.slice(0, 4)) + 1;
    return age >= item.startAge && age <= item.endAge;
  });

  const sections: ReportSection[] = [
    section(
      "summary",
      "1. 만세력 판독 요약",
      [
        `${calculation.birth.solarDate} ${calculation.birth.time ?? "시간 미상"} / ${calculation.birth.location} 기준으로 계산했습니다.`,
        `사주팔자: 년 ${p.year.ganzhiKorean}(${p.year.ganzhi}) · 월 ${p.month.ganzhiKorean}(${p.month.ganzhi}) · 일 ${p.day.ganzhiKorean}(${p.day.ganzhi}) · 시 ${hour}.`,
        `일간은 ${calculation.dayMaster.ganKorean}${calculation.dayMaster.elementKorean}, 월령은 ${calculation.season.monthOrderKorean}이며 절기는 ${calculation.season.currentJieqiKorean}입니다.`,
        "이 숫자는 AI가 만든 것이 아니라 절입 시각과 간지 규칙으로 고정 계산된 결과입니다.",
      ],
      calculation.evidence,
    ),
    section("character", "성격과 행동 패턴", [
      `일간 ${calculation.dayMaster.ganKorean}${calculation.dayMaster.elementKorean}은 ${calculation.strength.classification} 상태에서 성격의 뼈대가 됩니다.`,
      `월지 ${p.month.zhiKorean}의 십성(${p.month.zhiTenGodKorean})이 사회에서 보이는 첫인상과 가깝습니다.`,
      `십성 상위는 ${godLine(calculation)}입니다. 이 조합이 말투, 결정 속도, 사람 다루는 방식에 반복됩니다.`,
    ]),
    section(
      "natal",
      "2. 원국 핵심 구조",
      [
        `격국은 ${calculation.pattern.name}입니다. ${calculation.pattern.basis}`,
        `신강/신약 점수는 ${calculation.strength.score}점으로 ${calculation.strength.classification}입니다.`,
        `용신 ${calculation.useGod.yongsin.join("·") || "판단 보류"}, 희신 ${calculation.useGod.heesin.join("·") || "-"}, 기신 ${calculation.useGod.gisin.join("·") || "-"}.`,
        `십성 분포: ${godLine(calculation)}. 재성은 현실에서 돈·거래·성과·이성 관계와 연결되는 요소로 읽습니다.`,
      ],
      calculation.strength.reasons,
    ),
    section("lifetime", "3. 평생 총운", [
      `${calculation.strength.classification} 사주는 초반에 ${calculation.strength.score >= 55 ? "자기 힘으로 판을 깔고" : "환경과 사람의 도움을 받으며"} 중반 이후 대운의 용신 여부에 따라 체급이 갈립니다.`,
      nowDaeun
        ? `현재 대운은 ${nowDaeun.startAge}~${nowDaeun.endAge}세 ${nowDaeun.ganzhiKorean}(${nowDaeun.tenGodKorean})입니다. ${nowDaeun.opportunity}`
        : "현재 대운은 시작 전 또는 경계에 있습니다.",
      "평생 운은 한 해의 길흉으로 결정되지 않습니다. 원국이 뼈대이고, 대운이 기후, 세운이 날씨입니다.",
    ]),
    section("wealth", "4. 금전운", [
      `가장 잘 맞는 현금흐름 유형은 ${topWealth?.type ?? "판단 보류"}입니다. ${topWealth?.reasons[0] ?? ""}`,
      `재성 점수 상위: ${calculation.wealthTypes
        .slice(0, 3)
        .map((item) => `${item.type} ${item.score}`)
        .join(" · ")}.`,
      "돈을 버는 능력과 지키는 능력은 다릅니다. 식상생재는 버는 힘, 정재·인성은 지키는 힘, 겁재·충은 새는 구멍으로 분리해 봅니다.",
      "‘돈복이 좋다’는 표현은 사용하지 않습니다. 이 사주는 어떤 방식으로 현금이 들어오고 어디에 새는지를 봐야 합니다.",
      "부동산/투자는 대운의 재성과 인성 조합이 동시에 올 때 공부 후 실행하는 편이 덜 위험합니다. 사주는 투자 권유가 아닙니다.",
    ]),
    section("career", "5. 직업운", [
      `직업 적성 1순위는 ${topCareer?.type ?? "복합형"}입니다. ${topCareer?.reasons[0] ?? ""}`,
      `상위 유형: ${calculation.careerTypes
        .slice(0, 4)
        .map((item) => item.type)
        .join(", ")}.`,
      "승진은 관성+인성+해당 대운, 사업은 식상+재성, 전문성은 인성+식상, 조직 적응은 관성+인성으로 보되 한 글자로 직업을 확정하지 않습니다.",
    ]),
    section("love", "6. 연애운", [
      calculation.birth.gender === "male"
        ? "전통적으로 남성은 재성을 배우자성으로 보지만, 이 사이트는 성별 하나만으로 배우자를 단정하지 않습니다. 일지(배우자궁), 합충, 식상, 대운을 함께 봅니다."
        : "전통적으로 여성은 관성을 배우자성으로 보지만, 성별 공식만으로 결혼 상대를 확정하지 않습니다.",
      `일지는 ${p.day.zhiKorean}(${p.day.twelveStageKorean})이라 관계에서 ${p.day.twelveStageKorean}의 리듬이 잘 드러납니다.`,
      "사랑 시작은 식상이 많으면 표현형, 인성이 많으면 관찰형, 관성이 많으면 조건·책임형으로 나타나는 경우가 많습니다.",
    ]),
    section("marriage", "7. 결혼운", [
      "결혼 적령기는 배우자성과 배우자궁이 대운에서 온전히 열리는 10년 구간을 우선 봅니다.",
      nowDaeun ? `현재 대운의 관계 키워드는 ‘${nowDaeun.love}’입니다.` : "혼인 관련 대운은 타임라인에서 확인하십시오.",
      "별거/이혼 ‘위험 시기’는 일지 충·원진이 세운과 겹치는 해입니다. 위험이 높아진다는 것이지 반드시 사건이 난다는 뜻이 아닙니다.",
    ]),
    section("health", "8. 건강운", [
      "사주는 의학적 진단이 아닙니다. 아래는 명리학적으로 취약하게 보는 경향입니다.",
      `일간 ${calculation.dayMaster.elementKorean}과 월령 ${calculation.season.monthOrderKorean} 조합에서는 수면·스트레스·피로 관리가 기본값이 됩니다.`,
      "목은 간/근골격, 화는 심혈관·염증, 토는 소화, 금은 호흡, 수는 신장/방광·순환과 상징적으로 연결합니다. 질병을 예측하지 않습니다.",
    ]),
    section("family", "9. 인간관계/가족운", [
      "년주는 조상·초년 환경, 월주는 부모·사회, 일지는 배우자·동거, 시주는 자녀·말년의 상징으로 읽습니다.",
      calculation.relations.length
        ? `원국 합충: ${calculation.relations.map((item) => item.typeKorean).join(", ")}. 가족 안에서도 이 패턴이 반복될 수 있습니다.`
        : "원국 합충이 두드러지지 않아 관계 기복은 대운·세운에서 더 잘 보입니다.",
    ]),
    section("daeun", "10. 대운 상세 해석", [
      "대운은 10년 기후입니다. 별점은 명리학적 상대 평가이며 확정 예언이 아닙니다.",
      ...calculation.daeun
        .slice(0, 6)
        .map((item) => `${item.startAge}~${item.endAge}세 ${item.ganzhiKorean}(${item.tenGodKorean}): ${item.opportunity}. 주의: ${item.caution}.`),
    ]),
    section("seun", "11. 세운 핵심 해석", [
      "현재부터 앞으로 7년은 날씨처럼 자세히 봅니다. 별점은 상대 평가입니다.",
      ...nearSeun.map(
        (item) => `${item.year}년(${item.age}세) ${item.ganzhi} ${item.tenGodKorean}: ${item.summary}. 직업 ${item.career} / 돈 ${item.money} / 연애 ${item.love}.`,
      ),
    ]),
    section("advice", "12. 현실 조언 및 총평", [
      "이 사주에서 우선순위는 용신을 일상 습관으로 만드는 일입니다. 용신 오행이 가리키는 일(학습, 생산, 정리, 운동, 사람)을 주 3회 이상 반복하십시오.",
      "고위험 결정(의료, 투자, 법률, 이혼)은 사주로 확정하지 말고 해당 전문가와 함께 보십시오.",
      "같은 생년월일을 다시 넣어도 사주팔자 원국은 항상 같습니다. 달라질 수 있는 것은 문장 표현뿐입니다.",
    ]),
    section("sinsal", "13. 살/신살 분석", [
      calculation.sinsal.length ? `원국에서 확인된 신살: ${calculation.sinsal.map((item) => item.name).join(", ")}.` : "특별히 두드러진 신살은 적습니다.",
      "신살이 하나 있다고 해서 무조건 나쁜 사건이 생기는 것은 아닙니다. 원국의 신강/용신과 함께 봐야 합니다.",
      ...calculation.sinsal.map((item) => `${item.name} (${item.positions.join(", ")}): ${item.summary}`),
    ]),
    section(
      "guimun",
      "14. 귀문관살 및 신기 관련 분석",
      [
        `귀문관살: ${calculation.guimun.present ? "있음" : "뚜렷하지 않음"}. 원국 활성도: ${calculation.guimun.natalActivation}.`,
        calculation.guimun.pairs.length ? `조합: ${calculation.guimun.pairs.join(", ")}.` : "전형적인 귀문 쌍이 원국에 없습니다.",
        `${calculation.guimun.dayBranchRelation}. ${calculation.guimun.monthBranchRelation}.`,
        calculation.guimun.daeunActivation.length
          ? `대운에서 켜질 수 있는 시기: ${calculation.guimun.daeunActivation.join(", ")}.`
          : "가까운 대운에서 귀문이 특별히 크게 켜지지는 않습니다.",
        calculation.guimun.disclaimer,
      ],
      calculation.guimun.traits,
    ),
    section("roast", "15. 팩트폭행 수준의 단점", [
      "결정론적 저주가 아닙니다. 이 구조에서 반복적으로 나타날 가능성이 높은 행동 패턴입니다.",
      ...calculation.weaknesses.map(
        (item, index) => `${index + 1}. ${item.title} / 원인: ${item.cause} / 패턴: ${item.pattern} / 손해: ${item.cost} / 개선: ${item.remedy}`,
      ),
    ]),
    section("talent", "16. 팩트폭행 수준의 장점", [
      "칭찬이 아니라 재사용 가능한 능력입니다.",
      ...calculation.talents.map(
        (item, index) =>
          `${index + 1}. ${item.title} / 근거: ${item.basis} / 능력: ${item.ability} / 분야: ${item.careers.join(", ")} / 과하면: ${item.sideEffect}`,
      ),
    ]),
    section("turning", "17. 인생의 핵심 변곡점", [
      "변곡점은 대운이 바뀌거나 세운이 원국 일지를 충하는 해입니다.",
      ...calculation.daeun.slice(0, 5).map((item) => `${item.startAge}세 전후: ${item.ganzhiKorean} 대운 시작. ${item.keywords.join(", ")}.`),
      ...calculation.seun
        .filter((item) => item.year >= currentYear && item.relationsWithNatal.length > 0)
        .slice(0, 5)
        .map((item) => `${item.year}년: 원국과 ${item.relationsWithNatal.join(", ")}.`),
    ]),
  ];

  return {
    source: "rules",
    sections,
    disclaimer: "본 리포트는 전통 명리학 규칙과 계산된 사주 데이터를 바탕으로 한 해석입니다. 의료·투자·법률 등 고위험 의사결정을 대체하지 않습니다.",
  };
}
