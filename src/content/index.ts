import {hasLocale} from 'next-intl';
import {routing, type Locale} from '@/i18n/routing';
import {en} from './en';
import {es} from './es';
import {quizSlugs, type Catalog} from './types';

const catalogs: Record<Locale, Catalog> = {en, es};

function assertCatalogParity() {
  const featuredIds = (catalog: Catalog) => catalog.featured.map((item) => item.id).join('|');
  const popularIds = (catalog: Catalog) => catalog.popular.map((item) => item.slug).join('|');

  if (featuredIds(en) !== featuredIds(es) || popularIds(en) !== popularIds(es)) {
    throw new Error('English and Spanish catalogs do not list the same games.');
  }

  for (const slug of quizSlugs) {
    const inEnglish = en.popular.some((quiz) => quiz.slug === slug);
    const inSpanish = es.popular.some((quiz) => quiz.slug === slug);
    if (!inEnglish || !inSpanish) {
      throw new Error(`Missing popular quiz ${slug}.`);
    }
  }
}

assertCatalogParity();

export function isLocale(value: string): value is Locale {
  return hasLocale(routing.locales, value);
}

export function getCatalog(locale: Locale) {
  return catalogs[locale];
}

export function getFeatured(locale: Locale) {
  return catalogs[locale].featured;
}

export function getPopular(locale: Locale) {
  return catalogs[locale].popular;
}

export function getTournament(locale: Locale) {
  return catalogs[locale].tournament;
}

export function getStaticPage(locale: Locale, page: 'about' | 'privacy' | 'contact') {
  return catalogs[locale][page];
}

export {quizSlugs};
