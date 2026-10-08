import {describe, expect, it} from 'vitest';
import {personalityMatch} from '@/content/quizzes/personality-match';
import {scoreAnswers} from './score';
import {canAdvance, createSession, goNext, goPrevious, isLastQuestion, selectAnswer} from './session';

describe('quiz completion', () => {
  it('walks forward only after an answer and keeps answers when going back', () => {
    let session = createSession(personalityMatch.id);
    expect(canAdvance(personalityMatch, session)).toBe(false);
    expect(goNext(personalityMatch, session)).toBe(session);
    expect(goPrevious(session)).toBe(session);

    session = selectAnswer(personalityMatch, session, 'b');
    expect(session.answers.pace).toBe('b');
    expect(canAdvance(personalityMatch, session)).toBe(true);

    session = goNext(personalityMatch, session);
    expect(session.index).toBe(1);
    expect(session.answers.pace).toBe('b');

    session = goPrevious(session);
    expect(session.index).toBe(0);
    expect(session.answers.pace).toBe('b');
    expect(selectAnswer(personalityMatch, session, 'missing')).toBe(session);
  });

  it('finishes on a valid result after every question is answered', () => {
    let session = createSession(personalityMatch.id);

    for (let index = 0; index < personalityMatch.questions.length; index += 1) {
      expect(session.index).toBe(index);
      expect(scoreAnswers(personalityMatch, session.answers)).toBeNull();
      session = selectAnswer(personalityMatch, session, index % 2 === 0 ? 'a' : 'c');

      if (index < personalityMatch.questions.length - 1) {
        expect(isLastQuestion(personalityMatch, session)).toBe(false);
        session = goNext(personalityMatch, session);
      }
    }

    expect(isLastQuestion(personalityMatch, session)).toBe(true);
    expect(goNext(personalityMatch, session)).toBe(session);

    const score = scoreAnswers(personalityMatch, session.answers);
    expect(score).not.toBeNull();
    expect(personalityMatch.results.some((result) => result.id === score?.resultId)).toBe(true);
    expect(score?.total).toBe(personalityMatch.questions.length * 2);
  });
});
