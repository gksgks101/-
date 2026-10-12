import { BRANCH_KO, ELEMENT_KO, STEM_KO } from "./constants";
import { buildEightChar, buildSeason, detectHourBoundary, hourBranchAt, resolveBirth, toSolarTime } from "./calendar";
import { buildDaeun, buildSeun, daeunDirection } from "./fortune";
import { pillarsFromEightChar, stemInfo } from "./pillars";
import {
  analyzeGuimun,
  analyzePattern,
  analyzeStrength,
  analyzeUseGod,
  buildSinsal,
  buildTalents,
  buildWeaknesses,
  countElements,
  dayVoid,
  findRelations,
  scoreCareer,
  scoreWealth,
  tenGodTally,
} from "./rules";
import type { BirthInput, Pillar, SajuCalculation } from "./types";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function cloneWithoutAlternatives(value: SajuCalculation): SajuCalculation {
  return { ...value, alternatives: null };
}

export function calculateSaju(input: BirthInput, timeOverride?: string): SajuCalculation {
  const resolved = resolveBirth(input, timeOverride);
  const solarTime = toSolarTime(resolved);
  const eightChar = buildEightChar(resolved);
  const built = pillarsFromEightChar(eightChar);
  const hourUnknown = input.timeKnowledge === "unknown";
  const pillars = {
    year: built.year,
    month: built.month,
    day: built.day,
    hour: hourUnknown ? null : built.hour,
  };
  const activePillars = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(Boolean) as Pillar[];
  const dayMaster = stemInfo(built.dayStem);
  const elements = countElements(activePillars);
  const tally = tenGodTally(activePillars);
  const relations = findRelations(activePillars);
  const { sinsal, gwiin } = buildSinsal(pillars);
  const voidBranches = dayVoid(pillars.day.ganzhi);
  const strength = analyzeStrength(dayMaster.element, pillars.month.zhi, activePillars, relations, tally);
  const useGod = analyzeUseGod(dayMaster.element, strength, elements.powerLabel);
  const pattern = analyzePattern(pillars.month);
  const natalBranches = activePillars.map((item) => item.zhi);
  const daeun = buildDaeun(solarTime, input.gender, built.dayStem, natalBranches);
  const seun = buildSeun(resolved.solar.year, built.dayStem, natalBranches, daeun, eightChar);
  const guimun = analyzeGuimun(pillars, daeun, seun);
  const wealthTypes = scoreWealth(tally, strength, relations);
  const careerTypes = scoreCareer(tally);
  const weaknesses = buildWeaknesses(tally, strength, relations, guimun);
  const talents = buildTalents(tally, strength, careerTypes);
  const season = buildSeason(solarTime);
  const direction = daeunDirection(input.gender, pillars.year.gan);

  let hourBoundary = null;
  if (input.timeKnowledge === "approximate" && input.timeRangeStart && input.timeRangeEnd && !timeOverride) {
    hourBoundary = detectHourBoundary(input.timeRangeStart, input.timeRangeEnd);
  }

  const evidence = [
    `절기: 현재 ${season.currentJieqiKorean}(${season.currentJieqi}), 시각 ${season.jieqiTime}. 월주는 절입 기준 ${season.monthOrderKorean}.`,
    `년주는 입춘 기준으로 ${pillars.year.ganzhiKorean}(${pillars.year.ganzhi}).`,
    `일간은 ${dayMaster.ganKorean}${ELEMENT_KO[dayMaster.element]}(${dayMaster.gan}), 음양 ${dayMaster.yinYang === "yang" ? "양" : "음"}.`,
    hourUnknown
      ? "출생시간을 몰라 시주를 비웠습니다. 시주 의존 해석은 참고만 하십시오."
      : `시지는 ${pad(resolved.effective.getHours())}:${pad(resolved.effective.getMinutes())} 기준 ${BRANCH_KO[hourBranchAt(resolved.effective.getHours(), resolved.effective.getMinutes())]}시.`,
    `대운은 ${input.gender === "male" ? "남성" : "여성"} + 년간 ${STEM_KO[pillars.year.gan]}(${direction}).`,
    `공망 지지는 ${voidBranches.join(", ") || "없음"}.`,
    resolved.usedTrueSolarTime ? "진태양시/지역시 보정을 적용한 시각으로 계산했습니다." : "시계 시각(표준시) 그대로 계산했습니다.",
    resolved.usedYajaSi ? "야자시를 적용해 23시 이후를 다음날 자시로 보았습니다." : "야자시를 적용하지 않았습니다.",
  ];

  const calculation: SajuCalculation = {
    birth: {
      displayName: input.name?.trim() || "익명",
      gender: input.gender,
      calendar: input.calendar,
      inputDate: input.date,
      solarDate: formatDate(resolved.solar.year, resolved.solar.month, resolved.solar.day),
      lunarDate: `${resolved.lunar.year}-${pad(resolved.lunar.month)}-${pad(resolved.lunar.day)}${resolved.lunar.leap ? " 윤달" : ""}`,
      isLeapMonth: resolved.lunar.leap,
      time: resolved.timeLabel,
      timeKnowledge: input.timeKnowledge,
      timezone: resolved.timezone,
      location: resolved.location,
      usedTrueSolarTime: resolved.usedTrueSolarTime,
      usedYajaSi: resolved.usedYajaSi,
      effectiveDateTime: `${formatDate(resolved.effective.getFullYear(), resolved.effective.getMonth() + 1, resolved.effective.getDate())} ${pad(resolved.effective.getHours())}:${pad(resolved.effective.getMinutes())}`,
    },
    pillars,
    dayMaster,
    elements,
    hiddenStems: {
      year: pillars.year.hiddenStems,
      month: pillars.month.hiddenStems,
      day: pillars.day.hiddenStems,
      hour: pillars.hour?.hiddenStems ?? [],
    },
    tenGods: tally,
    twelveStages: {
      year: pillars.year.twelveStageKorean,
      month: pillars.month.twelveStageKorean,
      day: pillars.day.twelveStageKorean,
      hour: pillars.hour?.twelveStageKorean ?? "미상",
    },
    voidBranches,
    sinsal,
    gwiin,
    relations,
    season,
    strength,
    useGod,
    pattern,
    daeun,
    seun,
    guimun,
    wealthTypes,
    careerTypes,
    weaknesses,
    talents,
    hourBoundary,
    alternatives: null,
    evidence,
  };

  if (hourBoundary?.crossesBoundary && !timeOverride) {
    calculation.alternatives = hourBoundary.cases.map((item) =>
      cloneWithoutAlternatives(calculateSaju({ ...input, timeKnowledge: "exact", time: item.time }, item.time)),
    );
  }

  return calculation;
}

