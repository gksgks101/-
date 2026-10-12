import { Suspense } from "react";
import { ResultView } from "@/components/ResultView";
import { isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "resultMetaTitle", "resultMetaDesc", "/result");
}

export default async function ResultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-[var(--muted)]">{msg(locale, "analyzing")}</div>}>
      <ResultView locale={locale} />
    </Suspense>
  );
}
