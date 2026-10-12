import type {Locale} from '@/i18n/routing';
import {validateQuiz, validateQuizCopy} from '@/lib/quiz/validate';
import type {QuizCopy, QuizDefinition} from '@/lib/quiz/types';
import enCopy from '../../../messages/quizzes/en.json';
import esCopy from '../../../messages/quizzes/es.json';
import {idealMatch} from './ideal-match';
import {personalityMatch} from './personality-match';

const quizzes = [personalityMatch, idealMatch];

const copies: Record<Locale, Record<string, QuizCopy>> = {
  en: enCopy as Record<string, QuizCopy>,
  es: esCopy as Record<string, QuizCopy>,
};

for (const quiz of quizzes) {
  validateQuiz(quiz);
  validateQuizCopy(quiz, copies.en[quiz.id]);
  validateQuizCopy(quiz, copies.es[quiz.id]);
}

export function listQuizzes() {
  return quizzes;
}

export function getQuizDefinition(slug: string): QuizDefinition | undefined {
  return quizzes.find((quiz) => quiz.id === slug);
}

export function getQuizCopy(locale: Locale, slug: string): QuizCopy | undefined {
  return copies[locale]?.[slug];
}
