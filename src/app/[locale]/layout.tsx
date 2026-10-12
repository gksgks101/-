import type {Metadata, Viewport} from 'next';
import {Outfit, Syne} from 'next/font/google';
import {hasLocale} from 'next-intl';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {SiteShell} from '@/components/layout/site-shell';
import {routing} from '@/i18n/routing';
import '../globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

export const viewport: Viewport = {
  themeColor: '#07060f',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      default: t('title'),
      template: `%s · Kaleid`,
    },
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${outfit.variable} ${syne.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <SiteShell>{children}</SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
