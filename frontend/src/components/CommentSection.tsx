"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import ShareButtons from "./ShareButtons";

interface Comment {
  id: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
  member: { id: number; name: string; affiliation?: string };
}

function getToken() {
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith("fkhk_token="))
    ?.split("=")[1];
}

export default function CommentSection({
  articleId,
  shareUrl,
  articleTitle,
}: {
  articleId: number;
  shareUrl: string;
  articleTitle: string;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadComments = useCallback(() => {
    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/article/${articleId}`, { headers })
      .then((r) => r.json())
      .then((d) => setComments(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleId]);

  useEffect(() => {
    if (!authLoading) loadComments();
  }, [authLoading, loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/article/${articleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim komentar");
      setContent("");
      setNotice({ type: "ok", text: data.message || "Komentar terkirim, menunggu moderasi." });
      loadComments();
    } catch (err: any) {
      setNotice({ type: "err", text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-8">
      {/* Share */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <ShareButtons url={shareUrl} title={articleTitle} />
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Komentar {comments.length > 0 && <span className="text-gray-400 font-normal">({comments.length})</span>}
        </h2>

        {/* Form */}
        {!authLoading && isAuthenticated ? (
          <form onSubmit={handleSubmit} className="mb-8">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis komentarmu..."
              rows={3}
              maxLength={1000}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{content.length}/1000</span>
              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {sending ? "Mengirim..." : "Kirim Komentar"}
              </button>
            </div>
            {notice && (
              <div
                className={`mt-3 rounded-xl border p-3 text-sm ${
                  notice.type === "ok"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {notice.text}
              </div>
            )}
          </form>
        ) : !authLoading ? (
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 text-center">
            <a href="/auth/login" className="text-primary font-medium hover:underline">
              Masuk
            </a>{" "}
            untuk ikut berkomentar.
          </div>
        ) : null}

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Belum ada komentar. Jadilah yang pertama!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {c.member?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{c.member?.name}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {!c.isApproved && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                        Menunggu moderasi
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
