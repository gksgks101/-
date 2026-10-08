'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {encodeAnswers} from '@/lib/quiz/codec';
import {
  canAdvance,
  createSession,
  currentQuestion,
  goNext,
  goPrevious,
  isLastQuestion,
  selectAnswer,
} from '@/lib/quiz/session';
import type {QuizCopy, QuizDefinition, QuizSession} from '@/lib/quiz/types';
import {Container} from '@/components/ui/container';
import {focusRing, primaryButton, secondaryButton} from '@/components/ui/styles';

export function QuizPlayer({quiz, copy}: {quiz: QuizDefinition; copy: QuizCopy}) {
  const t = useTranslations('Quiz');
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skippedFocus = useRef(false);
  const [session, setSession] = useState<QuizSession>(() => createSession(quiz.id));

  useEffect(() => {
    if (!skippedFocus.current) {
      skippedFocus.current = true;
      return;
    }

    headingRef.current?.focus();
  }, [session.index]);

  const question = currentQuestion(quiz, session);
  if (!question) {
    return null;
  }

  const questionCopy = copy.questions[question.id];
  const selected = session.answers[question.id];
  const last = isLastQuestion(quiz, session);
  const progress = ((session.index + 1) / quiz.questions.length) * 100;

  function finish() {
    router.push(`/results/quiz/${quiz.id}?a=${encodeAnswers(session.answers)}`);
  }

  return (
    <article className="py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-violet uppercase">{copy.kindLabel}</p>
        <p className="mt-3 text-sm text-muted">{copy.title}</p>
        <div className="mt-8">
          <div className="flex items-center justify-between gap-4 text-sm text-muted">
            <span>{t('progress', {current: session.index + 1, total: quiz.questions.length})}</span>
            <span>{copy.meta}</span>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={quiz.questions.length}
            aria-valuenow={session.index + 1}
            aria-label={t('progress', {current: session.index + 1, total: quiz.questions.length})}
          >
            <div className="h-full rounded-full bg-violet" style={{width: `${progress}%`}} />
          </div>
        </div>
        <form
          className="mt-10"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canAdvance(quiz, session)) {
              return;
            }

            if (last) {
              finish();
              return;
            }

            setSession((current) => goNext(quiz, current));
          }}
        >
          <fieldset>
            <legend className="sr-only">{t('choose')}</legend>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-3xl font-semibold tracking-tight text-balance outline-none sm:text-4xl"
            >
              {questionCopy.prompt}
            </h1>
            <div className="mt-6 grid gap-3">
              {question.options.map((option) => {
                const active = selected === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 text-base leading-6 ${
                      active ? 'border-violet bg-raised' : 'border-line bg-surface hover:border-violet/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={active}
                      onChange={() => setSession((current) => selectAnswer(quiz, current, option.id))}
                      className="mt-1 accent-[#c4b5fd]"
                    />
                    <span>{questionCopy.options[option.id]}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              className={secondaryButton}
              disabled={session.index === 0}
              onClick={() => setSession((current) => goPrevious(current))}
            >
              {t('previous')}
            </button>
            <button type="submit" className={`${primaryButton} ${focusRing}`} disabled={!canAdvance(quiz, session)}>
              {last ? t('seeResult') : t('next')}
            </button>
          </div>
        </form>
        </div>
      </Container>
    </article>
  );
}
