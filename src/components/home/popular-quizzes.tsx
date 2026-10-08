import {useLocale, useTranslations} from 'next-intl';
import {getPopular, isLocale} from '@/content';
import {Container} from '@/components/ui/container';
import {QuizCard} from './quiz-card';

export function PopularQuizzes() {
  const t = useTranslations('Home');
  const playLabel = useTranslations('Common')('play');
  const locale = useLocale();
  const quizzes = isLocale(locale) ? getPopular(locale) : [];

  return (
    <section id="popular" className="scroll-mt-24 py-12 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('popularTitle')}
          </h2>
          <p className="mt-3 text-lg leading-8 text-muted">{t('popularLede')}</p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quizzes.map((quiz) => (
            <li key={quiz.slug}>
              <QuizCard quiz={quiz} playLabel={playLabel} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
