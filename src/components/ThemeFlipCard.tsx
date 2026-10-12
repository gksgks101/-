"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import type { ColorChip, ThemeCardData } from "@/lib/interpret/themes";
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
              className="h-8 w-8 rounded-full border border-[var(--line)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]"
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

function FaceBody({
  lines,
  bullets,
  disclaimer,
}: {
  lines: string[];
  bullets: string[];
  disclaimer?: string;
}) {
  return (
    <>
      {lines.map((line) => (
        <p key={line.slice(0, 28)} className="mb-3 leading-7 text-[#ddd6c8]">
          {line}
        </p>
      ))}
      {bullets.length > 0 && (
        <ul className="mt-1 space-y-2 text-sm text-[var(--muted)]">
          {bullets.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      )}
      {disclaimer && <p className="mt-4 text-xs leading-6 text-[var(--gold)]">{disclaimer}</p>}
    </>
  );
}

export function ThemeFlipCard({ theme, locale }: { theme: ThemeCardData; locale: Locale }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      className="theme-flip w-full text-left"
    >
      <div className={`theme-flip-inner ${flipped ? "is-flipped" : ""}`}>
        <div className="theme-face theme-face-front hanji-panel rounded-3xl p-6">
          <div className="mb-3 flex items-center gap-3">
            <MotifIcon id={theme.id} />
            <div>
              <p className="text-xs tracking-[0.2em] text-[var(--gold)]">{theme.kicker}</p>
              <h3 className="pillar-gan text-2xl">{theme.title}</h3>
            </div>
          </div>
          <p className="mb-4 text-[11px] tracking-[0.14em] text-[var(--muted)]">{msg(locale, "tapEasy")}</p>
          <FaceBody lines={theme.front} bullets={theme.frontBullets} disclaimer={theme.disclaimer} />
          <ColorRow title={msg(locale, "luckyColors")} items={theme.luckyColors ?? []} />
          <ColorRow title={msg(locale, "avoidColors")} items={theme.avoidColors ?? []} />
        </div>
        <div className="theme-face theme-face-back hanji-panel rounded-3xl p-6">
          <div className="mb-3 flex items-center gap-3">
            <MotifIcon id={theme.id} />
            <div>
              <p className="text-xs tracking-[0.2em] text-[var(--gold)]">{theme.kicker}</p>
              <h3 className="pillar-gan text-2xl">{theme.title}</h3>
            </div>
          </div>
          <p className="mb-4 text-[11px] tracking-[0.14em] text-[var(--muted)]">{msg(locale, "tapPro")}</p>
          <p className="mb-4 text-lg font-semibold leading-8 text-[var(--ivory)]">{theme.easyHeadline}</p>
          <FaceBody lines={theme.easy} bullets={theme.easyBullets} disclaimer={theme.disclaimer} />
          <ColorRow title={msg(locale, "luckyColors")} items={theme.luckyColors ?? []} />
          <ColorRow title={msg(locale, "avoidColors")} items={theme.avoidColors ?? []} />
        </div>
      </div>
    </button>
  );
}
