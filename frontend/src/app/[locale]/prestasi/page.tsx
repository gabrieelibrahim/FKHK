"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

// --- INLINE SVG ICONS ---
function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

interface Achievement {
  id: string | number;
  name?: string;
  recipient?: string;
  title: string;
  year: number | string;
  event?: string | null;
  initials?: string;
  description?: string;
  photo?: string | null;
  category?: string | null;
}

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const t = useTranslations("prestasiPage");
  const locale = useLocale();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/achievements");
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json) ? json : json.data || [];
          setAchievements(items);
        }
      } catch (err) {
        console.error("Gagal memuat arsip prestasi:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function getRecipient(item: Achievement): string {
    return item.name || item.recipient || (locale === "en" ? "FKHK Student" : locale === "ar" ? "طالب بالمنتدى" : "Mahasiswa FKHK");
  }

  function getInitials(item: Achievement): string {
    if (item.initials) return item.initials;
    const name = getRecipient(item);
    return name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function getCategory(item: Achievement): "kompetisi" | "jurnal" | "konferensi" {
    if (item.category === "kompetisi" || item.category === "jurnal" || item.category === "konferensi") {
      return item.category;
    }
    const txt = (item.title + " " + (item.description || "")).toLowerCase();
    if (txt.includes("jurnal") || txt.includes("sinta") || txt.includes("scopus") || txt.includes("artikel")) {
      return "jurnal";
    }
    if (txt.includes("call for paper") || txt.includes("konferensi") || txt.includes("conference") || txt.includes("seminar")) {
      return "konferensi";
    }
    return "kompetisi";
  }

  const years = Array.from(new Set(achievements.map((item) => String(item.year)))).sort(
    (a, b) => Number(b) - Number(a)
  );

  const filtered = achievements.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      getRecipient(item).toLowerCase().includes(q) ||
      (item.event && item.event.toLowerCase().includes(q));

    const matchCategory =
      selectedCategory === "all" || getCategory(item) === selectedCategory;

    const matchYear =
      selectedYear === "all" || String(item.year) === selectedYear;

    return matchSearch && matchCategory && matchYear;
  });

  return (
    <div className="pt-[68px] min-h-screen bg-[#FAF7F2] text-[#1a1a1a]">
      {/* Header Banner */}
      <section className="border-b border-[#e5e0d8] bg-white">
        <div className="container mx-auto px-4 max-w-5xl pt-10 pb-8 sm:pt-14 sm:pb-10">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-[#2C5857] uppercase tracking-wider block mb-2">
              Prestasi &amp; Kontribusi
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#1a1a1a] font-serif leading-tight">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Filter & List Section */}
      <section className="container mx-auto px-4 max-w-5xl py-8 sm:py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#e5e0d8] rounded-xl text-[#1a1a1a] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#2C5857] focus:border-transparent transition"
              />
              <SearchIcon className="w-4 h-4 text-[#a3a3a3] absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl border border-[#e5e0d8] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-3">
                {locale === "en" ? "Categories" : locale === "ar" ? "التصنيفات" : "Kategori"}
              </h3>
              <div className="space-y-1">
                {[
                  { id: "all", label: t("tabAll") },
                  { id: "kompetisi", label: t("tabPeradilan") },
                  { id: "jurnal", label: t("tabKaryaTulis") },
                  { id: "konferensi", label: t("tabAkademik") },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedCategory === cat.id
                        ? "bg-[#2C5857] text-white"
                        : "text-[#525252] hover:bg-[#FAF7F2] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            {years.length > 0 && (
              <div className="bg-white rounded-xl border border-[#e5e0d8] p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-3">
                  {t("yearLabel")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedYear("all")}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      selectedYear === "all"
                        ? "bg-[#2C5857] text-white"
                        : "bg-[#FAF7F2] text-[#525252] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {locale === "en" ? "All" : locale === "ar" ? "الكل" : "Semua"}
                  </button>
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                        selectedYear === y
                          ? "bg-[#2C5857] text-white"
                          : "bg-[#FAF7F2] text-[#525252] hover:text-[#1a1a1a]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* List Cards */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-6 bg-white rounded-xl border border-[#e5e0d8] animate-pulse">
                    <div className="h-4 bg-zinc-200 rounded w-1/3 mb-3" />
                    <div className="h-5 bg-zinc-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-zinc-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-[#e5e0d8] p-8">
                <TrophyIcon className="w-10 h-10 text-[#d4cfc7] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">{t("empty")}</h3>
                <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-sm mx-auto">
                  {locale === "en"
                    ? "Try adjusting your search query or changing active filters."
                    : locale === "ar"
                    ? "يرجى تعديل مصطلح البحث أو تغيير فلاتر التصفية النشطة."
                    : "Tidak ada data prestasi yang cocok dengan kata kunci pencarian atau kombinasi filter aktif."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-white border border-[#e5e0d8] p-5 sm:p-6 flex flex-col justify-between hover:shadow-sm transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-[10px] font-bold tracking-widest text-[#2C5857] uppercase">
                          {getCategory(item) === "jurnal"
                            ? locale === "en"
                              ? "Journal Article"
                              : locale === "ar"
                              ? "بحث علمي"
                              : "Publikasi Jurnal"
                            : getCategory(item) === "konferensi"
                            ? locale === "en"
                              ? "Conference / Call for Papers"
                              : locale === "ar"
                              ? "مؤتمر علمي"
                              : "Konferensi"
                            : locale === "en"
                            ? "Competition Award"
                            : locale === "ar"
                            ? "جائزة تفوق"
                            : "Kejuaraan"}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#737373] font-medium shrink-0">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#a3a3a3]" />
                          {item.year}
                        </div>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1a1a1a] mb-2 leading-snug">
                        {item.title}
                      </h3>

                      {item.event && (
                        <p className="text-xs text-[#525252] mb-2">
                          <span className="font-semibold text-[#2C5857]">
                            {locale === "en" ? "Event: " : locale === "ar" ? "المسابقة: " : "Ajang: "}
                          </span>{" "}
                          {item.event}
                        </p>
                      )}

                      {item.description && (
                        <p className="text-xs sm:text-sm text-[#525252] mb-4 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#f0ece6] flex items-center gap-2 text-xs mt-3">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={getRecipient(item)}
                          className="w-7 h-7 rounded-full object-cover border border-[#d1e8e8]"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#f0f7f7] text-[#2C5857] font-bold flex items-center justify-center text-xs border border-[#d1e8e8]">
                          {getInitials(item)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-[#1a1a1a]">{getRecipient(item)}</div>
                        <div className="text-[11px] text-[#737373]">
                          {locale === "en"
                            ? "FKHK Student Delegate"
                            : locale === "ar"
                            ? "مندوب طلبة منتدى FKHK"
                            : "Delegasi Mahasiswa FKHK"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
