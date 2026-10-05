import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublishedArticles } from "@/lib/articles";
import { mediaUrl, getSiteUrl } from "@/lib/site";

type Props = {
  params: { locale: string };
  searchParams: { topic?: string; search?: string; page?: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "articlesPage" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { canonical: `${getSiteUrl()}/articles` },
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: `${getSiteUrl()}/articles`,
      locale: locale === "en" ? "en_US" : locale === "ar" ? "ar_AR" : "id_ID",
      type: "website",
    },
  };
}

export default async function ArticlesPage({ params: { locale }, searchParams }: Props) {
  const t = await getTranslations({ locale, namespace: "articlesPage" });

  const TOPICS = [
    { id: "", label: t("tabAll") },
    { id: "Pernikahan", label: t("tabPernikahan") },
    { id: "Hukum Waris", label: t("tabWaris") },
    { id: "Perlindungan Anak", label: t("tabAnak") },
    { id: "General", label: t("tabUmum") },
  ];

  const currentTopic = searchParams.topic || "";
  const currentSearch = searchParams.search || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const { data: articles, totalPages, total } = await fetchPublishedArticles({
    topic: currentTopic || undefined,
    search: currentSearch || undefined,
    page,
    limit: 12,
  });

  const dateLocale = locale === "en" ? "en-US" : locale === "ar" ? "ar-SA" : "id-ID";

  return (
    <div className="pt-[68px] min-h-screen bg-[#FCFAF8] text-zinc-900">
      {/* Editorial Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 max-w-5xl pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block mb-2">
                Publikasi &amp; Riset
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950 font-serif leading-tight">
                {t("title")}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
                {t("subtitle")}
              </p>
            </div>

            {/* Live Counter Info */}
            <div className="border-l-2 border-[#2C5857] pl-3 py-0.5 text-xs text-zinc-600 shrink-0">
              <p className="font-semibold text-zinc-900">
                {total !== undefined
                  ? `${total} ${locale === "en" ? "Articles" : locale === "ar" ? "مقالة" : "Dokumen"}`
                  : "Indeks Aktif"}
              </p>
              <p className="text-zinc-500">
                {locale === "en"
                  ? "Open for academic community"
                  : locale === "ar"
                  ? "متاح للباحثين والطلاب"
                  : "Terbuka untuk civitas akademik"}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="border-t border-zinc-100 bg-[#FAF7F2]">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
              {/* Category Segmented Controls */}
              <nav aria-label="Kategori Kajian" className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {TOPICS.map((item) => {
                  const isActive = currentTopic === item.id;
                  const params = new URLSearchParams();
                  if (item.id) params.set("topic", item.id);
                  if (currentSearch) params.set("search", currentSearch);
                  const href = `/articles${params.toString() ? `?${params.toString()}` : ""}`;

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors no-underline ${
                        isActive
                          ? "bg-[#2C5857] text-white"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"
                      }`}
                    >
                      {item.label}
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
                  placeholder={t("searchPlaceholder")}
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-zinc-300 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2C5857] focus:ring-1 focus:ring-[#2C5857] transition"
                />
                {currentSearch && (
                  <Link
                    href={currentTopic ? `/articles?topic=${currentTopic}` : "/articles"}
                    className="absolute right-2 text-zinc-400 hover:text-zinc-700 p-0.5 text-xs leading-none no-underline"
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
              {locale === "en" ? "Filter results: " : locale === "ar" ? "نتائج التصفية: " : "Hasil filter: "}
              {currentTopic && <span className="font-semibold text-zinc-900">{currentTopic}</span>}
              {currentTopic && currentSearch && " & "}
              {currentSearch && <span className="font-semibold text-zinc-900">&quot;{currentSearch}&quot;</span>}
              {total !== undefined && ` (${total} ${locale === "en" ? "articles" : locale === "ar" ? "مقالة" : "artikel"})`}
            </p>
            <Link href="/articles" className="text-[#2C5857] hover:underline font-medium no-underline">
              Reset
            </Link>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="py-14 text-center border-t border-b border-zinc-200 bg-white px-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-2 font-serif">
              {t("empty")}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
              {currentSearch || currentTopic
                ? locale === "en"
                  ? "No articles matched your search or filter combination."
                  : locale === "ar"
                  ? "لم يتم العثور على مقالات تطابق معايير البحث."
                  : "Tidak ditemukan artikel yang sesuai dengan filter atau kata kunci pencarian."
                : locale === "en"
                ? "Academic articles and legal reviews are currently being prepared by the editorial board."
                : locale === "ar"
                ? "المقالات والبحوث القانونية قيد المراجعة والتحرير."
                : "Naskah kajian ilmiah dan telaah hukum terbaru sedang dalam proses peninjauan redaksi."}
            </p>
            {(currentSearch || currentTopic) && (
              <div className="mt-5">
                <Link
                  href="/articles"
                  className="inline-flex items-center px-4 py-2 border border-zinc-300 rounded-md bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition no-underline"
                >
                  {t("tabAll")}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200 bg-white">
            {articles.map((a) => {
              const image = mediaUrl(a.imageUrl);
              const dateStr = a.publishedAt
                ? new Date(a.publishedAt).toLocaleDateString(dateLocale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : locale === "en"
                ? "Recent"
                : locale === "ar"
                ? "أحدث"
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
                        <span>
                          {a.readingMinutes
                            ? `${a.readingMinutes} ${locale === "en" ? "min read" : locale === "ar" ? "دقائق قراءة" : "menit baca"}`
                            : locale === "en"
                            ? "4 min read"
                            : locale === "ar"
                            ? "4 دقائق قراءة"
                            : "4 menit baca"}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-semibold text-zinc-950 font-serif leading-snug group-hover:text-[#2C5857] transition-colors mb-2">
                        <Link href={`/articles/${a.slug}`} className="focus:outline-none no-underline text-inherit hover:text-[#2C5857]">
                          {a.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed mb-4">
                        {a.excerpt ||
                          (locale === "en"
                            ? "Click to read full academic analysis and discussion..."
                            : locale === "ar"
                            ? "انقر لقراءة التحليل القانوني والمقال كاملاً..."
                            : "Klik untuk membaca telaah ilmiah selengkapnya...")}
                      </p>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                        <span className="font-medium text-zinc-700">
                          {locale === "en" ? "By " : locale === "ar" ? "بقلم: " : "Oleh "}
                          {a.author?.name || (locale === "en" ? "FKHK Editorial" : locale === "ar" ? "هيئة التحرير" : "Redaksi FKHK")}
                        </span>
                        <Link
                          href={`/articles/${a.slug}`}
                          className="font-medium text-[#2C5857] hover:underline inline-flex items-center gap-1 no-underline"
                        >
                          {t("readMore")} &rarr;
                        </Link>
                      </div>
                    </div>

                    {image && (
                      <Link
                        href={`/articles/${a.slug}`}
                        className="sm:w-44 sm:h-28 shrink-0 overflow-hidden rounded-md bg-zinc-100 border border-zinc-200"
                      >
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
                className="px-3 py-1.5 border border-zinc-300 bg-white rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition no-underline"
              >
                &larr;
              </Link>
            )}
            <span className="text-xs text-zinc-500">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/articles?${new URLSearchParams({
                  ...(currentSearch ? { search: currentSearch } : {}),
                  ...(currentTopic ? { topic: currentTopic } : {}),
                  page: String(page + 1),
                }).toString()}`}
                className="px-3 py-1.5 border border-zinc-300 bg-white rounded-md text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition no-underline"
              >
                &rarr;
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
