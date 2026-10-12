import type {ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {SiteFooter} from './site-footer';
import {SiteHeader} from './site-header';

export function SiteShell({children}: {children: ReactNode}) {
  const t = useTranslations('Common');

  return (
    <>
      <a href="#main" className="skip-link">
        {t('skip')}
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
