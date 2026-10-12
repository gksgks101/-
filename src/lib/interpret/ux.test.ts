import { describe, expect, it } from "vitest";
import { josa } from "@/lib/i18n/josa";
import { ANIMAL_PAGES, STEM_PAGES } from "@/lib/content/encyclopedia";
import { buildHourCandidates, needsHourWarning } from "./hourCandidates";
import { buildMatchReport } from "./match";
import { buildResultSummary, youAreLine } from "./summary";
import { calculateSaju } from "@/lib/saju/engine";
import { decodeShareQuery, encodeShareQuery, toShareable } from "@/lib/share/resultUrl";
import type { BirthInputPayload } from "@/lib/saju/schema";

const sample: BirthInputPayload = {
  gender: "male",
  calendar: "solar",
  date: "2001-03-23",
  timeKnowledge: "exact",
  time: "13:00",
  timeAccuracy: "about_1h",
  country: "대한민국",
  city: "안산",
};

describe("조사", () => {
  it("받침에 따라 은/는 이/가 을/를을 가른다", () => {
    expect(josa("신사", "은/는")).toBe("신사는");
    expect(josa("편재", "이/가")).toBe("편재가");
    expect(josa("상관", "은/는")).toBe("상관은");
    expect(josa("식신", "을/를")).toBe("식신을");
    expect(josa("계열", "으로/로")).toBe("계열로");
    expect(josa("학습형", "으로/로")).toBe("학습형으로");
  });
});

describe("공유 링크", () => {
  it("이름을 빼고 생일·시간·성별을 왕복한다", () => {
    const encoded = encodeShareQuery(toShareable({ ...sample, name: "김비밀" }));
    expect(encoded).not.toContain("김");
    expect(encoded).not.toContain("name");
    const decoded = decodeShareQuery(new URLSearchParams(encoded));
    expect(decoded?.date).toBe("2001-03-23");
    expect(decoded?.time).toBe("13:00");
    expect(decoded?.gender).toBe("male");
    expect(decoded?.timeAccuracy).toBe("about_1h");
  });
});

describe("시주 후보", () => {
  it("약 1시간 오차이면 경고와 후보가 나온다", () => {
    expect(needsHourWarning(sample)).toBe(true);
    const candidates = buildHourCandidates(sample);
    expect(candidates.length).toBeGreaterThan(1);
    expect(candidates.some((item) => item.isCurrent)).toBe(true);
    expect(new Set(candidates.map((item) => item.zhi)).size).toBe(candidates.length);
  });
});

describe("요약·궁합·백과", () => {
  const self = calculateSaju({ ...sample, name: undefined });
  const other = calculateSaju({
    gender: "female",
    calendar: "solar",
    date: "1998-08-08",
    timeKnowledge: "unknown",
    country: "대한민국",
    city: "서울",
  });

  it("한 줄 유형과 별점 다섯 항목을 만든다", () => {
    const summary = buildResultSummary(self, "ko");
    expect(youAreLine(summary.typeName, "ko")).toContain("형");
    expect(summary.yearKeywords).toHaveLength(3);
    expect(summary.scores.map((item) => item.id)).toEqual(["love", "wealth", "career", "health", "relations"]);
    for (const score of summary.scores) {
      expect(score.stars).toBeGreaterThanOrEqual(1);
      expect(score.stars).toBeLessThanOrEqual(5);
    }
  });

  it("궁합 점수와 설명을 세 언어로 만든다", () => {
    for (const locale of ["ko", "es", "pl"] as const) {
      const report = buildMatchReport(self, other, locale);
      expect(report.score).toBeGreaterThanOrEqual(28);
      expect(report.score).toBeLessThanOrEqual(96);
      expect(report.headline.length).toBeGreaterThan(8);
      expect(report.paragraphs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("일간 10개와 띠 12개 페이지가 있다", () => {
    expect(STEM_PAGES).toHaveLength(10);
    expect(ANIMAL_PAGES).toHaveLength(12);
  });
});
