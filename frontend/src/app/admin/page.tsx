"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  members: number;
  articles: number;
  events: number;
  subscribers: number;
}

const statCards = [
  {
    key: "members" as const,
    label: "Total Anggota",
    href: "/admin/members",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    key: "articles" as const,
    label: "Total Artikel",
    href: "/admin/articles",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    key: "events" as const,
    label: "Total Kegiatan",
    href: "/admin/events",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    key: "subscribers" as const,
    label: "Newsletter",
    href: "/admin",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ members: 0, articles: 0, events: 0, subscribers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = () =>
      document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?limit=1`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=1`).then((r) => r.json()),
    ])
      .then(([members, articles, events]) => {
        setStats({
          members: members.total || 0,
          articles: articles.total || 0,
          events: events.total || 0,
          subscribers: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-0">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:mb-1">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 lg:mt-0 lg:mb-6">Selamat datang di panel administrasi FKHK.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:mb-8">
        {statCards.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="group block min-w-0 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs no-underline transition-all hover:border-primary/40 hover:shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="min-w-0 pr-2 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">
                {s.label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                {s.icon}
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{stats[s.key]}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Akses Cepat</h2>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {[
            {
              href: "/admin/articles",
              label: "Kelola Artikel",
              desc: "Review & publikasi",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ),
            },
            {
              href: "/admin/events",
              label: "Kelola Kegiatan",
              desc: "Buat & kelola event",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              ),
            },
            {
              href: "/admin/members",
              label: "Kelola Anggota",
              desc: "Data anggota",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
            },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex min-h-16 items-center gap-3.5 rounded-xl border border-gray-200/80 bg-white p-3.5 no-underline transition-all hover:border-primary/40 hover:bg-gray-50/50 hover:shadow-xs sm:p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {q.icon}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm">{q.label}</p>
                <p className="text-xs text-gray-500 truncate">{q.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
