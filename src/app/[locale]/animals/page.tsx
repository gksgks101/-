import { Suspense } from "react";
import Link from "next/link";
import { ANIMAL_PAGES } from "@/lib/content/encyclopedia";
import { isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "animalsMetaTitle", "animalsMetaDesc", "/animals");
}

async function AnimalsBody({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="pillar-gan text-4xl">{msg(locale, "animalsTitle")}</h1>
      <p className="mt-4 text-[var(--muted)]">{msg(locale, "animalsLead")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {ANIMAL_PAGES.map((item) => (
          <Link key={item.slug} href={`/${locale}/animals/${item.slug}`} className="hanji-panel rounded-3xl p-5 hover:border-[var(--accent)]">
            <p className="pillar-gan text-2xl">{item.title[locale]}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.lead[locale]}</p>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-center">
        <Link href={`/${locale}`} className="text-[var(--dancheong)] underline-offset-4 hover:underline">
          {msg(locale, "analyzeCta")}
        </Link>
      </p>
    </div>
  );
}

export default function AnimalsPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={<div className="px-5 py-12 text-center text-[var(--muted)]">…</div>}>
      <AnimalsBody params={params} />
    </Suspense>
  );
}
