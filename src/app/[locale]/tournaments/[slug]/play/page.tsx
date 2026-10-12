import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {BracketPlayer} from '@/components/tournament/bracket-player';
import {getTournamentCopy, getTournamentDefinition, listTournaments} from '@/content/tournaments';
import {resolveLocale} from '@/lib/locale';
import {pageMetadata, tournamentOgImage} from '@/lib/metadata';

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

export function generateStaticParams() {
  return listTournaments().map((tournament) => ({slug: tournament.id}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const copy = getTournamentCopy(locale, slug);
  if (!copy) {
    return {};
  }

  return pageMetadata({
    locale,
    href: `/tournaments/${slug}/play`,
    title: copy.title,
    description: copy.summary,
    image: tournamentOgImage(locale, copy.title),
  });
}

export default async function TournamentPlayPage({params}: Props) {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const tournament = getTournamentDefinition(slug);
  const copy = getTournamentCopy(locale, slug);
  if (!tournament || !copy) {
    notFound();
  }

  const personas = tournament.participants.map((persona) => {
    const profile = copy.participants[persona.id];
    return {
      id: persona.id,
      name: profile.name,
      role: profile.role,
      monogram: persona.monogram,
      tone: persona.tone,
    };
  });

  return <BracketPlayer tournamentId={tournament.id} eyebrow={copy.kindLabel} title={copy.title} personas={personas} />;
}
