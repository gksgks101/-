import type {Catalog} from './types';

export const en: Catalog = {
  featured: [
    {
      id: 'world-cup',
      href: '/tournaments',
      kind: 'World Cup',
      title: 'Ideal Type World Cup',
      summary:
        'Eight original personas. Pick a side until one ideal type is the last one standing.',
      marks: ['LV', 'MN', 'SE'],
    },
    {
      id: 'personality',
      href: '/quizzes/personality-match',
      kind: 'Personality',
      title: 'Which K-pop Idol Matches Your Personality?',
      summary: 'Nine questions that match you with a fictional stage persona.',
      marks: ['LV'],
    },
    {
      id: 'compatibility',
      href: '/quizzes/ideal-match',
      kind: 'Compatibility',
      title: 'Which K-pop Idol Is Your Ideal Match?',
      summary: 'Nine questions that name the fictional persona you keep choosing.',
      marks: ['SE'],
    },
  ],
  popular: [
    {
      slug: 'personality-match',
      href: '/quizzes/personality-match',
      kind: 'Personality',
      title: 'Which K-pop Idol Matches Your Personality?',
      summary: 'Nine questions that match you with a fictional stage persona.',
      meta: '9 questions · 4 min',
      monogram: 'LV',
      tone: 'violet',
    },
    {
      slug: 'ideal-match',
      href: '/quizzes/ideal-match',
      kind: 'Compatibility',
      title: 'Which K-pop Idol Is Your Ideal Match?',
      summary: 'Nine questions that name the fictional persona you keep choosing.',
      meta: '9 questions · 4 min',
      monogram: 'SE',
      tone: 'lilac',
    },
  ],
  tournament: {
    eyebrow: 'Ideal Type World Cup',
    title: 'Ideal Type World Cup',
    summary:
      'A single-elimination bracket of eight original stage personas. Two appear at a time. You keep the one that fits until a champion remains.',
    stats: [
      {label: 'Roster', value: '8 personas'},
      {label: 'Format', value: '3 rounds'},
      {label: 'Time', value: 'About 3 min'},
    ],
    stepsTitle: 'How a run works',
    steps: [
      {
        title: 'Meet the roster',
        body: 'Every persona is fictional: a role, a monogram, and a short trait line. No photographs.',
      },
      {
        title: 'Pick a side',
        body: 'Each match is a pair. Choose the persona that feels closer to your ideal type.',
      },
      {
        title: 'Name a champion',
        body: 'The last persona standing is your result, with the path of picks that got you there.',
      },
    ],
    highlightsTitle: 'The roster',
    highlights: [
      {monogram: 'LV', title: 'Lina Voss', body: 'Center vocal', tone: 'violet'},
      {monogram: 'MN', title: 'Mira Noh', body: 'Lead rap', tone: 'iris'},
      {monogram: 'SE', title: 'Sora Ell', body: 'Visual line', tone: 'lilac'},
      {monogram: 'JR', title: 'Jae Rim', body: 'Main dancer', tone: 'violet'},
      {monogram: 'HS', title: 'Hana Sol', body: 'Producer', tone: 'iris'},
      {monogram: 'TP', title: 'Theo Park', body: 'Sub vocal', tone: 'lilac'},
      {monogram: 'RC', title: 'Ryn Cho', body: 'Performance', tone: 'violet'},
      {monogram: 'NB', title: 'Noa Bel', body: 'Lyricist', tone: 'iris'},
    ],
  },
  about: {
    eyebrow: 'Kaleid',
    title: 'About',
    lede: 'Kaleid is a fan entertainment site for ideal-type tournaments, personality quizzes, and compatibility quizzes.',
    sections: [
      {
        title: 'Original by design',
        body: 'Personas, archetypes, and visuals are created for Kaleid. The site uses text labels and CSS monograms instead of idol photographs, official logos, or unlicensed brand assets.',
      },
      {
        title: 'Play without an account',
        body: 'This version has no sign-in, payments, comments, direct messages, or uploads. Quizzes run in the browser from local questions and scores.',
      },
      {
        title: 'English first',
        body: 'English is the default language. Spanish is available from the language control in the header. Adding another language means a new message catalog and a matching content file.',
      },
    ],
  },
  privacy: {
    eyebrow: 'Kaleid',
    title: 'Privacy',
    lede: 'This version of Kaleid is a public site with local content. It does not ask you to create a profile.',
    sections: [
      {
        title: 'What this version stores',
        body: 'There is no account database, no comment history, and no message inbox. Quiz and tournament copy lives in the app, not in a user record. A shared result link stores a code for the answers or bracket picks. It does not include a name, email, or other personal information.',
      },
      {
        title: 'Language preference',
        body: 'Choosing English or Spanish can store a locale cookie so the next visit opens in that language. The cookie remembers a language code. It is not an account.',
      },
      {
        title: 'What we do not do',
        body: 'This version does not sell personal data, accept uploads, or process payments.',
      },
    ],
  },
  contact: {
    eyebrow: 'Kaleid',
    title: 'Contact',
    lede: 'Kaleid does not collect messages in this version. These notes show where each kind of question belongs.',
    sections: [
      {
        title: 'About the games',
        body: 'The home page lists the ideal-type world cup, the personality quiz, and the compatibility quiz.',
        href: '/',
        hrefLabel: 'Go to home',
      },
      {
        title: 'Privacy',
        body: 'The privacy page explains the language cookie and what this version does not collect.',
        href: '/privacy',
        hrefLabel: 'Read privacy',
      },
      {
        title: 'Affiliation',
        body: 'Kaleid is an independent fan project. It is not an official agency, network, or artist site.',
        href: '/about',
        hrefLabel: 'Read about',
      },
    ],
  },
};
