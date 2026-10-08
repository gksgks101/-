import type {QuizDefinition, QuizSession} from './types';

export function createSession(quizId: string): QuizSession {
  return {quizId, index: 0, answers: {}};
}

export function currentQuestion(quiz: QuizDefinition, session: QuizSession) {
  return quiz.questions[session.index];
}

export function canAdvance(quiz: QuizDefinition, session: QuizSession) {
  const question = currentQuestion(quiz, session);
  if (!question) {
    return false;
  }

  return question.options.some((option) => option.id === session.answers[question.id]);
}

export function selectAnswer(quiz: QuizDefinition, session: QuizSession, optionId: string): QuizSession {
  const question = currentQuestion(quiz, session);
  if (!question?.options.some((option) => option.id === optionId)) {
    return session;
  }

  return {
    ...session,
    answers: {...session.answers, [question.id]: optionId},
  };
}

export function goNext(quiz: QuizDefinition, session: QuizSession): QuizSession {
  if (!canAdvance(quiz, session) || session.index >= quiz.questions.length - 1) {
    return session;
  }

  return {...session, index: session.index + 1};
}

export function goPrevious(session: QuizSession): QuizSession {
  if (session.index === 0) {
    return session;
  }

  return {...session, index: session.index - 1};
}

export function isLastQuestion(quiz: QuizDefinition, session: QuizSession) {
  return session.index === quiz.questions.length - 1;
}