export function calculationToAiJson(calculation: SajuCalculation) {
  return {
    gender: calculation.birth.gender,
    solarDate: calculation.birth.solarDate,
    lunarDate: calculation.birth.lunarDate,
    time: calculation.birth.time,
    location: calculation.birth.location,
    pillars: {
      year: calculation.pillars.year.ganzhi,
      month: calculation.pillars.month.ganzhi,
      day: calculation.pillars.day.ganzhi,
      hour: calculation.pillars.hour?.ganzhi ?? null,
    },
    dayMaster: calculation.dayMaster,
    elements: calculation.elements,
    tenGods: calculation.tenGods,
    twelveStages: calculation.twelveStages,
    hiddenStems: calculation.hiddenStems,
    voidBranches: calculation.voidBranches,
    sinsal: calculation.sinsal,
    gwiin: calculation.gwiin,
    relations: calculation.relations,
    season: calculation.season,
    strength: calculation.strength,
    useGod: calculation.useGod,
    pattern: calculation.pattern,
    daeun: calculation.daeun.map((item) => ({
      startAge: item.startAge,
      endAge: item.endAge,
      ganzhi: item.ganzhi,
      tenGod: item.tenGodKorean,
    })),
    seun: calculation.seun
      .filter((item) => item.year >= new Date().getFullYear() && item.year <= new Date().getFullYear() + 20)
      .map((item) => ({
        year: item.year,
        ganzhi: item.ganzhi,
        tenGod: item.tenGodKorean,
        relationsWithNatal: item.relationsWithNatal,
      })),
    guimun: calculation.guimun,
    wealthTypes: calculation.wealthTypes.slice(0, 4),
    careerTypes: calculation.careerTypes.slice(0, 4),
    weaknesses: calculation.weaknesses,
    talents: calculation.talents,
    evidence: calculation.evidence,
  };
}
