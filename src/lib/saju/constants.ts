import type { ElementKey, HiddenStemRole, YinYang } from "./types";

export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export const STEM_KO: Record<string, string> = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
};

export const BRANCH_KO: Record<string, string> = {
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해",
};

export const ELEMENT_KO: Record<ElementKey, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export const STEM_META: Record<string, { element: ElementKey; yinYang: YinYang; korean: string }> = {
  甲: { element: "wood", yinYang: "yang", korean: "갑" },
  乙: { element: "wood", yinYang: "yin", korean: "을" },
  丙: { element: "fire", yinYang: "yang", korean: "병" },
  丁: { element: "fire", yinYang: "yin", korean: "정" },
  戊: { element: "earth", yinYang: "yang", korean: "무" },
  己: { element: "earth", yinYang: "yin", korean: "기" },
  庚: { element: "metal", yinYang: "yang", korean: "경" },
  辛: { element: "metal", yinYang: "yin", korean: "신" },
  壬: { element: "water", yinYang: "yang", korean: "임" },
  癸: { element: "water", yinYang: "yin", korean: "계" },
};

export const BRANCH_META: Record<
  string,
  { element: ElementKey; yinYang: YinYang; korean: string; animal: string }
> = {
  子: { element: "water", yinYang: "yang", korean: "자", animal: "쥐" },
  丑: { element: "earth", yinYang: "yin", korean: "축", animal: "소" },
  寅: { element: "wood", yinYang: "yang", korean: "인", animal: "호랑이" },
  卯: { element: "wood", yinYang: "yin", korean: "묘", animal: "토끼" },
  辰: { element: "earth", yinYang: "yang", korean: "진", animal: "용" },
  巳: { element: "fire", yinYang: "yin", korean: "사", animal: "뱀" },
  午: { element: "fire", yinYang: "yang", korean: "오", animal: "말" },
  未: { element: "earth", yinYang: "yin", korean: "미", animal: "양" },
  申: { element: "metal", yinYang: "yang", korean: "신", animal: "원숭이" },
  酉: { element: "metal", yinYang: "yin", korean: "유", animal: "닭" },
  戌: { element: "earth", yinYang: "yang", korean: "술", animal: "개" },
  亥: { element: "water", yinYang: "yin", korean: "해", animal: "돼지" },
};

export const HIDDEN_STEMS: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

export const HIDDEN_ROLES: HiddenStemRole[] = ["main", "middle", "residual"];
export const HIDDEN_ROLE_KO: Record<HiddenStemRole, string> = {
  main: "본기",
  middle: "중기",
  residual: "여기",
};

export const TEN_GOD_KO: Record<string, string> = {
  比肩: "비견",
  劫财: "겁재",
  食神: "식신",
  伤官: "상관",
  偏财: "편재",
  正财: "정재",
  七杀: "편관",
  正官: "정관",
  偏印: "편인",
  正印: "정인",
};

export const TWELVE_KO: Record<string, string> = {
  长生: "장생",
  沐浴: "목욕",
  冠带: "관대",
  临官: "건록",
  帝旺: "제왕",
  衰: "쇠",
  病: "병",
  死: "사",
  墓: "묘",
  绝: "절",
  胎: "태",
  养: "양",
};

export const JIEQI_KO: Record<string, string> = {
  小寒: "소한",
  大寒: "대한",
  立春: "입춘",
  雨水: "우수",
  惊蛰: "경칩",
  春分: "춘분",
  清明: "청명",
  谷雨: "곡우",
  立夏: "입하",
  小满: "소만",
  芒种: "망종",
  夏至: "하지",
  小暑: "소서",
  大暑: "대서",
  立秋: "입추",
  处暑: "처서",
  白露: "백로",
  秋分: "추분",
  寒露: "한로",
  霜降: "상강",
  立冬: "입동",
  小雪: "소설",
  大雪: "대설",
  冬至: "동지",
};

