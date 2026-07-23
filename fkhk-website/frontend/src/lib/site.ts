const trimSlash = (url: string) => url.replace(/\/$/, "");

export function getApiUrl() {
  return trimSlash(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
}

export function getSiteUrl() {
  return trimSlash(process.env.NEXT_PUBLIC_SITE_URL || "https://fkhk.id");
}

export function mediaUrl(path?: string | null) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
