import type { Locale } from "@/lib/i18n/config";
import type { ElementKey, SajuCalculation } from "@/lib/saju/types";
import { loc } from "./themeContext";

const KO_ELEMENT: Record<string, ElementKey> = { 목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water" };

export const YONGSIN_ACCENT: Record<ElementKey, string> = {
  wood: "#2f6b3a",
  fire: "#c41e3a",
  earth: "#b8860b",
  metal: "#5c564c",
  water: "#1d4e89",
};

export function yongsinElement(calculation: SajuCalculation): ElementKey {
  return KO_ELEMENT[calculation.useGod.yongsin[0] ?? ""] ?? "fire";
}

export function accentFromYongsin(calculation: SajuCalculation): string {
  return YONGSIN_ACCENT[yongsinElement(calculation)];
}

export function yongsinLine(calculation: SajuCalculation, locale: Locale): string {
  const yong = calculation.useGod.yongsin.join("·") || "-";
  const hee = calculation.useGod.heesin.join("·") || "-";
  const gi = calculation.useGod.gisin.join("·") || "-";
  return loc(locale, `용신 ${yong} · 희신 ${hee} · 기신 ${gi}`, `Yongsin ${yong} · Heesin ${hee} · Gisin ${gi}`, `Yongsin ${yong} · Heesin ${hee} · Gisin ${gi}`);
}

export function yongsinReason(calculation: SajuCalculation, locale: Locale): string {
  const strong = calculation.strength.score >= 55;
  return loc(
    locale,
    strong
      ? "신강 계열에서는 일간을 설기하거나 재성으로 흘려보내는 오행을 용신으로 봅니다."
      : "신약 계열에서는 일간을 생조하는 인성과 비겁을 용신으로 봅니다.",
    strong
      ? "Si el tronco es fuerte, el yongsin drena o convierte en riqueza."
      : "Si el tronco es débil, el yongsin es el recurso y el compañero que lo nutren.",
    strong
      ? "Gdy pień jest silny, yongsin spuszcza siłę albo oddaje ją majątkowi."
      : "Gdy pień jest słaby, yongsin to pieczęć i towarzysz, które go karmią.",
  );
}
