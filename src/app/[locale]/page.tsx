import { Suspense } from "react";
import Link from "next/link";
import { BirthForm } from "@/components/BirthForm";
import { IntroExplain } from "@/components/IntroExplain";
import { ANIMAL_PAGES, STEM_PAGES } from "@/lib/content/encyclopedia";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "metaTitle", "metaDesc");
}

async function HomeBody({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-16">
      <p className="mb-3 text-center text-xs tracking-[0.35em] text-[var(--dancheong)]">{msg(locale, "homeKicker")}</p>
      <h1 className="pillar-gan mb-4 text-center text-4xl leading-tight sm:text-5xl">
        {msg(locale, "homeTitle1")}
        <br />
        {msg(locale, "homeTitle2")}
      </h1>
      <p className="mb-10 text-center text-[17px] leading-7 text-[var(--muted)]">{msg(locale, "homeLead")}</p>
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--hanji)] p-6 shadow-[0_20px_80px_rgba(28,22,18,0.08)]">
        <BirthForm locale={locale} />
      </div>
      <IntroExplain locale={locale} />
      <div className="mt-10 grid gap-3 text-sm text-[var(--muted)]">
        <p>{msg(locale, "homeNote1")}</p>
        <p>{msg(locale, "homeNote2")}</p>
        <p>{msg(locale, "homeNote3")}</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">{msg(locale, "stemsTitle")}</h2>
          <ul className="space-y-1 text-sm">
            {STEM_PAGES.map((item) => (
              <li key={item.slug}>
                <Link href={`/${locale}/stems/${item.slug}`} className="text-[var(--dancheong)] underline-offset-4 hover:underline">
                  {item.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 font-semibold">{msg(locale, "animalsTitle")}</h2>
          <ul className="space-y-1 text-sm">
            {ANIMAL_PAGES.map((item) => (
              <li key={item.slug}>
                <Link href={`/${locale}/animals/${item.slug}`} className="text-[var(--dancheong)] underline-offset-4 hover:underline">
                  {item.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={<div className="px-5 py-16 text-center text-[var(--muted)]">…</div>}>
      <HomeBody params={params} />
    </Suspense>
  );
}
