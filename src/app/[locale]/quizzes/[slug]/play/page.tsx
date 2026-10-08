import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {QuizPlayer} from '@/components/quiz/quiz-player';
import {getQuizCopy, getQuizDefinition, listQuizzes} from '@/content/quizzes';
import {resolveLocale} from '@/lib/locale';
import {pageMetadata, quizOgImage} from '@/lib/metadata';

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

export function generateStaticParams() {
  return listQuizzes().map((quiz) => ({slug: quiz.id}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const copy = getQuizCopy(locale, slug);
  if (!copy) {
    return {};
  }

  return pageMetadata({
    locale,
    href: `/quizzes/${slug}/play`,
    title: copy.title,
    description: copy.summary,
    image: {...quizOgImage(locale, slug, copy.title), openGraph: true},
  });
}

export default async function QuizPlayPage({params}: Props) {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const quiz = getQuizDefinition(slug);
  const copy = getQuizCopy(locale, slug);

  if (!quiz || !copy) {
    notFound();
  }

  return <QuizPlayer quiz={quiz} copy={copy} />;
}
