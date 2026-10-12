import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { lifeStages } from "@/lib/interpret/fortuneYears";
import type { SajuCalculation } from "@/lib/saju/types";

const ICONS: Record<string, string> = {
  child: "🌱",
  youth: "🌿",
  adult: "🔥",
  mid: "⛰",
  elder: "🌙",
};

export function LifeFlow({ locale, chart }: { locale: Locale; chart: SajuCalculation }) {
  const stages = lifeStages(chart, locale);
  const points = stages.map((stage, index) => {
    const x = 24 + (index * 352) / Math.max(1, stages.length - 1);
    const y = 88 - (stage.height / 100) * 64;
    return `${x},${y}`;
  });

  return (
    <section className="mt-10 hanji-panel rounded-3xl p-6">
      <h3 className="pillar-gan text-2xl">{msg(locale, "lifeFlowTitle")}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{msg(locale, "lifeFlowLead")}</p>
      <svg viewBox="0 0 400 100" className="mt-5 h-24 w-full" aria-hidden>
        <path d={`M 16 88 H 384`} stroke="rgba(28,22,18,0.16)" strokeWidth="1" />
        <polyline fill="none" stroke="var(--dancheong)" strokeWidth="2.4" points={points.join(" ")} />
        {stages.map((stage, index) => {
          const x = 24 + (index * 352) / Math.max(1, stages.length - 1);
          const y = 88 - (stage.height / 100) * 64;
          return <circle key={stage.id} cx={x} cy={y} r="5" fill="var(--hanji)" stroke="var(--accent)" strokeWidth="2" />;
        })}
      </svg>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stages.map((stage) => (
          <article key={stage.id} className="rounded-2xl border border-[var(--line)] bg-white/40 p-4">
            <p className="text-2xl" aria-hidden>
              {ICONS[stage.id]}
            </p>
            <p className="mt-1 text-xs tracking-[0.16em] text-[var(--muted)]">
              {stage.from}~{stage.to ?? "∞"}
            </p>
            <h4 className="mt-1 text-lg font-semibold">{stage.title}</h4>
            <p className="mt-1 text-[var(--dancheong)]">{stage.keyword}</p>
            {stage.lines.map((line) => (
              <p key={line.slice(0, 20)} className="mt-2 text-sm leading-6 text-[var(--ink)]">
                {line}
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
