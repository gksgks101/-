import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {FeaturedGames} from '@/components/home/featured-games';
import {Hero} from '@/components/home/hero';
import {PopularQuizzes} from '@/components/home/popular-quizzes';
import {pageMetadata} from '@/lib/metadata';
import {resolveLocale} from '@/lib/locale';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({locale, namespace: 'Home'});
  const meta = await getTranslations({locale, namespace: 'Metadata'});

  return pageMetadata({
    locale,
    href: '/',
    title: t('headline'),
    description: meta('description'),
  });
}

export default async function HomePage({params}: Props) {
  resolveLocale((await params).locale);

  return (
    <>
      <Hero />
      <FeaturedGames />
      <PopularQuizzes />
    </>
  );
}
