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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", affiliation: "", role: "member" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];

  const fetchMembers = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members?limit=999`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => setMembers(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(fetchMembers, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", email: "", password: "", affiliation: "", role: "member" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (m: Member) => {
    setEditingId(m.id);
    setForm({ name: m.name, email: m.email, password: "", affiliation: m.affiliation || "", role: m.role });
    setFormError("");
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus anggota ini?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus anggota");
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (editingId) {
      if (!form.name || !form.email) {
        setFormError("Nama dan email wajib diisi");
        return;
      }
    } else {
      if (!form.name || !form.email || !form.password) {
        setFormError("Nama, email, dan password wajib diisi");
        return;
      }
    }
    setFormLoading(true);
    try {
      if (editingId) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/${editingId}/admin`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ name: form.name, email: form.email, affiliation: form.affiliation, role: form.role }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal mengubah anggota");
        setMembers((prev) => prev.map((m) => (m.id === editingId ? data.member : m)));
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Gagal menambah anggota");
      }
      setShowModal(false);
      setForm({ name: "", email: "", password: "", affiliation: "", role: "member" });
      setEditingId(null);
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
    <div className="space-y-5 sm:space-y-6 lg:space-y-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-6 lg:flex-row lg:gap-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Anggota</h1>
          <p className="mt-1 text-sm text-gray-500">Data anggota FKHK ({members.length})</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="min-h-11 w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-primary-dark sm:w-auto lg:min-h-0 lg:w-auto lg:rounded-lg"
        >
          + Tambah Anggota
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
        {members.length === 0 ? (
          <div className="px-4 py-16 text-center text-gray-500">Belum ada anggota.</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/75">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Nama</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Afiliasi</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Bergabung</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m) => (
                    <tr key={m.id} className="transition hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary lg:h-7 lg:w-7 lg:text-[0.6rem]">
                            {m.name?.charAt(0) || "?"}
                          </div>
                          <span className="font-medium text-gray-900">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.email}</td>
                      <td className="px-4 py-3 text-gray-600">{m.affiliation || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${m.role.includes("admin") ? "bg-primary/10 text-primary border border-primary/20" : "bg-gray-100 text-gray-600 border border-gray-200/60"}`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(m.createdAt).toLocaleDateString("id-ID")}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => openEdit(m)} className="min-h-9 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-primary lg:min-h-0 lg:px-2.5 lg:py-1">Edit</button>
                          <button onClick={() => handleDelete(m.id)} className="min-h-9 rounded-lg border border-red-200/60 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 lg:min-h-0 lg:px-2.5 lg:py-1">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 lg:hidden sm:p-4">
              {members.map((m) => (
                <article key={m.id} className="rounded-xl border border-gray-200/80 p-4 bg-white shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {m.name?.charAt(0) || "?"}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-gray-900">{m.name}</h2>
                        <p className="mt-1 truncate text-xs text-gray-500">{m.email}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${m.role.includes("admin") ? "bg-primary/10 text-primary border border-primary/20" : "bg-gray-100 text-gray-600 border border-gray-200/60"}`}>
                      {m.role}
                    </span>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-gray-400">Afiliasi</dt>
                      <dd className="mt-1 truncate font-medium text-gray-700">{m.affiliation || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Bergabung</dt>
                      <dd className="mt-1 font-medium text-gray-700">{new Date(m.createdAt).toLocaleDateString("id-ID")}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                    <button onClick={() => openEdit(m)} className="min-h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-primary">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="min-h-10 rounded-lg border border-red-200/60 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100">Hapus</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Tambah/Edit Anggota */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? "Edit Anggota" : "Tambah Anggota Baru"}</h2>
            {formError && (
              <div className="p-3 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg text-sm">{formError}</div>
            )}
            <form onSubmit={handleCreateOrEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required={!editingId}
                    minLength={6}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Afiliasi (Opsional)</label>
                <input
                  type="text"
                  value={form.affiliation}
                  onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin (Advokasi)</option>
                    <option value="admin_bph">Admin BPH</option>
                    <option value="admin_kaset">Admin KASET</option>
                    <option value="admin_psdm">Admin PSDM</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
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
