import {
  BAEKHO,
  BRANCH_BREAK,
  BRANCH_CLASH,
  BRANCH_HARM,
  BRANCH_KO,
  BRANCH_PUNISH_GROUPS,
  BRANCH_SIX_COMBINE,
  CHEON_EUL,
  CHEONDEOK,
  CONTROLS,
  DIRECTION_COMBINE,
  EMPTY_ELEMENT,
  GENERATES,
  GOEGANG,
  GUIMUN_PAIRS,
  MUNCHANG,
  SELF_PUNISH,
  STEM_COMBINE,
  STEM_META,
  TAEGEUK,
  TRIPLE_COMBINE,
  WOLDEOK,
  WONJIN,
} from "./constants";
import type {
  DaeunItem,
  ElementCount,
  ElementKey,
  ElementStrength,
  GuimunAnalysis,
  PatternAnalysis,
  Pillar,
  PillarKey,
  RelationHit,
  SeunItem,
  SinsalItem,
  StrengthAnalysis,
  StrengthItem,
  TypeScore,
  UseGodAnalysis,
  WeaknessItem,
} from "./types";

const PILLAR_LABEL: Record<PillarKey, string> = {
  year: "년주",
  month: "월주",
  day: "일주",
  hour: "시주",
};

function pairHits(pairs: [string, string][], branches: string[]): [string, string][] {
  return pairs.filter(([a, b]) => branches.includes(a) && branches.includes(b));
}

export function countElements(pillars: Pillar[]) {
  const stemCount = { ...EMPTY_ELEMENT };
  const branchCount = { ...EMPTY_ELEMENT };
  const hiddenCount = { ...EMPTY_ELEMENT };
  const powerScore = { ...EMPTY_ELEMENT };

  pillars.forEach((pillar, index) => {
    const monthBoost = index === 1 ? 1.6 : 1;
    const dayBoost = index === 2 ? 1.2 : 1;
    stemCount[pillar.ganElement] += 1;
    branchCount[pillar.zhiElement] += 1;
    powerScore[pillar.ganElement] += 12 * monthBoost * dayBoost;
    powerScore[pillar.zhiElement] += 8 * monthBoost;
    pillar.hiddenStems.forEach((hidden) => {
      hiddenCount[hidden.element] += 1;
      const weight = hidden.role === "main" ? 6 : hidden.role === "middle" ? 3 : 1.5;
      powerScore[hidden.element] += weight * monthBoost;
    });
  });

  const simpleCount: ElementCount = {
    wood: stemCount.wood + branchCount.wood,
    fire: stemCount.fire + branchCount.fire,
    earth: stemCount.earth + branchCount.earth,
    metal: stemCount.metal + branchCount.metal,
    water: stemCount.water + branchCount.water,
  };
  const values = Object.values(powerScore);
  const avg = values.reduce((sum, value) => sum + value, 0) / 5;
  const powerLabel = {} as ElementStrength;
  (Object.keys(powerScore) as ElementKey[]).forEach((key) => {
    if (powerScore[key] >= avg * 1.25) powerLabel[key] = "강";
    else if (powerScore[key] <= avg * 0.75) powerLabel[key] = "약";
    else powerLabel[key] = "중";
  });
  return { stemCount, branchCount, hiddenCount, simpleCount, powerScore, powerLabel };
}

export function tenGodTally(pillars: Pillar[]): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const pillar of pillars) {
    tally[pillar.ganTenGodKorean] = (tally[pillar.ganTenGodKorean] ?? 0) + 1;
    for (const hidden of pillar.hiddenStems) {
      const weight = hidden.role === "main" ? 1 : hidden.role === "middle" ? 0.5 : 0.25;
      tally[hidden.tenGodKorean] = (tally[hidden.tenGodKorean] ?? 0) + weight;
    }
  }
  return tally;
}

