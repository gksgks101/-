import Link from "next/link";
import { BirthForm } from "@/components/BirthForm";
import { IntroExplain } from "@/components/IntroExplain";
import { ANIMAL_PAGES, STEM_PAGES } from "@/lib/content/encyclopedia";
import { isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "metaTitle", "metaDesc");
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-16">
      <p className="mb-3 text-center text-xs tracking-[0.35em] text-[var(--dancheong)]">{msg(raw, "homeKicker")}</p>
      <h1 className="pillar-gan mb-4 text-center text-4xl leading-tight sm:text-5xl">
        {msg(raw, "homeTitle1")}
        <br />
        {msg(raw, "homeTitle2")}
      </h1>
      <p className="mb-10 text-center text-[17px] leading-7 text-[var(--muted)]">{msg(raw, "homeLead")}</p>
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--hanji)] p-6 shadow-[0_20px_80px_rgba(28,22,18,0.08)]">
        <BirthForm locale={raw} />
      </div>
      <IntroExplain locale={raw} />
      <div className="mt-10 grid gap-3 text-sm text-[var(--muted)]">
        <p>{msg(raw, "homeNote1")}</p>
        <p>{msg(raw, "homeNote2")}</p>
        <p>{msg(raw, "homeNote3")}</p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">{msg(raw, "stemsTitle")}</h2>
          <ul className="space-y-1 text-sm">
            {STEM_PAGES.map((item) => (
              <li key={item.slug}>
                <Link href={`/${raw}/stems/${item.slug}`} className="text-[var(--dancheong)] underline-offset-4 hover:underline">
                  {item.title[raw]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 font-semibold">{msg(raw, "animalsTitle")}</h2>
          <ul className="space-y-1 text-sm">
            {ANIMAL_PAGES.map((item) => (
              <li key={item.slug}>
                <Link href={`/${raw}/animals/${item.slug}`} className="text-[var(--dancheong)] underline-offset-4 hover:underline">
                  {item.title[raw]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
