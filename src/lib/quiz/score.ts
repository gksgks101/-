import type {QuizDefinition, QuizScore} from './types';

function emptyScores(quiz: QuizDefinition) {
  return Object.fromEntries(quiz.results.map((result) => [result.id, 0]));
}

function tieIndex(quiz: QuizDefinition, resultId: string) {
  const index = quiz.tieBreak.indexOf(resultId);
  return index === -1 ? quiz.tieBreak.length : index;
}

/**
 * Highest total wins. Equal totals resolve to the earliest id in `tieBreak`,
 * so the same scores always produce the same persona.
 */
export function pickWinner(quiz: QuizDefinition, scores: Record<string, number>) {
  let top = 0;
  for (const result of quiz.results) {
    top = Math.max(top, scores[result.id] ?? 0);
  }

  const tiedIds = quiz.tieBreak.filter((id) => (scores[id] ?? 0) === top);
  return {
    resultId: tiedIds[0] ?? quiz.tieBreak[0],
    tiedIds,
  };
}

export function isComplete(quiz: QuizDefinition, answers: Record<string, string>) {
  return quiz.questions.every((question) => {
    const optionId = answers[question.id];
    return question.options.some((option) => option.id === optionId);
  });
}

/** Returns null until every question has a known option. */
export function scoreAnswers(
  quiz: QuizDefinition,
  answers: Record<string, string>,
): QuizScore | null {
  if (!isComplete(quiz, answers)) {
    return null;
  }

  const scores = emptyScores(quiz);

  for (const question of quiz.questions) {
    const option = question.options.find((item) => item.id === answers[question.id]);
    if (!option) {
      return null;
    }

    for (const [resultId, points] of Object.entries(option.scores)) {
      scores[resultId] = (scores[resultId] ?? 0) + points;
    }
  }

  const {resultId, tiedIds} = pickWinner(quiz, scores);
  const total = Object.values(scores).reduce((sum, points) => sum + points, 0);
  const ranked = quiz.results
    .map((result) => ({id: result.id, points: scores[result.id] ?? 0}))
    .sort((left, right) => right.points - left.points || tieIndex(quiz, left.id) - tieIndex(quiz, right.id));

  return {
    resultId,
    scores,
    total,
    strength: total === 0 ? 0 : Math.round(((scores[resultId] ?? 0) / total) * 100),
    tiedIds,
    ranked,
  };
}
