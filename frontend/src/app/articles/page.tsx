import type { Metadata } from "next";
import Link from "next/link";
import { fetchPublishedArticles } from "@/lib/articles";
import { getSiteUrl, mediaUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Artikel",
  description:
    "Kumpulan artikel kajian Hukum Keluarga Islam dari Forum Kajian Hukum Keluarga (FKHK).",
  alternates: { canonical: `${getSiteUrl()}/articles` },
  openGraph: {
    title: "Artikel | FKHK",
    description:
      "Kumpulan artikel kajian Hukum Keluarga Islam dari Forum Kajian Hukum Keluarga (FKHK).",
    url: `${getSiteUrl()}/articles`,
    locale: "id_ID",
    type: "website",
  },
};

type Props = {
  searchParams: { topic?: string; search?: string; page?: string };
};

const TOPICS = ["Pernikahan", "Hukum Waris", "Perlindungan Anak", "General"];

export default async function ArticlesPage({ searchParams }: Props) {
  const topic = searchParams.topic || "";
  const search = searchParams.search || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const { data: articles, totalPages } = await fetchPublishedArticles({
    topic: topic || undefined,
    search: search || undefined,
    page,
    limit: 20,
  });

  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">Artikel</h1>

        <form method="get" className="flex gap-4 mb-8 flex-wrap">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Cari artikel..."
            className="px-4 py-2 border border-gray-300 rounded-lg flex-1 min-w-[200px]"
          />
          <select
            name="topic"
            defaultValue={topic}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Semua Topik</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90"
          >
            Cari
          </button>
        </form>

        {articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Belum ada artikel.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => {
              const image = mediaUrl(a.imageUrl);
              return (
                <Link
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md group"
                >
                  {image && (
                    <div className="h-40 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
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
                    <h2 className="mb-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-gray-900">
                      {a.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{a.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{a.author.name}</span>
                      <span>{a.viewCount} dilihat</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/articles?${new URLSearchParams({
                  ...(search ? { search } : {}),
                  ...(topic ? { topic } : {}),
                  page: String(page - 1),
                }).toString()}`}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-white"
              >
                Sebelumnya
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-gray-500">
              Halaman {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/articles?${new URLSearchParams({
                  ...(search ? { search } : {}),
                  ...(topic ? { topic } : {}),
                  page: String(page + 1),
                }).toString()}`}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-white"
              >
                Berikutnya
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
