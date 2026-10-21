import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PrestasiClient from "./PrestasiClient";
import { getAchievements } from "@/lib/achievements";
import { getSiteUrl } from "@/lib/site";

// Data prestasi dinamis dari DB (panel admin) — fetch server-side saat request,
// bukan prerender build-time (API backend tidak reachable saat docker build).
// Performa ditangani nginx micro-cache (30s).
export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "prestasiPage" });
  const siteUrl = getSiteUrl();
  const canonical =
    params.locale === "id"
      ? `${siteUrl}/prestasi`
      : `${siteUrl}/${params.locale}/prestasi`;

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical,
      languages: {
        id: `${siteUrl}/prestasi`,
        en: `${siteUrl}/en/prestasi`,
        ar: `${siteUrl}/ar/prestasi`,
      },
    },
  };
}

export default async function PrestasiPage({ params }: Props) {
  const achievements = await getAchievements();

  return <PrestasiClient achievements={achievements} />;
}
