import type { Metadata } from "next";
import Link from "next/link";
import { fetchPublishedArticles } from "@/lib/articles";
import { mediaUrl, getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Arsip Artikel & Kajian Ilmiah | FKHK",
  description:
    "Indeks publikasi, opini hukum, dan riset akademik Forum Kajian Hukum Keluarga Islam.",
  alternates: { canonical: `${getSiteUrl()}/articles` },
  openGraph: {
    title: "Arsip Artikel & Kajian Ilmiah | FKHK",
    description:
      "Indeks publikasi, opini hukum, dan riset akademik Forum Kajian Hukum Keluarga Islam.",
    url: `${getSiteUrl()}/articles`,
    locale: "id_ID",
    type: "website",
  },
};

type Props = {
  searchParams: { topic?: string; search?: string; page?: string };
};

const TOPICS = [
  { id: "", label: "Semua Bidang" },
  { id: "Pernikahan", label: "Pernikahan" },
  { id: "Hukum Waris", label: "Hukum Waris" },
  { id: "Perlindungan Anak", label: "Perlindungan Anak" },
  { id: "General", label: "Kajian Umum" },
];

export default async function ArticlesPage({ searchParams }: Props) {
  const currentTopic = searchParams.topic || "";
  const currentSearch = searchParams.search || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const { data: articles, totalPages, total } = await fetchPublishedArticles({
    topic: currentTopic || undefined,
    search: currentSearch || undefined,
    page,
    limit: 12,
  });

  return (
    <div className="pt-[68px] min-h-screen bg-[#FCFAF8] text-zinc-900">
      {/* Editorial Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 max-w-5xl pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block mb-2">
                Publikasi & Riset
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950 font-serif leading-tight">
                Arsip Artikel & Kajian Ilmiah
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
                Kumpulan tulisan ilmiah, analisis regulasi, dan telaah yurisprudensi mahasiswa serta akademisi Forum Kajian Hukum Keluarga.
              </p>
            </div>

            {/* Live Counter Info */}
            <div className="border-l-2 border-[#2C5857] pl-3 py-0.5 text-xs text-zinc-600 shrink-0">
              <p className="font-semibold text-zinc-900">{total !== undefined ? `${total} Dokumen` : "Indeks Aktif"}</p>
              <p className="text-zinc-500">Terbuka untuk civitas akademik</p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="border-t border-zinc-100 bg-[#FAF7F2]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
              {/* Category Segmented Controls */}
              <nav aria-label="Kategori Kajian" className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {TOPICS.map((t) => {
                  const isActive = currentTopic === t.id;
                  const params = new URLSearchParams();
                  if (t.id) params.set("topic", t.id);
                  if (currentSearch) params.set("search", currentSearch);
                  const href = `/articles${params.toString() ? `?${params.toString()}` : ""}`;

                  return (
                    <Link
                      key={t.id}
                      href={href}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                        isActive
                          ? "bg-[#2C5857] text-white"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
                      }`}
                    >
                      {t.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Integrated Search Input */}
              <form method="get" className="relative flex items-center w-full sm:w-64">
                {currentTopic && <input type="hidden" name="topic" value={currentTopic} />}
                <div className="absolute left-2.5 text-zinc-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  defaultValue={currentSearch}
                  placeholder="Cari judul atau topik..."
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-zinc-300 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] transition"
                />
                {currentSearch && (
                  <Link
                    href={currentTopic ? `/articles?topic=${currentTopic}` : "/articles"}
                    className="absolute right-2 text-zinc-400 hover:text-zinc-700 p-0.5 text-xs leading-none"
                    title="Hapus pencarian"
                  >
                    ×
                  </Link>
                )}
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content List */}
      <main className="container mx-auto px-4 max-w-5xl py-8 sm:py-12">
        {/* Active Filter State Notice */}
        {(currentTopic || currentSearch) && (
          <div className="mb-6 flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-200 pb-3">
            <p>
              Hasil filter:{" "}
              {currentTopic && <span className="font-semibold text-zinc-900">{currentTopic}</span>}
              {currentTopic && currentSearch && " dan "}
              {currentSearch && <span className="font-semibold text-zinc-900">&quot;{currentSearch}&quot;</span>}
              {total !== undefined && ` (${total} artikel)`}
            </p>
            <Link href="/articles" className="text-[#2C5857] hover:underline font-medium">
              Reset filter
            </Link>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="py-14 text-center border-t border-b border-zinc-200 bg-white px-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-2 font-serif">
              Belum ada artikel publikasi
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
              {currentSearch || currentTopic
                ? "Tidak ditemukan artikel yang sesuai dengan filter atau kata kunci pencarian."
                : "Naskah kajian ilmiah dan telaah hukum terbaru sedang dalam proses peninjauan redaksi."}
            </p>
            {(currentSearch || currentTopic) && (
              <div className="mt-5">
                <Link
                  href="/articles"
                  className="inline-flex items-center px-4 py-2 border border-zinc-300 rounded-md bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition"
                >
                  Kembali ke Semua Artikel
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200 bg-white">
            {articles.map((a) => {
              const image = mediaUrl(a.imageUrl);
              const dateStr = a.publishedAt
                ? new Date(a.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Terbaru";

              return (
                <article key={a.id} className="group p-5 sm:p-6 transition hover:bg-zinc-50/70">
                  <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                        <span className="font-medium text-[#2C5857]">{a.topic || "Kajian"}</span>
                        <span>•</span>
                        <time dateTime={a.publishedAt || ""}>{dateStr}</time>
                        <span>•</span>
                        <span>{a.readingMinutes ? `${a.readingMinutes} menit` : "4 menit baca"}</span>
                      </div>

                      <h2 className="text-base sm:text-lg font-semibold text-zinc-950 font-serif leading-snug group-hover:text-[#2C5857] transition-colors mb-2">
                        <Link href={`/articles/${a.slug}`} className="focus:outline-none">
                          {a.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed mb-4">
                        {a.excerpt || "Klik untuk membaca telaah ilmiah selengkapnya..."}
                      </p>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                        <span className="font-medium text-zinc-700">
                          Oleh {a.author?.name || "Redaksi FKHK"}
                        </span>
                        <Link
                          href={`/articles/${a.slug}`}
                          className="font-medium text-[#2C5857] hover:underline inline-flex items-center gap-1"
                        >
                          Baca Selengkapnya
                        </Link>
                      </div>
                    </div>

                    {image && (
                      <Link href={`/articles/${a.slug}`} className="sm:w-44 sm:h-28 shrink-0 overflow-hidden rounded-md bg-zinc-100 border border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Minimal Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8 pt-4">
            {page > 1 && (
              <Link
                href={`/articles?${new URLSearchParams({
                  ...(currentSearch ? { search: currentSearch } : {}),
                  ...(currentTopic ? { topic: currentTopic } : {}),
                  page: String(page - 1),
                }).toString()}`}
                className="px-3 py-1.5 border border-zinc-300 bg-white rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                Sebelumnya
              </Link>
            )}
            <span className="text-xs text-zinc-500">
              Halaman {page} dari {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/articles?${new URLSearchParams({
                  ...(currentSearch ? { search: currentSearch } : {}),
                  ...(currentTopic ? { topic: currentTopic } : {}),
                  page: String(page + 1),
                }).toString()}`}
                className="px-3 py-1.5 border border-zinc-300 bg-white rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition"
              >
                Selanjutnya
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
