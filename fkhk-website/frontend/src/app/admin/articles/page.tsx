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
  if (status === "published") return "bg-green-100 text-green-700";
  if (status === "submitted") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
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
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Artikel</h1>
          <p className="mt-1 text-sm text-gray-500">Baca dulu isi artikel, baru publish</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:rounded-xl">
        {articles.length === 0 ? (
          <div className="px-4 py-16 text-center text-gray-500">Belum ada artikel.</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Judul</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Penulis</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Topik</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openPreview(a)}
                          className="text-left font-medium text-gray-900 hover:text-primary"
                        >
                          {a.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.author.name}</td>
                      <td className="px-4 py-3 text-gray-600">{a.topic}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(a.status)}`}>
                          {statusLabel(a.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openPreview(a)}
                            className="min-h-9 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200 lg:min-h-0 lg:rounded-md lg:px-2.5 lg:py-1"
                          >
                            Lihat
                          </button>
                          {a.status === "submitted" && (
                            <button
                              type="button"
                              onClick={() => openPreview(a)}
                              className="min-h-9 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 transition hover:bg-emerald-100 lg:min-h-0 lg:rounded-md lg:px-2.5 lg:py-1"
                            >
                              Review
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleAction(a.id, "delete")}
                            className="min-h-9 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 lg:min-h-0 lg:rounded-md lg:px-2.5 lg:py-1"
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

            <div className="grid gap-3 p-3 lg:hidden sm:p-4">
              {articles.map((a) => (
                <article key={a.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => openPreview(a)}
                        className="line-clamp-2 min-h-11 text-left text-sm font-semibold leading-5 text-gray-900 hover:text-primary"
                      >
                        {a.title}
                      </button>
                      <p className="mt-1 truncate text-xs text-gray-500">{a.author.name}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${statusClass(a.status)}`}>
                      {statusLabel(a.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">Topik: {a.topic}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                    <button
                      type="button"
                      onClick={() => openPreview(a)}
                      className="min-h-10 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                      Lihat artikel
                    </button>
                    {a.status === "submitted" && (
                      <button
                        type="button"
                        onClick={() => openPreview(a)}
                        className="min-h-10 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 transition hover:bg-emerald-100"
                      >
                        Review
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleAction(a.id, "delete")}
                      className="min-h-10 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !actionLoading && setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {previewLoading ? "Memuat..." : preview?.title}
                </h2>
                {preview && (
                  <p className="text-xs text-gray-500 mt-1">
                    {preview.author?.name} · {preview.topic} ·{" "}
                    <span className={statusClass(preview.status) + " px-1.5 py-0.5 rounded-full font-medium"}>
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
                Tutup
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto flex-1">
              {previewLoading && (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
              <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-2 justify-end bg-gray-50">
                {preview.status === "submitted" && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction(preview.id, "reject")}
                      className="px-3 py-2 text-sm font-medium bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition disabled:opacity-50"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAction(preview.id, "approve")}
                      className="px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      {actionLoading ? "Memproses..." : "Publish"}
                    </button>
                  </>
                )}
                {preview.status === "published" && (
                  <p className="text-sm text-green-700 self-center mr-auto">Artikel sudah dipublish.</p>
                )}
                {preview.status === "draft" && (
                  <p className="text-sm text-yellow-700 self-center mr-auto">Artikel ditolak / draft.</p>
                )}
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setPreview(null)}
                  className="px-3 py-2 text-sm font-medium bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
