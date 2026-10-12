'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {Monogram} from '@/components/ui/monogram';
import {Container} from '@/components/ui/container';
import {secondaryButton} from '@/components/ui/styles';
import type {Tone} from '@/content/types';
import {bracketState, type Side} from '@/lib/tournament/bracket';
import {encodePicks} from '@/lib/tournament/codec';

export type BracketPersona = {
  id: string;
  name: string;
  role: string;
  monogram: string;
  tone: Tone;
};

export function BracketPlayer({
  tournamentId,
  eyebrow,
  title,
  personas,
}: {
  tournamentId: string;
  eyebrow: string;
  title: string;
  personas: BracketPersona[];
}) {
  const t = useTranslations('Tournament');
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skippedFocus = useRef(false);
  const [picks, setPicks] = useState<Side[]>([]);
  const ids = personas.map((persona) => persona.id);
  const match = bracketState(ids, picks);

  useEffect(() => {
    if (!skippedFocus.current) {
      skippedFocus.current = true;
      return;
    }

    headingRef.current?.focus();
  }, [picks.length]);

  if (!match || 'championId' in match) {
    return null;
  }

  const left = personas.find((persona) => persona.id === match.leftId);
  const right = personas.find((persona) => persona.id === match.rightId);
  if (!left || !right) {
    return null;
  }

  const round = match.roundSize === 2 ? t('final') : match.roundSize === 4 ? t('semifinal') : t('quarter');
  const progress = (match.matchNumber / match.totalMatches) * 100;

  function choose(side: Side) {
    const next = [...picks, side];
    const state = bracketState(ids, next);
    if (state && 'championId' in state) {
      router.push(`/results/tournament/${tournamentId}?p=${encodePicks(next)}`);
      return;
    }

    setPicks(next);
  }

  return (
    <article className="py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-violet uppercase">{eyebrow}</p>
          <p className="mt-3 text-sm text-muted">{title}</p>
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4 text-sm text-muted">
              <span>{t('progress', {current: match.matchNumber, total: match.totalMatches})}</span>
              <span>{round}</span>
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={match.totalMatches}
              aria-valuenow={match.matchNumber}
              aria-label={t('progress', {current: match.matchNumber, total: match.totalMatches})}
            >
              <div className="h-full rounded-full bg-violet" style={{width: `${progress}%`}} />
            </div>
          </div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-10 font-display text-3xl font-semibold tracking-tight text-balance outline-none sm:text-4xl"
          >
            {round}
          </h1>
          <p className="mt-3 text-base text-muted">{t('choose')}</p>
          <div className="mt-6 grid gap-3">
            {[
              {side: 'a' as const, persona: left},
              {side: 'b' as const, persona: right},
            ].map(({side, persona}) => (
              <button
                key={persona.id}
                type="button"
                className="flex min-h-20 w-full items-center gap-4 rounded-[1.5rem] border border-line bg-surface px-4 py-4 text-left hover:border-violet/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-strong"
                onClick={() => choose(side)}
              >
                <Monogram letters={persona.monogram} tone={persona.tone} />
                <span>
                  <span className="block font-display text-2xl font-semibold tracking-tight">{persona.name}</span>
                  <span className="mt-1 block text-sm text-muted">{persona.role}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-8">
            <button
              type="button"
              className={secondaryButton}
              disabled={picks.length === 0}
              onClick={() => setPicks((current) => current.slice(0, -1))}
            >
              {t('previous')}
            </button>
          </div>
        </div>
      </Container>
    </article>
  );
}
