import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { ELEMENT_COLOR, ELEMENT_NAME, GENDER_NAME, PILLAR_NAME } from "@/lib/i18n/terms";
import { elementPercents, type ThemeCardData } from "@/lib/interpret/themes";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const ch of text) {
    const next = current + ch;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = ch;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export async function renderSharePoster(
  calculation: SajuCalculation,
  themes: ThemeCardData[],
  locale: Locale,
): Promise<Blob> {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  await document.fonts.ready;

  ctx.fillStyle = "#1a140e";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#f3efe6";
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 80; i += 1) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 3, 3);
  }
  ctx.globalAlpha = 1;

  const card = dayMasterCard(calculation.dayMaster.gan);
  const image = await loadImage(card.image);
  const cardW = 480;
  const cardH = Math.round((cardW * 4) / 3);
  const cardX = (width - cardW) / 2;
  const cardY = 180;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 28);
  ctx.clip();
  ctx.drawImage(image, cardX, cardY, cardW, cardH);
  ctx.restore();
  ctx.strokeStyle = "#c4a574";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 28);
  ctx.stroke();

  ctx.fillStyle = "#c4a574";
  ctx.font = "600 28px 'Noto Sans', 'Noto Sans KR', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(msg(locale, "shareBrand"), width / 2, 90);
  ctx.fillStyle = "#f3efe6";
  ctx.font = "700 54px 'Noto Serif KR', 'Noto Serif', serif";
  const name =
    !calculation.birth.displayName || calculation.birth.displayName === "익명"
      ? msg(locale, "anonymous")
      : calculation.birth.displayName;
  ctx.fillText(msg(locale, "resultTitle", { name }), width / 2, 155);
  ctx.fillStyle = "#c4a574";
  ctx.font = "600 36px 'Noto Serif KR', serif";
  ctx.fillText(card.title[locale], width / 2, cardY + cardH + 58);

  const pillars = [
    ["year", calculation.pillars.year] as const,
    ["month", calculation.pillars.month] as const,
    ["day", calculation.pillars.day] as const,
    ["hour", calculation.pillars.hour] as const,
  ];
  const boxW = 220;
  const gap = 18;
  const rowY = cardY + cardH + 80;
  const totalW = boxW * 4 + gap * 3;
  let x = (width - totalW) / 2;
  for (const [key, pillar] of pillars) {
    ctx.strokeStyle = "rgba(196,165,116,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, rowY, boxW, 120, 16);
    ctx.stroke();
    ctx.fillStyle = "#8a7d6e";
    ctx.font = "500 20px 'Noto Sans', 'Noto Sans KR', sans-serif";
    ctx.fillText(PILLAR_NAME[key][locale], x + boxW / 2, rowY + 32);
    ctx.fillStyle = "#f3efe6";
    ctx.font = "700 36px 'Noto Serif KR', serif";
    ctx.fillText(pillar ? pillar.ganzhi : "—", x + boxW / 2, rowY + 82);
    x += boxW + gap;
  }

  const percents = elementPercents(calculation.elements.powerScore);
  const keys = Object.keys(percents) as ElementKey[];
  let barX = 80;
  const barY = rowY + 155;
  ctx.textAlign = "left";
  for (const key of keys) {
    const w = ((width - 160) * percents[key]) / 100;
    ctx.fillStyle = ELEMENT_COLOR[key];
    ctx.fillRect(barX, barY, w, 28);
    barX += w;
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#8a7d6e";
  ctx.font = "500 22px 'Noto Sans', 'Noto Sans KR', sans-serif";
  ctx.fillText(
    keys.map((key) => `${ELEMENT_NAME[locale][key]} ${percents[key]}%`).join("   "),
    width / 2,
    barY + 64,
  );

  let ty = barY + 100;
  ctx.textAlign = "left";
  const limit = height - 140;
  for (const theme of themes) {
    if (ty > limit) break;
    ctx.fillStyle = "#c4a574";
    ctx.font = "700 26px 'Noto Serif KR', serif";
    ctx.fillText(theme.title, 80, ty);
    ctx.fillStyle = "#ddd6c8";
    ctx.font = "400 24px 'Noto Sans', 'Noto Sans KR', sans-serif";
    const lines = wrap(ctx, theme.easyHeadline || theme.easy[0] || theme.front[0] || "", width - 160);
    ty += 34;
    for (const line of lines.slice(0, 1)) {
      if (ty > limit) break;
      ctx.fillText(line, 80, ty);
      ty += 32;
    }
    ty += 14;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#8a7d6e";
  ctx.font = "400 22px 'Noto Sans', 'Noto Sans KR', sans-serif";
  const meta = `${calculation.birth.solarDate} · ${calculation.birth.time ?? msg(locale, "timeUnknownLabel")} · ${GENDER_NAME[calculation.birth.gender][locale]}`;
  ctx.fillText(meta, width / 2, height - 90);
  ctx.fillText(msg(locale, "shareFooter"), width / 2, height - 50);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("blob");
  return blob;
}

export async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function shareOrDownload(blob: Blob, filename: string, title: string, text: string) {
  const file = new File([blob], filename, { type: "image/png" });
  const payload = { files: [file], title, text };
  if (typeof navigator.share === "function" && navigator.canShare?.(payload)) {
    await navigator.share(payload);
    return "shared";
  }
  await downloadBlob(blob, filename);
  return "downloaded";
}
