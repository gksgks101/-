import type {FeaturedGame} from '@/content/types';
import {Link} from '@/i18n/navigation';
import {Monogram} from '@/components/ui/monogram';
import {focusRing} from '@/components/ui/styles';

export function GameCard({
  game,
  index,
  playLabel,
}: {
  game: FeaturedGame;
  index: number;
  playLabel: string;
}) {
  return (
    <Link
      href={game.href}
      className={`group flex h-full flex-col rounded-[1.75rem] border border-line bg-surface p-6 transition hover:border-violet/50 hover:bg-raised sm:p-7 ${focusRing}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-violet uppercase">
          {game.kind}
        </p>
        <p className="font-display text-sm text-subtle">
          {String(index + 1).padStart(2, '0')}
        </p>
      </div>
      <h3 className="mt-8 font-display text-[1.7rem] leading-tight font-semibold tracking-tight text-balance">
        {game.title}
      </h3>
      <p className="mt-3 flex-1 text-base leading-7 text-muted">{game.summary}</p>
      <div className="mt-8 flex items-center justify-between gap-4">
        <span className="flex gap-2">
          {game.marks.map((mark, markIndex) => (
            <Monogram
              key={mark}
              letters={mark}
              size="sm"
              tone={markIndex === 1 ? 'iris' : markIndex === 2 ? 'lilac' : 'violet'}
            />
          ))}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {playLabel}
          <span aria-hidden="true"> →</span>
        </span>
      </div>
    </Link>
  );
}
