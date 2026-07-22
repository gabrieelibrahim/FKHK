"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    section: "Menu Utama",
    items: [
      { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { href: "/admin/articles", label: "Artikel", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
      { href: "/admin/events", label: "Kegiatan", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
      { href: "/admin/achievements", label: "Prestasi", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
      { href: "/admin/members", label: "Anggota", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    ],
  },
  {
    section: "Lainnya",
    items: [
      { href: "/", label: "Lihat Website", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading, member, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || member?.role !== "admin") {
      router.push("/auth/login");
    }
  }, [authLoading, isAuthenticated, member, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || member?.role !== "admin") return null;

  return (
    <div className="flex h-screen bg-gray-50">

      <aside className="w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-200">
          <img src="/assets/logo/logo.png" alt="FKHK" className="w-8 h-8" />
          <span className="font-bold text-gray-900">FKHK Admin</span>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((section) => (
            <div key={section.section}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{section.section}</p>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition no-underline mb-1 ${
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
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-4 lg:px-6">

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {member?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{member?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{member?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Keluar
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
