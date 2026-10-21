import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getAchievementBySlug,
  getOtherAchievementsByName,
  achievementSlug,
  type Achievement,
} from "@/lib/achievements";
import { getSiteUrl, mediaUrl } from "@/lib/site";

type Props = { params: { locale: string; slug: string } };

function recipientName(a: Achievement, locale: string): string {
  return (
    a.name ||
    a.recipient ||
    (locale === "en" ? "FKHK Student" : locale === "ar" ? "طالب بالمنتدى" : "Mahasiswa FKHK")
  );
}

function categoryLabel(category: string | null | undefined, locale: string): string {
  if (category === "jurnal") {
    return locale === "en" ? "Publikasi Jurnal" : locale === "ar" ? "بحث علمي" : "Publikasi Jurnal";
  }
  if (category === "konferensi") {
    return locale === "en" ? "Konferensi" : locale === "ar" ? "مؤتمر علمي" : "Konferensi";
  }
  return locale === "en" ? "Kejuaraan" : locale === "ar" ? "جائزة تفوق" : "Kejuaraan";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAchievementBySlug(params.slug);
  if (!a) {
    return { title: "Prestasi tidak ditemukan", robots: { index: false, follow: false } };
  }

  const locale = params.locale;
  const name = recipientName(a, locale);
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/prestasi/${params.slug}`;

  const title = `${a.title} - ${name} | FKHK`;

  const description =
    locale === "en"
      ? `${a.title} achieved by ${name}, FKHK student delegate${a.event ? ` at ${a.event}` : ""} (${a.year}). Forum Kajian Hukum Keluarga, UIN Sunan Kalijaga.`
      : locale === "ar"
      ? `${a.title} من ${name}، مندوب طلبة منتدى FKHK${a.event ? ` في ${a.event}` : ""} (${a.year}).`
      : `${a.title} oleh ${name}, delegasi mahasiswa FKHK${a.event ? ` di ${a.event}` : ""} (${a.year}). Forum Kajian Hukum Keluarga UIN Sunan Kalijaga.`;

  return {
    title,
    description,
    keywords: [name, a.title, a.event || "", "prestasi", "FKHK", "Forum Kajian Hukum Keluarga"].filter(Boolean),
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      locale: locale === "en" ? "en_US" : locale === "ar" ? "ar_AR" : "id_ID",
      images: a.photo ? [{ url: mediaUrl(a.photo) || "", alt: title }] : undefined,
    },
  };
}

export default async function PrestasiDetailPage({ params }: Props) {
  const a = await getAchievementBySlug(params.slug);
  if (!a) notFound();

  const locale = params.locale;
  const name = recipientName(a, locale);
  const siteUrl = getSiteUrl();
  const photo = mediaUrl(a.photo);
  const others = await getOtherAchievementsByName(name, Number(a.id));

  const categoryName = categoryLabel(a.category, locale);

  const backLabel =
    locale === "en" ? "Kembali ke Prestasi" : locale === "ar" ? "العودة إلى الإنجازات" : "Kembali ke Prestasi";
  const delegateLabel =
    locale === "en" ? "Delegasi Mahasiswa FKHK" : locale === "ar" ? "مندوب طلبة منتدى FKHK" : "Delegasi Mahasiswa FKHK";
  const otherLabel =
    locale === "en" ? `Prestasi Lain oleh ${name}` : locale === "ar" ? `إنجازات أخرى لـ ${name}` : `Prestasi Lain oleh ${name}`;

  const initials = (
    a.initials ||
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
  ).toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: locale === "en" ? "Home" : locale === "ar" ? "الرئيسية" : "Beranda",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: locale === "en" ? "Achievements" : locale === "ar" ? "الإنجازات" : "Prestasi",
            item: `${siteUrl}/prestasi`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: a.title,
            item: `${siteUrl}/prestasi/${params.slug}`,
          },
        ],
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/prestasi/${params.slug}#person`,
        name,
        affiliation: {
          "@type": "Organization",
          name: "Forum Kajian Hukum Keluarga (FKHK)",
          url: siteUrl,
        },
        image: photo || undefined,
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/prestasi/${params.slug}`,
        url: `${siteUrl}/prestasi/${params.slug}`,
        name: `${a.title} - ${name}`,
        description: `${a.title} oleh ${name} (${a.year}).`,
        isPartOf: { "@type": "WebSite", "@id": siteUrl },
        about: { "@id": `${siteUrl}/prestasi/${params.slug}#person` },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1a1a1a] pt-[76px] pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Link with minimum 44px tap target */}
        <div className="pt-4 pb-2">
          <Link
            href="/prestasi"
            className="inline-flex items-center gap-2 py-2.5 text-xs font-semibold text-[#2C5857] hover:text-[#1e3d3c] no-underline transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>{backLabel}</span>
          </Link>
        </div>

        {/* Hero Card */}
        <article className="bg-white rounded-2xl border border-[#e8e4dc] p-6 sm:p-8 shadow-sm">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[11px] font-semibold text-[#2C5857] bg-[#2C5857]/10 px-3 py-1 rounded-full">
              {categoryName}
            </span>
            <span className="text-[11px] font-medium text-[#737373] bg-[#FAF7F2] border border-[#e8e4dc] px-2.5 py-1 rounded-full">
              {a.year}
            </span>
            {a.event && (
              <span className="text-[11px] font-medium text-[#737373] bg-[#FAF7F2] border border-[#e8e4dc] px-2.5 py-1 rounded-full capitalize">
                {a.event}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-snug sm:leading-tight mb-6">
            {a.title}
          </h1>

          {/* Member Profile */}
          <div className="flex items-center gap-3.5 pt-5 border-t border-[#f0ede6]">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-12 h-12 rounded-full object-cover border border-[#2C5857]/20 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#2C5857]/10 text-[#2C5857] font-bold flex items-center justify-center text-sm border border-[#2C5857]/20 shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-[#1a1a1a] leading-tight truncate">
                {name}
              </p>
              <p className="text-xs text-[#737373] mt-0.5 leading-tight">
                {delegateLabel}
              </p>
            </div>
          </div>

          {/* Description if any */}
          {a.description && (
            <div className="mt-6 pt-6 border-t border-[#f0ede6]">
              <p className="text-sm sm:text-base text-[#525252] leading-relaxed whitespace-pre-line">
                {a.description}
              </p>
            </div>
          )}
        </article>

        {/* Other achievements by same member */}
        {others.length > 0 && (
          <section className="mt-8 mb-6">
            <div className="flex items-center gap-2 mb-3.5">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                {otherLabel}
              </h2>
              <span className="text-xs font-semibold text-[#2C5857] bg-[#2C5857]/10 px-2 py-0.5 rounded-full">
                {others.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {others.map((o) => (
                <Link
                  key={o.id}
                  href={`/prestasi/${achievementSlug(o)}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#e8e4dc] p-4 sm:p-5 no-underline hover:border-[#2C5857]/40 hover:shadow-sm transition group"
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-[#2C5857] bg-[#2C5857]/10 px-2.5 py-0.5 rounded-full">
                        {categoryLabel(o.category, locale)}
                      </span>
                      <span className="text-[10px] font-medium text-[#737373] bg-[#FAF7F2] border border-[#e8e4dc] px-2 py-0.5 rounded-full">
                        {o.year}
                      </span>
                      {o.event && (
                        <span className="text-[10px] font-medium text-[#737373] bg-[#FAF7F2] border border-[#e8e4dc] px-2 py-0.5 rounded-full capitalize truncate max-w-[140px]">
                          {o.event}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] leading-snug group-hover:text-[#2C5857] transition">
                      {o.title}
                    </h3>
                  </div>
                  <div className="shrink-0 text-[#737373] group-hover:text-[#2C5857] group-hover:translate-x-0.5 transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}