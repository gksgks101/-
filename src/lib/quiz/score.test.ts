import {describe, expect, it} from 'vitest';
import {en} from '@/content/en';
import {es} from '@/content/es';
import {getQuizCopy} from '@/content/quizzes';
import {idealMatch} from '@/content/quizzes/ideal-match';
import {personalityMatch} from '@/content/quizzes/personality-match';
import {decodeResult, encodeAnswers} from './codec';
import {scoreAnswers} from './score';
import type {QuizDefinition} from './types';

const samples = [personalityMatch, idealMatch];

function answersFor(quiz: QuizDefinition, optionId: string) {
  return Object.fromEntries(quiz.questions.map((question) => [question.id, optionId]));
}

function everyCompletion(quiz: QuizDefinition, visit: (answers: Record<string, string>) => void) {
  const answers: Record<string, string> = {};

  function walk(index: number) {
    if (index === quiz.questions.length) {
      visit(answers);
      return;
    }

    const question = quiz.questions[index];
    for (const option of question.options) {
      answers[question.id] = option.id;
      walk(index + 1);
    }
    delete answers[question.id];
  }

  walk(0);
}

describe('quiz scoring', () => {
  it('gives every answer two points and a perfect run the matching persona', () => {
    for (const quiz of samples) {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(8);
      expect(quiz.questions.length).toBeLessThanOrEqual(10);

      for (const question of quiz.questions) {
        for (const option of question.options) {
          const points = Object.values(option.scores).reduce((sum, value) => sum + value, 0);
          expect(points).toBe(2);
        }
      }

      quiz.results.forEach((result, index) => {
        const optionId = String.fromCharCode(97 + index);
        const score = scoreAnswers(quiz, answersFor(quiz, optionId));
        expect(score?.resultId).toBe(result.id);
        expect(score?.strength).toBe(100);
        expect(score?.tiedIds).toEqual([result.id]);
      });
    }
  });

  it('resolves ties by the fixed tieBreak order, not by object order', () => {
    const quiz: QuizDefinition = {
      id: 'tie-fixture',
      kind: 'personality',
      estimatedMinutes: 1,
      tieBreak: ['beta', 'alpha'],
      results: [
        {id: 'alpha', monogram: 'AL', tone: 'violet'},
        {id: 'beta', monogram: 'BE', tone: 'iris'},
      ],
      questions: [
        {
          id: 'q1',
          options: [
            {id: 'split', scores: {alpha: 1, beta: 1}},
            {id: 'alpha', scores: {alpha: 2}},
          ],
        },
        {
          id: 'q2',
          options: [{id: 'split', scores: {alpha: 1, beta: 1}}],
        },
      ],
    };

    const tied = scoreAnswers(quiz, {q1: 'split', q2: 'split'});
    expect(tied?.scores).toEqual({alpha: 2, beta: 2});
    expect(tied?.tiedIds).toEqual(['beta', 'alpha']);
    expect(tied?.resultId).toBe('beta');
    expect(tied?.ranked.map((item) => item.id)).toEqual(['beta', 'alpha']);

    const alphaWins = scoreAnswers(quiz, {q1: 'alpha', q2: 'split'});
    expect(alphaWins?.resultId).toBe('alpha');
    expect(alphaWins?.tiedIds).toEqual(['alpha']);
  });

  it('returns null until every question has a known answer', () => {
    expect(scoreAnswers(personalityMatch, {})).toBeNull();
    expect(scoreAnswers(personalityMatch, {pace: 'a'})).toBeNull();
    expect(scoreAnswers(personalityMatch, {...answersFor(personalityMatch, 'a'), pace: 'nope'})).toBeNull();
  });

  it('maps every possible completion to a persona in the quiz', () => {
    for (const quiz of samples) {
      const resultIds = new Set(quiz.results.map((result) => result.id));
      let completions = 0;

      everyCompletion(quiz, (answers) => {
        const score = scoreAnswers(quiz, answers);
        if (!score || !resultIds.has(score.resultId) || score.strength <= 0 || score.strength > 100) {
          throw new Error(`Invalid result for ${quiz.id}`);
        }
        completions += 1;
      });

      expect(completions).toBe(4 ** quiz.questions.length);
    }
  });

  it('publishes the sample quiz titles from the translation files', () => {
    expect(getQuizCopy('en', 'personality-match')?.title).toBe(
      'Which K-pop Idol Matches Your Personality?',
    );
    expect(getQuizCopy('en', 'ideal-match')?.title).toBe('Which K-pop Idol Is Your Ideal Match?');
    expect(en.featured.find((item) => item.id === 'personality')?.title).toBe(
      getQuizCopy('en', 'personality-match')?.title,
    );
    expect(en.featured.find((item) => item.id === 'compatibility')?.title).toBe(
      getQuizCopy('en', 'ideal-match')?.title,
    );
    expect(es.featured.find((item) => item.id === 'personality')?.title).toBe(
      getQuizCopy('es', 'personality-match')?.title,
    );
    expect(getQuizCopy('es', 'ideal-match')?.title?.length).toBeGreaterThan(0);
  });

  it('round-trips a finished quiz through the share code', () => {
    const answers = answersFor(idealMatch, 'c');
    const score = scoreAnswers(idealMatch, answers);
    const decoded = decodeResult(idealMatch, encodeAnswers(answers));

    expect(decoded).toEqual(score);
    expect(decodeResult(idealMatch, 'not-a-code')).toBeNull();
    expect(decodeResult(personalityMatch, encodeAnswers(answers))).toBeNull();
  });
});
