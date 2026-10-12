import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HtmlLang } from "@/components/HtmlLang";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { localeMetadata } from "@/lib/i18n/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return localeMetadata(locale, "metaTitle", "metaDesc");
}

async function LocaleShell({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  return (
    <>
      <HtmlLang locale={locale} />
      <header className="border-b border-[var(--line)] bg-[var(--paper)]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4">
          <Link href={`/${locale}`} className="font-[var(--font-serif)] text-lg tracking-[0.2em]">
            {msg(locale, "brand")}
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
              <Link href={`/${locale}`} className="hover:text-[var(--ink)]">
                {msg(locale, "navAnalyze")}
              </Link>
              <Link href={`/${locale}/match`} className="hover:text-[var(--ink)]">
                {msg(locale, "navMatch")}
              </Link>
              <Link href={`/${locale}/stems`} className="hover:text-[var(--ink)]">
                {msg(locale, "navStems")}
              </Link>
              <Link href={`/${locale}/animals`} className="hover:text-[var(--ink)]">
                {msg(locale, "navAnimals")}
              </Link>
              <Link href={`/${locale}/privacy`} className="hover:text-[var(--ink)]">
                {msg(locale, "navPrivacy")}
              </Link>
            </nav>
            <LanguageSwitch locale={locale} />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--line)] px-5 py-8 text-center text-xs text-[var(--muted)]">{msg(locale, "footer")}</footer>
    </>
  );
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<div className="px-5 py-10 text-center text-[var(--muted)]">…</div>}>
      <LocaleShell params={params}>{children}</LocaleShell>
    </Suspense>
  );
}
