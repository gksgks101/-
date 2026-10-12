"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { ELEMENT_COLOR, ELEMENT_NAME } from "@/lib/i18n/terms";
import { amountLevel, elementBalloon, strongestMetaphor } from "@/lib/interpret/elementGuide";
import { elementPercents } from "@/lib/interpret/themes";
import type { ElementCount, ElementKey, ElementStrength } from "@/lib/saju/types";
import { ElementGlyph } from "./MotifIcon";

const ORDER: ElementKey[] = ["wood", "fire", "earth", "metal", "water"];
const CX = 100;
const CY = 100;
const OUTER = 78;
const INNER = 46;

function polar(cx: number, cy: number, r: number, angle: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function donutSlice(start: number, end: number): string {
  const large = end - start > 180 ? 1 : 0;
  const [x1, y1] = polar(CX, CY, OUTER, start);
  const [x2, y2] = polar(CX, CY, OUTER, end);
  const [x3, y3] = polar(CX, CY, INNER, end);
  const [x4, y4] = polar(CX, CY, INNER, start);
  return `M ${x1} ${y1} A ${OUTER} ${OUTER} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${INNER} ${INNER} 0 ${large} 0 ${x4} ${y4} Z`;
}

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
  const strongest = [...ORDER].sort((a, b) => percents[b] - percents[a])[0];
  const [pinned, setPinned] = useState<ElementKey | null>(null);
  const [hover, setHover] = useState<ElementKey | null>(null);
  const active = hover ?? pinned;
  const sweeps = ORDER.map((key) => (percents[key] / 100) * 360);
  const starts = ORDER.map((_, index) => sweeps.slice(0, index).reduce((sum, value) => sum + value, 0));
  const slices = ORDER.map((key, index) => ({
    key,
    start: starts[index],
    end: starts[index] + Math.max(sweeps[index], percents[key] > 0 ? 2 : 0),
    pct: percents[key],
  }));
  const balloon = active ? elementBalloon(active, percents[active], labels[active], locale) : null;

  function toggle(key: ElementKey) {
    setPinned((value) => (value === key ? null : key));
  }

  return (
    <article className="hanji-panel rounded-3xl p-5 sm:p-6">
      <h2 className="mb-1 text-sm tracking-[0.2em] text-[var(--muted)]">{msg(locale, "elementsTitle")}</h2>
      <p className="mb-5 text-xs text-[var(--muted)]">{msg(locale, "elementsDonutHint")}</p>

      <div className="relative mx-auto w-full max-w-[280px]">
        <svg viewBox="0 0 200 200" className="h-auto w-full">
          {slices.map((slice) => (
            <path
              key={slice.key}
              d={donutSlice(slice.start, slice.end)}
              fill={ELEMENT_COLOR[slice.key]}
              stroke={slice.key === "metal" ? "#8c7349" : "rgba(28,22,18,0.18)"}
              strokeWidth={slice.key === "metal" ? 1.6 : 0.8}
              className="cursor-pointer transition-opacity"
              opacity={active && active !== slice.key ? 0.45 : 1}
              onMouseEnter={() => setHover(slice.key)}
              onMouseLeave={() => setHover(null)}
              onClick={(event) => {
                event.stopPropagation();
                toggle(slice.key);
              }}
            />
          ))}
          <text x={CX} y={CY - 8} textAnchor="middle" className="pillar-gan" fill="#1c1612" fontSize="18">
            {ELEMENT_NAME[locale][strongest]}
          </text>
          <text x={CX} y={CY + 16} textAnchor="middle" fill="#4a433c" fontSize="13">
            {percents[strongest]}%
          </text>
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1 text-center">
        {ORDER.map((key) => (
          <button
            key={key}
            type="button"
            className={`rounded-xl px-1 py-2 text-xs sm:text-sm ${active === key ? "bg-white/70" : ""}`}
            onMouseEnter={() => setHover(key)}
            onMouseLeave={() => setHover(null)}
            onClick={() => toggle(key)}
          >
            <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center">
              <ElementGlyph element={key} />
            </span>
            <span className="block text-[var(--ink)]">{ELEMENT_NAME[locale][key]}</span>
            <span className="block font-semibold">{percents[key]}%</span>
          </button>
        ))}
      </div>

      {balloon && (
        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-sm leading-7 text-[var(--ink)] shadow-sm">
          <p className="font-semibold text-[var(--dancheong)]">{balloon.title}</p>
          <p className="mt-2">{balloon.meaning}</p>
          <p className="mt-2">{balloon.much}</p>
          <p className="mt-2">{balloon.little}</p>
          <p className="mt-2 font-semibold">{balloon.mine}</p>
          <p className="mt-2 text-[var(--muted)]">{balloon.tip}</p>
        </div>
      )}

      <p className="mt-5 text-base font-semibold leading-7 text-[var(--ink)]">{strongestMetaphor(strongest, locale)}</p>
      {amountLevel(percents[strongest], labels[strongest]) !== "많음" && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          {elementBalloon(strongest, percents[strongest], labels[strongest], locale).mine}
        </p>
      )}
      <p className="mt-4 text-xs text-[var(--muted)]">
        {msg(locale, "simpleCount")}
        {ORDER.map((key) => ` ${ELEMENT_NAME[locale][key]}${simple[key]}`).join("")}
      </p>
    </article>
  );
}
