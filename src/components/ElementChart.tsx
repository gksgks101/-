import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { ELEMENT_COLOR, ELEMENT_NAME, POWER_LABEL } from "@/lib/i18n/terms";
import { elementPercents } from "@/lib/interpret/themes";
import type { ElementCount, ElementKey, ElementStrength } from "@/lib/saju/types";
import { ElementGlyph } from "./MotifIcon";

const ORDER: ElementKey[] = ["wood", "fire", "earth", "metal", "water"];

export function ElementChart({
  locale,
  power,
  simple,
  labels,
}: {
  locale: Locale;
  power: ElementCount;
  simple: ElementCount;
  labels: ElementStrength;
}) {
  const percents = elementPercents(power);
  const max = Math.max(...ORDER.map((key) => power[key]), 1);

  return (
    <article className="hanji-panel rounded-3xl p-5 sm:p-6">
      <h2 className="mb-1 text-sm tracking-[0.2em] text-[var(--muted)]">{msg(locale, "elementsTitle")}</h2>
      <p className="mb-5 text-xs text-[var(--muted)]">{msg(locale, "elementsHint")}</p>

      <div className="mb-6 flex h-4 overflow-hidden rounded-full border border-[var(--line)]">
        {ORDER.map((key) => (
          <div
            key={key}
            title={`${ELEMENT_NAME[locale][key]} ${percents[key]}%`}
            style={{ width: `${percents[key]}%`, background: ELEMENT_COLOR[key] }}
          />
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {ORDER.map((key) => {
          const pct = percents[key];
          const r = 16;
          const c = 2 * Math.PI * r;
          return (
            <div key={key} className="flex flex-col items-center gap-2 text-center">
              <div className="relative">
                <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
                  <circle cx="22" cy="22" r={r} fill="none" stroke="#2a241d" strokeWidth="5" />
                  <circle
                    cx="22"
                    cy="22"
                    r={r}
                    fill="none"
                    stroke={ELEMENT_COLOR[key]}
                    strokeWidth="5"
                    strokeDasharray={`${(pct / 100) * c} ${c}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ElementGlyph element={key} />
                </div>
              </div>
              <p className="text-xs text-[var(--muted)]">{ELEMENT_NAME[locale][key]}</p>
              <p className="pillar-gan text-sm">{pct}%</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {ORDER.map((key) => {
          const width = Math.round((power[key] / max) * 100);
          return (
            <div key={key} className="grid grid-cols-[2.2rem_1fr_3.2rem] items-center gap-3 text-sm">
              <span>{ELEMENT_NAME[locale][key]}</span>
              <div className="h-3 overflow-hidden rounded-full bg-[#2a241d]">
                <div className="h-3 rounded-full transition-[width] duration-700" style={{ width: `${width}%`, background: ELEMENT_COLOR[key] }} />
              </div>
              <span className="text-right text-[var(--muted)]">
                {Math.round(power[key])} · {POWER_LABEL[labels[key]]?.[locale] ?? labels[key]}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">
        {msg(locale, "simpleCount")}
        {ORDER.map((key) => ` ${ELEMENT_NAME[locale][key]}${simple[key]}`).join("")}
      </p>
    </article>
  );
}
