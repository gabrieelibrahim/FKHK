import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // id = default → URL tanpa prefix (mis. /tentang)
  // en & ar → pakai prefix (mis. /en/tentang, /ar/tentang)
  locales: ["id", "en", "ar"],
  defaultLocale: "id",
  localePrefix: "as-needed",
  // Deteksi otomatis via Accept-Language dimatikan: pengunjung tetap
  // dapat versi Indonesia kecuali memilih manual lewat switcher.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
