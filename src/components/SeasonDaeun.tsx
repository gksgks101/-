import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { tenGod } from "@/lib/i18n/terms";
import { prose } from "@/lib/i18n/prose";
import type { DaeunItem, SajuCalculation } from "@/lib/saju/types";
import { currentDaeun } from "@/lib/interpret/themeContext";
import { birthYearOf, daeunEasy, daeunSeason, daeunYearRange, type SeasonKey } from "@/lib/interpret/fortuneYears";

function SeasonArt({ season }: { season: SeasonKey }) {
  if (season === "spring") {
    return (
      <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden>
        <circle cx="14" cy="14" r="8" fill="#e8c4c4" />
        <path d="M32 40c0-16 8-24 16-28 0 10 6 18 10 28" fill="#2f6b3a" />
        <circle cx="44" cy="16" r="4" fill="#c41e3a" />
      </svg>
    );
  }
  if (season === "summer") {
    return (
      <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden>
        <circle cx="32" cy="18" r="10" fill="#c41e3a" />
        <path d="M8 40h48c-8-12-16-16-24-16S16 28 8 40z" fill="#d4a017" />
      </svg>
    );
  }
  if (season === "earth") {
    return (
      <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden>
        <path d="M6 36l14-18 12 10 12-14 14 22z" fill="#d4a017" />
        <path d="M6 36h46" stroke="#8c7349" strokeWidth="2" />
      </svg>
    );
  }
  if (season === "autumn") {
    return (
      <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden>
        <path d="M20 40c4-16 10-26 20-32-2 10 2 20 8 32" fill="#b0894a" />
        <circle cx="14" cy="30" r="5" fill="#c41e3a" />
        <circle cx="50" cy="34" r="4" fill="#c43c28" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 48" className="h-12 w-16" aria-hidden>
      <rect x="4" y="28" width="56" height="12" rx="6" fill="#1d4e89" />
      <circle cx="44" cy="14" r="8" fill="#efe6d4" stroke="#1c1612" />
      <path d="M12 24l8 4-8 4" fill="#6b8498" />
    </svg>
  );
}

const SEASON_KEY: Record<SeasonKey, string> = {
  spring: "seasonSpring",
  summer: "seasonSummer",
  earth: "seasonEarth",
  autumn: "seasonAutumn",
  winter: "seasonWinter",
};

export function SeasonDaeun({
  locale,
  chart,
  selected,
  onSelect,
}: {
  locale: Locale;
  chart: SajuCalculation;
  selected: number;
  onSelect: (index: number) => void;
}) {
  const now = currentDaeun(chart);
  const daeun = chart.daeun[selected] ?? chart.daeun[0];
  const birthYear = birthYearOf(chart);

  return (
    <section className="mt-10 hanji-panel rounded-3xl p-6">
      <h3 className="pillar-gan text-2xl">{msg(locale, "daeunTitle")}</h3>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-3">
        {chart.daeun.map((item, index) => {
          const season = daeunSeason(item);
          const isNow = now?.ganzhi === item.ganzhi && now?.startAge === item.startAge;
          const isSelected = selected === index;
          const years = daeunYearRange(birthYear, item.startAge, item.endAge);
          const easy = daeunEasy(item, locale);
          return (
            <button
              key={item.ganzhi + item.startAge}
              type="button"
              onClick={() => onSelect(index)}
              className={`min-w-40 rounded-2xl border px-3 py-3 text-left ${
                isSelected ? "border-[var(--accent)] bg-white/40" : "border-[var(--line)]"
              } ${isNow ? "season-current" : ""}`}
            >
              <SeasonArt season={season} />
              <p className="mt-1 text-xs text-[var(--muted)]">{msg(locale, SEASON_KEY[season])}</p>
              {isNow && <p className="text-xs font-semibold text-[var(--dancheong)]">{msg(locale, "nowLabel")}</p>}
              <p className="pillar-gan text-lg">{item.ganzhi}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--ink)]">
                {item.startAge}~{item.endAge}
                {locale === "ko" ? "세" : locale === "es" ? " años" : " lat"} · {years.from}~{years.to}
                {locale === "ko" ? "년" : ""}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--dancheong)]">{easy.keyword}</p>
              {easy.lines.map((line) => (
                <p key={line.slice(0, 18)} className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  {line}
                </p>
              ))}
            </button>
          );
        })}
      </div>
      {daeun && <DaeunDetail locale={locale} daeun={daeun} />}
    </section>
  );
}

function DaeunDetail({ locale, daeun }: { locale: Locale; daeun: DaeunItem }) {
  return (
    <div className="mt-4 grid gap-3 rounded-2xl border border-[var(--line)] bg-white/40 p-4 text-sm sm:grid-cols-2">
      <p>
        {daeun.ganzhiKorean} · {tenGod(daeun.tenGodKorean, locale)}
      </p>
      <p>
        {msg(locale, "keywords")} {daeun.keywords.join(" · ")}
      </p>
      <p>
        {msg(locale, "career")} {prose(daeun.career, locale)}
      </p>
      <p>
        {msg(locale, "money")} {prose(daeun.money, locale)}
      </p>
      <p>
        {msg(locale, "love")} {prose(daeun.love, locale)}
      </p>
      <p>
        {msg(locale, "health")} {prose(daeun.health, locale)}
      </p>
      <p>
        {msg(locale, "relation")} {prose(daeun.relationship, locale)}
      </p>
      <p>
        {msg(locale, "caution")} {prose(daeun.caution, locale)}
      </p>
      <p className="sm:col-span-2">
        {msg(locale, "opportunity")} {prose(daeun.opportunity, locale)}
      </p>
    </div>
  );
}
