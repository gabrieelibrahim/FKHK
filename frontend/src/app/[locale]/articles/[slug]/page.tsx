import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/lib/articles";
import { getSiteUrl, mediaUrl } from "@/lib/site";
import { readingTime } from "@/lib/readingTime";
import CommentSection from "@/components/CommentSection";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug);
  if (!article || article.status !== "published") {
    return { title: "Artikel tidak ditemukan", robots: { index: false, follow: false } };
  }

  const title = article.title;
  const description = article.excerpt || article.content.slice(0, 160);
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/articles/${article.slug}`;
  const image = mediaUrl(article.imageUrl) || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords: [article.topic, ...(article.tags || []), "FKHK", "Hukum Keluarga Islam", "Artikel Hukum"],
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      locale: "id_ID",
      publishedTime: article.publishedAt || undefined,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) notFound();

  const siteUrl = getSiteUrl();
  const image = mediaUrl(article.imageUrl);
  const minutes = readingTime(article.content || "");
  const related = await fetchRelatedArticles(article.slug, article.topic);

  const jsonLd =
    article.status === "published"
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Beranda",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Artikel",
                  item: `${siteUrl}/articles`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: article.title,
                  item: `${siteUrl}/articles/${article.slug}`,
                },
              ],
            },
            {
              "@type": "Article",
              "@id": `${siteUrl}/articles/${article.slug}#article`,
              isPartOf: {
                "@type": "WebPage",
                "@id": `${siteUrl}/articles/${article.slug}`,
              },
              headline: article.title,
              description: article.excerpt || article.content.slice(0, 160),
              image: image ? [image] : [`${siteUrl}/og-image.jpg`],
              datePublished: article.publishedAt || undefined,
              dateModified: article.publishedAt || article.createdAt || undefined,
              author: {
                "@type": "Person",
                name: article.author?.name || "FKHK",
              },
              publisher: {
                "@type": "Organization",
                name: "Forum Kajian Hukum Keluarga",
                url: siteUrl,
                logo: {
                  "@type": "ImageObject",
                  url: `${siteUrl}/og-image.jpg`,
                },
              },
              mainEntityOfPage: `${siteUrl}/articles/${article.slug}`,
            },
          ],
        }
      : null;

  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-12">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="container mx-auto px-4 max-w-[1100px]">
        <div className="relative mx-auto max-w-3xl">
          {/* Back button */}
          <Link
            href="/articles"
            className="absolute -left-14 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
            aria-label="Kembali ke artikel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Link>

          <div className="flex-1">
            {article.status !== "published" && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Preview — belum dipublish. Tidak di-index Google.
              </div>
            )}

            <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  {article.topic}
                </span>
                <span className="text-xs text-gray-400">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{minutes} menit baca</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>

              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{article.author.name}</p>
                  {article.author.affiliation && (
                    <p className="text-sm text-gray-500">{article.author.affiliation}</p>
                  )}
                </div>
              </div>

              {image && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
                  <img
                    src={image}
                    alt={article.title}
                    className="w-full max-h-[400px] object-cover"
                  />
                </div>
              )}

              <div className="prose prose-gray max-w-none leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-400 mt-4">{article.viewCount} dilihat</div>
            </article>

            {/* Komentar + Share */}
            <CommentSection
              articleId={article.id}
              shareUrl={`${siteUrl}/articles/${article.slug}`}
              articleTitle={article.title}
            />

            {/* Artikel Terkait */}
            {related.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Baca Juga</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {related.map((ra) => {
                    const rImg = mediaUrl(ra.imageUrl);
                    return (
                      <Link
                        key={ra.id}
                        href={`/articles/${ra.slug}`}
                        className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md group"
                      >
                        {rImg && (
                          <div className="h-28 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={rImg}
                              alt={ra.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-4">
                          <span className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">
                            {ra.topic}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {ra.title}
                          </h3>
                          <span className="text-xs text-gray-400 mt-auto pt-2">
                            {ra.author?.name}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
