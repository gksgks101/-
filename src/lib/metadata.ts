import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';

const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
};

export function pageMetadata({
  locale,
  href,
  title,
  description,
  query,
  image,
}: {
  locale: Locale;
  href: string;
  title: string;
  description: string;
  query?: string;
  image?: {url: string; alt: string; openGraph?: boolean};
}): Metadata {
  const pathname = getPathname({href, locale});
  const socialUrl = query ? `${pathname}?${query}` : pathname;
  const imageMeta = image ? [{url: image.url, alt: image.alt, width: 1200, height: 630}] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: pathname,
      languages: Object.fromEntries(routing.locales.map((code) => [code, getPathname({href, locale: code})])),
    },
    openGraph: {
      title,
      description,
      url: socialUrl,
      siteName: 'Kaleid',
      locale: ogLocales[locale],
      alternateLocale: routing.locales.filter((code) => code !== locale).map((code) => ogLocales[code]),
      type: 'website',
      ...(image && image.openGraph !== false && imageMeta ? {images: imageMeta} : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageMeta ? {images: imageMeta.map((item) => item.url)} : {}),
    },
  };
}

export function quizOgImage(locale: Locale, slug: string, alt: string) {
  return {
    url: getPathname({href: `/quizzes/${slug}/opengraph-image`, locale}),
    alt,
    openGraph: false,
  };
}

export function tournamentOgImage(locale: Locale, alt: string) {
  return {
    url: getPathname({href: '/tournaments/opengraph-image', locale}),
    alt,
  };
}

export function isShareToken(value: string) {
  return /^[A-Za-z0-9_-]{1,400}$/.test(value);
}
