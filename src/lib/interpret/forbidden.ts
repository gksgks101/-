import type { Locale } from "@/lib/i18n/config";

const STEM_KO = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
const BRANCH_KO = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;

const GANZHI_KO = STEM_KO.flatMap((stem) => BRANCH_KO.map((branch) => `${stem}${branch}`));

const STEM_ELEMENT = ["갑목", "을목", "병화", "정화", "무토", "기토", "경금", "신금", "임수", "계수"];

const TERM_KO = [
  "일간",
  "일지",
  "월지",
  "오행",
  "용신",
  "희신",
  "기신",
  "구신",
  "십성",
  "비견",
  "겁재",
  "식신",
  "상관",
  "편재",
  "정재",
  "편관",
  "정관",
  "편인",
  "정인",
  "비겁",
  "식상",
  "재성",
  "관성",
  "인성",
  "격국",
  "신강",
  "신약",
  "대운",
  "세운",
  "월운",
  "일운",
  "12운성",
  "십이운성",
  "지장간",
  "원진",
  "신살",
  "득령",
  "통근",
  "득세",
  "년주",
  "월주",
  "일주",
  "시주",
  "원국",
  "간지",
  "천간",
  "지지",
];

const TERM_LATIN = ["yongsin", "heesin", "gisin", "gusin", "daeun", "seun", "saju", "ganzhi"];

export const FORBIDDEN_EASY_TERMS = [
  ...TERM_KO,
  ...GANZHI_KO,
  ...STEM_ELEMENT,
  ...TERM_LATIN,
] as const;

function bounded(terms: string[]): RegExp {
  const inner = terms.sort((a, b) => b.length - a.length).join("|");
  return new RegExp(`(^|[^가-힣A-Za-z])(${inner})(?=[^가-힣A-Za-z]|$)`, "g");
}

const TERM_PATTERN = bounded([...TERM_KO, ...GANZHI_KO, ...STEM_ELEMENT]);

const LATIN_PATTERN = /\b(yongsin|heesin|gisin|gusin|daeun|seun|ganzhi)\b/gi;

const HANJA_PATTERN = /[\u4E00-\u9FFF]/g;

const ELEMENT_JARGON =
  /(목|화|토|금|수)\s*(기운|오행)|오행|(?<![가-힣])(목|화|토|금)(이|가)\s*(많|적|강|약)|(목|화|토|금|수)·(목|화|토|금|수)/g;

const RELATION_SYLLABLE = /(^|[^가-힣])(합|충|형)([은는이가을를의도만과와로]|[·,.\s]|$)/g;

export interface ForbiddenHit {
  term: string;
  snippet: string;
}

export function findForbiddenTerms(text: string): ForbiddenHit[] {
  const hits: ForbiddenHit[] = [];
  const seen = new Set<string>();

  function add(term: string, index: number) {
    const key = `${term}@${index}`;
    if (seen.has(key)) return;
    seen.add(key);
    const start = Math.max(0, index - 8);
    hits.push({ term, snippet: text.slice(start, index + term.length + 8) });
  }

  for (const match of text.matchAll(TERM_PATTERN)) {
    if (match.index == null) continue;
    add(match[2], match.index + match[1].length);
  }
  for (const match of text.matchAll(LATIN_PATTERN)) {
    if (match.index == null) continue;
    add(match[0], match.index);
  }
  for (const match of text.matchAll(HANJA_PATTERN)) {
    if (match.index == null) continue;
    add(match[0], match.index);
  }
  for (const match of text.matchAll(ELEMENT_JARGON)) {
    if (match.index == null) continue;
    add(match[0], match.index);
  }
  for (const match of text.matchAll(RELATION_SYLLABLE)) {
    if (match.index == null) continue;
    add(match[2], match.index + match[1].length);
  }
  return hits;
}

export function assertEasyCopy(label: string, lines: string[], locale?: Locale): void {
  const blob = lines.join("\n");
  const hits = findForbiddenTerms(blob);
  if (hits.length) {
    const detail = hits
      .slice(0, 8)
      .map((hit) => `"${hit.term}" in …${hit.snippet}…`)
      .join("; ");
    throw new Error(`${locale ?? ""} ${label}: forbidden terms: ${detail}`);
  }
}
