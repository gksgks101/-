import { Suspense } from "react";
import Link from "next/link";
import { ANIMAL_PAGES, animalPage } from "@/lib/content/encyclopedia";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => ANIMAL_PAGES.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !animalPage(slug)) return {};
  return localeMetadata(locale, "animalsMetaTitle", "animalsMetaDesc", `/animals/${slug}`);
}

async function AnimalBody({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = animalPage(slug);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-2xl px-5 py-12">
      <p className="text-xs tracking-[0.3em] text-[var(--dancheong)]">{msg(locale, "navAnimals")}</p>
      <h1 className="pillar-gan mt-3 text-4xl">{page.title[locale]}</h1>
      <p className="mt-4 text-xl">{page.lead[locale]}</p>
      <div className="mt-8 space-y-4 leading-7">
        {page.body[locale].map((paragraph) => (
          <p key={paragraph.slice(0, 20)}>{paragraph}</p>
        ))}
      </div>
      <Link
        href={`/${locale}`}
        className="mt-10 inline-block rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--ivory)]"
      >
        {msg(locale, "analyzeCta")}
      </Link>
    </article>
  );
}

export default function AnimalDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  return (
    <Suspense fallback={<div className="px-5 py-12 text-center text-[var(--muted)]">…</div>}>
      <AnimalBody params={params} />
    </Suspense>
  );
}
