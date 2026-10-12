import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ScoreSummary} from '@/components/quiz/score-summary';
import {ResultShare} from '@/components/share/result-share';
import {UnavailableResult} from '@/components/share/unavailable-result';
import {Container} from '@/components/ui/container';
import {getQuizCopy, getQuizDefinition, listQuizzes} from '@/content/quizzes';
import {decodeResult} from '@/lib/quiz/codec';
import {resolveLocale} from '@/lib/locale';
import {isShareToken, pageMetadata, quizOgImage} from '@/lib/metadata';

type Props = {
  params: Promise<{locale: string; slug: string}>;
  searchParams: Promise<{a?: string | string[]}>;
};

export function generateStaticParams() {
  return listQuizzes().map((quiz) => ({slug: quiz.id}));
}

export async function generateMetadata({params, searchParams}: Props): Promise<Metadata> {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const quiz = getQuizDefinition(slug);
  const copy = getQuizCopy(locale, slug);
  if (!quiz || !copy) {
    return {};
  }

  const token = firstParam((await searchParams).a);
  const score = token ? decodeResult(quiz, token) : null;
  const name = score ? copy.results[score.resultId]?.name : undefined;
  const description = score ? copy.results[score.resultId].explanation : copy.summary;

  return pageMetadata({
    locale,
    href: `/results/quiz/${slug}`,
    title: name ?? copy.title,
    description,
    query: token && score && isShareToken(token) ? `a=${token}` : undefined,
    image: {...quizOgImage(locale, slug, name ?? copy.title), openGraph: true},
  });
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuizResultPage({params, searchParams}: Props) {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const quiz = getQuizDefinition(slug);
  const copy = getQuizCopy(locale, slug);
  if (!quiz || !copy) {
    notFound();
  }

  const t = await getTranslations('Quiz');
  const share = await getTranslations('Share');
  const token = firstParam((await searchParams).a);
  const score = token ? decodeResult(quiz, token) : null;

  if (!score) {
    return (
      <UnavailableResult
        title={t('invalidTitle')}
        body={t('invalidBody')}
        href={`/quizzes/${quiz.id}`}
        label={t('backToQuiz')}
      />
    );
  }

  const profile = quiz.results.find((result) => result.id === score.resultId);
  const resultCopy = copy.results[score.resultId];
  const runnerUp = score.ranked.find((item) => item.id !== score.resultId && item.points > 0);
  const names = Object.fromEntries(quiz.results.map((result) => [result.id, copy.results[result.id].name]));

  if (!profile || !resultCopy) {
    notFound();
  }

  return (
    <article className="py-12 md:py-20">
      <Container>
        <div className="max-w-3xl">
          <ResultShare
            card={{
              eyebrow: copy.kindLabel,
              sourceTitle: copy.title,
              resultTitle: resultCopy.name,
              description: resultCopy.explanation,
              monogram: profile.monogram,
              tone: profile.tone,
              mark: resultCopy.role,
            }}
            shareText={share('shareText', {name: resultCopy.name})}
            resultId={score.resultId}
            retakeHref={`/quizzes/${quiz.id}/play`}
            retakeLabel={t('retake')}
          />
          <p className="mt-8 text-base text-foreground">
            {t('lead', {name: resultCopy.name, points: score.scores[score.resultId] ?? 0})}
          </p>
          {runnerUp ? (
            <p className="mt-2 text-base text-muted">{t('runnerUp', {name: names[runnerUp.id], points: runnerUp.points})}</p>
          ) : null}
          {score.tiedIds.length > 1 ? (
            <p className="mt-2 text-base text-muted">{t('tieNote', {name: resultCopy.name})}</p>
          ) : null}
          <p className="mt-6 inline-flex rounded-full border border-violet/40 bg-[#19142c] px-4 py-2 text-sm font-semibold text-violet-strong">
            {t('strength', {percent: score.strength})}
          </p>
          <ScoreSummary
            score={score}
            names={names}
            heading={t('yourScores')}
            pointsLabel={(count) => t('points', {count})}
          />
        </div>
      </Container>
    </article>
  );
}
