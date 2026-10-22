"use client";

import { usePathname } from "@/i18n/navigation";
import Navbar from "./Navbar";

// usePathname dari i18n → path TANPA prefix locale, jadi pengecekan
// hiddenPaths konsisten di semua bahasa (mis. /en/presensi → "/presensi").
export default function NavbarWrapper() {
  const pathname = usePathname();
  const hiddenPaths = ["/admin", "/dashboard", "/events/create", "/auth", "/presensi"];
  if (hiddenPaths.some((p) => pathname?.startsWith(p))) return null;
  return <Navbar />;
}
