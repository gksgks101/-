import type {QuizCopy, QuizDefinition} from './types';

function fail(quizId: string, message: string): never {
  throw new Error(`${quizId}: ${message}`);
}

export function validateQuiz(quiz: QuizDefinition) {
  if (quiz.questions.length === 0) {
    fail(quiz.id, 'needs at least one question');
  }

  const resultIds = quiz.results.map((result) => result.id);
  if (new Set(resultIds).size !== resultIds.length) {
    fail(quiz.id, 'has duplicate result ids');
  }

  const tieBreak = [...quiz.tieBreak].sort();
  const sortedResults = [...resultIds].sort();
  if (tieBreak.join('|') !== sortedResults.join('|')) {
    fail(quiz.id, 'tieBreak must list every result exactly once');
  }

  const questionIds = new Set<string>();
  for (const question of quiz.questions) {
    if (questionIds.has(question.id)) {
      fail(quiz.id, `duplicates question ${question.id}`);
    }
    questionIds.add(question.id);

    if (question.options.length < 2) {
      fail(quiz.id, `${question.id} needs at least two options`);
    }

    const optionIds = new Set<string>();
    for (const option of question.options) {
      if (optionIds.has(option.id)) {
        fail(quiz.id, `${question.id} duplicates option ${option.id}`);
      }
      optionIds.add(option.id);

      const entries = Object.entries(option.scores);
      if (entries.length === 0) {
        fail(quiz.id, `${question.id} option ${option.id} does not score a result`);
      }

      for (const [resultId, points] of entries) {
        if (!resultIds.includes(resultId) || !Number.isInteger(points) || points <= 0) {
          fail(quiz.id, `${question.id} option ${option.id} has an invalid score for ${resultId}`);
        }
      }
    }
  }
}

export function validateQuizCopy(quiz: QuizDefinition, copy: QuizCopy) {
  for (const question of quiz.questions) {
    const questionCopy = copy.questions[question.id];
    if (!questionCopy?.prompt) {
      fail(quiz.id, `missing prompt for ${question.id}`);
    }

    for (const option of question.options) {
      if (!questionCopy.options[option.id]) {
        fail(quiz.id, `missing option copy ${question.id}.${option.id}`);
      }
    }
  }

  for (const result of quiz.results) {
    const resultCopy = copy.results[result.id];
    if (!resultCopy?.name || !resultCopy.role || !resultCopy.explanation) {
      fail(quiz.id, `missing result copy for ${result.id}`);
    }
  }
}
