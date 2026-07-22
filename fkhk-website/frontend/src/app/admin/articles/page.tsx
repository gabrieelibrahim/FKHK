"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setArticles(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: number, action: "publish" | "delete") => {
    if (action === "delete" && !confirm("Hapus artikel ini?")) return;
    const token = document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];
    if (action === "publish") {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}/publish`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    }
    if (action === "delete") {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } else {
      setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status: "published" } : a)));
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
          <p className="text-sm text-gray-500 mt-1">Kelola artikel anggota FKHK</p>
        </div>
      </div>

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
                    <Link href={`/articles/${a.slug}`} className="font-medium text-gray-900 hover:text-primary">{a.title}</Link>
                    <p className="text-xs text-gray-400 mt-0.5 md:hidden">{a.author.name}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{a.author.name}</td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{a.topic}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-1 justify-end">
                      {a.status !== "published" && (
                        <button onClick={() => handleAction(a.id, "publish")} className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition">Publish</button>
                      )}
                      <button onClick={() => handleAction(a.id, "delete")} className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
