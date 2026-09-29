"use client";

import { useEffect, useState, useRef } from "react";
import ImageCropModal from "@/components/common/ImageCropModal";

interface Achievement {
  id: number;
  name: string;
  title: string;
  event: string | null;
  year: number;
  photo: string | null;
}


function getToken() {
  if (typeof window === "undefined") return "";
  const cookieToken = document.cookie
    .split("; ")
    .find((r) => r.startsWith("fkhk_token="))
    ?.split("=")[1];
  return cookieToken || localStorage.getItem("token") || "";
}

const emptyForm = {
  name: "",
  title: "",
  event: "",
  year: new Date().getFullYear(),
  photo: "",
};

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => r.json())
      .then((data) => setAchievements(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onSelectFile = async (file: File) => {
    if (!file) return;

    let targetFile: File | Blob = file;

    const isHeic =
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif") ||
      file.type === "image/heic" ||
      file.type === "image/heif";

    if (isHeic) {
      setIsConvertingHeic(true);
      try {
        const token = getToken();
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/convert-heic", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.dataUrl) {
            setCropImageSrc(data.dataUrl);
            setIsConvertingHeic(false);
            return;
          }
        }

        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server status ${res.status}`);
      } catch (err: any) {
        console.error("Gagal convert HEIC via server:", err);
        try {
          const heic2any = (await import("heic2any")).default;
          const conversionResult = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });

          targetFile = Array.isArray(conversionResult)
            ? conversionResult[0]
            : conversionResult;
        } catch (clientErr: any) {
          alert(`Gagal memproses file HEIC: ${err?.message || "Format tidak didukung"}`);
          setIsConvertingHeic(false);
          return;
        }
      } finally {
        setIsConvertingHeic(false);
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setCropImageSrc(reader.result as string);
      }
    };
    reader.onerror = () => {
      try {
        const url = URL.createObjectURL(targetFile);
        setCropImageSrc(url);
      } catch (e) {
        alert("Gagal membaca file. Pastikan file sudah terunduh di perangkat.");
      }
    };

    try {
      reader.readAsDataURL(targetFile);
    } catch (_) {
      try {
        const url = URL.createObjectURL(targetFile);
        setCropImageSrc(url);
      } catch (err) {
        alert("Gagal memuat file yang dipilih.");
      }
    }
  };

  const uploadCroppedBlob = async (blob: Blob) => {
    setCropImageSrc(null);
    setUploadingPhoto(true);
    try {
      const file = new File([blob], "achievement-avatar.webp", { type: "image/webp" });
      const fd = new FormData();
      fd.append("file", file);
      const token = getToken();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal upload foto");
      setForm((prev) => ({ ...prev, photo: data.url }));
    } catch (err: any) {
      alert(`Gagal upload: ${err?.message || err}`);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (a: Achievement) => {
    setEditingId(a.id);
    setForm({
      name: a.name,
      title: a.title,
      event: a.event || "",
      year: a.year,
      photo: a.photo || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data prestasi ini?")) return;
    try {
      const token = getToken();
      const res = await fetch(`/api/achievements/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert("Gagal menghapus prestasi");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
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
        ? `/api/achievements/${editingId}`
        : `/api/achievements`;
      const method = editingId ? "PUT" : "POST";
      const token = getToken();
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan prestasi");
      if (editingId) {
        setAchievements((prev) => prev.map((a) => (a.id === editingId ? data : a)));
      } else {
        setAchievements((prev) => [data, ...prev]);
      }
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prestasi Mahasiswa</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data mahasiswa berprestasi dan apresiasi lomba</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm"
        >
          + Tambah Prestasi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data prestasi...</div>
        ) : achievements.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Belum ada data prestasi. Klik &quot;+ Tambah Prestasi&quot; untuk menambahkan.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Mahasiswa</th>
                    <th className="px-6 py-3.5">Prestasi</th>
                    <th className="px-6 py-3.5">Ajang / Event</th>
                    <th className="px-6 py-3.5">Tahun</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {achievements.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {a.photo ? (
                            <img src={a.photo} alt={a.name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {a.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{a.title}</td>
                      <td className="px-6 py-4 text-gray-500">{a.event || "-"}</td>
                      <td className="px-6 py-4 text-gray-500">{a.year}</td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(a)}
                          className="text-primary hover:text-primary/80 font-medium text-xs px-2.5 py-1.5 rounded bg-primary/5 hover:bg-primary/10 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs px-2.5 py-1.5 rounded bg-red-50 hover:bg-red-100 transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {achievements.map((a) => (
                <div key={a.id} className="p-4 flex items-start gap-3.5">
                  {a.photo ? (
                    <img src={a.photo} alt={a.name} className="h-10 w-10 shrink-0 rounded-full object-cover mt-0.5" />
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mt-0.5">
                      {a.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                    <p className="text-xs font-medium text-primary mt-0.5 line-clamp-1">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.event ? `${a.event} • ${a.year}` : a.year}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => openEditModal(a)}
                        className="text-primary hover:text-primary/80 font-medium text-xs px-3 py-1.5 rounded-md bg-primary/5 hover:bg-primary/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-xs px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Prestasi" : "Tambah Prestasi"}
            </h2>

            {formError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Foto Mahasiswa</label>
                <div className="flex items-center gap-3">
                  {form.photo ? (
                    <img src={form.photo} alt="Preview" className="h-12 w-12 shrink-0 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs font-medium">
                      No Foto
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onSelectFile(f);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto || isConvertingHeic}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {isConvertingHeic
                      ? "Memproses HEIC..."
                      : uploadingPhoto
                      ? "Mengunggah..."
                      : form.photo
                      ? "Ganti Foto"
                      : "Pilih Foto"}
                  </button>
                  {form.photo && !uploadingPhoto && !isConvertingHeic && (
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, photo: "" }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Mahasiswa *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="cth. Ghayda Zaneta"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Prestasi / Penghargaan *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="cth. Penulis Terpilih Call for Papers"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ajang / Penyelenggara (Opsional)</label>
                <input
                  type="text"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  placeholder="cth. Pengadilan Agama Sleman"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tahun *</label>
                <input
                  type="number"
                  required
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading || uploadingPhoto || isConvertingHeic}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {formLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
