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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">Baca dulu isi artikel, baru publish</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {articles.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Belum ada artikel.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Judul</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Penulis</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Topik</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => openPreview(a)}
                      className="font-medium text-gray-900 hover:text-primary text-left"
                    >
                      {a.title}
                    </button>
                    <p className="text-xs text-gray-400 mt-0.5 md:hidden">{a.author.name}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{a.author.name}</td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{a.topic}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(a.status)}`}>
                      {statusLabel(a.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => openPreview(a)}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                      >
                        Lihat
                      </button>
                      {a.status === "submitted" && (
                        <button
                          type="button"
                          onClick={() => openPreview(a)}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition"
                        >
                          Review
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAction(a.id, "delete")}
                        className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
