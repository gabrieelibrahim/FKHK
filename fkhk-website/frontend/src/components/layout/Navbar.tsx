"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, member, logout } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isWhiteNav = scrolled || !isHome;

  const closeMobile = () => setMobileOpen(false);

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
          <Link href="/" className="flex items-center no-underline">
            <div className="relative w-[150px] h-11">
              <img
                src="/assets/logo/logo-fkhk-putih-brand.png"
                alt={scrolled ? "" : "Logo FKHK"}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  isWhiteNav ? "opacity-0" : "opacity-100"
                }`}
                aria-hidden={isWhiteNav}
              />
              <img
                src="/assets/logo/logo-fkhk-hijau-brand.png"
                alt={isWhiteNav ? "Logo FKHK" : ""}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                  isWhiteNav ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!isWhiteNav}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1 list-none m-0 p-0">
            {[
              { href: "/", label: "Beranda", id: "nav-beranda" },
              { href: "/tentang", label: "Tentang Kami", id: "nav-tentang" },
              { href: "/articles", label: "Artikel", id: "nav-artikel" },
              { href: "/events", label: "Kegiatan", id: "nav-kegiatan" },
              { href: "/prestasi", label: "Prestasi", id: "nav-prestasi" },
            ].map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 no-underline ${
                    isWhiteNav
                      ? "text-gray-700 hover:text-primary hover:bg-primary/10"
                      : "text-white/80 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={member?.role === "admin" ? "/admin" : "/dashboard"}
                  className={`hidden lg:inline-flex px-3 py-2 rounded-lg text-sm font-medium no-underline transition ${
                    isWhiteNav
                      ? "text-gray-700 hover:text-primary hover:bg-primary/10"
                      : "text-white/80 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {member?.role === "admin" ? "Admin" : "Dashboard"}
                </Link>
                <button
                  onClick={logout}
                  className={`hidden lg:inline-flex px-4 py-2 border rounded-lg text-sm font-semibold no-underline transition ${
                    isWhiteNav
                      ? "border-accent text-accent hover:bg-accent hover:text-white"
                      : "border-white/60 text-white hover:bg-white hover:text-[#1a2e2e]"
                  }`}
                >
                  Keluar
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
                Masuk
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col gap-[5px] p-2 bg-none border-none cursor-pointer"
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

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-[68px] left-0 w-full bg-white shadow-lg transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col p-6 gap-3">
          {[
            { href: "/", label: "Beranda" },
            { href: "/articles", label: "Artikel" },
            { href: "/events", label: "Kegiatan" },
            { href: "/tentang", label: "Tentang Kami" },
            { href: "/prestasi", label: "Prestasi" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMobile}
              className="px-4 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 no-underline"
            >
              {item.label}
            </Link>
          ))}
          <hr className="border-gray-200 my-2" />
          {isAuthenticated ? (
            <>
              {member?.role !== "admin" && (
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  className="px-4 py-2.5 rounded-lg text-[#1a2e2e] font-medium hover:bg-gray-100 no-underline"
                >
                  Dashboard
                </Link>
              )}
              {member?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={closeMobile}
                  className="px-4 py-2.5 rounded-lg text-[#1a2e2e] font-medium hover:bg-gray-100 no-underline"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { logout(); closeMobile(); }}
                className="w-full px-4 py-2.5 rounded-lg text-[#c0392b] font-medium hover:bg-red-50 text-left"
              >
                Keluar
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={closeMobile}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-center no-underline"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
