import type { Metadata } from "next";
import type { Locale } from "./config";
import { LOCALES } from "./config";
import { msg } from "./messages";

function withHttps(host: string): string {
  const trimmed = host.replace(/\/$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function isPlaceholderHost(url: string): boolean {
  return /saju\.app$/i.test(url.replace(/^https?:\/\//, "").replace(/\/$/, ""));
}

export function resolveSiteUrl(env: NodeJS.ProcessEnv = process.env): string {
  const candidates = [env.NEXT_PUBLIC_SITE_URL, env.VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL_URL];
  for (const raw of candidates) {
    const trimmed = raw?.trim();
    if (trimmed && !isPlaceholderHost(trimmed)) return withHttps(trimmed);
  }
  return "https://pi-lilac-36.vercel.app";
}

export const SITE_URL = resolveSiteUrl();

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
