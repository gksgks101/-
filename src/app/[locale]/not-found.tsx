import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Container} from '@/components/ui/container';
import {primaryButton} from '@/components/ui/styles';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <Container className="py-24">
      <h1 className="max-w-xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {t('title')}
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-muted">{t('body')}</p>
      <Link href="/" className={`mt-8 ${primaryButton}`}>
        {t('home')}
      </Link>
    </Container>
  );
}
