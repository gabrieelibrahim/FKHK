"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth, isAdminRole } from "@/context/AuthContext";

const navItems = [
  {
    section: "Menu Utama",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { href: "/dashboard/submit", label: "Tulis Artikel", icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" },
      { href: "/dashboard/my-articles", label: "Artikel Saya", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
    ],
  },
  {
    section: "Lainnya",
    items: [
      { href: "/", label: "Lihat Website", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading, member, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (isAdminRole(member?.role)) {
      router.push("/admin");
    }
  }, [authLoading, isAuthenticated, member, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (authLoading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar skeleton */}
        <aside className="hidden w-[min(84vw,18rem)] shrink-0 flex-col border-r border-gray-200 bg-white lg:flex lg:w-64">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-6">
            <div className="skeleton h-9 w-9 rounded-lg" />
            <div className="skeleton h-4 w-32" />
          </div>
          <nav className="space-y-6 p-4">
            {Array.from({ length: 2 }).map((_, s) => (
              <div key={s} className="space-y-1">
                <div className="skeleton mx-3 mb-2 h-3 w-16" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="skeleton mb-1 h-10 rounded-lg" />
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex items-center gap-3">
              <div className="skeleton h-11 w-11 rounded-xl lg:hidden" />
              <div className="lg:hidden space-y-1">
                <div className="skeleton h-4 w-36" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden sm:flex items-center gap-2">
                <div className="skeleton h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-2.5 w-16" />
                </div>
              </div>
              <div className="skeleton h-9 w-20 rounded-xl" />
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="skeleton h-7 w-40" />
                <div className="skeleton h-4 w-64 max-w-full" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs sm:p-5">
                    <div className="skeleton h-3 w-24" />
                    <div className="skeleton mt-2 h-8 w-14" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !member || isAdminRole(member.role)) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[min(84vw,18rem)] bg-white border-r border-gray-200 shrink-0 flex flex-col shadow-xl transition-transform duration-150 ease-out lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-200 shrink-0">
          <Image src="/assets/logo/logo-fkhk-hijau.webp" alt="FKHK" width={36} height={36} className="w-9 h-9 object-contain shrink-0" />
          <span className="font-bold text-gray-900">Dashboard Member</span>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto flex-1">
          {navItems.map((section) => (
            <div key={section.section}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{section.section}</p>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition no-underline mb-1 min-h-11 ${
                      isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 h-14 lg:h-16 bg-white/95 border-b border-gray-200 flex items-center justify-between px-3 lg:px-6 shrink-0 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
              aria-expanded={sidebarOpen}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-90 lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="lg:hidden">
              <p className="truncate text-sm font-semibold text-gray-900">Dashboard Member</p>
              <p className="truncate text-[11px] text-gray-500">Panel member</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {member?.name?.charAt(0) || "M"}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{member?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{member?.role}</p>
              </div>
            </div>
            {/* Mobile avatar */}
            <div className="sm:hidden w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {member?.name?.charAt(0) || "M"}
            </div>
            <button
              onClick={logout}
              className="flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-100 hover:bg-red-50 lg:min-h-0 lg:gap-2 lg:rounded-lg lg:py-1.5 lg:font-normal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="h-5 w-5 shrink-0">
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
