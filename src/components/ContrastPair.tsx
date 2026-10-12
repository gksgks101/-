import type { ContrastPair } from "@/lib/interpret/themes";

export function ContrastPairView({ pair }: { pair: ContrastPair }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <section className="contrast-good rounded-2xl p-4">
        <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--ink)]">
          <span aria-hidden className="text-lg text-[#3d6b45]">
            ○
          </span>
          {pair.goodTitle}
        </h4>
        <ul className="space-y-3">
          {pair.good.map((item) => (
            <li key={`${item.label}-${item.why.slice(0, 12)}`}>
              <p className="text-[16px] font-medium leading-6 text-[var(--ink)]">{item.label}</p>
              <p className="mt-0.5 text-[13px] leading-5 text-[var(--muted)]">{item.why}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="contrast-caution rounded-2xl p-4">
        <h4 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--ink)]">
          <span aria-hidden className="text-lg text-[#a33b3b]">
            △
          </span>
          {pair.cautionTitle}
        </h4>
        <ul className="space-y-3">
          {pair.caution.map((item) => (
            <li key={`${item.label}-${item.why.slice(0, 12)}`}>
              <p className="text-[16px] font-medium leading-6 text-[var(--ink)]">{item.label}</p>
              <p className="mt-0.5 text-[13px] leading-5 text-[var(--muted)]">{item.why}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
