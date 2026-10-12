"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import type { ThemeCardData } from "@/lib/interpret/themes";
import { ThemeFlipCard } from "./ThemeFlipCard";

export function ThemeDeck({ themes, locale }: { themes: ThemeCardData[]; locale: Locale }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const current = themes[index];

  function onTouchStart(event: React.TouchEvent) {
    startX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
    if (dx > 48) setIndex((value) => Math.max(0, value - 1));
    if (dx < -48) setIndex((value) => Math.min(themes.length - 1, value + 1));
    startX.current = null;
  }

  return (
    <>
      <div className="mt-6 hidden grid-cols-2 gap-4 md:grid md:auto-rows-fr">
        {themes.map((theme, themeIndex) => (
          <div key={theme.id} className="min-h-[420px]">
            <ThemeFlipCard theme={theme} locale={locale} hintShake={themeIndex === 0} />
          </div>
        ))}
      </div>

      <div className="mt-6 md:hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <p className="mb-3 text-center text-base font-medium text-[var(--ink)]">{msg(locale, "swipeHint")}</p>
        <div className="min-h-[460px]">{current && <ThemeFlipCard theme={current} locale={locale} hintShake={index === 0} />}</div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
          >
            ←
          </button>
          <p className="text-sm text-[var(--muted)]">
            {index + 1} / {themes.length}
          </p>
          <button
            type="button"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
            onClick={() => setIndex((value) => Math.min(themes.length - 1, value + 1))}
            disabled={index === themes.length - 1}
          >
            →
          </button>
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {themes.map((theme, themeIndex) => (
            <button
              key={theme.id}
              type="button"
              aria-label={theme.title}
              className={`h-2 w-2 rounded-full ${themeIndex === index ? "bg-[var(--dancheong)]" : "bg-[var(--line)]"}`}
              onClick={() => setIndex(themeIndex)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