export function findRelations(pillars: Pillar[]): RelationHit[] {
  const branches = pillars.map((item) => item.zhi);
  const stems = pillars.map((item) => item.gan);
  const hits: RelationHit[] = [];
  const stemCombines = STEM_COMBINE.filter(([a, b]) => stems.includes(a) && stems.includes(b));
  if (stemCombines.length) {
    hits.push({
      type: "gan-combine",
      typeKorean: "천간합",
      items: stemCombines.map(([a, b]) => `${a}${b}`),
      description: "천간이 합하면 오행 세력이 한쪽으로 기울거나 합화될 수 있습니다.",
    });
  }
  const six = pairHits(BRANCH_SIX_COMBINE, branches);
  if (six.length) {
    hits.push({
      type: "six-combine",
      typeKorean: "육합",
      items: six.map(([a, b]) => `${a}${b}`),
      description: "지지가 육합되면 관계·협력·묶임의 기운이 커집니다.",
    });
  }
  for (const group of TRIPLE_COMBINE) {
    const found = group.items.filter((item) => branches.includes(item));
    if (found.length >= 2) {
      hits.push({
        type: "triple",
        typeKorean: found.length === 3 ? "삼합" : "반합",
        items: [`${group.name}: ${found.join("")}`],
        description: "삼합/반합은 특정 오행의 세력을 강하게 모읍니다.",
      });
    }
  }
  for (const group of DIRECTION_COMBINE) {
    const found = group.items.filter((item) => branches.includes(item));
    if (found.length >= 3) {
      hits.push({
        type: "direction",
        typeKorean: "방합",
        items: [group.name],
        description: "방합은 계절 전체가 한쪽 오행으로 모이는 강한 결집입니다.",
      });
    }
  }
  const clash = pairHits(BRANCH_CLASH, branches);
  if (clash.length) {
    hits.push({
      type: "clash",
      typeKorean: "충",
      items: clash.map(([a, b]) => `${a}${b}`),
      description: "충은 변동, 이동, 충돌, 사건화를 잘 만듭니다.",
    });
  }
  for (const group of BRANCH_PUNISH_GROUPS) {
    const found = group.items.filter((item) => branches.includes(item));
    if (found.length >= 2) {
      hits.push({
        type: "punish",
        typeKorean: group.name,
        items: found,
        description: "형은 관계 마찰, 자기 검열, 반복되는 갈등 패턴과 연결됩니다.",
      });
    }
  }
  const self = branches.filter((item, index) => SELF_PUNISH.includes(item) && branches.indexOf(item) !== index);
  if (self.length) {
    hits.push({
      type: "self-punish",
      typeKorean: "자형",
      items: [...new Set(self)],
      description: "같은 지지가 겹치며 자형되면 스스로에게 엄격하거나 예민해질 수 있습니다.",
    });
  }
  const broken = pairHits(BRANCH_BREAK, branches);
  if (broken.length) {
    hits.push({
      type: "break",
      typeKorean: "파",
      items: broken.map(([a, b]) => `${a}${b}`),
      description: "파는 기존 관계가 느슨해지거나 깨지기 쉬운 흐름입니다.",
    });
  }
  const harm = pairHits(BRANCH_HARM, branches);
  if (harm.length) {
    hits.push({
      type: "harm",
      typeKorean: "해",
      items: harm.map(([a, b]) => `${a}${b}`),
      description: "해는 오해, 배신감, 보이지 않는 손실과 잘 연결됩니다.",
    });
  }
  const wonjin = pairHits(WONJIN, branches);
  if (wonjin.length) {
    hits.push({
      type: "wonjin",
      typeKorean: "원진",
      items: wonjin.map(([a, b]) => `${a}${b}`),
      description: "원진은 감정 대립, 끌리면서도 불편한 관계 패턴을 만듭니다.",
    });
  }
  return hits;
}

export function dayVoid(dayGanzhi: string): string[] {
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const sixty = Array.from({ length: 60 }, (_, i) => `${stems[i % 10]}${branches[i % 12]}`).indexOf(dayGanzhi);
  const voids = [
    ["戌", "亥"],
    ["申", "酉"],
    ["午", "未"],
    ["辰", "巳"],
    ["寅", "卯"],
    ["子", "丑"],
  ];
  return voids[Math.floor(sixty / 10)] ?? [];
}

