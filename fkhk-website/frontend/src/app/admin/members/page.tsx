"use client";

import { useEffect, useState } from "react";

interface Member {
  id: number;
  name: string;
  email: string;
  affiliation: string;
  role: string;
  createdAt: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", affiliation: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchMembers = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members`)
      .then((r) => r.json())
      .then((d) => setMembers(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(fetchMembers, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.email || !form.password) {
      setFormError("Nama, email, dan password wajib diisi");
      return;
    }
    setFormLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("fkhk_token="))
        ?.split("=")[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menambah anggota");
      setShowModal(false);
      setForm({ name: "", email: "", password: "", affiliation: "" });
      fetchMembers();
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anggota</h1>
          <p className="text-sm text-gray-500 mt-1">Data anggota FKHK ({members.length})</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition"
        >
          + Tambah Anggota
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {members.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Belum ada anggota.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Afiliasi</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem] font-bold text-primary shrink-0">
                        {m.name?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium text-gray-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{m.email}</td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{m.affiliation || "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>{m.role}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden lg:table-cell">
                    {new Date(m.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Tambah Anggota */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Anggota Baru</h2>
            {formError && (
              <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-200 rounded-lg text-sm">{formError}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Afiliasi (Opsional)</label>
                <input
                  type="text"
                  value={form.affiliation}
                  onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {formLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
