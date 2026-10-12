export type Side = 'a' | 'b';

export type OpenMatch = {
  leftId: string;
  rightId: string;
  matchNumber: number;
  totalMatches: number;
  roundSize: number;
};

export type BracketResult = {
  championId: string;
};

function isPowerOfTwo(value: number) {
  return value >= 2 && (value & (value - 1)) === 0;
}

function validPicks(picks: readonly Side[]) {
  return picks.every((pick) => pick === 'a' || pick === 'b');
}

/** Replay picks from a fixed seeding. A partial list returns the next open match. */
export function bracketState(ids: readonly string[], picks: readonly Side[]): OpenMatch | BracketResult | null {
  if (!isPowerOfTwo(ids.length) || !validPicks(picks)) {
    return null;
  }

  const totalMatches = ids.length - 1;
  if (picks.length > totalMatches) {
    return null;
  }

  let field = [...ids];
  let cursor = 0;

  while (field.length > 1) {
    const matchesInRound = field.length / 2;
    const picksLeft = picks.length - cursor;

    if (picksLeft < matchesInRound) {
      const pair = picksLeft;
      const leftId = field[pair * 2];
      const rightId = field[pair * 2 + 1];
      if (!leftId || !rightId) {
        return null;
      }

      return {
        leftId,
        rightId,
        matchNumber: cursor + picksLeft + 1,
        totalMatches,
        roundSize: field.length,
      };
    }

    const next: string[] = [];
    for (let match = 0; match < matchesInRound; match += 1) {
      const leftId = field[match * 2];
      const rightId = field[match * 2 + 1];
      const pick = picks[cursor];
      cursor += 1;
      if (!leftId || !rightId || (pick !== 'a' && pick !== 'b')) {
        return null;
      }
      next.push(pick === 'a' ? leftId : rightId);
    }
    field = next;
  }

  if (picks.length !== totalMatches || !field[0]) {
    return null;
  }

  return {championId: field[0]};
}

export function championFromPicks(ids: readonly string[], picks: readonly Side[]): BracketResult | null {
  const state = bracketState(ids, picks);
  if (!state || !('championId' in state)) {
    return null;
  }

  return state;
}
