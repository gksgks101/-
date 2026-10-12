import type { Metadata } from "next";
import type { Locale } from "./config";
import { LOCALES } from "./config";
import { msg } from "./messages";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://saju.app").replace(/\/$/, "");

export function localePath(locale: Locale, path = ""): string {
  const rest = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${rest}`;
}

export function localeMetadata(locale: Locale, titleKey: string, descKey: string, path = ""): Metadata {
  const title = msg(locale, titleKey);
  const description = msg(locale, descKey);
  const languages: Record<string, string> = {
    "x-default": `${SITE_URL}${localePath("ko", path)}`,
  };
  for (const item of LOCALES) {
    languages[item] = `${SITE_URL}${localePath(item, path)}`;
  }
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages,
    },
    openGraph: {
      title,
      description,
      locale: locale === "ko" ? "ko_KR" : locale === "es" ? "es_ES" : "pl_PL",
      url: `${SITE_URL}${localePath(locale, path)}`,
    },
  };
}
