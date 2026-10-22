"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";

interface Article {
  id: number;
  title: string;
  slug: string;
  imageUrl?: string;
  status: string;
  topic: string;
  viewCount: number;
  createdAt: string;
  publishedAt: string;
}

export default function MyArticlesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // edit modal state
  const [editModal, setEditModal] = useState<{ open: boolean; article: Article | null }>({ open: false, article: null });
  const [editUploading, setEditUploading] = useState(false);
  const [editPreview, setEditPreview] = useState("");
  const [editError, setEditError] = useState("");
  const editFileRef = useRef<HTMLInputElement>(null);

  const fetchArticles = () => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?mine=true&limit=50`, {
      headers: { Authorization: `Bearer ${document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1]}` },
    })
      .then((r) => r.json())
      .then((d) => setArticles(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, [authLoading, isAuthenticated, router, refreshKey]);

  useEffect(() => {
    const onFocus = () => setRefreshKey((k) => k + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleEditUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    setEditError("");
    try {
      const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal upload");
      setEditPreview(data.url);

      // langsung update ke backend
      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${editModal.article!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl: data.url }),
      });
      if (!updateRes.ok) throw new Error("Gagal update thumbnail");
      setEditModal({ open: false, article: null });
      setEditPreview("");
      fetchArticles();
    } catch (err: any) {
      setEditError(err.message);
    } finally { setEditUploading(false); }
  };

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div>
      <Reveal variant="fade-up">
        <div className="flex items-center justify-between gap-3 mb-5 lg:mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Artikel Saya</h1>
            <p className="mt-1 text-sm text-gray-500">Kelola artikel dan pantau status publikasi</p>
          </div>
          <Link
            href="/dashboard/submit"
            className="px-3.5 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shadow-xs transition"
          >
            + Tulis Artikel
          </Link>
        </div>
      </Reveal>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs">
              <div className="skeleton h-5 w-3/4 mb-2" />
              <div className="skeleton h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Reveal>
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200/80 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="text-gray-500 mb-4 text-sm">Belum ada artikel yang kamu kirim.</p>
            <Link href="/dashboard/submit" className="text-sm font-medium text-primary hover:underline">Tulis artikel pertama</Link>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-3">
          {articles.map((a, i) => (
            <Reveal key={a.id} variant="fade-up" delay={i * 0.04}>
              <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden hover:border-gray-300 transition">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* thumbnail preview */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200/60">
                      {a.imageUrl ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${a.imageUrl}`}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1} stroke='currentColor' class='w-6 h-6 text-gray-300'><path strokeLinecap='round' strokeLinejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'/></svg>`; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/articles/${a.slug}`} className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors block truncate">{a.title}</Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{a.topic}</span>
                        <span>·</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            a.status === "published"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : a.status === "submitted"
                                ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                                : a.status === "draft"
                                  ? "bg-gray-100 text-gray-700 border border-gray-200/80"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {a.status === "published"
                            ? "Dipublish"
                            : a.status === "submitted"
                              ? "Menunggu publish"
                              : a.status === "draft"
                                ? "Ditolak"
                                : a.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center gap-2 sm:justify-end">
                    {a.status === "draft" && (
                      <button
                        onClick={async () => {
                          const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
                          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${a.id}/submit`, {
                            method: "PUT",
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          setRefreshKey((k) => k + 1);
                        }}
                        className="flex-1 sm:flex-none min-h-9 px-3.5 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-xs shrink-0"
                      >
                        Kirim ulang
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditModal({ open: true, article: a });
                        setEditPreview(a.imageUrl || "");
                        setEditError("");
                      }}
                      className="flex-1 sm:flex-none min-h-9 px-3.5 py-1.5 text-xs font-medium border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition flex-shrink-0"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Edit Thumbnail Modal */}
      {editModal.open && editModal.article && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={() => setEditModal({ open: false, article: null })}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Ganti Thumbnail</h3>
            <p className="text-xs text-gray-500 mb-4 truncate">{editModal.article.title}</p>

            {editError && <p className="text-sm text-red-600 mb-3">{editError}</p>}

            {/* preview */}
            <div className="h-32 bg-gray-50 rounded-lg overflow-hidden mb-4 flex items-center justify-center border border-gray-200/80">
              {editPreview ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${editPreview}`}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).parentElement!.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1} stroke='currentColor' class='w-8 h-8 text-gray-300'><path strokeLinecap='round' strokeLinejoin='round' d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'/></svg>`; }}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              )}
            </div>

            <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={handleEditUpload} />
            <button
              type="button"
              onClick={() => editFileRef.current?.click()}
              disabled={editUploading}
              className="w-full py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-xs disabled:opacity-50"
            >
              {editUploading ? "Mengupload..." : "Pilih & Upload Foto"}
            </button>

            <button
              onClick={() => setEditModal({ open: false, article: null })}
              className="w-full mt-2 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
