"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- INLINE SVG ICONS (Lightweight, No external dependencies) ---
function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

interface Achievement {
  id: string | number;
  name?: string;
  recipient?: string;
  title: string;
  year: number | string;
  initials?: string;
  description?: string;
  photo?: string | null;
}

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

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
    return item.name || item.recipient || "Mahasiswa FKHK";
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
    const t = (item.title + " " + (item.description || "")).toLowerCase();
    if (t.includes("juara") || t.includes("lomba") || t.includes("fest")) {
      return "kompetisi";
    }
    if (t.includes("jurnal") || t.includes("sinta") || t.includes("multicultural")) {
      return "jurnal";
    }
    return "konferensi";
  }

  function getBadgeLabel(item: Achievement): string {
    const t = (item.title + " " + (item.description || "")).toLowerCase();
    if (t.includes("juara 2")) return "Juara 2 Esai";
    if (t.includes("juara 3")) return "Juara 3 Esai";
    if (t.includes("sinta 4")) return "Jurnal SINTA 4";
    if (t.includes("sinta")) return "Jurnal Terindeks SINTA";
    if (t.includes("pengadilan niaga")) return "Badilag MA RI x UII";
    if (t.includes("icoslaw")) return "ICosLaw 2026 (UINSA)";
    if (t.includes("ncols")) return "The 8th NCOLS (UPN-VJ)";
    return "Call for Papers";
  }

  const filtered = achievements.filter((item) => {
    const cat = getCategory(item);
    if (selectedCategory !== "all" && cat !== selectedCategory) return false;
    if (selectedYear !== "all" && item.year.toString() !== selectedYear) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const recip = getRecipient(item).toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      recip.includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  const countKompetisi = achievements.filter((a) => getCategory(a) === "kompetisi").length;
  const countKonferensi = achievements.filter((a) => getCategory(a) === "konferensi").length;
  const countJurnal = achievements.filter((a) => getCategory(a) === "jurnal").length;

  const uniqueYears = Array.from(new Set(achievements.map((a) => a.year.toString()))).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-[#1a1a1a]">
      {/* Top Header / Breadcrumb Bar */}
      <section className="border-b border-[#e5e0d8] bg-[#F7F2ED]/80 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#737373] mb-4">
            <Link href="/" className="hover:text-[#2C5857] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#2C5857] font-semibold">Rekam Jejak Prestasi</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f7f7] border border-[#d1e8e8] text-[#2C5857] text-xs font-semibold tracking-wide uppercase mb-3">
              <TrophyIcon className="w-3.5 h-3.5" />
              Registri Kehormatan Akademik
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1a1a] mb-3 leading-tight">
              Rekam Jejak Prestasi Akademik
            </h1>
            <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
              Dokumentasi resmi capaian kejuaraan, delegasi terpilih forum ilmiah nasional, serta publikasi artikel pada jurnal terindeks oleh mahasiswa dan kader Forum Kajian Hukum Keluarga.
            </p>
          </div>

          {/* Quick Metrics Bar - Grounded Neutral Style */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#e5e0d8] shadow-sm">
              <div className="text-xl sm:text-3xl font-serif font-bold text-[#2C5857]">{countKompetisi}</div>
              <div className="text-xs text-[#737373] font-medium mt-0.5">Kejuaraan Esai</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#e5e0d8] shadow-sm">
              <div className="text-xl sm:text-3xl font-serif font-bold text-[#2C5857]">{countKonferensi}</div>
              <div className="text-xs text-[#737373] font-medium mt-0.5">Call for Papers</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#e5e0d8] shadow-sm">
              <div className="text-xl sm:text-3xl font-serif font-bold text-[#2C5857]">{countJurnal}</div>
              <div className="text-xs text-[#737373] font-medium mt-0.5">Jurnal SINTA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Content Section */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          
          {/* Controls: Search & Category Pills */}
          <div className="flex flex-col gap-4 sm:gap-5 pb-8 border-b border-[#e5e0d8]">
            
            {/* Category Filter Pills - Grounded Brand Palette */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#2C5857] text-white shadow-sm"
                    : "bg-white border border-[#e5e0d8] text-[#525252] hover:bg-[#F7F2ED]"
                }`}
              >
                Semua Prestasi ({achievements.length})
              </button>
              
              <button
                onClick={() => setSelectedCategory("kompetisi")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === "kompetisi"
                    ? "bg-[#2C5857] text-white shadow-sm"
                    : "bg-white border border-[#e5e0d8] text-[#525252] hover:bg-[#F7F2ED]"
                }`}
              >
                Kejuaraan Esai ({countKompetisi})
              </button>

              <button
                onClick={() => setSelectedCategory("konferensi")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === "konferensi"
                    ? "bg-[#2C5857] text-white shadow-sm"
                    : "bg-white border border-[#e5e0d8] text-[#525252] hover:bg-[#F7F2ED]"
                }`}
              >
                Call for Papers ({countKonferensi})
              </button>

              <button
                onClick={() => setSelectedCategory("jurnal")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === "jurnal"
                    ? "bg-[#2C5857] text-white shadow-sm"
                    : "bg-white border border-[#e5e0d8] text-[#525252] hover:bg-[#F7F2ED]"
                }`}
              >
                Publikasi Jurnal ({countJurnal})
              </button>
            </div>

            {/* Sub-bar: Search Input & Year Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="w-4 h-4 text-[#a3a3a3] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama peraih, forum, atau penyelenggara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[#e5e0d8] text-xs sm:text-sm text-[#1a1a1a] placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#2C5857] focus:border-[#2C5857] transition-all"
                />
              </div>

              {/* Year filter buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
                <span className="text-[#737373] font-medium mr-1">Tahun:</span>
                <button
                  onClick={() => setSelectedYear("all")}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    selectedYear === "all"
                      ? "bg-[#2C5857] text-white"
                      : "bg-white border border-[#e5e0d8] text-[#525252] hover:bg-[#F7F2ED]"
                  }`}
                >
                  Semua
                </button>
                {uniqueYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      selectedYear === yr
                        ? "bg-[#2C5857] text-white"
                        : "bg-white border border-[#e5e0d8] text-[#525252] hover:bg-[#F7F2ED]"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Items Rendering */}
          <div className="mt-8">
            {loading ? (
              <div className="py-16 text-center text-sm text-[#737373]">
                Memuat registri prestasi...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-[#e5e0d8] p-8">
                <TrophyIcon className="w-10 h-10 text-[#d4cfc7] mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Arsip Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-[#737373] mt-1 max-w-sm mx-auto">
                  Tidak ada data prestasi yang cocok dengan kata kunci pencarian atau kombinasi filter aktif.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                
                {/* 1. SEKSI KEJUARAAN / PODIUM */}
                {(selectedCategory === "all" || selectedCategory === "kompetisi") && (
                  <div className="space-y-4">
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-2 pb-2 border-b border-[#e5e0d8]">
                        <TrophyIcon className="w-4 h-4 text-[#2C5857]" />
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a]">
                          Kejuaraan & Kompetisi Ilmiah
                        </h2>
                        <span className="text-xs text-[#737373] ml-auto">{filtered.filter(i => getCategory(i) === "kompetisi").length} Penghargaan</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered
                        .filter((item) => getCategory(item) === "kompetisi")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="relative rounded-xl bg-white border border-[#e5e0d8] border-l-4 border-l-[#2C5857] p-5 shadow-sm transition-all hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0f7f7] border border-[#d1e8e8] text-[#2C5857] text-xs font-semibold">
                                <TrophyIcon className="w-3.5 h-3.5" />
                                {getBadgeLabel(item)}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-[#737373] font-medium">
                                <CalendarIcon className="w-3.5 h-3.5 text-[#a3a3a3]" />
                                {item.year}
                              </div>
                            </div>

                            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1a1a1a] mb-2 leading-snug">
                              {item.title}
                            </h3>

                            {item.description && (
                              <p className="text-xs sm:text-sm text-[#525252] mb-4 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            <div className="pt-3 border-t border-[#f0ece6] flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#f0f7f7] text-[#2C5857] font-bold flex items-center justify-center text-xs border border-[#d1e8e8]">
                                  {getInitials(item)}
                                </div>
                                <div>
                                  <div className="font-semibold text-[#1a1a1a]">{getRecipient(item)}</div>
                                  <div className="text-[11px] text-[#737373]">Delegasi Mahasiswa FKHK</div>
                                </div>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#2C5857] font-medium">
                                <CheckCircleIcon className="w-3 h-3 text-[#2C5857]" />
                                Terverifikasi
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 2. SEKSI PUBLIKASI JURNAL SINTA */}
                {(selectedCategory === "all" || selectedCategory === "jurnal") && (
                  <div className="space-y-4">
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-2 pb-2 border-b border-[#e5e0d8]">
                        <BookOpenIcon className="w-4 h-4 text-[#2C5857]" />
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a]">
                          Publikasi Jurnal Terakreditasi
                        </h2>
                        <span className="text-xs text-[#737373] ml-auto">{filtered.filter(i => getCategory(i) === "jurnal").length} Publikasi</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-4">
                      {filtered
                        .filter((item) => getCategory(item) === "jurnal")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl bg-white border border-[#e5e0d8] border-l-4 border-l-[#2C5857] p-5 sm:p-6 shadow-sm transition-all hover:shadow-md"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0f7f7] border border-[#d1e8e8] text-[#2C5857] text-xs font-semibold">
                                <BookOpenIcon className="w-3.5 h-3.5" />
                                {getBadgeLabel(item)}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-[#737373] font-medium">
                                <CalendarIcon className="w-3.5 h-3.5 text-[#a3a3a3]" />
                                Tahun Terbit {item.year}
                              </div>
                            </div>

                            <h3 className="font-serif text-base sm:text-xl font-bold text-[#1a1a1a] mb-2 leading-snug">
                              {item.title}
                            </h3>

                            {item.description && (
                              <p className="text-xs sm:text-sm text-[#525252] mb-4 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            <div className="pt-3 border-t border-[#f0ece6] flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#f0f7f7] text-[#2C5857] font-bold flex items-center justify-center text-xs border border-[#d1e8e8]">
                                  {getInitials(item)}
                                </div>
                                <div>
                                  <div className="font-semibold text-[#1a1a1a]">{getRecipient(item)}</div>
                                  <div className="text-[11px] text-[#737373]">Penulis Utama / Kader Peneliti FKHK</div>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-[#f5f5f4] text-[#525252] text-[11px] font-medium border border-[#e5e0d8]">
                                Artikel Ilmiah Bereputasi
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 3. SEKSI CALL FOR PAPERS & KONFERENSI */}
                {(selectedCategory === "all" || selectedCategory === "konferensi") && (
                  <div className="space-y-4">
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-2 pb-2 border-b border-[#e5e0d8]">
                        <FileTextIcon className="w-4 h-4 text-[#2C5857]" />
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a]">
                          Call for Papers & Konferensi Nasional
                        </h2>
                        <span className="text-xs text-[#737373] ml-auto">{filtered.filter(i => getCategory(i) === "konferensi").length} Naskah Terpilih</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered
                        .filter((item) => getCategory(item) === "konferensi")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl bg-white border border-[#e5e0d8] p-5 shadow-sm transition-all hover:shadow-md hover:border-[#2C5857]/40 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F7F2ED] text-[#2C5857] text-[11px] font-semibold border border-[#e5e0d8]">
                                  <BuildingIcon className="w-3 h-3 text-[#2C5857]" />
                                  {getBadgeLabel(item)}
                                </span>
                                <span className="text-xs text-[#737373]">{item.year}</span>
                              </div>

                              <h3 className="font-serif text-sm sm:text-base font-bold text-[#1a1a1a] mb-2 leading-snug">
                                {item.title}
                              </h3>

                              {item.description && (
                                <p className="text-xs text-[#525252] mb-4 leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-3 border-t border-[#f0ece6] flex items-center justify-between text-xs mt-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#f0f7f7] text-[#2C5857] font-bold flex items-center justify-center text-[10px] border border-[#d1e8e8]">
                                  {getInitials(item)}
                                </div>
                                <span className="font-medium text-[#1a1a1a]">{getRecipient(item)}</span>
                              </div>
                              <span className="text-[11px] text-[#737373]">Penulis Terpilih</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
