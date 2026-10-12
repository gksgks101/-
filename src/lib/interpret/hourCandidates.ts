import { hourBranchAt } from "@/lib/saju/calendar";
import { BRANCH_KO } from "@/lib/saju/constants";
import { calculateSaju } from "@/lib/saju/engine";
import type { BirthInput, TimeAccuracy } from "@/lib/saju/types";

export interface HourCandidate {
  time: string;
  zhi: string;
  zhiKorean: string;
  ganzhi: string;
  ganzhiKorean: string;
  isCurrent: boolean;
}

function pad(value: number): string {
  return String(((value % 24) + 24) % 24).padStart(2, "0");
}

function shiftTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${pad(Math.floor(wrapped / 60))}:${String(wrapped % 60).padStart(2, "0")}`;
}

function offsetsFor(accuracy: TimeAccuracy | undefined): number[] {
  if (accuracy === "about_1h") return [-60, 0, 60];
  if (accuracy === "about_2_3h") return [-150, 0, 150];
  if (accuracy === "uncertain") return [-180, 0, 180];
  return [0];
}

export function needsHourWarning(input: BirthInput): boolean {
  if (input.timeKnowledge === "unknown") return false;
  if (input.timeKnowledge === "approximate") return true;
  return Boolean(input.timeAccuracy && input.timeAccuracy !== "exact");
}

export function buildHourCandidates(input: BirthInput): HourCandidate[] {
  if (!needsHourWarning(input) || !input.time) return [];
  const offsets =
    input.timeKnowledge === "approximate" && input.timeRangeStart && input.timeRangeEnd
      ? null
      : offsetsFor(input.timeAccuracy);
  const times = new Set<string>();
  times.add(input.time);
  if (offsets) {
    for (const offset of offsets) times.add(shiftTime(input.time, offset));
  } else if (input.timeRangeStart && input.timeRangeEnd) {
    times.add(input.timeRangeStart);
    times.add(input.timeRangeEnd);
  }
  const currentZhi = hourBranchAt(...(input.time.split(":").map(Number) as [number, number]));
  const seen = new Set<string>();
  const candidates: HourCandidate[] = [];
  for (const time of times) {
    const [h, m] = time.split(":").map(Number);
    const zhi = hourBranchAt(h, m);
    if (seen.has(zhi)) continue;
    seen.add(zhi);
    const calc = calculateSaju({ ...input, timeKnowledge: "exact", time }, time);
    const hour = calc.pillars.hour;
    if (!hour) continue;
    candidates.push({
      time,
      zhi,
      zhiKorean: BRANCH_KO[zhi],
      ganzhi: hour.ganzhi,
      ganzhiKorean: hour.ganzhiKorean,
      isCurrent: zhi === currentZhi,
    });
  }
  return candidates.sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
}
