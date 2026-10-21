import { getApiUrl } from "./site";

export type Achievement = {
  id: number;
  name?: string;
  recipient?: string;
  title: string;
  year: number | string;
  event?: string | null;
  category?: string | null;
  initials?: string | null;
  description?: string | null;
  photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function achievementSlug(a: {
  id: number | string;
  name?: string;
  recipient?: string;
}): string {
  const base = a.name || a.recipient || "prestasi";
  return `${a.id}-${slugifyName(base)}`;
}

export function parseAchievementId(slug: string): number | null {
  const m = slug.match(/^(\d+)(?:-|$)/);
  return m ? Number(m[1]) : null;
}

async function fetchAllAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(`${getApiUrl()}/api/achievements`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json.data || [];
  } catch {
    return [];
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  return fetchAllAchievements();
}

export async function getAchievementBySlug(
  slug: string
): Promise<Achievement | null> {
  const id = parseAchievementId(slug);
  if (id === null) return null;
  const all = await fetchAllAchievements();
  return all.find((a) => Number(a.id) === id) || null;
}

export async function getOtherAchievementsByName(
  name: string,
  excludeId: number
): Promise<Achievement[]> {
  const all = await fetchAllAchievements();
  return all.filter(
    (a) => (a.name || a.recipient) === name && Number(a.id) !== excludeId
  );
}
