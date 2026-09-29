"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, isAdminRole } from "@/context/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  allowedRoles: string[];
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    section: "Menu Utama",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        allowedRoles: ["superadmin", "admin", "admin_kaset", "admin_psdm"],
      },
      {
        href: "/admin/articles",
        label: "Artikel",
        icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
        allowedRoles: ["superadmin", "admin_kaset"],
      },
      {
        href: "/admin/events",
        label: "Kegiatan",
        icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
        allowedRoles: ["superadmin", "admin", "admin_kaset", "admin_psdm"],
      },
      {
        href: "/admin/achievements",
        label: "Prestasi",
        icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
        allowedRoles: ["superadmin", "admin_psdm"],
      },
      {
        href: "/admin/officers",
        label: "Pengurus",
        icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
        allowedRoles: ["superadmin", "admin", "admin_kaset", "admin_psdm"],
      },
      {
        href: "/admin/members",
        label: "Anggota",
        icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
        allowedRoles: ["superadmin"],
      },
      {
        href: "/admin/comments",
        label: "Komentar",
        icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8m-8 4h5",
        allowedRoles: ["superadmin", "admin", "admin_kaset", "admin_psdm"],
      },
    ],
  },
  {
    section: "Lainnya",
    items: [
      {
        href: "/",
        label: "Lihat Website",
        icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
        allowedRoles: ["superadmin", "admin", "admin_kaset", "admin_psdm"],
      },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading, member, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !isAdminRole(member?.role)) {
      router.push("/auth/login");
      return;
    }

    // Role-based route guard for admin sub-paths
    const currentItem = navSections
      .flatMap((s) => s.items)
      .find((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/")));

    if (currentItem && currentItem.allowedRoles && !currentItem.allowedRoles.includes(member?.role || "")) {
      router.push("/admin");
    }
  }, [authLoading, isAuthenticated, member, pathname, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  if (authLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gray-50 lg:min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdminRole(member?.role)) {
    return null;
  }

  return (
    <div className="flex min-h-[100dvh] bg-gray-50 lg:h-screen">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          className="fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        aria-label="Navigasi admin"
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(84vw,18rem)] shrink-0 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:block lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none lg:transition-none ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5 sm:px-6 lg:justify-start lg:gap-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/assets/logo/logo-fkhk-hijau.webp" alt="FKHK" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
            <span className="truncate font-bold text-gray-900">FKHK Admin</span>
          </div>
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 active:scale-90 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 lg:block lg:h-[calc(100vh-4rem)] lg:flex-none">
          {navSections.map((section) => {
            const visibleItems = section.items.filter(
              (item) => !item.allowedRoles || (member?.role && item.allowedRoles.includes(member.role))
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.section}>
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 lg:text-xs lg:tracking-wider">
                  {section.section}
                </p>
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mb-1 flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium no-underline transition-colors duration-100 lg:min-h-0 lg:rounded-lg lg:py-2.5 lg:shadow-none ${
                        isActive ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:static lg:z-auto lg:justify-end lg:bg-white lg:px-6 lg:backdrop-blur-none">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-90 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0 lg:hidden">
              <p className="truncate text-sm font-semibold text-gray-900">FKHK Admin</p>
              <p className="truncate text-[11px] text-gray-500">Panel administrasi</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {member?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member?.name}</p>
                <p className="text-xs capitalize text-gray-500">{member?.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-100 hover:bg-red-50 lg:min-h-0 lg:gap-0 lg:rounded-lg lg:py-1.5 lg:font-normal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="h-5 w-5 sm:hidden">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
