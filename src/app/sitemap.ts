import type { MetadataRoute } from "next";
import { ANIMAL_PAGES, STEM_PAGES } from "@/lib/content/encyclopedia";
import { LOCALES } from "@/lib/i18n/config";
import { SITE_URL, localePath } from "@/lib/i18n/seo";

const STATIC = ["", "/result", "/match", "/privacy", "/stems", "/animals"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [
    ...STATIC,
    ...STEM_PAGES.map((item) => `/stems/${item.slug}`),
    ...ANIMAL_PAGES.map((item) => `/animals/${item.slug}`),
  ];
  return LOCALES.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((item) => [item, `${SITE_URL}${localePath(item, path)}`])),
      },
    })),
  );
}
