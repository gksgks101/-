'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {isActivePath, primaryNav} from '@/lib/nav';
import {focusRing} from '@/components/ui/styles';
import {LocaleSwitcher} from './locale-switcher';
import {Logo} from './logo';

export function SiteHeader() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-5 sm:h-[4.5rem] sm:px-8">
        <Logo className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-strong" />
        <nav aria-label={t('primary')} className="ml-4 hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap ${focusRing} ${
                      active
                        ? 'bg-raised text-foreground'
                        : 'text-muted hover:bg-surface hover:text-foreground'
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher />
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-foreground lg:hidden ${focusRing}`}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? t('closeMenu') : t('openMenu')}</span>
            <span aria-hidden="true" className="flex w-4 flex-col gap-1.5">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
              <span className="h-px w-3/4 bg-current" />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-navigation"
          aria-label={t('primary')}
          className="border-t border-line bg-background lg:hidden"
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {primaryNav.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-medium ${focusRing} ${
                      active ? 'bg-raised text-foreground' : 'text-muted hover:bg-surface hover:text-foreground'
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
