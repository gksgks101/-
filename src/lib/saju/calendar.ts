import {
  EightChar,
  LunarDay,
  LunarHour,
  LunarSect2EightCharProvider,
  SolarDay,
  SolarTime,
  SixtyCycle,
} from "tyme4ts";
import { findCity } from "@/lib/geo/locations";
import {
  BRANCH_KO,
  DEFAULT_TIMEZONE,
  HOUR_BRANCHES,
  JIEQI_KO,
  KST_MERIDIAN,
  MONTH_ORDER,
  STEM_KO,
} from "./constants";
import type { BirthInput, HourBoundaryWarning, SeasonInfo } from "./types";

export interface ResolvedBirth {
  solar: { year: number; month: number; day: number; hour: number; minute: number };
  lunar: { year: number; month: number; day: number; leap: boolean };
  timezone: string;
  location: string;
  longitude: number;
  effective: Date;
  clock: Date;
  usedTrueSolarTime: boolean;
  usedYajaSi: boolean;
  timeLabel: string | null;
}

function parseDate(value: string): { year: number; month: number; day: number } {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    throw new Error("생년월일 형식이 올바르지 않습니다. YYYY-MM-DD로 입력하세요.");
  }
  return { year, month, day };
}

function parseTime(value?: string): { hour: number; minute: number } {
  if (!value) return { hour: 12, minute: 0 };
  const [hour, minute] = value.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error("출생시간 형식이 올바르지 않습니다. HH:mm으로 입력하세요.");
  }
  return { hour, minute };
}

function equationOfTimeMinutes(year: number, month: number, day: number): number {
  const date = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(Date.UTC(year, 0, 0));
  const dayOfYear = (date.getTime() - start.getTime()) / 86400000;
  const b = ((2 * Math.PI) / 365) * (dayOfYear - 81);
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function applyTimeShift(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  shiftMinutes: number,
): { year: number; month: number; day: number; hour: number; minute: number } {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  date.setUTCMinutes(date.getUTCMinutes() + shiftMinutes);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
  };
}

export function hourBranchAt(hour: number, minute: number): string {
  const value = hour + minute / 60;
  if (value >= 23 || value < 1) return "子";
  const found = HOUR_BRANCHES.find((item) => {
    if (item.start < item.end) return value >= item.start && value < item.end;
    return value >= item.start || value < item.end;
  });
  return found?.zhi ?? "子";
}

export function hourStemFromDay(dayStem: string, hourBranch: string): string {
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const dayIndex = stems.indexOf(dayStem);
  const branchIndex = branches.indexOf(hourBranch);
  return stems[(dayIndex % 5) * 2 + branchIndex];
}

export function resolveBirth(input: BirthInput, timeOverride?: string): ResolvedBirth {
  const city = findCity(input.country, input.city);
  const raw = parseDate(input.date);
  const clockTime =
    input.timeKnowledge === "unknown" ? { hour: 12, minute: 0 } : parseTime(timeOverride ?? input.time);

  let solar = { ...raw, ...clockTime };
  let lunar = { year: raw.year, month: raw.month, day: raw.day, leap: Boolean(input.isLeapMonth) };

  if (input.calendar === "lunar") {
    const lunarDay = LunarDay.fromYmd(raw.year, input.isLeapMonth ? -raw.month : raw.month, raw.day);
    const solarDay = lunarDay.getSolarDay();
    solar = {
      year: solarDay.getYear(),
      month: solarDay.getMonth(),
      day: solarDay.getDay(),
      hour: clockTime.hour,
      minute: clockTime.minute,
    };
    lunar = {
      year: lunarDay.getYear(),
      month: Math.abs(lunarDay.getMonth()),
      day: lunarDay.getDay(),
      leap: lunarDay.getLunarMonth().isLeap(),
    };
  } else {
    const solarDay = SolarDay.fromYmd(raw.year, raw.month, raw.day);
    const lunarDay = solarDay.getLunarDay();
    lunar = {
      year: lunarDay.getYear(),
      month: Math.abs(lunarDay.getMonth()),
      day: lunarDay.getDay(),
      leap: lunarDay.getLunarMonth().isLeap(),
    };
  }

  let shift = 0;
  if (input.useLocalMeanCorrection || input.useTrueSolarTime) {
    const meridian = city.timezone === "Asia/Seoul" || city.timezone === "Asia/Tokyo" ? KST_MERIDIAN : city.longitude;
    shift -= (meridian - city.longitude) * 4;
  }
  if (input.useTrueSolarTime) {
    shift += equationOfTimeMinutes(solar.year, solar.month, solar.day);
  }

  const effective = shift === 0 ? solar : applyTimeShift(solar.year, solar.month, solar.day, solar.hour, solar.minute, shift);
  const timeLabel =
    input.timeKnowledge === "unknown"
      ? null
      : `${String(clockTime.hour).padStart(2, "0")}:${String(clockTime.minute).padStart(2, "0")}`;

  return {
    solar,
    lunar,
    timezone: city.timezone || DEFAULT_TIMEZONE,
    location: `${city.country} ${city.name}`,
    longitude: city.longitude,
    effective: new Date(effective.year, effective.month - 1, effective.day, effective.hour, effective.minute),
    clock: new Date(solar.year, solar.month - 1, solar.day, solar.hour, solar.minute),
    usedTrueSolarTime: Boolean(input.useTrueSolarTime || input.useLocalMeanCorrection),
    usedYajaSi: Boolean(input.useYajaSi),
    timeLabel,
  };
}

