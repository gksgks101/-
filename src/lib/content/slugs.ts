export const STEM_SLUG: Record<string, string> = {
  甲: "gap",
  乙: "eul",
  丙: "byeong",
  丁: "jeong",
  戊: "mu",
  己: "gi",
  庚: "gyeong",
  辛: "sin",
  壬: "im",
  癸: "gye",
};

export const STEM_BY_SLUG = Object.fromEntries(Object.entries(STEM_SLUG).map(([gan, slug]) => [slug, gan]));

export const ANIMAL_SLUG: Record<string, string> = {
  子: "rat",
  丑: "ox",
  寅: "tiger",
  卯: "rabbit",
  辰: "dragon",
  巳: "snake",
  午: "horse",
  未: "goat",
  申: "monkey",
  酉: "rooster",
  戌: "dog",
  亥: "pig",
};

export const ANIMAL_BY_SLUG = Object.fromEntries(Object.entries(ANIMAL_SLUG).map(([zhi, slug]) => [slug, zhi]));
