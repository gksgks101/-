import {ogCard, ogSize} from '@/lib/og-card';
import {getQuizCopy} from '@/content/quizzes';
import {resolveLocale} from '@/lib/locale';
import {notFound} from 'next/navigation';

export const alt = 'Kaleid quiz';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const copy = getQuizCopy(locale, slug);
  if (!copy) {
    notFound();
  }

  return ogCard({kicker: copy.kindLabel, title: copy.title, summary: copy.cardSummary});
}
