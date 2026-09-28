"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Comment {
  id: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
  member: { id: number; name: string; email: string };
  article: { id: number; title: string; slug: string };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [counts, setCounts] = useState({ pending: 0, approved: 0 });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("fkhk_token="))
      ?.split("=")[1];

  const loadComments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments?${params}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setComments(d.data || []);
        if (d.counts) setCounts(d.counts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const approve = async (id: number) => {
    setActionLoading(id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      loadComments();
    } finally {
      setActionLoading(null);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Hapus komentar ini?")) return;
    setActionLoading(id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      loadComments();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Moderasi Komentar</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === "pending" ? "bg-amber-500 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Menunggu ({counts.pending})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === "approved" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Disetujui ({counts.approved})
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === "all" ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8m-8 4h5" />
          </svg>
          <p className="text-gray-500">Tidak ada komentar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-medium text-gray-900">{c.member?.name}</span>
                    <span className="text-xs text-gray-400">{c.member?.email}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <a
                      href={`/articles/${c.article?.slug}`}
                      className="text-xs text-primary hover:underline truncate max-w-[200px]"
                    >
                      {c.article?.title}
                    </a>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {!c.isApproved && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                        Menunggu
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                    {c.content}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!c.isApproved && (
                    <button
                      onClick={() => approve(c.id)}
                      disabled={actionLoading === c.id}
                      className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      Setujui
                    </button>
                  )}
                  <button
                    onClick={() => remove(c.id)}
                    disabled={actionLoading === c.id}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 disabled:opacity-50 transition border border-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
