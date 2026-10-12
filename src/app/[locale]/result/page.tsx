import { Suspense } from "react";
import { ResultView } from "@/components/ResultView";
import { isLocale } from "@/lib/i18n/config";
import { localeMetadata } from "@/lib/i18n/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "resultMetaTitle", "resultMetaDesc", "/result");
}

async function ResultBody({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ResultView locale={locale} />;
}

export default function ResultPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-[var(--muted)]">…</div>}>
      <ResultBody params={params} />
    </Suspense>
  );
}
