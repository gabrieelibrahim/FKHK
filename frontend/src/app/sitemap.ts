export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { fetchPublishedSlugs } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";

// id = default (tanpa prefix); en & ar pakai prefix
const publicLocales = routing.locales.filter((l) => l !== routing.defaultLocale);

function localeUrl(site: string, path: string, locale: string) {
  return locale === routing.defaultLocale
    ? `${site}${path}`
    : `${site}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const articles = await fetchPublishedSlugs(1000);

  const staticPaths: { path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/articles", changeFrequency: "daily", priority: 0.9 },
    { path: "/events", changeFrequency: "weekly", priority: 0.7 },
    { path: "/presensi", changeFrequency: "weekly", priority: 0.9 },
    { path: "/tentang", changeFrequency: "monthly", priority: 0.5 },
    { path: "/prestasi", changeFrequency: "monthly", priority: 0.5 },
    { path: "/ketentuan", changeFrequency: "monthly", priority: 0.3 },
    { path: "/privasi", changeFrequency: "monthly", priority: 0.3 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap(({ path, changeFrequency, priority }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(site, path, locale),
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );

  // Artikel hanya versi Indonesia (konten DB belum multi-bahasa)
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${site}/articles/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
