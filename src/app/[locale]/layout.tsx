import Link from "next/link";
import { notFound } from "next/navigation";
import { HtmlLang } from "@/components/HtmlLang";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
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
      <header className="border-b border-[var(--line)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4">
          <Link href={`/${locale}`} className="font-[var(--font-serif)] text-lg tracking-[0.2em]">
            {msg(locale, "brand")}
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex gap-4 text-sm text-[var(--muted)]">
              <Link href={`/${locale}`} className="hover:text-[var(--ivory)]">
                {msg(locale, "navAnalyze")}
              </Link>
              <Link href={`/${locale}/privacy`} className="hover:text-[var(--ivory)]">
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
