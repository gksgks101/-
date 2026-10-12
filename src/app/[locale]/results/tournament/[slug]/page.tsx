import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ResultShare} from '@/components/share/result-share';
import {UnavailableResult} from '@/components/share/unavailable-result';
import {Container} from '@/components/ui/container';
import {getTournamentCopy, getTournamentDefinition, listTournaments} from '@/content/tournaments';
import {resolveLocale} from '@/lib/locale';
import {isShareToken, pageMetadata, tournamentOgImage} from '@/lib/metadata';
import {decodePicks} from '@/lib/tournament/codec';

type Props = {
  params: Promise<{locale: string; slug: string}>;
  searchParams: Promise<{p?: string | string[]}>;
};

export function generateStaticParams() {
  return listTournaments().map((tournament) => ({slug: tournament.id}));
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({params, searchParams}: Props): Promise<Metadata> {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const tournament = getTournamentDefinition(slug);
  const copy = getTournamentCopy(locale, slug);
  if (!tournament || !copy) {
    return {};
  }

  const token = firstParam((await searchParams).p);
  const result = token ? decodePicks(tournament.participants.map((persona) => persona.id), token) : null;
  const champion = result ? copy.participants[result.championId] : undefined;

  return pageMetadata({
    locale,
    href: `/results/tournament/${slug}`,
    title: champion?.name ?? copy.title,
    description: champion?.explanation ?? copy.summary,
    query: token && result && isShareToken(token) ? `p=${token}` : undefined,
    image: tournamentOgImage(locale, champion?.name ?? copy.title),
  });
}

export default async function TournamentResultPage({params, searchParams}: Props) {
  const {locale: localeParam, slug} = await params;
  const locale = resolveLocale(localeParam);
  const tournament = getTournamentDefinition(slug);
  const copy = getTournamentCopy(locale, slug);
  if (!tournament || !copy) {
    notFound();
  }

  const t = await getTranslations('Tournament');
  const share = await getTranslations('Share');
  const token = firstParam((await searchParams).p);
  const result = token ? decodePicks(tournament.participants.map((persona) => persona.id), token) : null;
  const persona = result ? tournament.participants.find((item) => item.id === result.championId) : undefined;
  const champion = result ? copy.participants[result.championId] : undefined;

  if (!result || !persona || !champion) {
    return (
      <UnavailableResult title={t('invalidTitle')} body={t('invalidBody')} href={`/tournaments/${slug}/play`} label={t('back')} />
    );
  }

  return (
    <article className="py-12 md:py-20">
      <Container>
        <div className="max-w-3xl">
          <ResultShare
            card={{
              eyebrow: copy.kindLabel,
              sourceTitle: copy.title,
              resultTitle: champion.name,
              description: champion.explanation,
              monogram: persona.monogram,
              tone: persona.tone,
              mark: champion.role,
            }}
            shareText={share('shareText', {name: champion.name})}
            resultId={result.championId}
            retakeHref={`/tournaments/${slug}/play`}
            retakeLabel={t('retake')}
          />
        </div>
      </Container>
    </article>
  );
}
