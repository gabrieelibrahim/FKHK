"use client";

import { useState, useEffect } from "react";
import ImageCropModal from "@/components/common/ImageCropModal";

interface Achievement {
  id: number;
  name: string;
  title: string;
  year: string;
  initials: string;
  photo?: string | null;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", title: "", year: "", photo: "" as string | null });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // State untuk Crop Modal
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements`)
      .then((r) => r.json())
      .then((res) => setAchievements(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", title: "", year: "", photo: null });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (a: Achievement) => {
    setEditingId(a.id);
    setForm({ name: a.name, title: a.title, year: a.year, photo: a.photo ?? null });
    setFormError("");
    setShowModal(true);
  };

  const onSelectFile = (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      setCropImageSrc(url);
    } catch (_) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCroppedBlob = async (blob: Blob) => {
    setCropImageSrc(null);
    setUploadingPhoto(true);
    try {
      const file = new File([blob], "achievement-avatar.webp", { type: "image/webp" });
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal upload foto");
      setForm((prev) => ({ ...prev, photo: data.url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus prestasi ini?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus prestasi");
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.title || !form.year) {
      setFormError("Nama, prestasi, dan tahun wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/achievements/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/achievements`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan prestasi");
      if (editingId) {
        setAchievements((prev) => prev.map((a) => (a.id === editingId ? data : a)));
      } else {
        setAchievements((prev) => [...prev, data]);
      }
      setShowModal(false);
      setForm({ name: "", title: "", year: "", photo: null });
      setEditingId(null);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
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
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Prestasi Anggota</h1>
          <p className="mt-1 text-sm text-gray-500 lg:hidden">Catat pencapaian anggota FKHK</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="min-h-11 w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90 sm:w-auto lg:min-h-0 lg:w-auto lg:rounded-lg"
        >
          Tambah Prestasi
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:rounded-xl lg:border-gray-200">
        {achievements.length === 0 ? (
          <div className="px-4 py-16 text-center text-gray-500">Belum ada prestasi.</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Anggota</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prestasi</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tahun</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((a) => (
                    <tr key={a.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {a.photo ? (
                            <img src={`${process.env.NEXT_PUBLIC_API_URL}${a.photo}`} alt={a.name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{a.initials}</div>
                          )}
                          <span className="text-sm font-medium text-gray-900">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{a.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{a.year}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(a)} className="min-h-9 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100 lg:min-h-0 lg:rounded-md lg:px-2.5 lg:py-1">Edit</button>
                          <button onClick={() => handleDelete(a.id)} className="min-h-9 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 lg:min-h-0 lg:rounded-md lg:px-2.5 lg:py-1">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 lg:hidden sm:p-4">
              {achievements.map((a) => (
                <article key={a.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    {a.photo ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}${a.photo}`} alt={a.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{a.initials}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-gray-900">{a.name}</h2>
                      <p className="mt-1 text-sm leading-5 text-gray-700">{a.title}</p>
                      <p className="mt-2 text-xs font-medium text-gray-500">Tahun {a.year}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                        <button onClick={() => openEdit(a)} className="min-h-10 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100">Edit</button>
                        <button onClick={() => handleDelete(a.id)} className="min-h-10 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100">Hapus</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Tambah/Edit Prestasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? "Edit Prestasi" : "Tambah Prestasi"}</h2>
            {formError && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-sm">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prestasi</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required placeholder="2026" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Anggota (opsional)</label>
                <div className="flex items-center gap-3">
                  {form.photo ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${form.photo}`} alt="Preview" className="h-12 w-12 shrink-0 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onSelectFile(f);
                        e.target.value = ""; // reset agar bisa pilih file yang sama
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      disabled={uploadingPhoto}
                    />
                    {uploadingPhoto && <p className="mt-1 text-xs text-gray-500">Mengunggah foto...</p>}
                    {form.photo && !uploadingPhoto && (
                      <button type="button" onClick={() => setForm({ ...form, photo: null })} className="mt-1 text-xs text-red-500 hover:text-red-600">Hapus foto</button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Batal</button>
                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50">{formLoading ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crop Foto */}
      {cropImageSrc && (
        <ImageCropModal
          imageSrc={cropImageSrc}
          onCropComplete={uploadCroppedBlob}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </div>
  );
}
