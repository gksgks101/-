import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";

function CardArt({ index }: { index: 0 | 1 | 2 }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 120 72" className="mx-auto h-16 w-28" aria-hidden>
        <rect x="8" y="10" width="22" height="52" rx="4" fill="#efe6d4" stroke="#1c1612" />
        <rect x="36" y="10" width="22" height="52" rx="4" fill="#efe6d4" stroke="#1c1612" />
        <rect x="64" y="10" width="22" height="52" rx="4" fill="#efe6d4" stroke="#1c1612" />
        <rect x="92" y="10" width="22" height="52" rx="4" fill="#efe6d4" stroke="#c41e3a" />
        <text x="19" y="42" textAnchor="middle" fontSize="11">年</text>
        <text x="47" y="42" textAnchor="middle" fontSize="11">月</text>
        <text x="75" y="42" textAnchor="middle" fontSize="11">日</text>
        <text x="103" y="42" textAnchor="middle" fontSize="11" fill="#c41e3a">時</text>
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 120 72" className="mx-auto h-16 w-28" aria-hidden>
        <circle cx="60" cy="36" r="16" fill="#c41e3a" />
        <circle cx="24" cy="22" r="8" fill="#2f6b3a" />
        <circle cx="96" cy="22" r="8" fill="#d4a017" />
        <circle cx="28" cy="54" r="8" fill="#1d4e89" />
        <circle cx="92" cy="54" r="8" fill="#5c564c" />
        <text x="60" y="40" textAnchor="middle" fontSize="11" fill="#f3efe6">我</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 72" className="mx-auto h-16 w-28" aria-hidden>
      <rect x="18" y="8" width="40" height="56" rx="6" fill="#efe6d4" stroke="#1c1612" />
      <rect x="62" y="8" width="40" height="56" rx="6" fill="#1c1612" />
      <path d="M50 36h20" stroke="#c41e3a" strokeWidth="2" markerEnd="url(#a)" />
      <defs>
        <marker id="a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0l6 3-6 3z" fill="#c41e3a" />
        </marker>
      </defs>
    </svg>
  );
}

export function IntroExplain({ locale }: { locale: Locale }) {
  const cards = [
    { title: msg(locale, "intro1Title"), body: msg(locale, "intro1Body") },
    { title: msg(locale, "intro2Title"), body: msg(locale, "intro2Body") },
    { title: msg(locale, "intro3Title"), body: msg(locale, "intro3Body") },
  ] as const;

  return (
    <section className="mt-12">
      <h2 className="pillar-gan mb-5 text-center text-2xl">{msg(locale, "introTitle")}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card, index) => (
          <article key={card.title} className="hanji-panel rounded-3xl p-5 text-center">
            <CardArt index={index as 0 | 1 | 2} />
            <h3 className="mt-3 text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
