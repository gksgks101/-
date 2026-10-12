import type {Catalog} from './types';

export const es: Catalog = {
  featured: [
    {
      id: 'world-cup',
      href: '/tournaments',
      kind: 'Mundial',
      title: 'Mundial de tipo ideal',
      summary:
        'Ocho personajes originales. Elige un lado hasta que quede un solo tipo ideal.',
      marks: ['LV', 'MN', 'SE'],
    },
    {
      id: 'personality',
      href: '/quizzes/personality-match',
      kind: 'Personalidad',
      title: '¿Qué ídolo de K-pop encaja con tu personalidad?',
      summary: 'Nueve preguntas que te emparejan con un personaje de escenario ficticio.',
      marks: ['LV'],
    },
    {
      id: 'compatibility',
      href: '/quizzes/ideal-match',
      kind: 'Compatibilidad',
      title: '¿Qué ídolo de K-pop es tu match ideal?',
      summary: 'Nueve preguntas que nombran al personaje ficticio que sigues eligiendo.',
      marks: ['SE'],
    },
  ],
  popular: [
    {
      slug: 'personality-match',
      href: '/quizzes/personality-match',
      kind: 'Personalidad',
      title: '¿Qué ídolo de K-pop encaja con tu personalidad?',
      summary: 'Nueve preguntas que te emparejan con un personaje de escenario ficticio.',
      meta: '9 preguntas · 4 min',
      monogram: 'LV',
      tone: 'violet',
    },
    {
      slug: 'ideal-match',
      href: '/quizzes/ideal-match',
      kind: 'Compatibilidad',
      title: '¿Qué ídolo de K-pop es tu match ideal?',
      summary: 'Nueve preguntas que nombran al personaje ficticio que sigues eligiendo.',
      meta: '9 preguntas · 4 min',
      monogram: 'SE',
      tone: 'lilac',
    },
  ],
  tournament: {
    eyebrow: 'Mundial de tipo ideal',
    title: 'Mundial de tipo ideal',
    summary:
      'Un bracket de eliminación directa con ocho personajes de escenario originales. Aparecen de dos en dos. Te quedas con el que encaja hasta que queda un campeón.',
    stats: [
      {label: 'Elenco', value: '8 personajes'},
      {label: 'Formato', value: '3 rondas'},
      {label: 'Tiempo', value: 'Unos 3 min'},
    ],
    stepsTitle: 'Cómo funciona una partida',
    steps: [
      {
        title: 'Conoce el elenco',
        body: 'Cada personaje es ficticio: un rol, un monograma y una línea de rasgos. Sin fotografías.',
      },
      {
        title: 'Elige un lado',
        body: 'Cada duelo es una pareja. Quédate con el personaje más cercano a tu tipo ideal.',
      },
      {
        title: 'Nombra un campeón',
        body: 'El último personaje en pie es tu resultado, con el camino de elecciones que te llevó ahí.',
      },
    ],
    highlightsTitle: 'El elenco',
    highlights: [
      {monogram: 'LV', title: 'Lina Voss', body: 'Vocal principal', tone: 'violet'},
      {monogram: 'MN', title: 'Mira Noh', body: 'Rap principal', tone: 'iris'},
      {monogram: 'SE', title: 'Sora Ell', body: 'Línea visual', tone: 'lilac'},
      {monogram: 'JR', title: 'Jae Rim', body: 'Bailarín principal', tone: 'violet'},
      {monogram: 'HS', title: 'Hana Sol', body: 'Productor', tone: 'iris'},
      {monogram: 'TP', title: 'Theo Park', body: 'Subvocal', tone: 'lilac'},
      {monogram: 'RC', title: 'Ryn Cho', body: 'Performance', tone: 'violet'},
      {monogram: 'NB', title: 'Noa Bel', body: 'Letrista', tone: 'iris'},
    ],
  },
  about: {
    eyebrow: 'Kaleid',
    title: 'Acerca de',
    lede: 'Kaleid es un sitio de entretenimiento fan para torneos de tipo ideal, quizzes de personalidad y quizzes de compatibilidad.',
    sections: [
      {
        title: 'Original por diseño',
        body: 'Los personajes, los arquetipos y las imágenes se crean para Kaleid. El sitio usa etiquetas de texto y monogramas en CSS en lugar de fotografías de ídolos, logotipos oficiales o marcas sin licencia.',
      },
      {
        title: 'Juega sin cuenta',
        body: 'Esta versión no tiene inicio de sesión, pagos, comentarios, mensajes directos ni cargas de archivos. Los quizzes se juegan en el navegador con preguntas y puntajes locales.',
      },
      {
        title: 'Inglés primero',
        body: 'El inglés es el idioma predeterminado. El español está en el selector del encabezado. Añadir otro idioma significa un catálogo de mensajes nuevo y un archivo de contenido equivalente.',
      },
    ],
  },
  privacy: {
    eyebrow: 'Kaleid',
    title: 'Privacidad',
    lede: 'Esta versión de Kaleid es un sitio público con contenido local. No te pide crear un perfil.',
    sections: [
      {
        title: 'Qué guarda esta versión',
        body: 'No hay base de datos de cuentas, ni historial de comentarios, ni bandeja de mensajes. El texto de los quizzes y del torneo vive en la app, no en un registro de usuario. Un enlace de resultado guarda un código de las respuestas o de las elecciones del bracket. No incluye un nombre, un correo ni otra información personal.',
      },
      {
        title: 'Preferencia de idioma',
        body: 'Elegir inglés o español puede guardar una cookie de idioma para que la próxima visita abra en ese idioma. La cookie recuerda un código de idioma. No es una cuenta.',
      },
      {
        title: 'Qué no hacemos',
        body: 'Esta versión no vende datos personales, no acepta archivos y no procesa pagos.',
      },
    ],
  },
  contact: {
    eyebrow: 'Kaleid',
    title: 'Contacto',
    lede: 'Kaleid no recoge mensajes en esta versión. Estas notas muestran dónde encaja cada tipo de pregunta.',
    sections: [
      {
        title: 'Sobre los juegos',
        body: 'La página de inicio lista el mundial de tipo ideal, el quiz de personalidad y el quiz de compatibilidad.',
        href: '/',
        hrefLabel: 'Ir al inicio',
      },
      {
        title: 'Privacidad',
        body: 'La página de privacidad explica la cookie de idioma y qué no recoge esta versión.',
        href: '/privacy',
        hrefLabel: 'Leer privacidad',
      },
      {
        title: 'Afiliación',
        body: 'Kaleid es un proyecto fan independiente. No es un sitio oficial de agencia, cadena o artista.',
        href: '/about',
        hrefLabel: 'Leer acerca de',
      },
    ],
  },
};
