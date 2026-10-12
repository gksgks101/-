import type {PopularQuiz} from '@/content/types';
import {Link} from '@/i18n/navigation';
import {Monogram} from '@/components/ui/monogram';
import {focusRing} from '@/components/ui/styles';

export function QuizCard({quiz, playLabel}: {quiz: PopularQuiz; playLabel: string}) {
  return (
    <Link
      href={quiz.href}
      className={`flex h-full flex-col rounded-[1.5rem] border border-line bg-surface p-5 transition hover:border-violet/50 hover:bg-raised ${focusRing}`}
    >
      <Monogram letters={quiz.monogram} tone={quiz.tone} />
      <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-violet uppercase">
        {quiz.kind}
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{quiz.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{quiz.summary}</p>
      <p className="mt-6 flex items-center justify-between text-sm text-subtle">
        <span>{quiz.meta}</span>
        <span className="font-semibold text-foreground">
          {playLabel}
          <span aria-hidden="true"> →</span>
        </span>
      </p>
    </Link>
  );
}
