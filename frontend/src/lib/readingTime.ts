// Estimasi waktu baca (200 kata/menit)
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function readingTimeLabel(content: string): string {
  const minutes = readingTime(content);
  return `${minutes} menit baca`;
}
