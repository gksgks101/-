import { isLocale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { notFound } from "next/navigation";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 leading-8">
      <p className="text-xs tracking-[0.3em] text-[var(--gold)]">PRIVACY</p>
      <h1 className="pillar-gan mt-3 text-4xl">{msg(locale, "privacyTitle")}</h1>
      <p className="mt-8 text-[var(--muted)]">{msg(locale, "privacyLead")}</p>
      <h2 className="mt-10 text-xl">{msg(locale, "privacyH1")}</h2>
      <p className="text-[var(--muted)]">{msg(locale, "privacyP1")}</p>
      <h2 className="mt-10 text-xl">{msg(locale, "privacyH2")}</h2>
      <p className="text-[var(--muted)]">{msg(locale, "privacyP2")}</p>
      <h2 className="mt-10 text-xl">{msg(locale, "privacyH3")}</h2>
      <p className="text-[var(--muted)]">{msg(locale, "privacyP3")}</p>
      <h2 className="mt-10 text-xl">{msg(locale, "privacyH4")}</h2>
      <p className="text-[var(--muted)]">{msg(locale, "privacyP4")}</p>
    </article>
  );
}