export function toSolarTime(resolved: ResolvedBirth): SolarTime {
  const d = resolved.effective;
  return SolarTime.fromYmdHms(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), 0);
}

export function buildEightChar(resolved: ResolvedBirth): EightChar {
  const solarTime = toSolarTime(resolved);
  if (resolved.usedYajaSi) {
    return solarTime.getSixtyCycleHour().getEightChar();
  }
  const previous = LunarHour.provider;
  LunarHour.provider = new LunarSect2EightCharProvider();
  try {
    const eightChar = solarTime.getLunarHour().getEightChar();
    if (resolved.effective.getHours() >= 23) {
      const day = eightChar.getDay();
      const hourBranch = hourBranchAt(resolved.effective.getHours(), resolved.effective.getMinutes());
      const hourStem = hourStemFromDay(day.getHeavenStem().getName(), hourBranch);
      return new EightChar(eightChar.getYear(), eightChar.getMonth(), day, SixtyCycle.fromName(`${hourStem}${hourBranch}`));
    }
    return eightChar;
  } finally {
    LunarHour.provider = previous;
  }
}

function formatTymeDateTime(value: string): string {
  return value.replace("年", "-").replace("月", "-").replace("日", " ").trim();
}

export function buildSeason(solarTime: SolarTime): SeasonInfo {
  const current = solarTime.getTerm();
  const previous = current.next(-1);
  const next = current.next(1);
  const monthBranch = solarTime.getSixtyCycleHour().getMonth().getEarthBranch().getName();
  const month = MONTH_ORDER[monthBranch];
  return {
    currentJieqi: current.getName(),
    currentJieqiKorean: JIEQI_KO[current.getName()] ?? current.getName(),
    previousJieqi: previous.getName(),
    previousJieqiKorean: JIEQI_KO[previous.getName()] ?? previous.getName(),
    nextJieqi: next.getName(),
    nextJieqiKorean: JIEQI_KO[next.getName()] ?? next.getName(),
    monthOrder: month?.name ?? `${monthBranch}월`,
    monthOrderKorean: month?.korean ?? monthBranch,
    jieqiTime: formatTymeDateTime(current.getJulianDay().getSolarTime().toString()),
  };
}

export function detectHourBoundary(start: string, end: string): HourBoundaryWarning {
  const a = parseTime(start);
  const b = parseTime(end);
  const startMinutes = a.hour * 60 + a.minute;
  const endMinutes = b.hour * 60 + b.minute;
  const boundaries = [60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140, 1260, 1380];
  const crossed = boundaries.filter((mark) => startMinutes < mark && endMinutes >= mark);
  const sampleTimes = [start];
  for (const mark of crossed) {
    const hour = Math.floor(mark / 60);
    const minute = mark % 60;
    sampleTimes.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }
  const unique = [...new Set(sampleTimes)];
  const cases = unique.map((time) => {
    const parsed = parseTime(time);
    const zhi = hourBranchAt(parsed.hour, parsed.minute);
    return {
      label: `${time} 기준`,
      time,
      hourBranch: zhi,
      hourBranchKorean: BRANCH_KO[zhi],
      hourPillar: `${STEM_KO[hourStemFromDay("甲", zhi)] ?? ""}${BRANCH_KO[zhi]}시`,
    };
  });
  const uniqueBranches = [...new Set(cases.map((item) => item.hourBranch))];
  return {
    crossesBoundary: uniqueBranches.length > 1,
    message:
      uniqueBranches.length > 1
        ? `입력하신 시간 범위가 시주 경계에 걸쳐 있습니다. ${uniqueBranches
            .map((zhi) => `${BRANCH_KO[zhi]}시(${zhi})`)
            .join(" / ")}의 결과가 달라질 수 있습니다.`
        : "입력하신 시간 범위는 같은 시주 안에 있습니다.",
    cases,
  };
}
