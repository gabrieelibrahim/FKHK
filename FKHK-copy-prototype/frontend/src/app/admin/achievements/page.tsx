"use client";

import { useState, useEffect } from "react";

interface Achievement {
  id: number;
  name: string;
  title: string;
  year: string;
  initials: string;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", year: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements`)
      .then((r) => r.json())
      .then((res) => setAchievements(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.title || !form.year) {
      setFormError("Nama, prestasi, dan tahun wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambah prestasi");
      setShowModal(false);
      setForm({ name: "", title: "", year: "" });
      setAchievements((prev) => [...prev, data]);
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
        <h1 className="text-2xl font-bold text-gray-900">Prestasi Anggota</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">Tambah Prestasi</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Anggota</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Prestasi</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Tahun</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{a.initials}</div>
                    <span className="text-sm font-medium text-gray-900">{a.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{a.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Prestasi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Prestasi</h2>
            {formError && <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-sm">{formError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
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
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Batal</button>
                <button type="submit" disabled={formLoading} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50">{formLoading ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
