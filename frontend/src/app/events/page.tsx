"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  dateTime: string;
  location: string | null;
  onlineUrl: string | null;
  capacity: number | null;
  status: string;
  category: string;
  imageUrl: string | null;
  _count: { registrations: number };
  createdBy: { name: string };
}

const STATUS_TABS = [
  { id: "upcoming", label: "Mendatang" },
  { id: "completed", label: "Arsip Selesai" },
  { id: "all", label: "Semua Agenda" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter && filter !== "all") params.set("status", filter);
    if (submittedSearch) params.set("search", submittedSearch);
    params.set("limit", "12");
    params.set("page", String(page));

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.data || []);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [filter, submittedSearch, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
  };

  return (
    <div className="pt-[68px] min-h-screen bg-[#FCFAF8] text-zinc-900">
      {/* Editorial Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 max-w-5xl pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block mb-2">
                Forum Akademik
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950 font-serif leading-tight">
                Agenda Kegiatan & Seminar
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
                Jadwal diskusi publik, lokakarya hukum, bedah berkas peradilan, dan program keilmuan Forum Kajian Hukum Keluarga.
              </p>
            </div>

            {/* Quick Venue Note */}
            <div className="border-l-2 border-[#2C5857] pl-3 py-0.5 text-xs text-zinc-600 shrink-0">
              <p className="font-semibold text-zinc-900">Fakultas Syariah & Hukum</p>
              <p className="text-zinc-500">Terbuka untuk umum & internal anggota</p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="border-t border-zinc-100 bg-[#FAF7F2]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
              {/* Status Segmented Buttons */}
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {STATUS_TABS.map((t) => {
                  const isActive = filter === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setFilter(t.id);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                        isActive
                          ? "bg-[#2C5857] text-white"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Integrated Search Input */}
              <form onSubmit={handleSearch} className="relative flex items-center w-full sm:w-64">
                <div className="absolute left-2.5 text-zinc-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari agenda kegiatan..."
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-zinc-300 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] transition"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSubmittedSearch("");
                      setPage(1);
                    }}
                    className="absolute right-2 text-zinc-400 hover:text-zinc-700 p-0.5 text-xs leading-none"
                    title="Hapus pencarian"
                  >
                    ×
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Events List */}
      <main className="container mx-auto px-4 max-w-5xl py-8 sm:py-12">
        {submittedSearch && (
          <div className="mb-6 flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-200 pb-3">
            <p>
              Hasil pencarian: <span className="font-semibold text-zinc-900">&quot;{submittedSearch}&quot;</span>
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSubmittedSearch("");
                setPage(1);
              }}
              className="text-[#2C5857] hover:underline font-medium"
            >
              Reset pencarian
            </button>
          </div>
        )}

        {loading ? (
          <div className="border-t border-b border-zinc-200 divide-y divide-zinc-200 bg-white">
            {[1, 2].map((n) => (
              <div key={n} className="p-6 animate-pulse">
                <div className="h-4 bg-zinc-200 rounded w-1/4 mb-3" />
                <div className="h-6 bg-zinc-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-zinc-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-14 text-center border-t border-b border-zinc-200 bg-white px-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-2 font-serif">
              Belum ada agenda pada kategori ini
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
              {submittedSearch
                ? "Tidak ditemukan agenda kegiatan yang cocok dengan kata kunci tersebut."
                : filter === "upcoming"
                ? "Agenda mendatang sedang disiapkan oleh panitia. Silakan periksa arsip kegiatan sebelumnya."
                : "Arsip kegiatan sebelumnya belum tersedia di sistem."}
            </p>
            {filter !== "all" && (
              <div className="mt-5">
                <button
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                    setSubmittedSearch("");
                    setPage(1);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-zinc-300 rounded-md bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition"
                >
                  Tampilkan Semua Agenda
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t border-b border-zinc-200 divide-y divide-zinc-200 bg-white">
            {events.map((e) => {
              const eventDate = new Date(e.dateTime);
              const dayNum = !isNaN(eventDate.getTime()) ? eventDate.getDate() : "--";
              const monthStr = !isNaN(eventDate.getTime())
                ? eventDate.toLocaleDateString("id-ID", { month: "short" })
                : "---";
              const yearStr = !isNaN(eventDate.getTime()) ? eventDate.getFullYear() : "";
              const fullTimeStr = !isNaN(eventDate.getTime())
                ? `${eventDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`
                : "";

              const isCompleted = e.status === "completed";
              const isCancelled = e.status === "cancelled";
              const isInternal = e.category === "internal";

              return (
                <article key={e.id} className="group p-5 sm:p-6 transition hover:bg-zinc-50/70">
                  <div className="flex items-start gap-4 sm:gap-5">
                    {/* Date Badge */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-14 sm:w-16 py-2 px-1 text-center rounded-lg bg-[#FAF7F2] border border-zinc-200/90 shadow-sm">
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#2C5857] uppercase tracking-wider leading-none">
                        {monthStr}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-zinc-900 font-serif leading-tight my-0.5">
                        {dayNum}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium leading-none">
                        {yearStr}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        {/* Kategori Badge */}
                        {isInternal ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                            🔒 Internal FKHK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            🌐 Terbuka Umum
                          </span>
                        )}

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          isCompleted
                            ? "bg-zinc-100 text-zinc-600 border-zinc-200"
                            : isCancelled
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-[#2C5857]/10 text-[#2C5857] border-[#2C5857]/20"
                        }`}>
                          {isCompleted ? "Terlaksana" : isCancelled ? "Dibatalkan" : "Akan Datang"}
                        </span>

                        {fullTimeStr && <span className="text-zinc-500">• {fullTimeStr}</span>}
                      </div>

                      <h2 className="text-base sm:text-lg font-semibold text-zinc-950 font-serif leading-snug group-hover:text-[#2C5857] transition-colors mb-2">
                        <Link href={`/events/${e.slug}`} className="focus:outline-none">
                          {e.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed mb-4">
                        {e.description || "Informasi teknis dan materi kajian dapat dilihat pada halaman detail agenda ini."}
                      </p>

                      <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs text-zinc-500">
                        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 min-w-0">
                          {e.location && (
                            <span className="flex items-center gap-1 text-zinc-600 truncate max-w-[180px] sm:max-w-none">
                              <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              <span className="truncate">{e.location}</span>
                            </span>
                          )}
                          <span className="shrink-0">
                            {isInternal
                              ? "Khusus Anggota"
                              : e.capacity
                              ? `${e._count?.registrations || 0}/${e.capacity} Peserta`
                              : `${e._count?.registrations || 0} Peserta`}
                          </span>
                        </div>

                        <Link
                          href={`/events/${e.slug}`}
                          className="self-end sm:self-auto font-medium text-[#2C5857] hover:underline inline-flex items-center text-xs shrink-0"
                        >
                          Detail Agenda
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Minimal Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8 pt-4">
            {page > 1 && (
              <button
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-zinc-300 bg-white rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                Sebelumnya
              </button>
            )}
            <span className="text-xs text-zinc-500">
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-zinc-300 bg-white rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                Selanjutnya
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
