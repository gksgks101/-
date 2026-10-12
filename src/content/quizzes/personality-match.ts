import {exclusiveQuestion} from '@/lib/quiz/exclusive';
import type {QuizDefinition} from '@/lib/quiz/types';

const results = ['lina-voss', 'mira-noh', 'theo-park', 'noa-bel'] as const;

export const personalityMatch: QuizDefinition = {
  id: 'personality-match',
  kind: 'personality',
  estimatedMinutes: 4,
  tieBreak: [...results],
  results: [
    {id: 'lina-voss', monogram: 'LV', tone: 'violet'},
    {id: 'mira-noh', monogram: 'MN', tone: 'iris'},
    {id: 'theo-park', monogram: 'TP', tone: 'lilac'},
    {id: 'noa-bel', monogram: 'NB', tone: 'violet'},
  ],
  questions: [
    exclusiveQuestion('pace', results),
    exclusiveQuestion('mistake', results),
    exclusiveQuestion('edit', results),
    exclusiveQuestion('afternoon', results),
    exclusiveQuestion('opinion', results),
    exclusiveQuestion('rehearsal', results),
    exclusiveQuestion('praise', results),
    exclusiveQuestion('pressure', results),
    exclusiveQuestion('note', results),
  ],
};
