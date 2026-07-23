"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string;
  topic: string;
  status: string;
  viewCount: number;
  publishedAt: string;
  author: { name: string; affiliation: string };
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (topic) params.set("topic", topic);
    if (search) params.set("search", search);
    params.set("limit", "20");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?${params}`)
      .then((r) => r.json())
      .then((d) => setArticles(d.data || []))
      .finally(() => setLoading(false));
  }, [topic, search]);

  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">Artikel</h1>

        <div className="flex gap-4 mb-8 flex-wrap">
          <input
            type="text"
            placeholder="Cari artikel..."
            className="px-4 py-2 border border-gray-300 rounded-lg flex-1 min-w-[200px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">Semua Topik</option>
            <option value="Pernikahan">Pernikahan</option>
            <option value="Hukum Waris">Hukum Waris</option>
            <option value="Perlindungan Anak">Perlindungan Anak</option>
            <option value="General">General</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada artikel.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group"
              >
                {a.imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${a.imageUrl}`}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {a.topic}
                    </span>
                    <span className="text-xs text-gray-400">
                      {a.publishedAt
                        ? new Date(a.publishedAt).toLocaleDateString("id-ID")
                        : ""}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{a.author.name}</span>
                    <span>{a.viewCount} dilihat</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
