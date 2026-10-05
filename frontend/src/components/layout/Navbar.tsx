"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // link internal (admin/auth) — selalu tanpa prefix locale
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link as LocaleLink, usePathname } from "@/i18n/navigation"; // link publik — otomatis prefix locale
import { useAuth, isAdminRole } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, member, logout } = useAuth();
  const t = useTranslations("nav");
  // usePathname dari i18n → path tanpa prefix locale ("/" saat di /en)
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isWhiteNav = scrolled || !isHome;

  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    { href: "/", label: t("home"), id: "nav-beranda" },
    { href: "/tentang", label: t("about"), id: "nav-tentang" },
    { href: "/articles", label: t("articles"), id: "nav-artikel" },
    { href: "/events", label: t("events"), id: "nav-kegiatan" },
    { href: "/prestasi", label: t("achievements"), id: "nav-prestasi" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white shadow-md backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 max-w-[1240px]">
        <nav className="flex items-center justify-between h-[68px]">
          {/* Logo & Brand */}
          <LocaleLink href="/" className="flex items-center no-underline">
            <div className="relative w-[120px] sm:w-[150px] h-11">
              <Image
                src="/assets/logo/logo-fkhk-putih-brand.webp"
                alt={scrolled ? "" : "Logo FKHK"}
                fill
                priority
                sizes="(max-width: 640px) 120px, 150px"
                className={`object-contain transition-opacity duration-300 ${
                  isWhiteNav ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                aria-hidden={isWhiteNav}
              />
              <Image
                src="/assets/logo/logo-fkhk-hijau-brand.webp"
                alt={isWhiteNav ? "Logo FKHK" : ""}
                fill
                priority
                sizes="(max-width: 640px) 120px, 150px"
                className={`object-contain transition-opacity duration-300 ${
                  isWhiteNav ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isWhiteNav}
              />
            </div>
          </LocaleLink>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.id}>
                <LocaleLink
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 no-underline ${
                    isWhiteNav
                      ? "text-gray-700 hover:text-primary hover:bg-primary/10"
                      : "text-white/80 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {item.label}
                </LocaleLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  href={isAdminRole(member?.role) ? "/admin" : "/dashboard"}
                  className={`hidden lg:inline-flex px-3 py-2 rounded-lg text-sm font-medium no-underline transition ${
                    isWhiteNav
                      ? "text-gray-700 hover:text-primary hover:bg-primary/10"
                      : "text-white/80 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {isAdminRole(member?.role) ? t("admin") : t("dashboard")}
                </Link>
                <button
                  onClick={logout}
                  className={`hidden lg:inline-flex px-4 py-2 border rounded-lg text-sm font-semibold no-underline transition ${
                    isWhiteNav
                      ? "border-accent text-accent hover:bg-accent hover:text-white"
                      : "border-white/60 text-white hover:bg-white hover:text-[#1a2e2e]"
                  }`}
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className={`hidden lg:inline-flex px-4 py-2 rounded-lg text-sm font-semibold no-underline transition border ${
                  isWhiteNav
                    ? "border-primary text-primary hover:bg-primary hover:text-white"
                    : "border-white/80 text-white hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                {t("login")}
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col gap-[5px] w-10 h-10 items-center justify-center bg-none border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span
                className={`block w-6 h-[2px] rounded transition-all duration-300 ${
                  isWhiteNav ? "bg-[#1a2e2e]" : "bg-white"
                } ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              />
              <span
                className={`block w-6 h-[2px] rounded transition-all duration-300 ${
                  isWhiteNav ? "bg-[#1a2e2e]" : "bg-white"
                } ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-[2px] rounded transition-all duration-300 ${
                  isWhiteNav ? "bg-[#1a2e2e]" : "bg-white"
                } ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[68px] bg-black/40 z-40"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-[68px] left-0 w-full bg-white shadow-lg transition-all duration-300 overflow-hidden z-50 ${
          mobileOpen ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-6 gap-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <LocaleLink
                key={item.label}
                href={item.href}
                onClick={closeMobile}
                className={`px-4 py-3 rounded-lg font-medium no-underline transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </LocaleLink>
            );
          })}
          <div className="px-4 pt-1">
            <LanguageSwitcher light />
          </div>
          <hr className="border-gray-200 my-2" />
          {isAuthenticated ? (
            <>
              {!isAdminRole(member?.role) && (
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  className={`px-4 py-3 rounded-lg font-medium no-underline ${
                    pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-[#1a1a1a] hover:bg-gray-100"
                  }`}
                >
                  {t("dashboard")}
                </Link>
              )}
              {isAdminRole(member?.role) && (
                <Link
                  href="/admin"
                  onClick={closeMobile}
                  className={`px-4 py-3 rounded-lg font-medium no-underline ${
                    pathname === "/admin" ? "bg-primary/10 text-primary" : "text-[#1a1a1a] hover:bg-gray-100"
                  }`}
                >
                  {t("admin")}
                </Link>
              )}
              <button
                onClick={() => { logout(); closeMobile(); }}
                className="w-full px-4 py-3 rounded-lg text-[#c0392b] font-medium hover:bg-red-50 text-left"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={closeMobile}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium text-center no-underline"
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
