import type { BirthInputPayload } from "@/lib/saju/schema";

export type ShareableBirth = Pick<
  BirthInputPayload,
  | "gender"
  | "calendar"
  | "date"
  | "isLeapMonth"
  | "timeKnowledge"
  | "time"
  | "timeRangeStart"
  | "timeRangeEnd"
  | "timeAccuracy"
  | "country"
  | "city"
  | "useLocalMeanCorrection"
  | "useYajaSi"
  | "useTrueSolarTime"
>;

export function toShareable(input: BirthInputPayload): ShareableBirth {
  return {
    gender: input.gender,
    calendar: input.calendar,
    date: input.date,
    isLeapMonth: input.isLeapMonth,
    timeKnowledge: input.timeKnowledge,
    time: input.time,
    timeRangeStart: input.timeRangeStart,
    timeRangeEnd: input.timeRangeEnd,
    timeAccuracy: input.timeAccuracy,
    country: input.country,
    city: input.city,
    useLocalMeanCorrection: input.useLocalMeanCorrection,
    useYajaSi: input.useYajaSi,
    useTrueSolarTime: input.useTrueSolarTime,
  };
}

export function encodeShareQuery(input: ShareableBirth): string {
  const params = new URLSearchParams();
  params.set("g", input.gender === "female" ? "f" : "m");
  params.set("cal", input.calendar === "lunar" ? "l" : "s");
  params.set("d", input.date);
  if (input.isLeapMonth) params.set("leap", "1");
  params.set("tk", input.timeKnowledge === "unknown" ? "u" : input.timeKnowledge === "approximate" ? "a" : "e");
  if (input.time) params.set("t", input.time);
  if (input.timeRangeStart) params.set("ts", input.timeRangeStart);
  if (input.timeRangeEnd) params.set("te", input.timeRangeEnd);
  if (input.timeAccuracy && input.timeAccuracy !== "exact") params.set("ta", input.timeAccuracy);
  params.set("co", input.country);
  params.set("ci", input.city);
  if (input.useLocalMeanCorrection) params.set("lm", "1");
  if (input.useYajaSi) params.set("yj", "1");
  if (input.useTrueSolarTime) params.set("tt", "1");
  return params.toString();
}

export function decodeShareQuery(search: URLSearchParams): ShareableBirth | null {
  const date = search.get("d");
  const country = search.get("co");
  const city = search.get("ci");
  if (!date || !country || !city) return null;
  const tk = search.get("tk");
  const ta = search.get("ta");
  const timeAccuracy =
    ta === "about_1h" || ta === "about_2_3h" || ta === "uncertain" || ta === "exact" ? ta : "exact";
  return {
    gender: search.get("g") === "f" ? "female" : "male",
    calendar: search.get("cal") === "l" ? "lunar" : "solar",
    date,
    isLeapMonth: search.get("leap") === "1",
    timeKnowledge: tk === "u" ? "unknown" : tk === "a" ? "approximate" : "exact",
    time: search.get("t") ?? undefined,
    timeRangeStart: search.get("ts") ?? undefined,
    timeRangeEnd: search.get("te") ?? undefined,
    timeAccuracy,
    country,
    city,
    useLocalMeanCorrection: search.get("lm") === "1",
    useYajaSi: search.get("yj") === "1",
    useTrueSolarTime: search.get("tt") === "1",
  };
}
