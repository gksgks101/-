import {describe, expect, it} from 'vitest';
import {fromBase64Url, toBase64Url} from '@/lib/share/base64url';
import {worldCup} from '@/content/tournaments/world-cup';
import {getTournamentCopy} from '@/content/tournaments';
import {en} from '@/content/en';
import {es} from '@/content/es';
import {bracketState, championFromPicks, type Side} from './bracket';
import {decodePicks, encodePicks} from './codec';

const ids: string[] = worldCup.participants.map((persona) => persona.id);

function picks(value: string): Side[] {
  return value.split('') as Side[];
}

describe('tournament results', () => {
  it('keeps the left side of every match when every pick is a', () => {
    expect(championFromPicks(ids, picks('aaaaaaa'))?.championId).toBe('lina-voss');
  });

  it('keeps the right side of every match when every pick is b', () => {
    expect(championFromPicks(ids, picks('bbbbbbb'))?.championId).toBe('noa-bel');
  });

  it('rejects unfinished, oversized, and illegal pick lists', () => {
    expect(championFromPicks(ids, picks('aaa'))).toBeNull();
    expect(championFromPicks(ids, picks('aaaaaaaa'))).toBeNull();
    expect(bracketState(ids, ['a', 'c' as Side])).toBeNull();
    expect(bracketState(['only-one'], [])).toBeNull();
  });

  it('maps every complete bracket to a roster id', () => {
    const sides: Side[] = ['a', 'b'];
    let count = 0;

    function walk(current: Side[]) {
      if (current.length === ids.length - 1) {
        const champion = championFromPicks(ids, current);
        if (!champion || !ids.includes(champion.championId)) {
          throw new Error('Invalid champion');
        }
        count += 1;
        return;
      }

      for (const side of sides) {
        walk([...current, side]);
      }
    }

    walk([]);
    expect(count).toBe(2 ** (ids.length - 1));
  });

  it('opens the next pair from the winners so far', () => {
    const first = bracketState(ids, []);
    expect(first && 'leftId' in first ? [first.leftId, first.rightId, first.matchNumber, first.roundSize] : null).toEqual([
      'lina-voss',
      'mira-noh',
      1,
      8,
    ]);

    const afterQuarters = bracketState(ids, picks('aaaa'));
    expect(afterQuarters && 'leftId' in afterQuarters ? [afterQuarters.leftId, afterQuarters.rightId, afterQuarters.roundSize] : null).toEqual([
      'lina-voss',
      'sora-ell',
      4,
    ]);
  });

  it('round-trips a bracket code and drops personal fields', () => {
    const token = encodePicks(picks('abababa'));
    const payload = JSON.parse(fromBase64Url(token)) as Record<string, unknown>;
    expect(Object.keys(payload).sort()).toEqual(['picks', 'v']);
    expect(decodePicks(ids, token)?.championId).toBe(championFromPicks(ids, picks('abababa'))?.championId);
    expect(decodePicks(ids, 'nope')).toBeNull();

    const dirty = toBase64Url(
      JSON.stringify({v: 1, picks: picks('abababa'), email: 'fan@example.com', name: 'Fan'}),
    );
    const decoded = decodePicks(ids, dirty);
    expect(decoded?.championId).toBeTruthy();
    expect(JSON.stringify(decoded)).not.toContain('fan@example.com');
    expect(JSON.stringify(decoded)).not.toContain('Fan');
  });

  it('uses the same roster names as the tournament page', () => {
    for (const [locale, catalog] of [
      ['en', en],
      ['es', es],
    ] as const) {
      const copy = getTournamentCopy(locale, worldCup.id);
      expect(copy?.title).toBe(catalog.tournament.title);
      expect(catalog.tournament.highlights.map((item) => item.monogram)).toEqual(
        worldCup.participants.map((persona) => persona.monogram),
      );
      expect(catalog.tournament.highlights.map((item) => item.title)).toEqual(
        worldCup.participants.map((persona) => copy?.participants[persona.id]?.name),
      );
    }
  });
});
