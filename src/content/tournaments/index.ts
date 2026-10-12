import type {Locale} from '@/i18n/routing';
import type {Tone} from '@/content/types';
import enCopy from '../../../messages/tournaments/en.json';
import esCopy from '../../../messages/tournaments/es.json';
import {worldCup, type TournamentDefinition} from './world-cup';

export type TournamentPersonaCopy = {
  name: string;
  role: string;
  explanation: string;
};

export type TournamentCopy = {
  kindLabel: string;
  title: string;
  summary: string;
  participants: Record<string, TournamentPersonaCopy>;
};

const tournaments = [worldCup] satisfies TournamentDefinition[];

const copies: Record<Locale, Record<string, TournamentCopy>> = {
  en: enCopy,
  es: esCopy,
};

function fail(message: string): never {
  throw new Error(message);
}

for (const tournament of tournaments) {
  const seen = new Set<string>();
  for (const persona of tournament.participants) {
    if (seen.has(persona.id)) {
      fail(`${tournament.id} repeats ${persona.id}`);
    }
    seen.add(persona.id);
    const tone: Tone = persona.tone;
    if (tone !== 'violet' && tone !== 'iris' && tone !== 'lilac') {
      fail(`${tournament.id} has an unknown tone for ${persona.id}`);
    }
  }

  for (const locale of ['en', 'es'] as const) {
    const copy = copies[locale][tournament.id];
    if (!copy?.title || !copy.kindLabel || !copy.summary) {
      fail(`${tournament.id} is missing ${locale} copy`);
    }
    for (const persona of tournament.participants) {
      const profile = copy.participants[persona.id];
      if (!profile?.name || !profile.role || !profile.explanation) {
        fail(`${tournament.id} is missing ${locale} copy for ${persona.id}`);
      }
    }
  }
}

export function listTournaments() {
  return tournaments;
}

export function getTournamentDefinition(slug: string) {
  return tournaments.find((tournament) => tournament.id === slug);
}

export function getTournamentCopy(locale: Locale, slug: string) {
  return copies[locale]?.[slug];
}