export function buildSinsal(pillars: Record<PillarKey, Pillar | null>): { sinsal: SinsalItem[]; gwiin: SinsalItem[] } {
  const present = (Object.entries(pillars) as [PillarKey, Pillar | null][]).filter(([, value]) => value) as [PillarKey, Pillar][];
  const branches = present.map(([, pillar]) => pillar.zhi);
  const day = pillars.day!;
  const month = pillars.month!;
  const dayStem = day.gan;
  const yearBranch = pillars.year?.zhi ?? day.zhi;
  const gwiin: SinsalItem[] = [];
  const sinsal: SinsalItem[] = [];

  const cheonEul = CHEON_EUL[dayStem] ?? [];
  const cheonEulPos = present.filter(([, pillar]) => cheonEul.includes(pillar.zhi)).map(([key]) => PILLAR_LABEL[key]);
  if (cheonEulPos.length) {
    gwiin.push({
      name: "천을귀인",
      category: "gwiin",
      positions: cheonEulPos,
      summary: "어려울 때 사람이나 기회가 나타나는 길성으로 봅니다. 만능 해결사는 아닙니다.",
    });
  }
  const munchang = MUNCHANG[dayStem];
  if (munchang && branches.includes(munchang)) {
    gwiin.push({
      name: "문창귀인",
      category: "gwiin",
      positions: present.filter(([, pillar]) => pillar.zhi === munchang).map(([key]) => PILLAR_LABEL[key]),
      summary: "글, 학습, 표현, 자격 공부와 잘 맞는 길성으로 해석합니다.",
    });
  }
  const taegeuk = TAEGEUK[dayStem] ?? [];
  const taegeukPos = present.filter(([, pillar]) => taegeuk.includes(pillar.zhi)).map(([key]) => PILLAR_LABEL[key]);
  if (taegeukPos.length) {
    gwiin.push({
      name: "태극귀인",
      category: "gwiin",
      positions: taegeukPos,
      summary: "본질을 파고드는 탐구심, 철학·연구 성향과 연결해 봅니다.",
    });
  }
  const cheondeok = CHEONDEOK[month.zhi];
  if (cheondeok && present.some(([, pillar]) => pillar.gan === cheondeok || pillar.zhi === cheondeok)) {
    gwiin.push({
      name: "천덕귀인",
      category: "gwiin",
      positions: ["월지 기준"],
      summary: "급한 흉을 덜어준다고 보는 길성입니다. 노력 없이 보호된다는 뜻은 아닙니다.",
    });
  }
  const woldeok = WOLDEOK[month.zhi];
  if (woldeok && present.some(([, pillar]) => pillar.gan === woldeok)) {
    gwiin.push({
      name: "월덕귀인",
      category: "gwiin",
      positions: ["월지 기준"],
      summary: "주변 평판과 조력, 예의 바른 이미지와 연결됩니다.",
    });
  }

  const group = TRIPLE_COMBINE.find((item) => item.items.includes(yearBranch)) ?? TRIPLE_COMBINE[0];
  const map12: Record<string, string[]> = {
    인오술: ["亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌"],
    신자진: ["巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰"],
    사유축: ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"],
    해묘미: ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"],
  };
  const names12 = ["겁살", "재살", "천살", "지살", "년살", "월살", "망신", "장성", "반안", "역마", "육해", "화개"];
  const key = group.name.slice(0, 3);
  const wheel = map12[key] ?? map12["인오술"];
  const dohwaMap: Record<string, string> = { 인오술: "卯", 신자진: "酉", 사유축: "午", 해묘미: "子" };
  for (const label of ["역마", "도화", "화개", "겁살", "재살", "지살", "망신", "장성", "반안", "육해"]) {
    if (label === "도화") {
      const zhi = dohwaMap[key];
      if (zhi && branches.includes(zhi)) {
        sinsal.push({
          name: "도화",
          category: "sinsal",
          positions: present.filter(([, pillar]) => pillar.zhi === zhi).map(([k]) => PILLAR_LABEL[k]),
          summary: "매력, 인기, 감정 기복, 외적인 시선과 연결됩니다. 무조건 연애 사건으로 보지 않습니다.",
        });
      }
      continue;
    }
    const index = names12.indexOf(label);
    const zhi = wheel[index];
    if (zhi && branches.includes(zhi)) {
      sinsal.push({
        name: label,
        category: "sinsal",
        positions: present.filter(([, pillar]) => pillar.zhi === zhi).map(([k]) => PILLAR_LABEL[k]),
        summary:
          label === "역마"
            ? "이동, 변화, 출장, 이직, 바깥 활동이 잦아지는 살입니다."
            : label === "화개"
              ? "연구, 예술, 혼자만의 세계, 종교·철학 성향과 연결됩니다."
              : `${label}은 원국 전체 구조와 함께 봐야 하며, 하나 있다고 길흉이 확정되지 않습니다.`,
      });
    }
  }
  if (BAEKHO.includes(day.ganzhi)) {
    sinsal.push({
      name: "백호대살",
      category: "sinsal",
      positions: ["일주"],
      summary: "예민함, 날카로움, 사고/수술/갈등 주의를 전통적으로 경고합니다. 확정 재난이 아닙니다.",
    });
  }
  if (GOEGANG.includes(day.ganzhi)) {
    sinsal.push({
      name: "괴강살",
      category: "sinsal",
      positions: ["일주"],
      summary: "결단력, 카리스마, 고집이 함께 가는 구조입니다. 리더십과 독선의 양면이 있습니다.",
    });
  }
  const voidBranches = dayVoid(day.ganzhi);
  const voidPos = present.filter(([, pillar]) => voidBranches.includes(pillar.zhi)).map(([k, p]) => `${PILLAR_LABEL[k]} ${p.zhi}`);
  if (voidPos.length) {
    sinsal.push({
      name: "공망",
      category: "void",
      positions: voidPos,
      summary: "공망은 비어 있음, 초연함, 형식보다 본질을 찾는 경향으로 읽습니다.",
    });
  }
  return { sinsal, gwiin };
}

