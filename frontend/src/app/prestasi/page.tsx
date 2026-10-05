"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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
    // Kategori tersimpan dari admin (field eksplisit); fallback deteksi kata kunci untuk data lama
    if (item.category === "kompetisi" || item.category === "jurnal" || item.category === "konferensi") {
      return item.category;
    }
    const t = (item.title + " " + (item.description || "")).toLowerCase();
    if (t.includes("juara") || t.includes("lomba") || t.includes("fest")) {
      return "kompetisi";
    }
    if (t.includes("jurnal") || t.includes("sinta") || t.includes("multicultural")) {
      return "jurnal";
    }
    return "konferensi";
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

  const categories = [
    { key: "all", label: "Semua Prestasi", count: achievements.length },
    { key: "kompetisi", label: "Kejuaraan Esai", count: countKompetisi },
    { key: "konferensi", label: "Call for Papers", count: countKonferensi },
    { key: "jurnal", label: "Publikasi Jurnal", count: countJurnal },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-[#1a1a1a]">
      {/* Header */}
      <section className="border-b border-[#e5e0d8] bg-[#F7F2ED]/80 pt-10 pb-10 sm:pt-14 sm:pb-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#737373] mb-4">
            <Link href="/" className="hover:text-[#2C5857] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#2C5857] font-semibold">Rekam Jejak Prestasi</span>
          </div>

          <div className="max-w-3xl">
            <span className="text-[10px] font-bold tracking-widest text-[#2C5857] uppercase block mb-2">
              Registri Kehormatan Akademik
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1a1a] mb-3 leading-tight">
              Rekam Jejak Prestasi Akademik
            </h1>
            <p className="text-sm sm:text-base text-[#525252] leading-relaxed">
              Dokumentasi resmi capaian kejuaraan, delegasi forum ilmiah, serta publikasi artikel pada jurnal terindeks oleh mahasiswa dan kader Forum Kajian Hukum Keluarga.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          {/* Controls */}
          <div className="flex flex-col gap-4 sm:gap-5 pb-8 border-b border-[#e5e0d8]">

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === cat.key
                      ? "bg-[#2C5857] text-white"
                      : "bg-white border border-[#e5e0d8] text-[#525252] hover:bg-[#F7F2ED]"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Search & Year */}
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

          {/* Items */}
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

                {/* Kejuaraan */}
                {(selectedCategory === "all" || selectedCategory === "kompetisi") && (
                  <div className="space-y-4">
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-2 pb-2 border-b border-[#e5e0d8]">
                        <TrophyIcon className="w-4 h-4 text-[#2C5857]" />
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a]">
                          Kejuaraan & Kompetisi Ilmiah
                        </h2>
                        <span className="text-xs text-[#737373] ml-auto">
                          {filtered.filter(i => getCategory(i) === "kompetisi").length} Penghargaan
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered
                        .filter((item) => getCategory(item) === "kompetisi")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl bg-white border border-[#e5e0d8] p-5 sm:p-6"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <span className="text-[10px] font-bold tracking-widest text-[#2C5857] uppercase">
                                Kejuaraan Esai
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
                                <span className="font-semibold text-[#2C5857]">Ajang:</span> {item.event}
                              </p>
                            )}

                            {item.description && (
                              <p className="text-xs sm:text-sm text-[#525252] mb-4 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            <div className="pt-3 border-t border-[#f0ece6] flex items-center gap-2 text-xs">
                              {item.photo ? (
                                <img src={item.photo} alt={getRecipient(item)} className="w-7 h-7 rounded-full object-cover border border-[#d1e8e8]" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-[#f0f7f7] text-[#2C5857] font-bold flex items-center justify-center text-xs border border-[#d1e8e8]">
                                  {getInitials(item)}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-[#1a1a1a]">{getRecipient(item)}</div>
                                <div className="text-[11px] text-[#737373]">Delegasi Mahasiswa FKHK</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Jurnal */}
                {(selectedCategory === "all" || selectedCategory === "jurnal") && (
                  <div className="space-y-4">
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-2 pb-2 border-b border-[#e5e0d8]">
                        <BookOpenIcon className="w-4 h-4 text-[#2C5857]" />
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a]">
                          Publikasi Jurnal Terakreditasi
                        </h2>
                        <span className="text-xs text-[#737373] ml-auto">
                          {filtered.filter(i => getCategory(i) === "jurnal").length} Publikasi
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      {filtered
                        .filter((item) => getCategory(item) === "jurnal")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl bg-white border border-[#e5e0d8] p-5 sm:p-6"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <span className="text-[10px] font-bold tracking-widest text-[#2C5857] uppercase">
                                Publikasi Jurnal
                              </span>
                              <div className="flex items-center gap-1 text-xs text-[#737373] font-medium">
                                <CalendarIcon className="w-3.5 h-3.5 text-[#a3a3a3]" />
                                Tahun Terbit {item.year}
                              </div>
                            </div>

                            <h3 className="font-serif text-base sm:text-xl font-bold text-[#1a1a1a] mb-2 leading-snug">
                              {item.title}
                            </h3>

                            {item.event && (
                              <p className="text-xs text-[#525252] mb-2">
                                <span className="font-semibold text-[#2C5857]">Ajang:</span> {item.event}
                              </p>
                            )}

                            {item.description && (
                              <p className="text-xs sm:text-sm text-[#525252] mb-4 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            <div className="pt-3 border-t border-[#f0ece6] flex flex-wrap items-center gap-2.5 text-xs">
                              {item.photo ? (
                                <img src={item.photo} alt={getRecipient(item)} className="w-8 h-8 rounded-full object-cover border border-[#d1e8e8]" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#f0f7f7] text-[#2C5857] font-bold flex items-center justify-center text-xs border border-[#d1e8e8]">
                                  {getInitials(item)}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-[#1a1a1a]">{getRecipient(item)}</div>
                                <div className="text-[11px] text-[#737373]">Penulis Utama / Kader Peneliti FKHK</div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Call for Papers */}
                {(selectedCategory === "all" || selectedCategory === "konferensi") && (
                  <div className="space-y-4">
                    {selectedCategory === "all" && (
                      <div className="flex items-center gap-2 pb-2 border-b border-[#e5e0d8]">
                        <FileTextIcon className="w-4 h-4 text-[#2C5857]" />
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a]">
                          Call for Papers & Konferensi Nasional
                        </h2>
                        <span className="text-xs text-[#737373] ml-auto">
                          {filtered.filter(i => getCategory(i) === "konferensi").length} Naskah Terpilih
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered
                        .filter((item) => getCategory(item) === "konferensi")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl bg-white border border-[#e5e0d8] p-5 sm:p-6 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2.5">
                                <span className="text-[10px] font-bold tracking-widest text-[#2C5857] uppercase">
                                  Call for Papers
                                </span>
                                <span className="text-xs text-[#737373]">{item.year}</span>
                              </div>

                              <h3 className="font-serif text-sm sm:text-base font-bold text-[#1a1a1a] mb-2 leading-snug">
                                {item.title}
                              </h3>

                              {item.event && (
                                <p className="text-xs text-[#525252] mb-2">
                                  <span className="font-semibold text-[#2C5857]">Ajang:</span> {item.event}
                                </p>
                              )}

                              {item.description && (
                                <p className="text-xs text-[#525252] mb-4 leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-3 border-t border-[#f0ece6] flex items-center gap-2 text-xs mt-2">
                              {item.photo ? (
                                <img src={item.photo} alt={getRecipient(item)} className="w-6 h-6 rounded-full object-cover border border-[#d1e8e8]" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#f0f7f7] text-[#2C5857] font-bold flex items-center justify-center text-[10px] border border-[#d1e8e8]">
                                  {getInitials(item)}
                                </div>
                              )}
                              <span className="font-medium text-[#1a1a1a]">{getRecipient(item)}</span>
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
