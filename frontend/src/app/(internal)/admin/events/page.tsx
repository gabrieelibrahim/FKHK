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
  status: string;
  category: string;
  imageUrl: string | null;
  _count: { registrations: number };
  capacity: number | null;
  presensiCode: string | null;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    category: "umum",
    dateTime: "",
    location: "",
    onlineUrl: "",
    capacity: "",
    imageUrl: "",
    presensiCode: "",
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    id: 0,
    title: "",
    description: "",
    category: "umum",
    dateTime: "",
    location: "",
    onlineUrl: "",
    capacity: "",
    status: "upcoming",
    imageUrl: "",
    presensiCode: "",
  });

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?limit=100`)
      .then((r) => r.json())
      .then((d) => setEvents(d.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kegiatan ini?")) return;
    const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!createForm.title || !createForm.dateTime) {
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
          title: createForm.title,
          description: createForm.description,
          category: createForm.category,
          dateTime: createForm.dateTime,
          location: createForm.location || null,
          onlineUrl: createForm.onlineUrl || null,
          imageUrl: createForm.imageUrl || null,
          presensiCode: createForm.presensiCode.trim() || null,
          capacity: createForm.category === "internal" ? null : (createForm.capacity ? parseInt(createForm.capacity) : null),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat kegiatan");
      setShowCreateModal(false);
      setCreateForm({
        title: "",
        description: "",
        category: "umum",
        dateTime: "",
        location: "",
        onlineUrl: "",
        capacity: "",
        imageUrl: "",
        presensiCode: "",
      });
      fetchEvents();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenEdit = (e: EventItem) => {
    let dtVal = "";
    try {
      const d = new Date(e.dateTime);
      if (!isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, "0");
        dtVal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
    } catch (_) {}

    setEditForm({
      id: e.id,
      title: e.title || "",
      description: e.description || "",
      category: e.category || "umum",
      dateTime: dtVal,
      location: e.location || "",
      onlineUrl: e.onlineUrl || "",
      capacity: e.capacity ? String(e.capacity) : "",
      status: e.status || "upcoming",
      imageUrl: e.imageUrl || "",
      presensiCode: e.presensiCode || "",
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!editForm.title || !editForm.dateTime) {
      setFormError("Judul dan tanggal wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          category: editForm.category,
          dateTime: editForm.dateTime,
          location: editForm.location || null,
          onlineUrl: editForm.onlineUrl || null,
          imageUrl: editForm.imageUrl || null,
          capacity: editForm.category === "internal" ? null : (editForm.capacity ? parseInt(editForm.capacity) : null),
          status: editForm.status,
          presensiCode: editForm.presensiCode.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui kegiatan");
      setShowEditModal(false);
      fetchEvents();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUploadImage = async (file: File, isEdit: boolean) => {
    setUploading(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      if (isEdit) {
        setEditForm((prev) => ({ ...prev, imageUrl: d.url }));
      } else {
        setCreateForm((prev) => ({ ...prev, imageUrl: d.url }));
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 sm:space-y-6 lg:space-y-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-6 lg:flex-row lg:gap-0">
        <div className="space-y-2">
          <div className="skeleton h-7 w-40" />
          <div className="skeleton h-4 w-64 max-w-full" />
        </div>
        <div className="skeleton h-10 w-36 rounded-xl" />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
        {/* Desktop table skeleton */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-8 border-b border-gray-100 bg-gray-50/75 px-4 py-3">
            <div className="skeleton h-4 flex-[2.5]" />
            <div className="skeleton h-5 flex-1 rounded-full" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-5 flex-1 rounded-full" />
            <div className="skeleton h-4 flex-[1.5]" />
          </div>
          {Array.from({ length: 6 }).map((_, r) => (
            <div key={r} className="flex items-center gap-8 border-b border-gray-100 px-4 py-3.5 last:border-0">
              <div className="skeleton h-4 flex-[2.5]" />
              <div className="skeleton h-5 flex-1 rounded-full" />
              <div className="skeleton h-4 flex-1" />
              <div className="skeleton h-4 flex-1" />
              <div className="skeleton h-5 flex-1 rounded-full" />
              <div className="flex flex-[1.5] justify-end gap-1.5">
                <div className="skeleton h-6 w-12 rounded-lg" />
                <div className="skeleton h-6 w-12 rounded-lg" />
                <div className="skeleton h-6 w-14 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        {/* Mobile card skeleton */}
        <div className="grid grid-cols-1 gap-3 p-3 lg:hidden sm:p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className="rounded-xl border border-gray-200/80 p-4 bg-white shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-5 w-20 shrink-0 rounded-full" />
              </div>
              <div className="mt-2">
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="skeleton h-3 w-12" />
                  <div className="skeleton mt-1.5 h-3 w-16" />
                </div>
                <div>
                  <div className="skeleton h-3 w-12" />
                  <div className="skeleton mt-1.5 h-3 w-12" />
                </div>
              </dl>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="skeleton h-10 rounded-lg" />
                <div className="skeleton h-10 rounded-lg" />
                <div className="skeleton h-10 rounded-lg" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
  }

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-6 lg:flex-row lg:gap-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Kegiatan</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola agenda kegiatan umum & internal FKHK</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormError("");
            setShowCreateModal(true);
          }}
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
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/75">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Judul</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Kategori</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Tanggal</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Peserta</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((e) => (
                    <tr key={e.id} className="transition hover:bg-gray-50/50">
                      <td className="max-w-[320px] px-4 py-3 font-medium text-gray-900 truncate">
                        {e.title}
                      </td>
                      <td className="px-4 py-3">
                        {e.category === "internal" ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            Internal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Umum
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{new Date(e.dateTime).toLocaleDateString("id-ID")}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {e.category === "internal" ? (
                          <span className="text-gray-400 text-xs italic">Khusus Anggota</span>
                        ) : e.capacity ? (
                          `${e._count?.registrations || 0}/${e.capacity}`
                        ) : (
                          `${e._count?.registrations || 0}`
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          e.status === "upcoming"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : e.status === "completed"
                            ? "bg-gray-100 text-gray-700 border border-gray-200/80"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {e.status === "upcoming" ? "Akan Datang" : e.status === "completed" ? "Selesai" : "Dibatalkan"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/events/${e.slug}`}
                            className="min-h-9 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 lg:min-h-0 lg:px-2.5 lg:py-1"
                          >
                            Detail
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(e)}
                            className="min-h-9 rounded-lg border border-blue-200/80 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 lg:min-h-0 lg:px-2.5 lg:py-1"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(e.id)}
                            className="min-h-9 rounded-lg border border-red-200/60 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 lg:min-h-0 lg:px-2.5 lg:py-1"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-3 lg:hidden sm:p-4">
              {events.map((e) => (
                <article key={e.id} className="rounded-xl border border-gray-200/80 p-4 bg-white shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 text-sm font-semibold leading-5 text-gray-900">{e.title}</h2>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      e.status === "upcoming"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : e.status === "completed"
                        ? "bg-gray-100 text-gray-700 border border-gray-200/80"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {e.status === "upcoming" ? "Akan Datang" : e.status === "completed" ? "Selesai" : "Dibatalkan"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {e.category === "internal" ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        Internal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Umum
                      </span>
                    )}
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-gray-400">Tanggal</dt>
                      <dd className="mt-1 font-medium text-gray-700">{new Date(e.dateTime).toLocaleDateString("id-ID")}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Peserta</dt>
                      <dd className="mt-1 font-medium text-gray-700">
                        {e.category === "internal"
                          ? "Khusus Anggota"
                          : e.capacity
                          ? `${e._count?.registrations || 0}/${e.capacity}`
                          : `${e._count?.registrations || 0}`}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/events/${e.slug}`}
                      className="flex min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Detail
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(e)}
                      className="flex min-h-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-2 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(e.id)}
                      className="flex min-h-10 items-center justify-center rounded-lg border border-red-200/60 bg-red-50 px-2 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Buat Kegiatan */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Kegiatan Baru</h2>
            {formError && <div className="p-3 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg text-sm">{formError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Misal: Seminar Hukum Keluarga"
                  required
                />
              </div>

              {/* Kategori Kegiatan (Umum vs Internal) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Kegiatan</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, category: "umum" })}
                    className={`p-3 rounded-xl border text-left transition ${
                      createForm.category === "umum"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 font-semibold"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      
                      <span className="text-sm">Umum</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-normal">
                      Terbuka untuk publik, peserta mengisi form pendaftaran.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreateForm({ ...createForm, category: "internal" })}
                    className={`p-3 rounded-xl border text-left transition ${
                      createForm.category === "internal"
                        ? "border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20 font-semibold"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      
                      <span className="text-sm">Internal</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-normal">
                      Khusus anggota/pengurus, tidak ada tombol pendaftaran.
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Tuliskan detail agenda kegiatan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                <input
                  type="datetime-local"
                  value={createForm.dateTime}
                  onChange={(e) => setCreateForm({ ...createForm, dateTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (opsional)</label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Misal: Aula Lt. 3 / Zoom Meeting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Online / Link Meeting (opsional)</label>
                <input
                  type="url"
                  value={createForm.onlineUrl}
                  onChange={(e) => setCreateForm({ ...createForm, onlineUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Thumbnail (opsional)</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => document.getElementById("create-event-img-input")?.click()}
                    className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {uploading ? "Mengupload..." : "Pilih Foto"}
                  </button>
                  <input
                    id="create-event-img-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, false);
                    }}
                  />
                  {createForm.imageUrl && <span className="text-xs text-primary font-medium">Foto terupload</span>}
                </div>
                {createForm.imageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${createForm.imageUrl}`}
                    alt="preview"
                    className="mt-2 h-20 w-auto rounded-lg border border-gray-200 object-cover"
                  />
                )}
              </div>

              {createForm.category === "umum" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas Kuota Peserta (opsional)</label>
                  <input
                    type="number"
                    value={createForm.capacity}
                    onChange={(e) => setCreateForm({ ...createForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Kosongkan jika kuota tidak terbatas"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Presensi (opsional, anti titip absen)</label>
                <input
                  type="text"
                  value={createForm.presensiCode}
                  onChange={(e) => setCreateForm({ ...createForm, presensiCode: e.target.value.toUpperCase() })}
                  maxLength={12}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Misal: RK2026 — kosongkan jika tidak perlu kode"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Jika diisi, peserta wajib memasukkan kode ini untuk konfirmasi kehadiran. Umumkan kode hanya di lokasi kegiatan.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {formLoading ? "Menyimpan..." : "Simpan Kegiatan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Kegiatan */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Edit Kegiatan</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {formError && <div className="p-3 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg text-sm">{formError}</div>}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              {/* Kategori Kegiatan (Umum vs Internal) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori Kegiatan</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, category: "umum" })}
                    className={`p-3 rounded-xl border text-left transition ${
                      editForm.category === "umum"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 font-semibold"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      
                      <span className="text-sm">Umum</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-normal">
                      Terbuka untuk publik, peserta mengisi form pendaftaran.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, category: "internal" })}
                    className={`p-3 rounded-xl border text-left transition ${
                      editForm.category === "internal"
                        ? "border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20 font-semibold"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      
                      <span className="text-sm">Internal</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-normal">
                      Khusus anggota/pengurus, tidak ada tombol pendaftaran.
                    </p>
                  </button>
                </div>
              </div>

              {/* Status Kegiatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Kegiatan</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="upcoming">Akan Datang (Upcoming)</option>
                  <option value="completed">Selesai (Completed)</option>
                  <option value="cancelled">Dibatalkan (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                <input
                  type="datetime-local"
                  value={editForm.dateTime}
                  onChange={(e) => setEditForm({ ...editForm, dateTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (opsional)</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Online / Link Meeting (opsional)</label>
                <input
                  type="url"
                  value={editForm.onlineUrl}
                  onChange={(e) => setEditForm({ ...editForm, onlineUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Thumbnail (opsional)</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => document.getElementById("edit-event-img-input")?.click()}
                    className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {uploading ? "Mengupload..." : "Ganti Foto"}
                  </button>
                  <input
                    id="edit-event-img-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, true);
                    }}
                  />
                  {editForm.imageUrl && <span className="text-xs text-primary font-medium">Foto terpasang</span>}
                </div>
                {editForm.imageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${editForm.imageUrl}`}
                      alt="preview"
                      className="h-20 w-auto rounded-lg border border-gray-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, imageUrl: "" })}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Hapus Foto
                    </button>
                  </div>
                )}
              </div>

              {editForm.category === "umum" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas Kuota Peserta (opsional)</label>
                  <input
                    type="number"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Kosongkan jika kuota tidak terbatas"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Presensi (opsional, anti titip absen)</label>
                <input
                  type="text"
                  value={editForm.presensiCode}
                  onChange={(e) => setEditForm({ ...editForm, presensiCode: e.target.value.toUpperCase() })}
                  maxLength={12}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Kosongkan untuk menonaktifkan kode"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Jika diisi, peserta wajib memasukkan kode ini untuk konfirmasi kehadiran. Umumkan kode hanya di lokasi kegiatan.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {formLoading ? "Memperbarui..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
