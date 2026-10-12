import { ResultView } from "@/components/ResultView";
import { isLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export default async function ResultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ResultView locale={locale} />;
}
