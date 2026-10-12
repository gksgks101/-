import type {QuizScore} from '@/lib/quiz/types';

export function ScoreSummary({
  score,
  names,
  heading,
  pointsLabel,
}: {
  score: QuizScore;
  names: Record<string, string>;
  heading: string;
  pointsLabel: (count: number) => string;
}) {
  const max = score.ranked[0]?.points || 1;

  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{heading}</h2>
      <ul className="mt-5 grid gap-4">
        {score.ranked.map((item) => {
          const width = Math.round((item.points / max) * 100);
          const winner = item.id === score.resultId;
          return (
            <li key={item.id}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className={winner ? 'font-semibold text-foreground' : 'text-muted'}>{names[item.id]}</span>
                <span className="text-subtle">{pointsLabel(item.points)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-raised" aria-hidden="true">
                <div
                  className={`h-full rounded-full ${winner ? 'bg-violet' : 'bg-violet/45'}`}
                  style={{width: `${width}%`}}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