export function analyzeGuimun(
  pillars: Record<PillarKey, Pillar | null>,
  daeun: DaeunItem[],
  seun: SeunItem[],
): GuimunAnalysis {
  const branches = (Object.values(pillars).filter(Boolean) as Pillar[]).map((item) => item.zhi);
  const pairs = pairHits(GUIMUN_PAIRS, branches).map(([a, b]) => `${BRANCH_KO[a]}${BRANCH_KO[b]}(${a}${b})`);
  const present = pairs.length > 0;
  const day = pillars.day?.zhi;
  const month = pillars.month?.zhi;
  const dayRelation = day && pairs.some((item) => item.includes(day)) ? "일지와 직접 연결" : "일지와 직접 연결되지 않음";
  const monthRelation = month && pairs.some((item) => item.includes(month)) ? "월지와 직접 연결" : "월지와 직접 연결되지 않음";
  let natalActivation: GuimunAnalysis["natalActivation"] = "없음";
  if (present && (dayRelation.startsWith("일지") || monthRelation.startsWith("월지"))) natalActivation = "강";
  else if (present && pairs.length > 1) natalActivation = "중간";
  else if (present) natalActivation = "약";
  const daeunActivation = daeun
    .filter((item) => GUIMUN_PAIRS.some(([a, b]) => (branches.includes(a) && item.zhi === b) || (branches.includes(b) && item.zhi === a)))
    .map((item) => `${item.startAge}~${item.endAge}세 ${item.ganzhiKorean}`);
  const currentYear = new Date().getFullYear();
  const seunActivation = seun
    .filter((item) => item.year >= currentYear && item.year <= currentYear + 20)
    .filter((item) => GUIMUN_PAIRS.some(([a, b]) => (branches.includes(a) && item.zhi === b) || (branches.includes(b) && item.zhi === a)))
    .map((item) => `${item.year}년`);
  return {
    present,
    pairs,
    overlap: pairs.length > 1,
    dayBranchRelation: dayRelation,
    monthBranchRelation: monthRelation,
    natalActivation,
    daeunActivation,
    seunActivation,
    traits: present
      ? ["직관이 예민할 수 있음", "생각이 많아질 수 있음", "특정 분야에 깊게 몰입", "사람의 분위기를 빠르게 읽는 경향", "스트레스가 심할 경우 과민반응 가능"]
      : ["원국에서 전형적인 귀문 조합은 뚜렷하지 않습니다."],
    disclaimer:
      "전통 명리학에서는 귀문관살을 직관성·감각적 예민함·몰입성과 연결해 해석하기도 합니다. 다만 이것을 초자연적인 능력이나 실제 '영적 능력'으로 단정할 수는 없습니다.",
  };
}

