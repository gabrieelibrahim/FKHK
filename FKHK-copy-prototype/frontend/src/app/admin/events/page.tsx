"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kegiatan</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola kegiatan FKHK</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">+ Buat Kegiatan</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Belum ada kegiatan.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Judul</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Tanggal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Peserta</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-900">{e.title}</td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{new Date(e.dateTime).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{e.capacity ? `${e._count.registrations}/${e.capacity}` : `${e._count.registrations}`}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{e.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <Link href={`/events/${e.slug}`} className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition">Detail</Link>
                      <button onClick={() => handleDelete(e.id)} className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Buat Kegiatan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Kegiatan Baru</h2>
            {formError && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-sm">{formError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                <input type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (opsional)</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Online (opsional)</label>
                <input type="url" value={form.onlineUrl} onChange={(e) => setForm({ ...form, onlineUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Thumbnail (opsional)</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => document.getElementById("event-img-input")?.click()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
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
                  {form.imageUrl && <span className="text-xs text-green-600">✓ Foto terupload</span>}
                </div>
                {form.imageUrl && (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${form.imageUrl}`} alt="preview" className="mt-2 h-20 w-auto rounded-lg border object-cover" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas (opsional)</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Batal</button>
                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50">{formLoading ? "Membuat..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
