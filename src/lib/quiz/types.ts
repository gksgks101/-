import type {Tone} from '@/content/types';

export type QuizKind = 'personality' | 'compatibility';

export type QuizOption = {
  id: string;
  scores: Record<string, number>;
};

export type QuizQuestion = {
  id: string;
  options: QuizOption[];
};

export type QuizResultProfile = {
  id: string;
  monogram: string;
  tone: Tone;
};

/**
 * Locale-agnostic quiz structure. Prose lives in translation files, keyed by these ids.
 * Adding a quiz means a new definition plus English and Spanish copy, not an engine change.
 */
export type QuizDefinition = {
  id: string;
  kind: QuizKind;
  estimatedMinutes: number;
  tieBreak: string[];
  results: QuizResultProfile[];
  questions: QuizQuestion[];
};

export type QuizScore = {
  resultId: string;
  scores: Record<string, number>;
  total: number;
  strength: number;
  tiedIds: string[];
  ranked: {id: string; points: number}[];
};

export type QuizSession = {
  quizId: string;
  index: number;
  answers: Record<string, string>;
};

export type QuizCopy = {
  kindLabel: string;
  title: string;
  cardSummary: string;
  summary: string;
  meta: string;
  rules: string;
  resultsTitle: string;
  questions: Record<string, {prompt: string; options: Record<string, string>}>;
  results: Record<string, {name: string; role: string; explanation: string}>;
};
