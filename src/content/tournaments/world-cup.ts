import type {Tone} from '@/content/types';

export const worldCup = {
  id: 'world-cup',
  participants: [
    {id: 'lina-voss', monogram: 'LV', tone: 'violet'},
    {id: 'mira-noh', monogram: 'MN', tone: 'iris'},
    {id: 'sora-ell', monogram: 'SE', tone: 'lilac'},
    {id: 'jae-rim', monogram: 'JR', tone: 'violet'},
    {id: 'hana-sol', monogram: 'HS', tone: 'iris'},
    {id: 'theo-park', monogram: 'TP', tone: 'lilac'},
    {id: 'ryn-cho', monogram: 'RC', tone: 'violet'},
    {id: 'noa-bel', monogram: 'NB', tone: 'iris'},
  ],
} as const;

export type TournamentParticipant = {
  id: string;
  monogram: string;
  tone: Tone;
};

export type TournamentDefinition = {
  id: string;
  participants: readonly TournamentParticipant[];
};
