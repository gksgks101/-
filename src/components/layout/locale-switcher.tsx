'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {focusRing} from '@/components/ui/styles';

const labels: Record<Locale, 'en' | 'es'> = {
  en: 'en',
  es: 'es',
};

const short: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
};

export function LocaleSwitcher() {
  const t = useTranslations('Locale');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t('label')}
      className="inline-flex rounded-full border border-line bg-surface p-1"
    >
      {routing.locales.map((code) => {
        const current = code === locale;

        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            hrefLang={code}
            lang={code}
            aria-current={current ? 'true' : undefined}
            aria-label={t(labels[code])}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide ${focusRing} ${
              current
                ? 'bg-violet text-ink'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {short[code]}
          </Link>
        );
      })}
    </div>
  );
}
