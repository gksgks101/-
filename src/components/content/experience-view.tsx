import type {DetailPage} from '@/content/types';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Container} from '@/components/ui/container';
import {Monogram} from '@/components/ui/monogram';
import {focusRing, primaryButton} from '@/components/ui/styles';

export function ExperienceView({page, action}: {page: DetailPage; action?: {href: string; label: string}}) {
  const t = useTranslations('Common');

  return (
    <article className="py-12 md:py-20">
      <Container>
        <Link href="/" className={`text-sm font-medium text-muted hover:text-foreground ${focusRing}`}>
          {t('home')}
        </Link>
        <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-violet uppercase">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {page.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{page.summary}</p>
        {action ? (
          <Link href={action.href} className={`mt-8 ${primaryButton}`}>
            {action.label}
          </Link>
        ) : null}
        <ul className="mt-8 flex flex-wrap gap-3">
          {page.stats.map((stat) => (
            <li
              key={stat.label}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-foreground"
            >
              <span className="sr-only">{stat.label}: </span>
              {stat.value}
            </li>
          ))}
        </ul>
        <section className="mt-14">
          <h2 className="font-display text-3xl font-semibold tracking-tight">{page.stepsTitle}</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {page.steps.map((step, index) => (
              <li key={step.title} className="rounded-[1.5rem] border border-line bg-surface p-6">
                <p className="font-display text-sm text-violet">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="mt-16">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            {page.highlightsTitle}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {page.highlights.map((item) => (
              <li
                key={item.monogram}
                className="rounded-[1.5rem] border border-line bg-surface p-5"
              >
                <Monogram letters={item.monogram} tone={item.tone} />
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </article>
  );
}
