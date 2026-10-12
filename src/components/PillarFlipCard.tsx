"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { tenGod } from "@/lib/i18n/terms";
import { pillarEasyLines, pillarRole } from "@/lib/interpret/glyphs";
import type { Pillar, PillarKey } from "@/lib/saju/types";

export function PillarFlipCard({
  pillarKey,
  pillar,
  locale,
}: {
  pillarKey: PillarKey;
  pillar: Pillar | null;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const role = pillarRole(pillarKey, locale);

  if (!pillar) {
    return (
      <article className="hanji-panel rounded-2xl p-4 text-center">
        <p className="text-xs tracking-[0.2em] text-[var(--muted)]">{role.title}</p>
        <p className="mt-6 text-[var(--muted)]">{msg(locale, "unknown")}</p>
      </article>
    );
  }

  const easy = pillarEasyLines(pillar, pillarKey, locale);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={open}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen((value) => !value);
        }
      }}
      className="theme-flip min-h-[220px] cursor-pointer text-left"
    >
      <div className={`theme-flip-inner h-full ${open ? "is-flipped" : ""}`}>
        <article className="theme-face theme-face-front hanji-panel flex h-full flex-col rounded-2xl p-4 text-center">
          <p className="text-xs tracking-[0.2em] text-[var(--muted)]">{role.title}</p>
          <p className="pillar-gan mt-3 text-3xl text-[var(--accent)]">{pillar.gan}</p>
          <p className="text-sm text-[var(--muted)]">
            {pillar.ganKorean} · {tenGod(pillar.ganTenGodKorean, locale)}
          </p>
          <div className="gold-line my-3" />
          <p className="pillar-gan text-3xl">{pillar.zhi}</p>
          <p className="text-sm text-[var(--muted)]">
            {pillar.zhiKorean} · {pillar.twelveStageKorean}
          </p>
          <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
            {msg(locale, "hiddenStem")}
            <br />
            {pillar.hiddenStems.map((item) => `${item.ganKorean}${item.roleKorean}`).join(" · ")}
          </p>
          <p className="mt-auto pt-3 text-xs text-[var(--dancheong)]">{msg(locale, "tapEasy")}</p>
        </article>
        <article className="theme-face theme-face-back hanji-panel flex h-full flex-col overflow-y-auto rounded-2xl p-4 text-left">
          <p className="text-xs tracking-[0.2em] text-[var(--accent)]">{role.easyTitle}</p>
          <p className="mt-2 text-base font-semibold leading-7 text-[var(--ink)]">{easy[0]}</p>
          {easy.slice(1).map((line) => (
            <p key={line.slice(0, 24)} className="mt-3 text-[15px] leading-7 text-[var(--ink)]">
              {line}
            </p>
          ))}
        </article>
      </div>
    </div>
  );
}
