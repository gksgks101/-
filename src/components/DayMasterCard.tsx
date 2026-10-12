"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { CARD_BACK_IMAGE, type DayMasterCard as CardMeta } from "@/lib/saju/dayCards";

export function DayMasterCard({
  card,
  locale,
  gan,
  ganKorean,
}: {
  card: CardMeta;
  locale: Locale;
  gan: string;
  ganKorean: string;
}) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    const timer = window.setTimeout(() => setFlipped(true), 650);
    return () => window.clearTimeout(timer);
  }, [card.gan]);

  return (
    <div className="mx-auto w-full max-w-[320px] sm:max-w-[360px]">
      <p className="mb-3 text-center text-xs tracking-[0.28em] text-[var(--gold)]">{msg(locale, "yourCard")}</p>
      <button
        type="button"
        aria-label={msg(locale, "tapFlip")}
        onClick={() => setFlipped((value) => !value)}
        className="saju-flip w-full"
      >
        <div className={`saju-flip-inner ${flipped ? "is-flipped" : ""}`}>
          <div className="saju-face saju-face-back">
            <img src={CARD_BACK_IMAGE} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="saju-face saju-face-front">
            <img src={card.image} alt={card.title[locale]} className="h-full w-full object-cover" />
            <div className="saju-card-caption">
              <p className="pillar-gan text-3xl leading-none">{gan}</p>
              <p className="mt-1 text-sm tracking-[0.18em]">{ganKorean}</p>
            </div>
          </div>
        </div>
      </button>
      <div className="mt-4 text-center">
        <h2 className="pillar-gan text-2xl sm:text-3xl">{card.title[locale]}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{card.subtitle[locale]}</p>
        <p className="mt-3 text-xs tracking-[0.2em] text-[var(--gold)]">{msg(locale, "tapFlip")}</p>
      </div>
    </div>
  );
}
