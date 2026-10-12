/** Korean particles from the last hangul syllable's batchim. Non-Korean text is returned unchanged. */

function lastHangul(word: string): string | null {
  const chars = [...word.replace(/[^0-9A-Za-z가-힣]/g, "")];
  for (let i = chars.length - 1; i >= 0; i -= 1) {
    const code = chars[i].codePointAt(0) ?? 0;
    if (code >= 0xac00 && code <= 0xd7a3) return chars[i];
  }
  return null;
}

export function hasBatchim(word: string): boolean {
  const last = lastHangul(word);
  if (!last) return false;
  const code = last.codePointAt(0) ?? 0;
  return (code - 0xac00) % 28 !== 0;
}

function endsWithRieul(word: string): boolean {
  const last = lastHangul(word);
  if (!last) return false;
  const code = last.codePointAt(0) ?? 0;
  return (code - 0xac00) % 28 === 8;
}

export type JosaPair = "은/는" | "이/가" | "을/를" | "으로/로" | "과/와";

export function josa(word: string, pair: JosaPair): string {
  if (!lastHangul(word)) return word;
  const batchim = hasBatchim(word);
  if (pair === "은/는") return word + (batchim ? "은" : "는");
  if (pair === "이/가") return word + (batchim ? "이" : "가");
  if (pair === "을/를") return word + (batchim ? "을" : "를");
  if (pair === "과/와") return word + (batchim ? "과" : "와");
  if (endsWithRieul(word) || !batchim) return `${word}로`;
  return `${word}으로`;
}
