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

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const vercel = process.env.VERCEL_URL?.trim();
  if (explicit && !isPlaceholderHost(explicit)) return withHttps(explicit);
  if (vercelProd) return withHttps(vercelProd);
  if (vercel) return withHttps(vercel);
  return withHttps(explicit || "https://saju.app");
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
