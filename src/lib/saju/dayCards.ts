import type { Locale } from "@/lib/i18n/config";
import type { ElementKey } from "./types";

export interface DayMasterCard {
  gan: string;
  ganKorean: string;
  image: string;
  element: ElementKey;
  motif: Record<Locale, string>;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
}

export const CARD_BACK_IMAGE = "/cards/back.jpg";

export const DAY_MASTER_CARDS: Record<string, DayMasterCard> = {
  甲: {
    gan: "甲",
    ganKorean: "갑",
    image: "/cards/gap-pine.jpg",
    element: "wood",
    motif: { ko: "소나무", es: "pino", pl: "sosna" },
    title: { ko: "갑목 · 소나무", es: "Jia · Pino", pl: "Gap · Sosna" },
    subtitle: {
      ko: "곧게 자라는 큰 나무. 시작과 개척의 기운.",
      es: "Un gran pino que crece derecho. Energía de inicio y apertura.",
      pl: "Wielka sosna rosnąca prosto. Energia początku i pionierskości.",
    },
  },
  乙: {
    gan: "乙",
    ganKorean: "을",
    image: "/cards/eul-plum.jpg",
    element: "wood",
    motif: { ko: "매화", es: "ciruelo", pl: "śliwa" },
    title: { ko: "을목 · 매화", es: "Yi · Ciruelo", pl: "Eul · Śliwa" },
    subtitle: {
      ko: "바람에 휘어도 꺾이지 않는 매화와 버들.",
      es: "Ciruelo y sauce: flexibles, no se rompen con el viento.",
      pl: "Śliwa i wierzba: giętkie, nie łamią się na wietrze.",
    },
  },
  丙: {
    gan: "丙",
    ganKorean: "병",
    image: "/cards/byeong-sun.jpg",
    element: "fire",
    motif: { ko: "태양", es: "sol", pl: "słońce" },
    title: { ko: "병화 · 태양", es: "Bing · Sol", pl: "Byeong · Słońce" },
    subtitle: {
      ko: "단청 위에 뜬 큰 해. 드러내고 밝히는 불.",
      es: "Gran sol sobre dancheong. Fuego que revela e ilumina.",
      pl: "Wielkie słońce nad dancheong. Ogień, który odsłania i rozświetla.",
    },
  },
  丁: {
    gan: "丁",
    ganKorean: "정",
    image: "/cards/jeong-lantern.jpg",
    element: "fire",
    motif: { ko: "등잔", es: "linterna", pl: "latarnia" },
    title: { ko: "정화 · 연등", es: "Ding · Linterna", pl: "Jeong · Latarnia" },
    subtitle: {
      ko: "모란과 연등. 섬세하게 오래 타는 불.",
      es: "Peonía y linterna de loto. Un fuego fino y duradero.",
      pl: "Piwonia i lotosowa latarnia. Subtelny, długotrwały ogień.",
    },
  },
  戊: {
    gan: "戊",
    ganKorean: "무",
    image: "/cards/mu-mountain.jpg",
    element: "earth",
    motif: { ko: "산", es: "montaña", pl: "góra" },
    title: { ko: "무토 · 산", es: "Wu · Montaña", pl: "Mu · Góra" },
    subtitle: {
      ko: "성벽과 큰 산. 중심을 지키는 흙.",
      es: "Montaña y muralla. Tierra que sostiene el centro.",
      pl: "Góra i mur. Ziemia, która trzyma centrum.",
    },
  },
  己: {
    gan: "己",
    ganKorean: "기",
    image: "/cards/gi-field.jpg",
    element: "earth",
    motif: { ko: "논밭", es: "arrozal", pl: "pole ryżowe" },
    title: { ko: "기토 · 논밭", es: "Ji · Arrozal", pl: "Gi · Pole" },
    subtitle: {
      ko: "황토 논밭. 기르고 품는 흙.",
      es: "Arrozales de tierra amarilla. Tierra que nutre y acoge.",
      pl: "Żółte pola ryżowe. Ziemia, która karmi i obejmuje.",
    },
  },
  庚: {
    gan: "庚",
    ganKorean: "경",
    image: "/cards/gyeong-metal.jpg",
    element: "metal",
    motif: { ko: "쇠", es: "metal", pl: "metal" },
    title: { ko: "경금 · 쇠", es: "Geng · Metal", pl: "Gyeong · Metal" },
    subtitle: {
      ko: "바위와 검, 범종. 자르고 세우는 쇠.",
      es: "Roca, espada y campana. Metal que corta y establece.",
      pl: "Skała, miecz i dzwon. Metal, który tnie i ustanawia.",
    },
  },
  辛: {
    gan: "辛",
    ganKorean: "신",
    image: "/cards/sin-jewel.jpg",
    element: "metal",
    motif: { ko: "보석", es: "joya", pl: "klejnot" },
    title: { ko: "신금 · 보석", es: "Xin · Joya", pl: "Sin · Klejnot" },
    subtitle: {
      ko: "달빛 아래 옥과 은장. 다듬어진 쇠.",
      es: "Jade y plata bajo la luna. Metal refinado.",
      pl: "Jadeit i srebro w blasku księżyca. Wyszlifowany metal.",
    },
  },
  壬: {
    gan: "壬",
    ganKorean: "임",
    image: "/cards/im-ocean.jpg",
    element: "water",
    motif: { ko: "바다", es: "océano", pl: "ocean" },
    title: { ko: "임수 · 바다", es: "Ren · Océano", pl: "Im · Ocean" },
    subtitle: {
      ko: "민화 파도의 큰 바다. 흘러 삼키는 물.",
      es: "Gran mar de olas minhwa. Agua que fluye y abarca.",
      pl: "Wielkie morze fal minhwa. Woda, która płynie i ogarnia.",
    },
  },
  癸: {
    gan: "癸",
    ganKorean: "계",
    image: "/cards/gye-dew.jpg",
    element: "water",
    motif: { ko: "이슬", es: "rocío", pl: "rosa" },
    title: { ko: "계수 · 이슬", es: "Gui · Rocío", pl: "Gye · Rosa" },
    subtitle: {
      ko: "연못의 새벽 이슬. 스며드는 물.",
      es: "Rocío del estanque al alba. Agua que se filtra.",
      pl: "Poranna rosa na stawie. Woda, która wsiąka.",
    },
  },
};

export function dayMasterCard(gan: string): DayMasterCard {
  return DAY_MASTER_CARDS[gan] ?? DAY_MASTER_CARDS["甲"];
}