export const MONTH_ORDER: Record<string, { name: string; korean: string }> = {
  寅: { name: "寅월", korean: "인월" },
  卯: { name: "卯월", korean: "묘월" },
  辰: { name: "辰월", korean: "진월" },
  巳: { name: "巳월", korean: "사월" },
  午: { name: "午월", korean: "오월" },
  未: { name: "未월", korean: "미월" },
  申: { name: "申월", korean: "신월" },
  酉: { name: "酉월", korean: "유월" },
  戌: { name: "戌월", korean: "술월" },
  亥: { name: "亥월", korean: "해월" },
  子: { name: "子월", korean: "자월" },
  丑: { name: "丑월", korean: "축월" },
};

export const HOUR_BRANCHES = [
  { zhi: "子", start: 23, end: 1 },
  { zhi: "丑", start: 1, end: 3 },
  { zhi: "寅", start: 3, end: 5 },
  { zhi: "卯", start: 5, end: 7 },
  { zhi: "辰", start: 7, end: 9 },
  { zhi: "巳", start: 9, end: 11 },
  { zhi: "午", start: 11, end: 13 },
  { zhi: "未", start: 13, end: 15 },
  { zhi: "申", start: 15, end: 17 },
  { zhi: "酉", start: 17, end: 19 },
  { zhi: "戌", start: 19, end: 21 },
  { zhi: "亥", start: 21, end: 23 },
] as const;

export const NAEUM: Record<string, string> = {
  甲子: "해중금",
  乙丑: "해중금",
  丙寅: "노중화",
  丁卯: "노중화",
  戊辰: "대림목",
  己巳: "대림목",
  庚午: "로중토",
  辛未: "로중토",
  壬申: "검봉금",
  癸酉: "검봉금",
  甲戌: "산두화",
  乙亥: "산두화",
  丙子: "윤하수",
  丁丑: "윤하수",
  戊寅: "성두토",
  己卯: "성두토",
  庚辰: "백랍금",
  辛巳: "백랍금",
  壬午: "양류목",
  癸未: "양류목",
  甲申: "천중수",
  乙酉: "천중수",
  丙戌: "옥상토",
  丁亥: "옥상토",
  戊子: "벽력화",
  己丑: "벽력화",
  庚寅: "송백목",
  辛卯: "송백목",
  壬辰: "장류수",
  癸巳: "장류수",
  甲午: "사중금",
  乙未: "사중금",
  丙申: "산하화",
  丁酉: "산하화",
  戊戌: "평지목",
  己亥: "평지목",
  庚子: "벽력화",
  辛丑: "벽력화",
  壬寅: "금박금",
  癸卯: "금박금",
  甲辰: "복등화",
  乙巳: "복등화",
  丙午: "천하수",
  丁未: "천하수",
  戊申: "대역토",
  己酉: "대역토",
  庚戌: "차천금",
  辛亥: "차천금",
  壬子: "상자목",
  癸丑: "상자목",
  甲寅: "대계수",
  乙卯: "대계수",
  丙辰: "사중토",
  丁巳: "사중토",
  戊午: "천상화",
  己未: "천상화",
  庚申: "석류목",
  辛酉: "석류목",
  壬戌: "대해수",
  癸亥: "대해수",
};

export const STEM_COMBINE: [string, string][] = [
  ["甲", "己"],
  ["乙", "庚"],
  ["丙", "辛"],
  ["丁", "壬"],
  ["戊", "癸"],
];

export const BRANCH_SIX_COMBINE: [string, string][] = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"],
];

export const BRANCH_CLASH: [string, string][] = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
];

export const BRANCH_HARM: [string, string][] = [
  ["子", "未"],
  ["丑", "午"],
  ["寅", "巳"],
  ["卯", "辰"],
  ["申", "亥"],
  ["酉", "戌"],
];

export const BRANCH_BREAK: [string, string][] = [
  ["子", "酉"],
  ["丑", "辰"],
  ["寅", "亥"],
  ["卯", "午"],
  ["巳", "申"],
  ["戌", "未"],
];

