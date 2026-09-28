"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  dateTime: string;
  location: string;
  onlineUrl: string;
  capacity: number;
  status: string;
  imageUrl: string;
  _count: { registrations: number };
  createdBy: { name: string };
}

const STATUS_MAP: Record<string, string> = {
  upcoming: "Akan Datang",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

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
    if (filter) params.set("status", filter);
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
      .finally(() => setLoading(false));
  }, [filter, submittedSearch, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[80px] pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">
          Kegiatan
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {["upcoming", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {STATUS_MAP[f]}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 sm:ml-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kegiatan..."
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm flex-1 sm:w-56"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90"
            >
              Cari
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada kegiatan.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {e.imageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${e.imageUrl}`}
                    alt={e.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {STATUS_MAP[e.status] || e.status}
                    </span>
                  </div>
                  <h2 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-gray-900">
                    {e.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {e.description}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {new Date(e.dateTime).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {e.location && <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>{e.location}</span>}
                    {e.capacity && (
                      <span className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {e._count.registrations}/{e.capacity} peserta
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {page > 1 && (
              <button
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
              >
                Sebelumnya
              </button>
            )}
            <span className="px-4 py-2 text-sm text-gray-500">
              Halaman {page} / {totalPages}
            </span>
            {page < totalPages && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50"
              >
                Berikutnya
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
