"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import type { ColorChip, ThemeCardData } from "@/lib/interpret/themes";
import { GlossaryTerm } from "./GlossaryTerm";
import { MotifIcon } from "./MotifIcon";

function ColorRow({ title, items }: { title: string; items: ColorChip[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs tracking-[0.16em] text-[var(--muted)]">{title}</p>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div key={`${item.hex}-${item.label}`} className="flex items-center gap-2">
            <span
              className="h-8 w-8 rounded-full border border-[var(--line)]"
              style={{ background: item.hex }}
              aria-hidden
            />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeFlipCard({
  theme,
  locale,
  hintShake,
}: {
  theme: ThemeCardData;
  locale: Locale;
  hintShake?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!hintShake) return;
    const seen = sessionStorage.getItem("saju-card-hint");
    if (seen) return;
    const timer = window.setTimeout(() => setShake(true), 400);
    const stop = window.setTimeout(() => {
      setShake(false);
      sessionStorage.setItem("saju-card-hint", "1");
    }, 1600);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(stop);
    };
  }, [hintShake]);

  return (
    <div className={`theme-flip h-full w-full ${shake ? "theme-hint-shake" : ""}`}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={() => setFlipped((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setFlipped((value) => !value);
          }
        }}
        className="h-full w-full cursor-pointer text-left"
      >
        <div className={`theme-flip-inner h-full ${flipped ? "is-flipped" : ""}`}>
          <div className="theme-face theme-face-front hanji-panel flex h-full flex-col rounded-3xl p-6">
            <div className="mb-3 flex items-center gap-3">
              <MotifIcon id={theme.id} />
              <div>
                <p className="text-xs tracking-[0.2em] text-[var(--accent)]">{theme.kicker}</p>
                <h3 className="pillar-gan text-2xl text-[var(--ink)]">{theme.title}</h3>
              </div>
            </div>
            <p className="mb-4 text-base font-semibold tracking-wide text-[var(--dancheong)]">{msg(locale, "tapEasy")}</p>
            {theme.front.map((line, index) => (
              <p key={`${index}-${line.slice(0, 20)}`} className="mb-3 text-[17px] leading-7 text-[var(--ink)]">
                {line}
              </p>
            ))}
            {theme.frontTerms.length > 0 && (
              <p className="mt-auto flex flex-wrap gap-x-3 gap-y-2 pt-2 text-sm">
                {theme.frontTerms.map((item) => (
                  <GlossaryTerm key={item.word} word={item.word} gloss={item.gloss} />
                ))}
              </p>
            )}
            <ColorRow title={msg(locale, "luckyColors")} items={theme.luckyColors ?? []} />
            <ColorRow title={msg(locale, "avoidColors")} items={theme.avoidColors ?? []} />
            {theme.disclaimer && <p className="mt-4 text-xs leading-6 text-[var(--dancheong)]">{theme.disclaimer}</p>}
          </div>
          <div className="theme-face theme-face-back hanji-panel flex h-full flex-col rounded-3xl p-6">
            <div className="mb-3 flex items-center gap-3">
              <MotifIcon id={theme.id} />
              <div>
                <p className="text-xs tracking-[0.2em] text-[var(--accent)]">{theme.kicker}</p>
                <h3 className="pillar-gan text-2xl text-[var(--ink)]">{theme.title}</h3>
              </div>
            </div>
            <p className="mb-4 text-sm tracking-wide text-[var(--muted)]">{msg(locale, "tapPro")}</p>
            <p className="mb-4 text-xl font-semibold leading-8 text-[var(--ink)]">{theme.easyHeadline}</p>
            {theme.easy.map((line, index) => (
              <p key={`${index}-${line.slice(0, 20)}`} className="mb-3 text-[17px] leading-7 text-[var(--ink)]">
                {index === 0 ? <strong>{line}</strong> : line}
              </p>
            ))}
            {theme.disclaimer && <p className="mt-auto pt-4 text-xs leading-6 text-[var(--dancheong)]">{theme.disclaimer}</p>}
            <ColorRow title={msg(locale, "luckyColors")} items={theme.luckyColors ?? []} />
            <ColorRow title={msg(locale, "avoidColors")} items={theme.avoidColors ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