export function analyzeStrength(
  dayElement: ElementKey,
  monthBranch: string,
  pillars: Pillar[],
  relations: RelationHit[],
  tally: Record<string, number>,
): StrengthAnalysis {
  const reasons: string[] = [];
  let score = 50;
  const monthElement = (
    {
      寅: "wood",
      卯: "wood",
      辰: "earth",
      巳: "fire",
      午: "fire",
      未: "earth",
      申: "metal",
      酉: "metal",
      戌: "earth",
      亥: "water",
      子: "water",
      丑: "earth",
    } as Record<string, ElementKey>
  )[monthBranch];
  const monthCommand = monthElement === dayElement;
  if (monthCommand) {
    score += 18;
    reasons.push("월령을 얻어 일간이 계절의 주인이 됩니다(득령).");
  } else if (GENERATES[monthElement] === dayElement) {
    score += 10;
    reasons.push("월지가 일간을 생하여 인성의 도움을 받습니다.");
  } else if (CONTROLS[monthElement] === dayElement) {
    score -= 10;
    reasons.push("월지가 일간을 극하여 계절적으로 부담이 있습니다.");
  } else if (GENERATES[dayElement] === monthElement) {
    score -= 6;
    reasons.push("월지가 식상의 계절이라 일간 힘이 밖으로 새기 쉽습니다.");
  } else {
    score -= 8;
    reasons.push("월지가 재성의 계절이라 일간이 써야 할 일이 많습니다.");
  }
  const dayPillar = pillars[2];
  const rooted = dayPillar.hiddenStems.some((item) => STEM_META[item.gan].element === dayElement);
  if (rooted) {
    score += 10;
    reasons.push("일지에 통근하여 뿌리가 있습니다(득지).");
  } else {
    score -= 6;
    reasons.push("일지에 통근이 약해 뿌리가 얕습니다.");
  }
  const supportBranches = pillars.filter((item) => item.hiddenStems.some((hidden) => STEM_META[hidden.gan].element === dayElement)).length;
  const gainedBranch = supportBranches >= 2;
  if (gainedBranch) {
    score += 8;
    reasons.push(`지지 ${supportBranches}곳에서 같은 오행의 뿌리를 확인했습니다.`);
  }
  const bijeop = (tally["비견"] ?? 0) + (tally["겁재"] ?? 0);
  const insung = (tally["정인"] ?? 0) + (tally["편인"] ?? 0);
  const siksang = (tally["식신"] ?? 0) + (tally["상관"] ?? 0);
  const jaeseong = (tally["정재"] ?? 0) + (tally["편재"] ?? 0);
  const gwanseong = (tally["정관"] ?? 0) + (tally["편관"] ?? 0);
  score += Math.min(12, bijeop * 4 + insung * 5);
  score -= Math.min(14, siksang * 3 + jaeseong * 3 + gwanseong * 3);
  if (bijeop + insung >= 2) reasons.push("비겁·인성이 있어 일간을 돕는 세력이 있습니다(득세).");
  if (siksang + jaeseong + gwanseong >= 3) reasons.push("식상·재성·관성이 많아 일간이 써야 할 에너지가 큽니다.");
  if (relations.some((item) => item.typeKorean === "충")) {
    score -= 3;
    reasons.push("원국 충이 있어 세력이 안정적으로만 모이지는 않습니다.");
  }
  score = Math.max(8, Math.min(92, Math.round(score)));
  let classification: StrengthAnalysis["classification"] = "중화";
  if (score >= 78) classification = "강한 신강";
  else if (score >= 63) classification = "중강";
  else if (score >= 45) classification = "중화";
  else if (score >= 32) classification = "중약";
  else classification = "약한 신약";
  return {
    score,
    classification,
    reasons,
    monthCommand,
    rooted,
    gainedSeason: monthCommand || GENERATES[monthElement] === dayElement,
    gainedBranch,
    gainedPower: bijeop + insung >= 2,
  };
}

export function analyzeUseGod(dayElement: ElementKey, strength: StrengthAnalysis, powerLabel: ElementStrength): UseGodAnalysis {
  const drain = GENERATES[dayElement];
  const wealth = CONTROLS[dayElement];
  const officer = (Object.entries(CONTROLS).find(([, value]) => value === dayElement)?.[0] ?? "metal") as ElementKey;
  const resource = (Object.entries(GENERATES).find(([, value]) => value === dayElement)?.[0] ?? "water") as ElementKey;
  const yongsin = strength.score >= 55 ? [drain, wealth] : [resource, dayElement];
  const heesin = strength.score >= 55 ? [officer] : [resource];
  const gisin = strength.score >= 55 ? [dayElement, resource] : [wealth, officer];
  const gusin = strength.score >= 55 ? [resource] : [drain];
  const label = (keys: ElementKey[]) => [...new Set(keys)].map((key) => ({ wood: "목", fire: "화", earth: "토", metal: "금", water: "수" })[key]);
  return {
    yongsin: label(yongsin),
    heesin: label(heesin),
    gisin: label(gisin),
    gusin: label(gusin),
    reasons: [
      `일간 오행은 ${{ wood: "목", fire: "화", earth: "토", metal: "금", water: "수" }[dayElement]}이며 강약 판정은 ${strength.classification}입니다.`,
      strength.score >= 55
        ? "신강 계열에서는 일간을 설기하거나 재성으로 흘려보내는 오행을 용신으로 봅니다."
        : "신약 계열에서는 일간을 생조하는 인성과 비겁을 용신으로 봅니다.",
      `오행 실제 세력: 목 ${powerLabel.wood}, 화 ${powerLabel.fire}, 토 ${powerLabel.earth}, 금 ${powerLabel.metal}, 수 ${powerLabel.water}.`,
    ],
  };
}

