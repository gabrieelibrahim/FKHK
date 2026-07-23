"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hiddenPaths = ["/admin", "/dashboard", "/events/create", "/articles/submit", "/auth"];
  if (hiddenPaths.some((p) => pathname?.startsWith(p))) return null;
  return <Navbar />;
}
