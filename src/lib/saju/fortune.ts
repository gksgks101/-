import { ChildLimit, Gender, SixtyCycleYear, type EightChar, type SolarTime } from "tyme4ts";
import { BRANCH_CLASH, BRANCH_KO, STEM_KO, STEM_META } from "./constants";
import { hiddenStemsOf, tenGodOf } from "./pillars";
import { starsFromScore } from "./rules";
import type { DaeunItem, GenderType, SeunItem } from "./types";

function pairExists(pairs: [string, string][], a: string, b: string): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function relationLabels(natal: string[], target: string): string[] {
  return natal.filter((branch) => pairExists(BRANCH_CLASH, branch, target)).map((branch) => `${BRANCH_KO[branch]}${BRANCH_KO[target]}충`);
}

function jaeText(god: string, clash: boolean): string {
  if (god.includes("재")) return clash ? "돈의 이동이 큼. 투자보다 정산" : "수입 기회가 열리지만 지출도 같이 커짐";
  if (god.includes("관")) return "명예·직함이 돈보다 앞설 수 있음";
  if (god.includes("식") || god === "상관") return "만들어 팔거나 성과급형 수입";
  if (god.includes("인")) return "자격·학습 투자가 훗날 현금이 됨";
  return "현금흐름은 보통, 새는 곳부터 막을 해";
}

function careerText(god: string): string {
  if (god === "정관" || god === "편관") return "승진, 평가, 직함, 책임 증가";
  if (god === "식신" || god === "상관") return "창작, 이직, 포트폴리오, 기술 업그레이드";
  if (god === "정인" || god === "편인") return "공부, 자격, 연구, 문서 작업";
  if (god.includes("재")) return "매출, 영업, 사업 확장";
  return "자기 포지션을 다지는 구간";
}

function loveText(god: string): string {
  if (god.includes("재") || god.includes("관")) return "만남·약정·관계 공식화가 잘 보임";
  if (god === "상관") return "감정을 말과 행동으로 밀어붙이기 쉬움";
  if (god.includes("인")) return "돌봄과 의리는 커지지만 연애 밀도는 낮을 수 있음";
  return "관계보다 자기 상태 정리가 먼저인 구간";
}

export function buildDaeun(solarTime: SolarTime, gender: GenderType, dayStem: string, natalBranches: string[]): DaeunItem[] {
  const child = ChildLimit.fromSolarTime(solarTime, gender === "male" ? Gender.MAN : Gender.WOMAN);
  const items: DaeunItem[] = [];
  let current = child.getStartDecadeFortune();
  for (let i = 0; i < 9; i += 1) {
    const cycle = current.getSixtyCycle();
    const gan = cycle.getHeavenStem().getName();
    const zhi = cycle.getEarthBranch().getName();
    const god = tenGodOf(dayStem, gan);
    const hidden = hiddenStemsOf(dayStem, zhi);
    const clash = relationLabels(natalBranches, zhi).length > 0;
    const helpful = ["식신", "상관", "정재", "편재", "정관", "정인"].includes(god.korean);
    const score = 55 + (helpful ? 15 : 0) - (clash ? 12 : 0) + (god.korean === "편관" ? 4 : 0);
    items.push({
      startAge: current.getStartAge(),
      endAge: current.getEndAge(),
      gan,
      zhi,
      ganzhi: `${gan}${zhi}`,
      ganzhiKorean: `${STEM_KO[gan]}${BRANCH_KO[zhi]}`,
      tenGod: god.key,
      tenGodKorean: god.korean,
      elements: [STEM_META[gan].element, ...hidden.map((item) => item.element)],
      stars: starsFromScore(score),
      keywords: [god.korean, clash ? "변동" : "운용", helpful ? "활용" : "관리"],
      money: jaeText(god.korean, clash),
      career: careerText(god.korean),
      love: loveText(god.korean),
      health: clash ? "신경과 수면 관리가 필요" : "리듬을 지키면 무난",
      relationship: clash ? "기존 관계가 재배치될 수 있음" : "관계 확장보다 질 관리",
      caution: clash ? "충이 겹치면 이동·이직을 한꺼번에 결정하지 말 것" : "과신이 고착이 되지 않게",
      opportunity: `${god.korean} 대운이므로 ${god.korean}이 가리키는 현실 영역(돈/명예/학습/표현)을 프로젝트화할 시기`,
    });
    current = current.next(1);
  }
  return items;
}

export function buildSeun(
  birthYear: number,
  dayStem: string,
  natalBranches: string[],
  daeun: DaeunItem[],
  eightChar: EightChar,
): SeunItem[] {
  const endYear = new Date().getFullYear() + 20;
  const items: SeunItem[] = [];
  for (let year = birthYear; year <= endYear; year += 1) {
    const cycle = SixtyCycleYear.fromYear(year).getSixtyCycle();
    const gan = cycle.getHeavenStem().getName();
    const zhi = cycle.getEarthBranch().getName();
    const god = tenGodOf(dayStem, gan);
    const age = year - birthYear + 1;
    const daeunNow = daeun.find((item) => age >= item.startAge && age <= item.endAge);
    const natalRel = relationLabels(natalBranches, zhi);
    const daeunRel = daeunNow ? relationLabels([daeunNow.zhi], zhi) : [];
    const yearVoid = eightChar.getDay().getExtraEarthBranches().map((item) => item.getName());
    const sinsalChanges = yearVoid.includes(zhi) ? ["공망 해"] : [];
    if (natalRel.length) sinsalChanges.push(...natalRel);
    const clash = natalRel.length > 0;
    const score = 52 + (["정재", "편재", "식신", "정관", "정인"].includes(god.korean) ? 14 : 0) - (clash ? 14 : 0);
    items.push({
      year,
      age,
      gan,
      zhi,
      ganzhi: `${gan}${zhi}`,
      ganzhiKorean: `${STEM_KO[gan]}${BRANCH_KO[zhi]}`,
      tenGod: god.key,
      tenGodKorean: god.korean,
      element: STEM_META[gan].element,
      relationsWithNatal: natalRel,
      relationsWithDaeun: daeunRel,
      sinsalChanges,
      stars: starsFromScore(score),
      summary: clash ? "원국과 충이 겹쳐 변화가 커질 수 있는 해" : `${god.korean} 세운으로 ${god.korean} 영역이 전면에 나오는 해`,
      career: careerText(god.korean),
      money: jaeText(god.korean, clash),
      love: loveText(god.korean),
    });
  }
  return items;
}

export function daeunDirection(gender: GenderType, yearStem: string): "순행" | "역행" {
  const yang = ["甲", "丙", "戊", "庚", "壬"].includes(yearStem);
  const male = gender === "male";
  return (male && yang) || (!male && !yang) ? "순행" : "역행";
}
