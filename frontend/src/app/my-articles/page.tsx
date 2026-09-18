"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";

interface Article {
  id: number;
  title: string;
  slug: string;
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

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?mine=true&limit=50`, {
      headers: { Authorization: `Bearer ${document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1]}` },
    })
      .then((r) => r.json())
      .then((d) => setArticles(d.data || []))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Reveal variant="fade-up">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">Artikel Saya</h1>
            <motion.a
              href="/articles/submit"
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              + Tulis Artikel
            </motion.a>
          </div>
        </Reveal>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="skeleton h-5 w-3/4 mb-2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Reveal>
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 0v3.375a3.375 3.375 0 003.375 3.375h3.375m-4.5 15v-3.375a3.375 3.375 0 013.375-3.375H21m-3.375 0h.375m-6.75 0h.375m-6 0h.375" /></svg>
              <p className="text-gray-500 mb-4">Belum ada artikel.</p>
              <Link href="/articles/submit" className="text-primary hover:underline">Tulis artikel pertama</Link>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {articles.map((a, i) => (
              <Reveal key={a.id} variant="fade-up" delay={i * 0.05}>
                <motion.div whileHover={{ x: 3 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <Link href={`/articles/${a.slug}`} className="text-lg font-semibold text-gray-900 hover:text-primary">{a.title}</Link>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{a.topic}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === "published" ? "bg-green-100 text-green-700" : a.status === "draft" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{a.status}</span>
                      <span>{a.viewCount} dilihat</span>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
