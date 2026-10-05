"use client";

import { useEffect, useState, useRef } from "react";
import ImageCropModal from "@/components/common/ImageCropModal";

interface Officer {
  id: number;
  name: string;
  position: string;
  category: string;
  order: number;
  photo: string | null;
  initials: string | null;
  isActive: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "bph", label: "Badan Pengurus Harian (BPH)" },
  { value: "divisi_kajian", label: "Divisi Kajian & Riset" },
  { value: "divisi_advokasi", label: "Divisi Advokasi" },
  { value: "divisi_psdm", label: "Divisi Pengembangan SDM" },
  { value: "divisi_publikasi", label: "Divisi Publikasi & Relasi" },
  { value: "lainnya", label: "Lainnya / Pembina / Khusus" },
];

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
  position: "",
  category: "bph",
  order: 1,
  photo: "",
  isActive: true,
};

export default function AdminOfficersPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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

  const fetchOfficers = () => {
    setLoading(true);
    fetch("/api/officers?all=true")
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : (json && Array.isArray(json.data) ? json.data : []);
        setOfficers(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOfficers();
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
      const file = new File([blob], "officer-avatar.webp", { type: "image/webp" });
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
    setForm({
      ...emptyForm,
      category: selectedCategory === "all" ? "bph" : selectedCategory,
    });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (o: Officer) => {
    setEditingId(o.id);
    setForm({
      name: o.name,
      position: o.position,
      category: o.category,
      order: o.order,
      photo: o.photo || "",
      isActive: o.isActive,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data pengurus ini?")) return;
    try {
      const token = getToken();
      const res = await fetch(`/api/officers/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setOfficers((prev) => prev.filter((o) => o.id !== id));
      } else {
        alert("Gagal menghapus pengurus");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.position) {
      setFormError("Nama dan jabatan wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      const url = editingId ? `/api/officers/${editingId}` : `/api/officers`;
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
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data pengurus");
      if (editingId) {
        setOfficers((prev) => prev.map((o) => (o.id === editingId ? data : o)));
      } else {
        setOfficers((prev) => [...prev, data]);
      }
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredOfficers = officers.filter(
    (o) => selectedCategory === "all" || o.category === selectedCategory
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Struktur Pengurus</h1>
          <p className="text-sm text-gray-500 mt-1">Atur foto, nama, jabatan, dan kategori pengurus FKHK</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm self-start sm:self-auto"
        >
          + Tambah Pengurus
        </button>
      </div>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
            selectedCategory === "all"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Semua ({officers.length})
        </button>
        {CATEGORY_OPTIONS.map((cat) => {
          const count = officers.filter((o) => o.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
                    <div className="divide-y divide-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-6">
                <div className="skeleton h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-1/5" />
                </div>
                <div className="skeleton h-8 w-20 shrink-0 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredOfficers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Belum ada pengurus di kategori ini. Klik &quot;+ Tambah Pengurus&quot; untuk menambahkan.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Pengurus</th>
                    <th className="px-6 py-3.5">Jabatan</th>
                    <th className="px-6 py-3.5">Kategori</th>
                    <th className="px-6 py-3.5 text-center">Urutan</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOfficers.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {o.photo ? (
                            <img src={o.photo} alt={o.name} className="h-9 w-9 shrink-0 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {o.initials || o.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-900 block">{o.name}</span>
                            {!o.isActive && (
                              <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                                Nonaktif
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{o.position}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {CATEGORY_OPTIONS.find((c) => c.value === o.category)?.label || o.category}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500 font-mono text-xs">{o.order}</td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(o)}
                          className="text-primary hover:text-primary/80 font-medium text-xs px-2.5 py-1.5 rounded bg-primary/5 hover:bg-primary/10 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(o.id)}
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
              {filteredOfficers.map((o) => (
                <div key={o.id} className="p-4 flex items-start gap-3.5">
                  {o.photo ? (
                    <img src={o.photo} alt={o.name} className="h-11 w-11 shrink-0 rounded-full object-cover border border-gray-200 mt-0.5" />
                  ) : (
                    <div className="h-11 w-11 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mt-0.5">
                      {o.initials || o.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 text-sm truncate">{o.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono">#{o.order}</span>
                    </div>
                    <p className="text-xs font-medium text-primary mt-0.5">{o.position}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {CATEGORY_OPTIONS.find((c) => c.value === o.category)?.label || o.category}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => openEditModal(o)}
                        className="text-primary hover:text-primary/80 font-medium text-xs px-3 py-1.5 rounded-md bg-primary/5 hover:bg-primary/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 my-8">
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Pengurus" : "Tambah Pengurus"}
            </h2>

            {formError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Foto Profil Pengurus</label>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="cth. Tulus Mardiansyah"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Jabatan *</label>
                <input
                  type="text"
                  required
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="cth. Ketua, Koordinator, Anggota Divisi"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori / Struktur *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    Status Aktif
                  </label>
                </div>
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