function endsWithRieul(value: string): boolean {
  const last = value.codePointAt(value.length - 1);
  if (!last) return false;
  if (last < 0xac00 || last > 0xd7a3) return last === 0x3139 || last === 0x11af;
  return (last - 0xac00) % 28 === 8;
}

export function analyzePattern(month: Pillar): PatternAnalysis {
  const god = month.hiddenStems[0]?.tenGodKorean ?? month.ganTenGodKorean;
  const map: Record<string, string> = {
    정관: "정관격",
    편관: "편관격",
    정재: "정재격",
    편재: "편재격",
    식신: "식신격",
    상관: "상관격",
    정인: "정인격",
    편인: "편인격",
    비견: "건록격 계열",
    겁재: "양인격 계열",
  };
  const name = map[god] ?? `${god} 중심 구조`;
  return {
    name,
    basis: `월지 본기 십성이 ${god}이므로 ${name}${endsWithRieul(name) ? "로" : "으로"} 먼저 봅니다.`,
    summary: "격국은 간판일 뿐이며, 신강/신약·용신·합충이 맞아야 격의 장점이 실제로 열립니다.",
  };
}

export function scoreWealth(tally: Record<string, number>, strength: StrengthAnalysis, relations: RelationHit[]): TypeScore[] {
  const siksang = (tally["식신"] ?? 0) + (tally["상관"] ?? 0);
  const jae = (tally["정재"] ?? 0) + (tally["편재"] ?? 0);
  const gwan = (tally["정관"] ?? 0) + (tally["편관"] ?? 0);
  const inseong = (tally["정인"] ?? 0) + (tally["편인"] ?? 0);
  const bijeop = (tally["비견"] ?? 0) + (tally["겁재"] ?? 0);
  const clash = relations.some((item) => item.type === "clash") ? 1 : 0;
  return [
    { type: "월급형", score: Math.round(gwan * 20 + inseong * 12 + (tally["정재"] ?? 0) * 10), reasons: ["관성+인성+정재가 조직 급여형과 잘 맞습니다."] },
    { type: "사업형", score: Math.round(siksang * 16 + (tally["편재"] ?? 0) * 18), reasons: ["식상생재와 편재는 자기 사업을 만드는 흐름입니다."] },
    { type: "성과형", score: Math.round(siksang * 14 + jae * 12 + clash * 8), reasons: ["결과물이 눈에 보여야 돈이 붙는 구조입니다."] },
    { type: "전문직형", score: Math.round(inseong * 18 + siksang * 10), reasons: ["인성+식상은 자격과 기술로 돈을 법니다."] },
    { type: "투자형", score: Math.round((tally["편재"] ?? 0) * 20 + clash * 10 + bijeop * 4), reasons: ["편재와 변동은 투자/기회형 현금흐름과 가깝습니다."] },
    { type: "축적형", score: Math.round((tally["정재"] ?? 0) * 22 + inseong * 8 + (strength.score > 50 ? 6 : 0)), reasons: ["정재와 안정 점수는 모으는 힘과 연결됩니다."] },
    { type: "영업형", score: Math.round(siksang * 12 + jae * 12 + (tally["겁재"] ?? 0) * 8), reasons: ["사람과 설득, 거래가 돈이 되는 구조입니다."] },
    { type: "콘텐츠형", score: Math.round(siksang * 20 + inseong * 6), reasons: ["식상은 만들고 보여주는 능력이 곧 수입이 됩니다."] },
  ].sort((a, b) => b.score - a.score);
}

