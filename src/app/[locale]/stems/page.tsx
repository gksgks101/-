import { Suspense } from "react";
import Link from "next/link";
import { STEM_PAGES } from "@/lib/content/encyclopedia";
import { isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";
import { DAY_MASTER_CARDS } from "@/lib/saju/dayCards";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "stemsMetaTitle", "stemsMetaDesc", "/stems");
}

async function StemsBody({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="pillar-gan text-4xl">{msg(locale, "stemsTitle")}</h1>
      <p className="mt-4 text-[var(--muted)]">{msg(locale, "stemsLead")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {STEM_PAGES.map((item) => {
          const card = DAY_MASTER_CARDS[item.gan ?? "甲"];
          return (
            <Link key={item.slug} href={`/${locale}/stems/${item.slug}`} className="hanji-panel rounded-3xl p-5 hover:border-[var(--accent)]">
              <p className="pillar-gan text-2xl">{item.title[locale]}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.lead[locale]}</p>
              <p className="mt-3 text-xs tracking-[0.16em] text-[var(--dancheong)]">{card.keywords[locale].join(" · ")}</p>
            </Link>
          );
        })}
      </div>
      <p className="mt-10 text-center">
        <Link href={`/${locale}`} className="text-[var(--dancheong)] underline-offset-4 hover:underline">
          {msg(locale, "analyzeCta")}
        </Link>
      </p>
    </div>
  );
}

export default function StemsPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={<div className="px-5 py-12 text-center text-[var(--muted)]">…</div>}>
      <StemsBody params={params} />
    </Suspense>
  );
}
