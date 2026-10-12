import { EarthBranch, HeavenStem, type EightChar } from "tyme4ts";
import {
  BRANCH_META,
  ELEMENT_KO,
  HIDDEN_ROLE_KO,
  HIDDEN_ROLES,
  HIDDEN_STEMS,
  NAEUM,
  STEM_META,
  TEN_GOD_KO,
  TWELVE_KO,
} from "./constants";
import type { HiddenStem, Pillar, StemInfo } from "./types";

export function stemInfo(gan: string): StemInfo {
  const meta = STEM_META[gan];
  return {
    gan,
    ganKorean: meta.korean,
    element: meta.element,
    elementKorean: ELEMENT_KO[meta.element],
    yinYang: meta.yinYang,
  };
}

export function tenGodOf(dayStem: string, targetStem: string): { key: string; korean: string } {
  const name = HeavenStem.fromName(dayStem).getTenStar(HeavenStem.fromName(targetStem)).getName();
  return { key: name, korean: TEN_GOD_KO[name] ?? name };
}

export function twelveStageOf(dayStem: string, branch: string): { key: string; korean: string } {
  const name = HeavenStem.fromName(dayStem).getTerrain(EarthBranch.fromName(branch)).getName();
  return { key: name, korean: TWELVE_KO[name] ?? name };
}

export function hiddenStemsOf(dayStem: string, branch: string): HiddenStem[] {
  return (HIDDEN_STEMS[branch] ?? []).map((gan, index) => {
    const god = tenGodOf(dayStem, gan);
    const role = HIDDEN_ROLES[Math.min(index, HIDDEN_ROLES.length - 1)];
    return {
      gan,
      ganKorean: STEM_META[gan].korean,
      element: STEM_META[gan].element,
      tenGod: god.key,
      tenGodKorean: god.korean,
      role,
      roleKorean: HIDDEN_ROLE_KO[role],
    };
  });
}

export function buildPillar(dayStem: string, gan: string, zhi: string): Pillar {
  const ganMeta = STEM_META[gan];
  const zhiMeta = BRANCH_META[zhi];
  const ganGod = tenGodOf(dayStem, gan);
  const mainHidden = (HIDDEN_STEMS[zhi] ?? [])[0] ?? gan;
  const zhiGod = tenGodOf(dayStem, mainHidden);
  const stage = twelveStageOf(dayStem, zhi);
  const ganzhi = `${gan}${zhi}`;
  return {
    gan,
    zhi,
    ganzhi,
    ganKorean: ganMeta.korean,
    zhiKorean: zhiMeta.korean,
    ganzhiKorean: `${ganMeta.korean}${zhiMeta.korean}`,
    ganElement: ganMeta.element,
    zhiElement: zhiMeta.element,
    ganTenGod: ganGod.key,
    ganTenGodKorean: ganGod.korean,
    zhiTenGod: zhiGod.key,
    zhiTenGodKorean: zhiGod.korean,
    twelveStage: stage.key,
    twelveStageKorean: stage.korean,
    hiddenStems: hiddenStemsOf(dayStem, zhi),
    naeum: NAEUM[ganzhi] ?? "",
  };
}

export function pillarsFromEightChar(eightChar: EightChar) {
  const dayStem = eightChar.getDay().getHeavenStem().getName();
  return {
    year: buildPillar(dayStem, eightChar.getYear().getHeavenStem().getName(), eightChar.getYear().getEarthBranch().getName()),
    month: buildPillar(dayStem, eightChar.getMonth().getHeavenStem().getName(), eightChar.getMonth().getEarthBranch().getName()),
    day: buildPillar(dayStem, eightChar.getDay().getHeavenStem().getName(), eightChar.getDay().getEarthBranch().getName()),
    hour: buildPillar(dayStem, eightChar.getHour().getHeavenStem().getName(), eightChar.getHour().getEarthBranch().getName()),
    dayStem,
  };
}
