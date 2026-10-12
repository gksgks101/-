import {useLocale, useTranslations} from 'next-intl';
import {getFeatured, isLocale} from '@/content';
import {Container} from '@/components/ui/container';
import {GameCard} from './game-card';

export function FeaturedGames() {
  const t = useTranslations('Home');
  const playLabel = useTranslations('Common')('play');
  const locale = useLocale();
  const games = isLocale(locale) ? getFeatured(locale) : [];

  return (
    <section id="featured" className="scroll-mt-24 py-12 md:py-16">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('featuredTitle')}
          </h2>
          <p className="mt-3 text-lg leading-8 text-muted">{t('featuredLede')}</p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game, index) => (
            <li key={game.id} className="min-h-full">
              <GameCard game={game} index={index} playLabel={playLabel} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
