import type {QuizCopy, QuizDefinition} from '@/lib/quiz/types';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Container} from '@/components/ui/container';
import {Monogram} from '@/components/ui/monogram';
import {focusRing, primaryButton} from '@/components/ui/styles';

export function QuizIntro({quiz, copy}: {quiz: QuizDefinition; copy: QuizCopy}) {
  const t = useTranslations('Quiz');
  const home = useTranslations('Common');

  return (
    <article className="py-12 md:py-20">
      <Container>
        <Link href="/" className={`text-sm font-medium text-muted hover:text-foreground ${focusRing}`}>
          {home('home')}
        </Link>
        <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-violet uppercase">
          {copy.kindLabel}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{copy.summary}</p>
        <p className="mt-6 text-sm text-foreground">{copy.meta}</p>
        <Link href={`/quizzes/${quiz.id}/play`} className={`mt-8 ${primaryButton}`}>
          {t('start')}
          <span aria-hidden="true">→</span>
        </Link>
        <section className="mt-14 max-w-3xl rounded-[1.5rem] border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{copy.resultsTitle}</h2>
          <p className="mt-3 text-base leading-7 text-muted">{copy.rules}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {quiz.results.map((result) => {
              const profile = copy.results[result.id];
              return (
                <li key={result.id} className="flex items-center gap-4">
                  <Monogram letters={result.monogram} tone={result.tone} size="sm" />
                  <span>
                    <span className="block font-medium">{profile.name}</span>
                    <span className="block text-sm text-muted">{profile.role}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </Container>
    </article>
  );
}
