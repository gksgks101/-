import {fromBase64Url, toBase64Url} from '@/lib/share/base64url';
import {championFromPicks, type Side} from './bracket';

type Payload = {
  v: 1;
  picks: readonly Side[];
};

const personalKeys = ['email', 'name', 'user', 'userId', 'phone', 'address', 'birthday'] as const;

export function encodePicks(picks: readonly Side[]) {
  return toBase64Url(JSON.stringify({v: 1, picks} satisfies Payload));
}

/** Reads a bracket code. Extra fields in a hand-edited link are ignored and never returned. */
export function decodePicks(ids: readonly string[], token: string) {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as Partial<Payload> & Record<string, unknown>;
    if (parsed.v !== 1 || !Array.isArray(parsed.picks)) {
      return null;
    }

    for (const key of personalKeys) {
      if (key in parsed) {
        delete parsed[key];
      }
    }

    const picks = parsed.picks.filter((pick): pick is Side => pick === 'a' || pick === 'b');
    if (picks.length !== parsed.picks.length) {
      return null;
    }

    return championFromPicks(ids, picks);
  } catch {
    return null;
  }
}