export function scoreCareer(tally: Record<string, number>): TypeScore[] {
  const siksang = (tally["식신"] ?? 0) + (tally["상관"] ?? 0);
  const jae = (tally["정재"] ?? 0) + (tally["편재"] ?? 0);
  const gwan = (tally["정관"] ?? 0) + (tally["편관"] ?? 0);
  const inseong = (tally["정인"] ?? 0) + (tally["편인"] ?? 0);
  return [
    { type: "조직형", score: Math.round(gwan * 18 + inseong * 10), reasons: ["관성+인성은 조직 적응과 승진 축입니다."] },
    { type: "공무원형", score: Math.round((tally["정관"] ?? 0) * 24 + inseong * 12), reasons: ["정관과 인성은 시험·공직·규율형과 가깝습니다."] },
    { type: "전문직형", score: Math.round(inseong * 20 + siksang * 8), reasons: ["전문성은 인성+식상의 결합입니다."] },
    { type: "기술직형", score: Math.round(siksang * 16 + inseong * 8), reasons: ["손으로 만들거나 시스템화하는 힘입니다."] },
    { type: "창업형", score: Math.round(siksang * 14 + jae * 16), reasons: ["식상+재성은 사업의 기본 공식입니다."] },
    { type: "기획형", score: Math.round(inseong * 12 + siksang * 12), reasons: ["읽고 설계하고 기획하는 자리와 맞습니다."] },
    { type: "영업형", score: Math.round(siksang * 12 + jae * 14), reasons: ["사람과 숫자를 동시에 움직이는 자리입니다."] },
    { type: "연구형", score: Math.round(inseong * 18 + (tally["편인"] ?? 0) * 10), reasons: ["편인·정인은 깊이 파는 연구형과 연결됩니다."] },
    { type: "콘텐츠형", score: Math.round(siksang * 20), reasons: ["표현과 창작이 직업이 될 수 있습니다."] },
    { type: "투자형", score: Math.round((tally["편재"] ?? 0) * 20 + (tally["편관"] ?? 0) * 6), reasons: ["기회와 리스크를 다루는 자리입니다."] },
  ].sort((a, b) => b.score - a.score);
}

export function buildWeaknesses(
  tally: Record<string, number>,
  strength: StrengthAnalysis,
  relations: RelationHit[],
  guimun: GuimunAnalysis,
): WeaknessItem[] {
  const items: WeaknessItem[] = [];
  const siksang = (tally["식신"] ?? 0) + (tally["상관"] ?? 0);
  const jae = (tally["정재"] ?? 0) + (tally["편재"] ?? 0);
  if (siksang >= 2) {
    items.push({
      title: "생각이 행동보다 앞서거나, 말이 결과를 앞지르는 패턴",
      type: "식상",
      severity: 4,
      cause: "식상 세력이 커서 아이디어와 표현이 먼저 열립니다.",
      pattern: "분석·기획·비판은 빠르지만 실행과 마감이 밀릴 수 있습니다.",
      realLife: ["계획을 많이 세움", "시작 전 분석이 길어짐", "완벽한 조건을 기다림", "결정이 늦어질 가능성"],
      cost: "기회 비용과 사람의 신뢰가 천천히 깎일 수 있습니다.",
      remedy: "기한을 외부에 공개하고, ‘70점 완성 후 수정’을 기본 규칙으로 삼으십시오.",
    });
  }
  if (strength.score < 45) {
    items.push({
      title: "체력과 결정권을 과소평가한 채 일을 떠안는 패턴",
      type: "신약",
      severity: 4,
      cause: `일간이 ${strength.classification}으로 판정되어 외부 요구에 쉽게 밀릴 수 있습니다.`,
      pattern: "거절보다 수습을 택하고, 혼자 다 해결하려는 경향.",
      realLife: ["부탁을 거절하기 어려움", "과도한 책임 흡수", "회복 시간 부족"],
      cost: "번아웃과 낮은 단가/낮은 조건에 고착될 수 있습니다.",
      remedy: "용신 오행에 해당하는 일(공부, 지원, 같은 편)을 먼저 확보한 뒤 재성과 관성을 받으십시오.",
    });
  }
  if (jae >= 2 && (tally["겁재"] ?? 0) >= 1) {
    items.push({
      title: "돈과 사람 사이에서 새는 현금흐름",
      type: "재성",
      severity: 3,
      cause: "재성이 있는데 겁재가 함께 있어 재물을 나누거나 흔들 수 있습니다.",
      pattern: "벌어도 공동 지출, 보증, 충동적 투자로 잔고가 안 남습니다.",
      realLife: ["같이 쓰면 더 크게 씀", "기회에 빨리 베팅", "정산이 느림"],
      cost: "수입 자체보다 ‘남는 돈’이 약해질 수 있습니다.",
      remedy: "자동이체 저축과 투자 한도를 미리 고정하십시오.",
    });
  }
  if (relations.some((item) => item.type === "clash")) {
    items.push({
      title: "변동을 성장으로 착각하는 패턴",
      type: "충",
      severity: 3,
      cause: "원국에 충이 있어 환경이 자주 흔들립니다.",
      pattern: "이직, 이사, 관계 리셋이 반복될 수 있습니다.",
      realLife: ["지금 자리를 오래 못 견딤", "갈등 후 한 번에 정리"],
      cost: "경력과 관계가 축적되기 전에 끊길 수 있습니다.",
      remedy: "큰 변화는 대운 단위로만 설계하고, 세운의 충해에는 ‘유지’를 기본값으로 두십시오.",
    });
  }
  if (guimun.present) {
    items.push({
      title: "예민함이 과해지면 사람을 과해석하는 패턴",
      type: "귀문",
      severity: 3,
      cause: "귀문 조합이 원국에 있어 직관과 상상이 동시에 켜집니다.",
      pattern: "분위기 파악은 빠르지만, 확인 없이 스토리를 완성할 수 있습니다.",
      realLife: ["혼자 생각하다 관계 거리 둠", "밤늦게 장면이 반복 재생"],
      cost: "실제보다 관계가 더 위험해 보일 수 있습니다.",
      remedy: "직관은 가설로만 두고, 24시간 뒤 사실 확인을 규칙으로 만드십시오.",
    });
  }
  return items.slice(0, 5);
}

