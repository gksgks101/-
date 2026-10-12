import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {ExperienceView} from '@/components/content/experience-view';
import {getTournament} from '@/content';
import {worldCup} from '@/content/tournaments/world-cup';
import {resolveLocale} from '@/lib/locale';
import {pageMetadata, tournamentOgImage} from '@/lib/metadata';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const page = getTournament(locale);

  return pageMetadata({
    locale,
    href: '/tournaments',
    title: page.title,
    description: page.summary,
    image: {...tournamentOgImage(locale, page.title), openGraph: false},
  });
}

export default async function TournamentPage({params}: Props) {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations('Tournament');

  return (
    <ExperienceView
      page={getTournament(locale)}
      action={{href: `/tournaments/${worldCup.id}/play`, label: t('start')}}
    />
  );
}