export const BRANCH_PUNISH_GROUPS = [
  { name: "무례지형", items: ["寅", "巳", "申"] },
  { name: "지세지형", items: ["丑", "戌", "未"] },
  { name: "무은지형", items: ["子", "卯"] },
];

export const SELF_PUNISH = ["辰", "午", "酉", "亥"];

export const TRIPLE_COMBINE = [
  { name: "인오술 삼합(화)", items: ["寅", "午", "戌"], element: "fire" as ElementKey },
  { name: "사유축 삼합(금)", items: ["巳", "酉", "丑"], element: "metal" as ElementKey },
  { name: "신자진 삼합(수)", items: ["申", "子", "辰"], element: "water" as ElementKey },
  { name: "해묘미 삼합(목)", items: ["亥", "卯", "未"], element: "wood" as ElementKey },
];

export const DIRECTION_COMBINE = [
  { name: "인묘진 방합(목)", items: ["寅", "卯", "辰"], element: "wood" as ElementKey },
  { name: "사오미 방합(화)", items: ["巳", "午", "未"], element: "fire" as ElementKey },
  { name: "신유술 방합(금)", items: ["申", "酉", "戌"], element: "metal" as ElementKey },
  { name: "해자축 방합(수)", items: ["亥", "子", "丑"], element: "water" as ElementKey },
];

export const WONJIN: [string, string][] = [
  ["子", "未"],
  ["丑", "午"],
  ["寅", "酉"],
  ["卯", "申"],
  ["辰", "亥"],
  ["巳", "戌"],
];

export const GUIMUN_PAIRS: [string, string][] = [
  ["子", "酉"],
  ["丑", "午"],
  ["寅", "巳"],
  ["卯", "辰"],
  ["申", "亥"],
  ["未", "戌"],
];

export const CHEON_EUL: Record<string, string[]> = {
  甲: ["丑", "未"],
  戊: ["丑", "未"],
  乙: ["子", "申"],
  己: ["子", "申"],
  丙: ["亥", "酉"],
  丁: ["亥", "酉"],
  壬: ["巳", "卯"],
  癸: ["巳", "卯"],
  庚: ["寅", "午"],
  辛: ["寅", "午"],
};

export const MUNCHANG: Record<string, string> = {
  甲: "巳",
  乙: "午",
  丙: "申",
  丁: "酉",
  戊: "申",
  己: "酉",
  庚: "亥",
  辛: "子",
  壬: "寅",
  癸: "卯",
};

export const TAEGEUK: Record<string, string[]> = {
  甲: ["子", "午"],
  乙: ["子", "午"],
  丙: ["卯", "酉"],
  丁: ["卯", "酉"],
  戊: ["辰", "戌", "丑", "未"],
  己: ["辰", "戌", "丑", "未"],
  庚: ["寅", "亥"],
  辛: ["寅", "亥"],
  壬: ["巳", "申"],
  癸: ["巳", "申"],
};

export const CHEONDEOK: Record<string, string> = {
  寅: "丁",
  卯: "申",
  辰: "壬",
  巳: "辛",
  午: "亥",
  未: "甲",
  申: "癸",
  酉: "寅",
  戌: "丙",
  亥: "乙",
  子: "巳",
  丑: "庚",
};

export const WOLDEOK: Record<string, string> = {
  寅: "丙",
  午: "丙",
  戌: "丙",
  申: "壬",
  子: "壬",
  辰: "壬",
  亥: "甲",
  卯: "甲",
  未: "甲",
  巳: "庚",
  酉: "庚",
  丑: "庚",
};

export const BAEKHO = ["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"];
export const GOEGANG = ["庚辰", "庚戌", "壬辰", "壬戌"];

export const EMPTY_ELEMENT: Record<ElementKey, number> = {
  wood: 0,
  fire: 0,
  earth: 0,
  metal: 0,
  water: 0,
};

export const GENERATES: Record<ElementKey, ElementKey> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

export const CONTROLS: Record<ElementKey, ElementKey> = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire",
};

export const KST_MERIDIAN = 135;
export const DEFAULT_TIMEZONE = "Asia/Seoul";
