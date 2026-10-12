import { MatchPanel } from "@/components/MatchPanel";
import { isLocale } from "@/lib/i18n/config";
import { localeMetadata } from "@/lib/i18n/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "matchMetaTitle", "matchMetaDesc", "/match");
}

export default async function MatchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12">
      <MatchPanel locale={locale} standalone />
    </div>
  );
}
