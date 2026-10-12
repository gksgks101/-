import { describe, expect, it } from "vitest";
import { hourBranchAt } from "./calendar";
import { calculateSaju } from "./engine";
import { dayVoid } from "./rules";
import type { BirthInput } from "./types";

const base = {
  gender: "male" as const,
  calendar: "solar" as const,
  date: "2001-03-23",
  timeKnowledge: "exact" as const,
  country: "대한민국",
  city: "안산",
  useYajaSi: false,
  useTrueSolarTime: false,
};

function input(time: string, extra: Partial<BirthInput> = {}): BirthInput {
  return { ...base, time, ...extra };
}

describe("2001-03-23 안산 남성 기준 사주", () => {
  it("13:00은 신사년 신묘월 을유일 계미시로 고정된다", () => {
    const result = calculateSaju(input("13:00"));
    expect(result.pillars.year.ganzhi).toBe("辛巳");
    expect(result.pillars.month.ganzhi).toBe("辛卯");
    expect(result.pillars.day.ganzhi).toBe("乙酉");
    expect(result.pillars.hour?.ganzhi).toBe("癸未");
    expect(result.dayMaster.gan).toBe("乙");
    expect(result.dayMaster.element).toBe("wood");
    expect(result.birth.location).toContain("안산");
  });

  it("같은 입력은 항상 같은 원국을 반환한다", () => {
    const a = calculateSaju(input("13:00"));
    const b = calculateSaju(input("13:00"));
    expect(a.pillars).toEqual(b.pillars);
    expect(a.dayMaster).toEqual(b.dayMaster);
    expect(a.voidBranches).toEqual(b.voidBranches);
  });

  it("未시 경계를 시각별로 정확히 가른다", () => {
    const cases = [
      ["11:00", "壬午"],
      ["12:00", "壬午"],
      ["12:59", "壬午"],
      ["13:00", "癸未"],
      ["13:30", "癸未"],
      ["14:00", "癸未"],
      ["14:59", "癸未"],
      ["15:00", "甲申"],
    ] as const;
    for (const [time, hour] of cases) {
      const result = calculateSaju(input(time));
      expect(result.pillars.hour?.ganzhi, time).toBe(hour);
    }
  });

  it("대략 시간 12:00~14:00이면 오시/미시 비교를 제안한다", () => {
    const result = calculateSaju({
      ...base,
      timeKnowledge: "approximate",
      time: "13:00",
      timeRangeStart: "12:00",
      timeRangeEnd: "14:00",
    });
    expect(result.hourBoundary?.crossesBoundary).toBe(true);
    expect(result.hourBoundary?.cases.some((item) => item.hourBranch === "午")).toBe(true);
    expect(result.hourBoundary?.cases.some((item) => item.hourBranch === "未")).toBe(true);
    expect(result.alternatives?.length).toBeGreaterThan(0);
  });
});

describe("절입과 자시", () => {
  it("2001 입춘 직전은 경진년, 직후는 신사년", () => {
    const before = calculateSaju(input("01:00", { date: "2001-02-04" }));
    const after = calculateSaju(input("03:30", { date: "2001-02-04" }));
    expect(before.pillars.year.ganzhi).toBe("庚辰");
    expect(after.pillars.year.ganzhi).toBe("辛巳");
  });

  it("경칩 직전은 인월, 직후는 묘월", () => {
    const before = calculateSaju(input("19:00", { date: "2001-03-05" }));
    const after = calculateSaju(input("21:00", { date: "2001-03-05" }));
    expect(before.pillars.month.zhi).toBe("寅");
    expect(after.pillars.month.zhi).toBe("卯");
  });

  it("자시와 야자시 옵션이 23:00 일주를 다르게 만든다", () => {
    const off = calculateSaju(input("23:00", { useYajaSi: false }));
    const on = calculateSaju(input("23:00", { useYajaSi: true }));
    expect(off.pillars.day.ganzhi).toBe("乙酉");
    expect(on.pillars.day.ganzhi).toBe("丙戌");
    expect(off.pillars.hour?.zhi).toBe("子");
    expect(on.pillars.hour?.zhi).toBe("子");
  });

  it("00:30은 당일 늦은 자시로 계산된다", () => {
    const result = calculateSaju(input("00:30"));
    expect(result.pillars.hour?.zhi).toBe("子");
    expect(result.pillars.day.ganzhi).toBe("乙酉");
  });
});

describe("명리 규칙", () => {
  it("을유 공망은 오미이다", () => {
    expect(dayVoid("乙酉")).toEqual(["午", "未"]);
  });

  it("시지 함수는 13:00을 未로 본다", () => {
    expect(hourBranchAt(12, 59)).toBe("午");
    expect(hourBranchAt(13, 0)).toBe("未");
  });

  it("지장간·십성·12운성·대운·세운이 비어 있지 않다", () => {
    const result = calculateSaju(input("13:00"));
    expect(result.pillars.day.hiddenStems[0]?.gan).toBe("辛");
    expect(result.pillars.year.ganTenGodKorean).toBe("편관");
    expect(result.twelveStages.year).toBe("목욕");
    expect(result.daeun.length).toBeGreaterThanOrEqual(8);
    expect(result.seun.some((item) => item.year === 2026)).toBe(true);
    expect(result.strength.reasons.length).toBeGreaterThan(0);
    expect(result.useGod.yongsin.length).toBeGreaterThan(0);
  });
});
