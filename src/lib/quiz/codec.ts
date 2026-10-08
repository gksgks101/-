import {fromBase64Url, toBase64Url} from '@/lib/share/base64url';
import {scoreAnswers} from './score';
import type {QuizDefinition, QuizScore} from './types';

type Payload = {
  v: 1;
  answers: Record<string, string>;
};

export function encodeAnswers(answers: Record<string, string>) {
  return toBase64Url(JSON.stringify({v: 1, answers} satisfies Payload));
}

/** Recomputes the winner from the saved answers so a shared link cannot invent a result. */
export function decodeResult(quiz: QuizDefinition, token: string): QuizScore | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as Partial<Payload>;
    if (parsed.v !== 1 || !parsed.answers || typeof parsed.answers !== 'object') {
      return null;
    }

    return scoreAnswers(quiz, parsed.answers);
  } catch {
    return null;
  }
}
