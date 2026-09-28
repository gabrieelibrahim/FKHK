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
  { key: "members" as const, label: "Total Anggota", color: "bg-blue-500", href: "/admin/members" },
  { key: "articles" as const, label: "Total Artikel", color: "bg-emerald-500", href: "/admin/articles" },
  { key: "events" as const, label: "Total Kegiatan", color: "bg-amber-500", href: "/admin/events" },
  { key: "subscribers" as const, label: "Newsletter", color: "bg-purple-500", href: "/admin" },
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
            className="block min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm no-underline transition hover:shadow-md sm:p-5 lg:rounded-xl lg:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="min-w-0 pr-2 text-xs font-medium leading-5 text-gray-500 sm:text-sm lg:pr-0 lg:leading-normal">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.color} bg-opacity-10 flex items-center justify-center`}>
                <div className={`w-3 h-3 rounded-full ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{stats[s.key]}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:rounded-xl lg:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Akses Cepat</h2>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {[
            { href: "/admin/articles", label: "Kelola Artikel", desc: "Review & publikasi", color: "bg-emerald-100", iconColor: "#059669" },
            { href: "/admin/events", label: "Kelola Kegiatan", desc: "Buat & kelola event", color: "bg-amber-100", iconColor: "#d97706" },
            { href: "/admin/members", label: "Kelola Anggota", desc: "Data anggota", color: "bg-blue-100", iconColor: "#2563eb" },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex min-h-16 items-center gap-3 rounded-xl border border-gray-100 p-3 no-underline transition hover:border-gray-300 hover:bg-gray-50 sm:p-4 lg:min-h-0 lg:rounded-lg lg:p-4"
            >
              <div className={`w-10 h-10 rounded-lg ${q.color} flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={q.iconColor} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{q.label}</p>
                <p className="text-sm text-gray-500">{q.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
