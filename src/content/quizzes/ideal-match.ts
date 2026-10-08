import {exclusiveQuestion} from '@/lib/quiz/exclusive';
import type {QuizDefinition} from '@/lib/quiz/types';

const results = ['sora-ell', 'jae-rim', 'hana-sol', 'ryn-cho'] as const;

export const idealMatch: QuizDefinition = {
  id: 'ideal-match',
  kind: 'compatibility',
  estimatedMinutes: 4,
  tieBreak: [...results],
  results: [
    {id: 'sora-ell', monogram: 'SE', tone: 'lilac'},
    {id: 'jae-rim', monogram: 'JR', tone: 'violet'},
    {id: 'hana-sol', monogram: 'HS', tone: 'iris'},
    {id: 'ryn-cho', monogram: 'RC', tone: 'violet'},
  ],
  questions: [
    exclusiveQuestion('beside', results),
    exclusiveQuestion('after', results),
    exclusiveQuestion('quality', results),
    exclusiveQuestion('plans', results),
    exclusiveQuestion('notice', results),
    exclusiveQuestion('message', results),
    exclusiveQuestion('day-off', results),
    exclusiveQuestion('conflict', results),
    exclusiveQuestion('choosing', results),
  ],
};
