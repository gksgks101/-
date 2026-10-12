import { BirthForm } from "@/components/BirthForm";
import { isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-16">
      <p className="mb-3 text-center text-xs tracking-[0.35em] text-[var(--gold)]">{msg(raw, "homeKicker")}</p>
      <h1 className="pillar-gan mb-4 text-center text-4xl leading-tight sm:text-5xl">
        {msg(raw, "homeTitle1")}
        <br />
        {msg(raw, "homeTitle2")}
      </h1>
      <p className="mb-10 text-center text-[var(--muted)]">{msg(raw, "homeLead")}</p>
      <div className="rounded-3xl border border-[var(--line)] bg-[#12100d]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <BirthForm locale={raw} />
      </div>
      <div className="mt-10 grid gap-3 text-sm text-[var(--muted)]">
        <p>{msg(raw, "homeNote1")}</p>
        <p>{msg(raw, "homeNote2")}</p>
        <p>{msg(raw, "homeNote3")}</p>
      </div>
    </div>
  );
}
