import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Link/router/usePathname versi i18n — otomatis nambah prefix locale
// (mis. /articles → /en/articles saat sedang di locale en).
// usePathname mengembalikan path TANPA prefix locale.
export const { Link, redirect, usePathname, useRouter } = createNavigation(
  routing
);
