import type {StaticPage} from '@/content/types';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Container} from '@/components/ui/container';
import {focusRing, textLink} from '@/components/ui/styles';

export function StaticPageView({page}: {page: StaticPage}) {
  const t = useTranslations('Common');

  return (
    <article className="py-12 md:py-20">
      <Container>
        <div className="max-w-3xl">
        <Link href="/" className={`text-sm font-medium text-muted hover:text-foreground ${focusRing}`}>
          {t('home')}
        </Link>
        <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-violet uppercase">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          {page.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">{page.lede}</p>
        <div className="mt-12 space-y-10">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">{section.body}</p>
              {section.href && section.hrefLabel ? (
                <Link href={section.href} className={`mt-4 ${textLink}`}>
                  {section.hrefLabel}
                </Link>
              ) : null}
            </section>
          ))}
        </div>
        </div>
      </Container>
    </article>
  );
}
