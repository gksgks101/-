import type {Tone} from '@/content/types';
import {Monogram} from '@/components/ui/monogram';

export type ResultCardData = {
  eyebrow: string;
  sourceTitle: string;
  resultTitle: string;
  description: string;
  monogram: string;
  tone: Tone;
  mark: string;
};

export function ResultCard({card}: {card: ResultCardData}) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-line bg-[#12101c]">
      <div className="h-1.5 bg-[#c4b5fd]" />
      <div className="p-5 sm:p-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-violet">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-violet" />
          Kaleid
        </p>
        <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-violet uppercase">{card.eyebrow}</p>
        <p className="mt-3 font-display text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
          {card.sourceTitle}
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Monogram letters={card.monogram} tone={card.tone} size="lg" />
          <p className="text-sm text-muted">{card.mark}</p>
        </div>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {card.resultTitle}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">{card.description}</p>
      </div>
    </section>
  );
}