export function buildTalents(tally: Record<string, number>, strength: StrengthAnalysis, career: TypeScore[]): StrengthItem[] {
  const top = career[0];
  const items: StrengthItem[] = [
    {
      title: `${top.type}으로 성과를 쌓는 능력`,
      basis: `${top.reasons[0]} 현재 강약 판정은 ${strength.classification}입니다.`,
      ability: "한 번 익힌 규칙을 반복해 자기 레퍼토리로 만드는 힘.",
      careers: career.slice(0, 4).map((item) => item.type),
      sideEffect: "익숙한 방식만 고집하면 새로운 대운에서 늦어질 수 있습니다.",
      amplify: "대운의 용신 오행이 들어오는 10년을 전성기 프로젝트로 쓰십시오.",
    },
  ];
  if ((tally["정인"] ?? 0) + (tally["편인"] ?? 0) >= 1) {
    items.push({
      title: "구조를 파악하고 장기적으로 축적하는 능력",
      basis: "인성이 있어 학습·자격·문서·원리가 자산이 됩니다.",
      ability: "한 번 배운 것을 장기간 활용하고, 경험이 쌓일수록 강해집니다.",
      careers: ["전문직", "연구", "조직 내 전문 포지션", "콘텐츠 축적"],
      sideEffect: "준비만 하다가 시장 타이밍을 놓칠 수 있습니다.",
      amplify: "배운 것을 90일 안에 공개 결과물로 바꾸십시오.",
    });
  }
  if ((tally["식신"] ?? 0) + (tally["상관"] ?? 0) >= 1) {
    items.push({
      title: "만들고 설명해서 사람을 설득하는 능력",
      basis: "식상이 있어 표현·기획·기술 구현이 잘 열립니다.",
      ability: "복잡한 내용을 자기 언어로 바꾸거나 결과물을 눈에 보이게 만듭니다.",
      careers: ["콘텐츠", "기획", "교육", "제품/서비스 설계"],
      sideEffect: "말이 많아지거나 비판이 날카로워질 수 있습니다.",
      amplify: "결과물 단위로 포트폴리오를 쌓아 재성과 연결하십시오.",
    });
  }
  return items.slice(0, 3);
}

export function starsFromScore(score: number): number {
  if (score >= 80) return 5;
  if (score >= 65) return 4;
  if (score >= 50) return 3;
  if (score >= 35) return 2;
  return 1;
}
