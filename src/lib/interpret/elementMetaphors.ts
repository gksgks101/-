import type { Locale } from "@/lib/i18n/config";
import type { ElementKey } from "@/lib/saju/types";

export const ELEMENT_METAPHOR: Record<ElementKey, Record<Locale, { much: string; little: string }>> = {
  wood: {
    ko: { much: "금이 아니라 나무처럼, 방향이 먼저 나와요.", little: "나무가 적으면 시작이 늦어질 수 있어요." },
    es: { much: "Como un árbol: primero sale la dirección.", little: "Poca madera: el inicio puede tardar." },
    pl: { much: "Jak drzewo: najpierw wychodzi kierunek.", little: "Mało drewna: start może się spóźnić." },
  },
  fire: {
    ko: { much: "불처럼 자리를 밝히고 감정이 먼저 보여요.", little: "불이 적으면 온기와 표현이 줄어들 수 있어요." },
    es: { much: "Como el fuego: ilumina y se ve la emoción.", little: "Poco fuego: bajan calor y expresión." },
    pl: { much: "Jak ogień: rozświetla i widać emocję.", little: "Mało ognia: ciepło i wyraz mogą spaść." },
  },
  earth: {
    ko: { much: "흙처럼 중심을 잡고 사람을 품어요.", little: "흙이 적으면 일상이 흔들릴 수 있어요." },
    es: { much: "Como la tierra: sostiene el centro y acoge.", little: "Poca tierra: el día a día puede temblar." },
    pl: { much: "Jak ziemia: trzyma środek i obejmuje.", little: "Mało ziemi: dzień codzienny może się chwiać." },
  },
  metal: {
    ko: { much: "금이 많아요 = 칼처럼 판단이 빨라요.", little: "금이 적으면 마무리가 늘어질 수 있어요." },
    es: { much: "Mucho metal = el corte es rápido, como un cuchillo.", little: "Poco metal: el cierre se alarga." },
    pl: { much: "Dużo metalu = szybki osąd, jak nóż.", little: "Mało metalu: domknięcie może się ciągnąć." },
  },
  water: {
    ko: { much: "물처럼 시야가 넓고 생각이 흘러요.", little: "물이 적으면 휴식과 직관이 마를 수 있어요." },
    es: { much: "Como el agua: mirada ancha, el pensamiento fluye.", little: "Poca agua: descanso e intuición se secan." },
    pl: { much: "Jak woda: szerokie pole, myśl płynie.", little: "Mało wody: odpoczynek i intuicja mogą wyschnąć." },
  },
};
