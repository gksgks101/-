import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {footerNav} from '@/lib/nav';
import {focusRing} from '@/components/ui/styles';
import {Container} from '@/components/ui/container';
import {Logo} from './logo';

export function SiteFooter() {
  const t = useTranslations('Footer');

  return (
    <footer className="mt-8 border-t border-line">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <Logo className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-strong" />
          <p className="mt-4 text-sm leading-6 text-muted">{t('tagline')}</p>
        </div>
        <nav aria-label={t('nav')}>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium text-foreground underline decoration-line underline-offset-4 hover:text-violet ${focusRing}`}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-line/70">
        <Container className="py-5">
          <p className="text-sm text-subtle">{t('rights')}</p>
        </Container>
      </div>
    </footer>
  );
}
