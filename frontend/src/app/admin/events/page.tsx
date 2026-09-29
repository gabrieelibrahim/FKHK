"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EventItem {
  id: number;
  title: string;
  slug: string;
  dateTime: string;
  status: string;
  _count: { registrations: number };
  capacity: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dateTime: "", location: "", onlineUrl: "", capacity: "", imageUrl: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=100`)
      .then((r) => r.json())
      .then((d) => setEvents(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kegiatan ini?")) return;
    const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title || !form.dateTime) {
      setFormError("Judul dan tanggal wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dateTime: form.dateTime,
          location: form.location || null,
          onlineUrl: form.onlineUrl || null,
          imageUrl: form.imageUrl || null,
          capacity: form.capacity ? parseInt(form.capacity) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat kegiatan");
      setShowModal(false);
      setForm({ title: "", description: "", dateTime: "", location: "", onlineUrl: "", capacity: "", imageUrl: "" });
      const refreshed = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=100`);
      const refreshedData = await refreshed.json();
      setEvents(refreshedData.data || []);
    } catch (err: any) {
      setFormError(err.message);
    } finally { setFormLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-6 lg:flex-row lg:gap-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Kegiatan</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola kegiatan FKHK</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="min-h-11 w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-primary-dark sm:w-auto lg:min-h-0 lg:w-auto lg:rounded-lg"
        >
          + Buat Kegiatan
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
        {events.length === 0 ? (
          <div className="px-4 py-16 text-center text-gray-500">Belum ada kegiatan.</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/75">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Judul</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Tanggal</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Peserta</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((e) => (
                    <tr key={e.id} className="transition hover:bg-gray-50/50">
                      <td className="max-w-[360px] px-4 py-3 font-medium text-gray-900">{e.title}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(e.dateTime).toLocaleDateString("id-ID")}</td>
                      <td className="px-4 py-3 text-gray-600">{e.capacity ? `${e._count.registrations}/${e.capacity}` : `${e._count.registrations}`}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${e.status === "upcoming" ? "bg-primary/10 text-primary border border-primary/20" : "bg-gray-100 text-gray-700 border border-gray-200/80"}`}>
                          {e.status === "upcoming" ? "Akan Datang" : e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/events/${e.slug}`} className="min-h-9 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 lg:min-h-0 lg:px-2.5 lg:py-1">Detail</Link>
                          <button type="button" onClick={() => handleDelete(e.id)} className="min-h-9 rounded-lg border border-red-200/60 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 lg:min-h-0 lg:px-2.5 lg:py-1">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 lg:hidden sm:p-4">
              {events.map((e) => (
                <article key={e.id} className="rounded-xl border border-gray-200/80 p-4 bg-white shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 text-sm font-semibold leading-5 text-gray-900">{e.title}</h2>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${e.status === "upcoming" ? "bg-primary/10 text-primary border border-primary/20" : "bg-gray-100 text-gray-700 border border-gray-200/80"}`}>
                      {e.status === "upcoming" ? "Akan Datang" : e.status}
                    </span>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-gray-400">Tanggal</dt>
                      <dd className="mt-1 font-medium text-gray-700">{new Date(e.dateTime).toLocaleDateString("id-ID")}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Peserta</dt>
                      <dd className="mt-1 font-medium text-gray-700">{e.capacity ? `${e._count.registrations}/${e.capacity}` : `${e._count.registrations}`}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                    <Link href={`/events/${e.slug}`} className="flex min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900">Detail</Link>
                    <button type="button" onClick={() => handleDelete(e.id)} className="min-h-10 rounded-lg border border-red-200/60 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100">Hapus</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Buat Kegiatan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Kegiatan Baru</h2>
            {formError && <div className="p-3 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg text-sm">{formError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                <input type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (opsional)</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Online (opsional)</label>
                <input type="url" value={form.onlineUrl} onChange={(e) => setForm({ ...form, onlineUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Thumbnail (opsional)</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => document.getElementById("event-img-input")?.click()} className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                    {uploading ? "Mengupload..." : "Pilih Foto"}
                  </button>
                  <input id="event-img-input" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
                      const fd = new FormData(); fd.append("file", file);
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
                      });
                      const d = await res.json();
                      if (!res.ok) throw new Error(d.message);
                      setForm((prev) => ({ ...prev, imageUrl: d.url }));
                    } catch (err: any) { setFormError(err.message); }
                    finally { setUploading(false); }
                  }} />
                  {form.imageUrl && <span className="text-xs text-primary font-medium">✓ Foto terupload</span>}
                </div>
                {form.imageUrl && (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${form.imageUrl}`} alt="preview" className="mt-2 h-20 w-auto rounded-lg border border-gray-200 object-cover" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas (opsional)</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Batal</button>
                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50">{formLoading ? "Membuat..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
