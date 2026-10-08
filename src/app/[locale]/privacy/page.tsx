import type {Metadata} from 'next';
import {StaticPageView} from '@/components/content/static-page';
import {getStaticPage} from '@/content';
import {resolveLocale} from '@/lib/locale';
import {pageMetadata} from '@/lib/metadata';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const page = getStaticPage(locale, 'privacy');

  return pageMetadata({
    locale,
    href: '/privacy',
    title: page.title,
    description: page.lede,
  });
}

export default async function PrivacyPage({params}: Props) {
  const locale = resolveLocale((await params).locale);

  return <StaticPageView page={getStaticPage(locale, 'privacy')} />;
}
