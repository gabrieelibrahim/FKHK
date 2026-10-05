"use client";

import { useEffect, useState, useMemo } from "react";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  dateTime: string;
  status: string;
  category: string;
  _count?: { registrations: number };
}

interface RegistrationRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  institution: string;
  nim: string;
  registeredAt: string;
  attended: boolean;
  isMember: boolean;
}

function getToken(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((r) => r.startsWith("fkhk_token="))
    ?.split("=")[1];
  if (cookie) return cookie;
  try {
    return localStorage.getItem("fkhk_token");
  } catch {
    return null;
  }
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function csvEscape(value: string): string {
  const v = value ?? "";
  if (/[",\n;]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export default function AdminPresensiPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=100`)
      .then((r) => r.json())
      .then((d) => setEvents(d.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    setLoadingRows(true);
    setError("");
    const token = getToken();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${selectedId}/registrations`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "Gagal memuat data presensi");
        setRows(d.data || []);
      })
      .catch((e) => {
        setRows([]);
        setError(e.message || "Gagal memuat data presensi");
      })
      .finally(() => setLoadingRows(false));
  }, [selectedId]);

  const selectedEvent = events.find((e) => e.id === selectedId) || null;

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.nim, r.institution, r.phone]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  const attendedCount = rows.filter((r) => r.attended).length;
  const memberCount = rows.filter((r) => r.isMember).length;

  const handleDownload = () => {
    if (!selectedEvent || filteredRows.length === 0) return;
    const header = ["No", "Nama", "Email", "Telepon", "Institusi", "NIM", "Waktu Presensi", "Status", "Anggota FKHK"];
    const lines = filteredRows.map((r, i) =>
      [
        String(i + 1),
        csvEscape(r.name),
        csvEscape(r.email),
        csvEscape(r.phone),
        csvEscape(r.institution),
        csvEscape(r.nim),
        csvEscape(formatDateTime(r.registeredAt)),
        r.attended ? "Hadir" : "Terdaftar",
        r.isMember ? "Ya" : "Bukan",
      ].join(",")
    );
    const csv = "\uFEFF" + [header.join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toLocaleDateString("id-ID").replace(/\//g, "-");
    a.href = url;
    a.download = `rekap-presensi-${selectedEvent.slug}-${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">Rekap Presensi</h1>
          <p className="text-sm text-gray-500">
            Data peserta &amp; kehadiran per kegiatan — siap diunduh untuk laporan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!selectedEvent || filteredRows.length === 0}
          className="flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download CSV/Excel
        </button>
      </div>

      {/* Pemilih kegiatan */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Pilih Kegiatan</label>
        {loadingEvents ? (
          <div className="skeleton h-10 w-full rounded-lg" />
        ) : (
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">— Pilih kegiatan —</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({formatDateTime(e.dateTime)})
                {e._count?.registrations !== undefined ? ` — ${e._count.registrations} peserta` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {selectedEvent && (
        <>
          {/* Ringkasan */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Peserta", value: rows.length, color: "text-gray-900" },
              { label: "Hadir (Presensi)", value: attendedCount, color: "text-emerald-600" },
              { label: "Belum Presensi", value: rows.length - attendedCount, color: "text-amber-600" },
              { label: "Anggota FKHK", value: memberCount, color: "text-blue-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabel */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{selectedEvent.title}</h2>
                <p className="text-xs text-gray-500">{formatDateTime(selectedEvent.dateTime)} WIB</p>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / NIM / email..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
              />
            </div>

            {loadingRows ? (
              <div className="space-y-4 p-6">
                <div className="hidden sm:block">
                  <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="skeleton h-3 w-6" />
                    <div className="skeleton h-3.5 flex-[1.6]" />
                    <div className="skeleton hidden h-3 flex-1 md:block" />
                    <div className="skeleton hidden h-3 flex-1 lg:block" />
                    <div className="skeleton hidden h-3 flex-1 lg:block" />
                    <div className="skeleton hidden h-3 flex-1 sm:block" />
                    <div className="skeleton h-5 w-16 shrink-0 rounded-full" />
                  </div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-gray-50 px-4 py-3 last:border-0">
                      <div className="skeleton h-3 w-6" />
                      <div className="flex flex-[1.6] items-center gap-2">
                        <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
                        <div className="skeleton h-3.5 w-24" />
                      </div>
                      <div className="skeleton hidden h-3 flex-1 md:block" />
                      <div className="skeleton hidden h-3 flex-1 lg:block" />
                      <div className="skeleton hidden h-3 flex-1 lg:block" />
                      <div className="skeleton hidden h-3 flex-1 sm:block" />
                      <div className="skeleton h-5 w-16 shrink-0 rounded-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-5 sm:hidden">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="skeleton h-9 w-9 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-3.5 w-1/2" />
                        <div className="skeleton h-3 w-1/3" />
                      </div>
                      <div className="skeleton h-5 w-16 shrink-0 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredRows.length === 0 ? (              <div className="p-10 text-center text-sm text-gray-400">
                {rows.length === 0 ? "Belum ada peserta terdaftar untuk kegiatan ini." : "Tidak ada hasil untuk pencarian ini."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3 font-medium">No</th>
                      <th className="px-4 py-3 font-medium">Nama</th>
                      <th className="hidden px-4 py-3 font-medium md:table-cell">NIM</th>
                      <th className="hidden px-4 py-3 font-medium lg:table-cell">Institusi</th>
                      <th className="hidden px-4 py-3 font-medium lg:table-cell">Kontak</th>
                      <th className="hidden px-4 py-3 font-medium sm:table-cell">Waktu Presensi</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((r, i) => (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{r.name}</p>
                          {r.isMember && <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">Anggota FKHK</span>}
                        </td>
                        <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{r.nim}</td>
                        <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">{r.institution}</td>
                        <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                          <p className="truncate" style={{ maxWidth: 200 }}>{r.email}</p>
                          <p className="text-xs text-gray-400">{r.phone}</p>
                        </td>
                        <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{formatDateTime(r.registeredAt)}</td>
                        <td className="px-4 py-3">
                          {r.attended ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Hadir
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Terdaftar
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedEvent && !loadingEvents && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-10 w-10 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-3 text-sm text-gray-500">Pilih kegiatan di atas untuk melihat rekap presensinya.</p>
        </div>
      )}
    </div>
  );
}
