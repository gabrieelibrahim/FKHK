"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  topic: string;
  tags: string[];
  status: string;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  author: { id: number; name: string; email: string; affiliation: string; avatarUrl: string };
}

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-500">Artikel tidak ditemukan.</p>
        <Link href="/articles" className="text-primary hover:underline">Kembali ke artikel</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/articles" className="text-sm text-gray-500 hover:text-primary mb-6 inline-flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke artikel
        </Link>

        <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.topic}</span>
            <span className="text-xs text-gray-400">
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : ""}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{article.author.name}</p>
              {article.author.affiliation && <p className="text-sm text-gray-500">{article.author.affiliation}</p>}
            </div>
          </div>

          {article.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${article.imageUrl}`}
                alt={article.title}
                className="w-full max-h-[400px] object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          )}

          <div className="prose prose-gray max-w-none leading-relaxed whitespace-pre-wrap">{article.content}</div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-400 mt-4">{article.viewCount} dilihat</div>
        </article>
      </div>
    </main>
  );
}
