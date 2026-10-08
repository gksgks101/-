export const quizSlugs = ['personality-match', 'ideal-match'] as const;

export type QuizSlug = (typeof quizSlugs)[number];

export type Tone = 'violet' | 'iris' | 'lilac';

export type FeaturedGame = {
  id: 'world-cup' | 'personality' | 'compatibility';
  href: string;
  kind: string;
  title: string;
  summary: string;
  marks: string[];
};

export type PopularQuiz = {
  slug: QuizSlug;
  href: string;
  kind: string;
  title: string;
  summary: string;
  meta: string;
  monogram: string;
  tone: Tone;
};

export type Highlight = {
  monogram: string;
  title: string;
  body: string;
  tone: Tone;
};

export type DetailPage = {
  eyebrow: string;
  title: string;
  summary: string;
  stats: {label: string; value: string}[];
  stepsTitle: string;
  steps: {title: string; body: string}[];
  highlightsTitle: string;
  highlights: Highlight[];
};

export type StaticSection = {
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
};

export type StaticPage = {
  eyebrow: string;
  title: string;
  lede: string;
  sections: StaticSection[];
};

export type Catalog = {
  featured: FeaturedGame[];
  popular: PopularQuiz[];
  tournament: DetailPage;
  about: StaticPage;
  privacy: StaticPage;
  contact: StaticPage;
};
