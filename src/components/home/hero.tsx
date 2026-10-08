import {useLocale, useTranslations} from 'next-intl';
import {getTournament, isLocale} from '@/content';
import {Link} from '@/i18n/navigation';
import {Container} from '@/components/ui/container';
import {Monogram} from '@/components/ui/monogram';
import {focusRing, primaryButton} from '@/components/ui/styles';

export function Hero() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const roster = isLocale(locale) ? getTournament(locale).highlights.slice(0, 4) : [];
  const pairs = [roster.slice(0, 2), roster.slice(2, 4)];

  return (
    <section className="pt-14 pb-8 sm:pt-20 md:pt-24 md:pb-12">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-violet uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="mt-5 max-w-xl font-display text-[2.7rem] leading-[0.96] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {t('headline')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{t('lede')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/tournaments" className={`${primaryButton} w-full sm:w-auto`}>
              {t('start')}
              <span aria-hidden="true">→</span>
            </Link>
            <a href="#popular" className={`w-full justify-center sm:w-auto ${focusRing} inline-flex min-h-12 items-center rounded-full px-4 text-sm font-semibold text-foreground underline decoration-line underline-offset-4 hover:text-violet`}>
              {t('browse')}
            </a>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="rounded-[2rem] border border-line bg-surface p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between text-[0.7rem] font-semibold tracking-[0.16em] text-subtle uppercase">
            <span>{t('roundLabel')}</span>
            <span className="text-violet">Kaleid</span>
          </div>
          <div className="grid gap-3">
            {pairs.map((pair) => {
              const [left, right] = pair;
              if (!left || !right) {
                return null;
              }

              return (
                <div
                  key={`${left.monogram}-${right.monogram}`}
                  className="flex items-center gap-2"
                >
                  {[left, right].map((persona, index) => (
                    <div key={persona.monogram} className="contents">
                      {index === 1 ? (
                        <span className="shrink-0 text-[0.7rem] font-semibold tracking-wide text-subtle uppercase">
                          {t('versus')}
                        </span>
                      ) : null}
                      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-background px-2.5 py-2.5 sm:gap-3 sm:px-3 sm:py-3">
                        <Monogram letters={persona.monogram} tone={persona.tone} size="sm" />
                        <span className="truncate text-sm font-medium">{persona.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-2xl border border-violet/40 bg-[#19142c] px-4 py-4">
            <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-violet uppercase">
              {t('finalLabel')}
            </p>
            <p className="mt-1 font-display text-2xl tracking-tight">{t('finalTitle')}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
