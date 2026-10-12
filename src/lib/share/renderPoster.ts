import type { Locale } from "@/lib/i18n/config";
import { msg } from "@/lib/i18n/messages";
import { GENDER_NAME } from "@/lib/i18n/terms";
import { coreHeadline } from "@/lib/interpret/coreCopy";
import { youAreLine, buildResultSummary } from "@/lib/interpret/summary";
import { stemEasyLine, type ThemeCardData } from "@/lib/interpret/themes";
import { dayMasterCard } from "@/lib/saju/dayCards";
import type { SajuCalculation } from "@/lib/saju/types";

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
  return lines.slice(0, 4);
}

export function sharePosterCopy(calculation: SajuCalculation, locale: Locale, themes: ThemeCardData[]): string[] {
  const summary = buildResultSummary(calculation, locale);
  return [
    youAreLine(summary.typeName, locale),
    coreHeadline(calculation, locale),
    stemEasyLine(calculation.dayMaster.gan, locale),
    themes[0]?.easyHeadline ?? "",
  ];
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

  ctx.fillStyle = "#f7f2e8";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#c41e3a";
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 60; i += 1) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 4, 4);
  }
  ctx.globalAlpha = 1;

  const card = dayMasterCard(calculation.dayMaster.gan);
  const image = await loadImage(card.image);
  const cardW = 520;
  const cardH = Math.round((cardW * 4) / 3);
  const cardX = (width - cardW) / 2;
  const cardY = 220;
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

  ctx.fillStyle = "#c41e3a";
  ctx.font = "600 28px 'Noto Sans', 'Noto Sans KR', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(msg(locale, "shareBrand"), width / 2, 90);

  const copy = sharePosterCopy(calculation, locale, themes);
  ctx.fillStyle = "#1c1612";
  ctx.font = "700 48px 'Noto Serif KR', 'Noto Serif', serif";
  let y = 150;
  for (const line of wrap(ctx, copy[0] ?? "", width - 120)) {
    ctx.fillText(line, width / 2, y);
    y += 56;
  }

  ctx.fillStyle = "#4a433c";
  ctx.font = "600 32px 'Noto Serif KR', serif";
  ctx.fillText(card.title[locale], width / 2, cardY + cardH + 64);

  ctx.fillStyle = "#1c1612";
  ctx.font = "600 36px 'Noto Serif KR', serif";
  ctx.textAlign = "left";
  y = cardY + cardH + 130;
  for (const line of wrap(ctx, copy[1] ?? "", width - 160)) {
    ctx.fillText(line, 80, y);
    y += 48;
  }

  ctx.fillStyle = "#c41e3a";
  ctx.font = "600 30px 'Noto Sans', 'Noto Sans KR', sans-serif";
  y += 24;
  for (const line of wrap(ctx, copy[2] ?? "", width - 160)) {
    ctx.fillText(line, 80, y);
    y += 42;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#8c7349";
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
