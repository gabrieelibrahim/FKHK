"use client";

import { useEffect, useState } from "react";

interface Article {
  id: number;
  title: string;
  slug: string;
  author: { name: string };
  status: string;
  topic: string;
  viewCount: number;
  createdAt: string;
}

interface ArticleDetail extends Article {
  content: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  publishedAt?: string;
}

function statusLabel(status: string) {
  if (status === "published") return "Dipublish";
  if (status === "submitted") return "Menunggu publish";
  if (status === "draft") return "Ditolak / draft";
  return status;
}

function statusClass(status: string) {
  if (status === "published") return "bg-primary/10 text-primary border border-primary/20";
  if (status === "submitted") return "bg-amber-50 text-amber-800 border border-amber-200/60";
  return "bg-gray-100 text-gray-700 border border-gray-200/80";
}

function getToken() {
  return document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<ArticleDetail | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // create article state
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState("");
  const [createForm, setCreateForm] = useState({
    title: "",
    topic: "General",
    tags: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    publishNow: true,
  });

  const loadArticles = () => {
    const token = getToken();
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setArticles(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openPreview = async (a: Article) => {
    setError("");
    setPreviewLoading(true);
    setPreview(null);
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${a.slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat artikel");
      setPreview(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleAction = async (id: number, action: "approve" | "reject" | "delete") => {
    if (action === "delete" && !confirm("Hapus artikel ini?")) return;
    const token = getToken();
    setActionLoading(true);
    setError("");
    try {
      if (action === "approve") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/publish`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Gagal publish");
        setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status: "published" } : a)));
        setPreview((p) => (p && p.id === id ? { ...p, status: "published" } : p));
      } else if (action === "reject") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/reject`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Gagal menolak");
        setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status: "draft" } : a)));
        setPreview((p) => (p && p.id === id ? { ...p, status: "draft" } : p));
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Gagal menghapus");
        }
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setPreview(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!createForm.title.trim() || !createForm.content.trim()) {
      setCreateError("Judul dan konten wajib diisi");
      return;
    }
    setCreateLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: createForm.title,
          content: createForm.content,
          excerpt: createForm.excerpt,
          topic: createForm.topic,
          imageUrl: createForm.imageUrl || null,
          tags: createForm.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat artikel");

      // Auto-publish jika dicentang (admin kaset / superadmin)
      if (createForm.publishNow && data.id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${data.id}/publish`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }

      setCreateOpen(false);
      setCreateForm({
        title: "",
        topic: "General",
        tags: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        publishNow: true,
      });
      loadArticles();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setCreateError("");
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal upload");
      setCreateForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    setCreateError("");
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/extract-text`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengekstrak teks");
      if (!data.text || !data.text.trim()) throw new Error("Tidak ada teks yang bisa diekstrak dari file");
      setCreateForm((prev) => ({ ...prev, content: data.text.trim() }));
      setUploadedDocName(data.filename || file.name);
      if (!file.name) setUploadedDocName(file.name);
      // Isi judul otomatis dari nama file jika masih kosong
      setCreateForm((prev) => {
        if (prev.title.trim()) return prev;
        const baseName = (data.filename || file.name || "").replace(/\.(docx|pdf|txt)$/i, "").replace(/[-_]+/g, " ").trim();
        return baseName ? { ...prev, title: baseName } : prev;
      });
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
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
        <div className="skeleton h-10 w-36 rounded-lg" />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
        {/* Desktop table skeleton */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-8 border-b border-gray-100 bg-gray-50/75 px-4 py-3">
            <div className="skeleton h-4 flex-[2.5]" />
            <div className="skeleton h-4 flex-[1.2]" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-5 flex-1 rounded-full" />
            <div className="skeleton h-4 flex-[1.2]" />
          </div>
          {Array.from({ length: 6 }).map((_, r) => (
            <div key={r} className="flex items-center gap-8 border-b border-gray-100 px-4 py-3.5 last:border-0">
              <div className="skeleton h-4 flex-[2.5]" />
              <div className="skeleton h-4 flex-[1.2]" />
              <div className="skeleton h-4 flex-1" />
              <div className="skeleton h-5 flex-1 rounded-full" />
              <div className="flex flex-[1.2] justify-end gap-1.5">
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
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-24" />
                </div>
                <div className="skeleton h-5 w-16 shrink-0 rounded-full" />
              </div>
              <div className="skeleton mt-3 h-3 w-28" />
              <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
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
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Artikel</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola, tulis, dan publish artikel</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreateError("");
            setCreateOpen(true);
          }}
          className="min-h-10 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-primary-dark"
        >
          + Tulis Artikel
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
        {articles.length === 0 ? (
          <div className="px-4 py-16 text-center text-gray-500">Belum ada artikel.</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/75">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Judul</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Penulis</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Topik</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map((a) => (
                    <tr key={a.id} className="transition hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openPreview(a)}
                          className="text-left font-medium text-gray-900 hover:text-primary transition-colors"
                        >
                          {a.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.author.name}</td>
                      <td className="px-4 py-3 text-gray-600">{a.topic}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(a.status)}`}>
                          {statusLabel(a.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openPreview(a)}
                            className="min-h-9 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 lg:min-h-0 lg:px-2.5 lg:py-1"
                          >
                            Lihat
                          </button>
                          {a.status === "submitted" && (
                            <button
                              type="button"
                              onClick={() => openPreview(a)}
                              className="min-h-9 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-primary-dark lg:min-h-0 lg:px-2.5 lg:py-1"
                            >
                              Review
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleAction(a.id, "delete")}
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
              {articles.map((a) => (
                <article key={a.id} className="rounded-xl border border-gray-200/80 p-4 bg-white shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => openPreview(a)}
                        className="line-clamp-2 min-h-11 text-left text-sm font-semibold leading-5 text-gray-900 hover:text-primary transition-colors"
                      >
                        {a.title}
                      </button>
                      <p className="mt-1 truncate text-xs text-gray-500">{a.author.name}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass(a.status)}`}>
                      {statusLabel(a.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">Topik: {a.topic}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                    <button
                      type="button"
                      onClick={() => openPreview(a)}
                      className="min-h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                    >
                      Lihat artikel
                    </button>
                    {a.status === "submitted" && (
                      <button
                        type="button"
                        onClick={() => openPreview(a)}
                        className="min-h-10 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-primary-dark"
                      >
                        Review
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleAction(a.id, "delete")}
                      className="min-h-10 rounded-lg border border-red-200/60 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
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

      {(preview || previewLoading) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => !actionLoading && setPreview(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {previewLoading ? <span className="skeleton inline-block h-5 w-40" /> : preview?.title}
                </h2>
                {preview && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>{preview.author?.name}</span>
                    <span>·</span>
                    <span>{preview.topic}</span>
                    <span>·</span>
                    <span className={statusClass(preview.status) + " px-2 py-0.5 rounded-full font-medium text-[11px]"}>
                      {statusLabel(preview.status)}
                    </span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                disabled={actionLoading}
                className="text-gray-400 hover:text-gray-600 text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto flex-1">
              {previewLoading && (
                <div className="space-y-4 py-4">
                  <div className="skeleton h-44 w-full rounded-lg" />
                  <div className="skeleton h-6 w-2/3" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-4/5" />
                </div>
              )}
              {preview && (
                <>
                  {preview.imageUrl && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${preview.imageUrl}`}
                      alt=""
                      className="w-full max-h-48 object-cover rounded-xl mb-4 border border-gray-100"
                    />
                  )}
                  {preview.excerpt && (
                    <p className="text-sm text-gray-500 italic mb-4 border-l-2 border-primary/30 pl-3">
                      {preview.excerpt}
                    </p>
                  )}
                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {preview.content}
                  </div>
                </>
              )}
            </div>

            {preview && (
              <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-2 justify-end bg-gray-50/75">
                {preview.status === "submitted" && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction(preview.id, "reject")}
                      className="px-3.5 py-2 text-sm font-medium border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition disabled:opacity-50"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction(preview.id, "approve")}
                      className="px-3.5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark shadow-xs transition disabled:opacity-50"
                    >
                      {actionLoading ? "Memproses..." : "Publish"}
                    </button>
                  </>
                )}
                {preview.status === "published" && (
                  <p className="text-sm text-primary font-medium self-center mr-auto">Artikel sudah dipublish.</p>
                )}
                {preview.status === "draft" && (
                  <p className="text-sm text-gray-600 font-medium self-center mr-auto">Artikel ditolak / draft.</p>
                )}
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setPreview(null)}
                  className="px-3.5 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Article Modal */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => !createLoading && setCreateOpen(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Tulis Artikel Baru</h2>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                disabled={createLoading}
                className="text-gray-400 hover:text-gray-600 text-sm shrink-0"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{createError}</div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Judul *</label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Judul artikel"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Topik</label>
                  <select
                    value={createForm.topic}
                    onChange={(e) => setCreateForm({ ...createForm, topic: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Pernikahan">Pernikahan</option>
                    <option value="Hukum Waris">Hukum Waris</option>
                    <option value="Perlindungan Anak">Perlindungan Anak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={createForm.tags}
                    onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                    placeholder="hukum-keluarga, islam"
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Thumbnail</label>
                <div className="flex items-center gap-3">
                  {createForm.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${createForm.imageUrl}`}
                      alt="preview"
                      className="h-14 w-20 rounded-lg border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="h-14 w-20 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400">
                      No Foto
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="create-article-image"
                      onChange={handleCreateImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("create-article-image")?.click()}
                      disabled={uploadingImage}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      {uploadingImage ? "Mengunggah..." : createForm.imageUrl ? "Ganti Foto" : "Pilih Foto"}
                    </button>
                    {createForm.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, imageUrl: "" })}
                        className="ml-2 text-xs text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Excerpt (ringkasan)</label>
                <textarea
                  rows={2}
                  value={createForm.excerpt}
                  onChange={(e) => setCreateForm({ ...createForm, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat artikel"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Konten *</label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <input
                    type="file"
                    accept=".docx,.txt,.pdf"
                    className="hidden"
                    id="create-article-doc"
                    onChange={handleCreateDocUpload}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("create-article-doc")?.click()}
                    disabled={uploadingDoc}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {uploadingDoc ? "Mengekstrak..." : "Upload Word/PDF"}
                  </button>
                  {uploadedDocName && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 max-w-[240px] truncate">
                      ✓ {uploadedDocName}
                    </span>
                  )}
                </div>
                <textarea
                  rows={10}
                  required
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  placeholder="Tulis isi artikel di sini, atau upload file Word/PDF untuk isi otomatis..."
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none font-mono leading-relaxed"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Upload .docx/.pdf/.txt — teksnya otomatis masuk ke kolom konten, lalu bisa diedit. File tidak disimpan di server.
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={createForm.publishNow}
                  onChange={(e) => setCreateForm({ ...createForm, publishNow: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Langsung publish setelah disimpan
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createLoading || uploadingImage}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {createLoading ? "Menyimpan..." : "Simpan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
