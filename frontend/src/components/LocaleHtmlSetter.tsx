"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/**
 * Sinkronkan <html lang> & <html dir> dengan locale aktif.
 * Root layout merender <html lang="id"> (default); komponen ini
 * menyesuaikan saat user pindah ke /en atau /ar (Arab → RTL).
 */
export default function LocaleHtmlSetter() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
