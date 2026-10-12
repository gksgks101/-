"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, COUNTRIES, citiesFor } from "@/lib/geo/locations";
import type { BirthInputPayload } from "@/lib/saju/schema";

const STEPS = ["절기 확인", "년주 계산", "월주 계산", "일주 계산", "시주 계산", "오행 분석", "십성 분석", "대운 계산", "세운 계산"];
const selectClass = "w-full rounded-xl border border-[var(--line)] bg-[#161310] px-3 py-3 outline-none focus:border-[var(--gold)]";

export function BirthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [advanced, setAdvanced] = useState(false);
  const [form, setForm] = useState<BirthInputPayload>({
    name: "",
    gender: "male",
    calendar: "solar",
    date: "2001-03-23",
    isLeapMonth: false,
    timeKnowledge: "exact",
    time: "13:00",
    timeRangeStart: "12:00",
    timeRangeEnd: "14:00",
    timeAccuracy: "exact",
    country: "대한민국",
    city: "서울",
    useLocalMeanCorrection: false,
    useYajaSi: false,
    useTrueSolarTime: false,
    unlockFull: true,
    useLlm: false,
  });

  const cityOptions = useMemo(() => citiesFor(form.country), [form.country]);
  const [year, month, day] = form.date.split("-");
  const [hour, minute] = (form.time ?? "13:00").split(":");
  const [rangeStartHour, rangeStartMinute] = (form.timeRangeStart ?? "12:00").split(":");
  const [rangeEndHour, rangeEndMinute] = (form.timeRangeEnd ?? "14:00").split(":");
  const years = Array.from({ length: 151 }, (_, index) => String(1900 + index));
  const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

  function update<K extends keyof BirthInputPayload>(key: K, value: BirthInputPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setDatePart(part: "year" | "month" | "day", value: string) {
    const next = { year, month, day, [part]: value };
    update("date", `${next.year}-${next.month}-${next.day}`);
  }

  function setClock(which: "time" | "timeRangeStart" | "timeRangeEnd", nextHour: string, nextMinute: string) {
    update(which, `${nextHour}:${nextMinute}`);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    setStep(0);
    const timer = window.setInterval(() => {
      setStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 220);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "분석에 실패했습니다.");
      sessionStorage.setItem("saju-result", JSON.stringify(data));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "분석에 실패했습니다.");
    } finally {
      window.clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block">
        <span className="mb-2 block text-xs tracking-[0.18em] text-[var(--muted)]">이름 (화면 표시용)</span>
        <input
          value={form.name ?? ""}
          onChange={(event) => update("name", event.target.value)}
          placeholder="김○○"
          className="w-full rounded-xl border border-[var(--line)] bg-[#161310] px-4 py-3 outline-none focus:border-[var(--gold)]"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">성별</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["male", "남성"],
              ["female", "여성"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => update("gender", value as "male" | "female")}
                className={`rounded-xl border px-4 py-3 ${form.gender === value ? "border-[var(--gold)] bg-[#241d16] text-[var(--gold)]" : "border-[var(--line)]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">달력</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["solar", "양력"],
              ["lunar", "음력"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => update("calendar", value as "solar" | "lunar")}
                className={`rounded-xl border px-4 py-3 ${form.calendar === value ? "border-[var(--gold)] bg-[#241d16] text-[var(--gold)]" : "border-[var(--line)]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">생년월일</legend>
        <div className="grid grid-cols-3 gap-2">
          <label>
            <span className="mb-1 block text-xs text-[var(--muted)]">년</span>
            <select value={year} onChange={(event) => setDatePart("year", event.target.value)} className={selectClass}>
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}년
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-[var(--muted)]">월</span>
            <select value={month} onChange={(event) => setDatePart("month", event.target.value)} className={selectClass}>
              {months.map((item) => (
                <option key={item} value={item}>
                  {Number(item)}월
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-[var(--muted)]">일</span>
            <select value={day} onChange={(event) => setDatePart("day", event.target.value)} className={selectClass}>
              {days.map((item) => (
                <option key={item} value={item}>
                  {Number(item)}일
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      {form.calendar === "lunar" && (
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={Boolean(form.isLeapMonth)} onChange={(event) => update("isLeapMonth", event.target.checked)} />
          윤달입니다
        </label>
      )}

      <fieldset>
        <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">출생시간</legend>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["exact", "정확히 알고 있음"],
            ["approximate", "대략 알고 있음"],
            ["unknown", "모름"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => update("timeKnowledge", value as BirthInputPayload["timeKnowledge"])}
              className={`rounded-xl border px-3 py-3 text-sm ${form.timeKnowledge === value ? "border-[var(--gold)] bg-[#241d16] text-[var(--gold)]" : "border-[var(--line)]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {form.timeKnowledge === "exact" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">시각 (24시간)</legend>
            <div className="grid grid-cols-2 gap-2">
              <select value={hour} onChange={(event) => setClock("time", event.target.value, minute)} className={selectClass}>
                {hours.map((item) => (
                  <option key={item} value={item}>
                    {item}시
                  </option>
                ))}
              </select>
              <select value={minute} onChange={(event) => setClock("time", hour, event.target.value)} className={selectClass}>
                {minutes.map((item) => (
                  <option key={item} value={item}>
                    {item}분
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.18em] text-[var(--muted)]">정확도</span>
            <select
              value={form.timeAccuracy}
              onChange={(event) => update("timeAccuracy", event.target.value as BirthInputPayload["timeAccuracy"])}
              className={selectClass}
            >
              <option value="exact">정확함</option>
              <option value="about_1h">약 1시간 오차</option>
              <option value="about_2_3h">약 2~3시간 오차</option>
              <option value="uncertain">정확하지 않음</option>
            </select>
          </label>
        </div>
      )}

      {form.timeKnowledge === "approximate" && (
        <div className="space-y-4">
          <fieldset>
            <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">시작 (24시간)</legend>
            <div className="grid grid-cols-2 gap-2">
              <select value={rangeStartHour} onChange={(event) => setClock("timeRangeStart", event.target.value, rangeStartMinute)} className={selectClass}>
                {hours.map((item) => (
                  <option key={item} value={item}>
                    {item}시
                  </option>
                ))}
              </select>
              <select value={rangeStartMinute} onChange={(event) => setClock("timeRangeStart", rangeStartHour, event.target.value)} className={selectClass}>
                {minutes.map((item) => (
                  <option key={item} value={item}>
                    {item}분
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs tracking-[0.18em] text-[var(--muted)]">끝 (24시간)</legend>
            <div className="grid grid-cols-2 gap-2">
              <select value={rangeEndHour} onChange={(event) => setClock("timeRangeEnd", event.target.value, rangeEndMinute)} className={selectClass}>
                {hours.map((item) => (
                  <option key={item} value={item}>
                    {item}시
                  </option>
                ))}
              </select>
              <select value={rangeEndMinute} onChange={(event) => setClock("timeRangeEnd", rangeEndHour, event.target.value)} className={selectClass}>
                {minutes.map((item) => (
                  <option key={item} value={item}>
                    {item}분
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <p className="text-sm text-[var(--muted)]">예: 12시~14시처럼 범위를 넣으면 오시/미시 경계를 자동으로 검사합니다.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs tracking-[0.18em] text-[var(--muted)]">출생국가</span>
          <select
            value={form.country}
            onChange={(event) => {
              const country = event.target.value;
              const nextCity = citiesFor(country)[0]?.name ?? form.city;
              setForm((prev) => ({ ...prev, country, city: nextCity }));
            }}
            className={selectClass}
          >
            {COUNTRIES.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs tracking-[0.18em] text-[var(--muted)]">출생도시</span>
          <select value={form.city} onChange={(event) => update("city", event.target.value)} className={selectClass}>
            {(cityOptions.length ? cityOptions : CITIES).map((city) => (
              <option key={city.name}>{city.name}</option>
            ))}
          </select>
        </label>
      </div>

      <button type="button" onClick={() => setAdvanced((value) => !value)} className="text-sm text-[var(--gold)] underline-offset-4 hover:underline">
        {advanced ? "고급 설정 닫기" : "고급 설정"}
      </button>

      {advanced && (
        <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[#14110e] p-4 text-sm">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={Boolean(form.useLocalMeanCorrection)} onChange={(event) => update("useLocalMeanCorrection", event.target.checked)} />
            한국식 표준시/지역시 보정 사용
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={Boolean(form.useTrueSolarTime)} onChange={(event) => update("useTrueSolarTime", event.target.checked)} />
            진태양시 보정 사용
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={Boolean(form.useYajaSi)} onChange={(event) => update("useYajaSi", event.target.checked)} />
            야자시 적용 (23시 이후를 다음날로)
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={Boolean(form.useLlm)} onChange={(event) => update("useLlm", event.target.checked)} />
            AI 문장 윤문 사용 (서버 API 키 필요, 이름은 전송하지 않음)
          </label>
        </div>
      )}

      {error && <p className="text-sm text-[#d28b7a]">{error}</p>}

      {loading && (
        <div className="space-y-2 rounded-2xl border border-[var(--line)] p-4">
          <p className="text-sm text-[var(--gold)]">사주 계산 중...</p>
          <ul className="space-y-1 text-sm text-[var(--muted)]">
            {STEPS.map((label, index) => (
              <li key={label}>
                {index <= step ? "✓" : "·"} {label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--gold)] py-4 font-medium text-[#1a140e] transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "만세력 계산 중" : "사주 분석 시작"}
      </button>
    </form>
  );
}
