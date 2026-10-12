import {getTournament} from '@/content';
import {resolveLocale} from '@/lib/locale';
import {ogCard, ogSize} from '@/lib/og-card';

export const alt = 'Kaleid tournament';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({params}: {params: Promise<{locale: string}>}) {
  const locale = resolveLocale((await params).locale);
  const page = getTournament(locale);

  return ogCard({kicker: page.eyebrow, title: page.title, summary: page.summary});
}
