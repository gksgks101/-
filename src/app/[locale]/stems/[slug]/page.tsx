import Link from "next/link";
import { STEM_PAGES, stemPage } from "@/lib/content/encyclopedia";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";
import { DAY_MASTER_CARDS } from "@/lib/saju/dayCards";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => STEM_PAGES.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !stemPage(slug)) return {};
  return localeMetadata(locale, "stemsMetaTitle", "stemsMetaDesc", `/stems/${slug}`);
}

export default async function StemDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const page = stemPage(slug);
  if (!page) notFound();
  const card = DAY_MASTER_CARDS[page.gan ?? "甲"];
  return (
    <article className="mx-auto max-w-2xl px-5 py-12">
      <p className="text-xs tracking-[0.3em] text-[var(--dancheong)]">{msg(locale, "navStems")}</p>
      <h1 className="pillar-gan mt-3 text-4xl">{page.title[locale]}</h1>
      <p className="mt-4 text-xl">{page.lead[locale]}</p>
      <p className="mt-3 text-sm tracking-[0.16em] text-[var(--muted)]">{card.keywords[locale].join(" · ")}</p>
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
