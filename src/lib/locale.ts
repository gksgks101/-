import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {isLocale} from '@/content';
import type {Locale} from '@/i18n/routing';

export function resolveLocale(locale: string): Locale {
  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return locale;
}
