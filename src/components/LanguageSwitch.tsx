"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/lib/i18n/config";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  const rest = pathname.replace(/^\/(ko|es|pl)/, "") || "/";
  return (
    <div className="flex items-center gap-1 text-xs tracking-[0.12em]">
      {LOCALES.map((item) => {
        const href = `/${item}${rest === "/" ? "" : rest}`;
        const active = item === locale;
        return (
          <Link
            key={item}
            href={href}
            hrefLang={item}
            className={`rounded-full px-2.5 py-1 ${active ? "bg-[var(--gold)] text-[#1a140e]" : "text-[var(--muted)] hover:text-[var(--ivory)]"}`}
          >
            {LOCALE_LABEL[item]}
          </Link>
        );
      })}
    </div>
  );
}
