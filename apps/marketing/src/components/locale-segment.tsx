"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

const localePrefix = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

const NAMES = { ar: "العربية", en: "English" } as const;

/** AR | EN in the header: both codes, the current one filled, same page in the other. */
export function LocaleSegment() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || `/${locale}`;
  const rest = pathname.replace(localePrefix, "");

  return (
    <div className="lz-lseg" role="group" aria-label={dict.nav.languageLabel}>
      {locales.map((code) => (
        <Link
          key={code}
          href={`/${code}${rest}`}
          hrefLang={code}
          lang={code}
          title={NAMES[code]}
          aria-label={NAMES[code]}
          aria-current={code === locale ? "true" : undefined}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
