"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Reveal from "../Reveal";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  topic: string;
  publishedAt: string;
  author: { name: string };
  imageUrl?: string;
}

export default function ArticlesSlider() {
  const [articles, setArticles] = useState<Article[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles?limit=5`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) setArticles(d.data);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const displayArticles = articles;

  const slide = (dir: number) => {
    if (sliderRef.current) {
      const cardWidth = 320;
      sliderRef.current.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24" id="artikel">
      <div className="container mx-auto px-4 max-w-[1240px]">
        <div className="flex items-end justify-between mb-10">
          <Reveal variant="fade-left">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Artikel Terbaru
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-2">
              Karya Terbaru dari<br />Anggota FKHK
            </h2>
          </Reveal>
          <Reveal variant="fade-right">
            <Link
              href="/articles"
              className="hidden sm:inline-flex px-5 py-2.5 bg-[#1a2e2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4545] transition no-underline"
            >
              Lihat Semua
            </Link>
          </Reveal>
        </div>

        {displayArticles.length > 0 && (
        <Reveal variant="fade-up">
          <div className="relative">
            <button
              onClick={() => slide(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Sebelumnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1a2e2e" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => slide(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Selanjutnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1a2e2e" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayArticles.map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  className="flex-shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1 group snap-start no-underline"
                >
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    {a.imageUrl ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}${a.imageUrl}`} alt={a.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-accent">{a.topic}</span>
                      <span className="text-xs text-gray-400">
                        {a.publishedAt
                          ? new Date(a.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                          : ""}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                      {a.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem] font-semibold text-primary">
                        {a.author.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                      </div>
                      <span className="text-xs text-gray-500">{a.author.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
        )}

        {displayArticles.length > 0 && (
        <div className="text-center mt-6 sm:hidden">
          <Link
            href="/articles"
            className="inline-flex px-5 py-2.5 bg-[#1a2e2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2a4545] transition no-underline"
          >
            Lihat Semua Artikel
          </Link>
        </div>
        )}
      </div>
    </section>
  );
}
