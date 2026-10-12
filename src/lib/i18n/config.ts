export const LOCALES = ["ko", "es", "pl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_LABEL: Record<Locale, string> = {
  ko: "한국어",
  es: "Español",
  pl: "Polski",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function parseLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function t(
  dictionary: Record<string, string>,
  key: string,
  vars?: Record<string, string | number>,
): string {
  let text = dictionary[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}
