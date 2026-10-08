import type {QuizQuestion} from './types';

/** One option per result, each worth the same point value. Option ids are a, b, c... */
export function exclusiveQuestion(
  id: string,
  resultIds: readonly string[],
  points = 2,
): QuizQuestion {
  return {
    id,
    options: resultIds.map((resultId, index) => ({
      id: String.fromCharCode(97 + index),
      scores: {[resultId]: points},
    })),
  };
}
