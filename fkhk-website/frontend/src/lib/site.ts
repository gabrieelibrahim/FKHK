const trimSlash = (url: string) => url.replace(/\/$/, "");

export function getApiUrl() {
  // Server-side: use internal Docker network URL if available
  if (typeof window === "undefined" && process.env.API_URL) {
    return trimSlash(process.env.API_URL);
  }
  // Client-side or fallback: use NEXT_PUBLIC_API_URL (relative "" for nginx proxy)
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
