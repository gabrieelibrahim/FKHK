"use client";

import { usePathname } from "@/i18n/navigation";
import Footer from "./Footer";

// usePathname dari i18n → path TANPA prefix locale, jadi pengecekan
// hide konsisten di semua bahasa (mis. /en/presensi → "/presensi").
export default function FooterWrapper() {
  const pathname = usePathname();
  const hide =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/presensi") ||
    pathname.startsWith("/auth");
  if (hide) return null;
  return <Footer />;
}
