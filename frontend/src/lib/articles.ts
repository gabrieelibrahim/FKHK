import { cookies } from "next/headers";
import { getApiUrl } from "./site";

export type ArticleAuthor = {
  id?: number;
  name: string;
  email?: string;
  affiliation?: string;
  avatarUrl?: string;
};

export type ArticleListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string | null;
  topic: string;
  tags?: string[];
  status: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt?: string;
  author: ArticleAuthor;
};

export type Article = ArticleListItem & {
  content: string;
};

type ArticlesResponse = {
  data: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function fetchPublishedArticles(params?: {
  page?: number;
  limit?: number;
  topic?: string;
  search?: string;
}): Promise<ArticlesResponse> {
  const qs = new URLSearchParams();
  qs.set("page", String(params?.page || 1));
  qs.set("limit", String(params?.limit || 20));
  if (params?.topic) qs.set("topic", params.topic);
  if (params?.search) qs.set("search", params.search);

  const res = await fetch(`${getApiUrl()}/api/articles?${qs}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return { data: [], total: 0, page: 1, limit: params?.limit || 20, totalPages: 0 };
  }

  return res.json();
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const token = cookies().get("fkhk_token")?.value;
  const res = await fetch(`${getApiUrl()}/api/articles/${encodeURIComponent(slug)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function fetchPublishedSlugs(limit = 1000): Promise<
  { slug: string; publishedAt: string | null; updatedAt?: string }[]
> {
  const res = await fetch(`${getApiUrl()}/api/articles?limit=${limit}&page=1`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const json: ArticlesResponse = await res.json();
  return (json.data || []).map((a) => ({
    slug: a.slug,
    publishedAt: a.publishedAt,
  }));
}
