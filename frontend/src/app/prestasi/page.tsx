"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Inline clean SVGs
const TrophyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const MedalIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2.2" />
    <path d="m13 12 5.88-9.8" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
);

const BookOpenIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const FileTextIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const SearchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BuildingIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CrownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const GraduationCapIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

interface Achievement {
  id: number;
  name: string;
  title: string;
  year: string;
  initials?: string;
  photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch("/api/achievements");
        if (res.ok) {
          const json = await res.json();
          const list = json.data || json || [];
          setAchievements(list);
        }
      } catch (err) {
        console.error("Gagal memuat prestasi:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  const parseItem = (item: Achievement) => {
    const raw = item.title || "";
    const clean = raw.replace(new RegExp("\u2014|\u2013", "g"), " - ");
    const parts = clean.split(" - ");
    const titlePart = parts[0]?.trim() || raw;
    const instPart = parts.length > 1 ? parts.slice(1).join(" - ").trim() : "";

    const lower = raw.toLowerCase();
    let cat = "konferensi";
    let catLabel = "Call for Papers";
    let rankLabel = "Penulis Terpilih";

    if (lower.includes("juara 1")) {
      cat = "kejuaraan";
      catLabel = "Kompetisi";
      rankLabel = "Juara 1";
    } else if (lower.includes("juara 2")) {
      cat = "kejuaraan";
      catLabel = "Kompetisi";
      rankLabel = "Juara 2";
    } else if (lower.includes("juara 3") || lower.includes("juara")) {
      cat = "kejuaraan";
      catLabel = "Kompetisi";
      rankLabel = lower.includes("juara 3") ? "Juara 3" : "Juara";
    } else if (lower.includes("jurnal") || lower.includes("sinta") || lower.includes("publikasi")) {
      cat = "jurnal";
      catLabel = "Publikasi Ilmiah";
      rankLabel = "SINTA 4";
    }

    return {
      ...item,
      mainTitle: titlePart,
      institution: instPart,
      category: cat,
      categoryLabel: catLabel,
      rankLabel
    };
  };

  const parsedList = achievements.map(parseItem);

  const years = Array.from(new Set(parsedList.map((a) => a.year).filter(Boolean)));

  const countAll = parsedList.length;
  const countKejuaraan = parsedList.filter((a) => a.category === "kejuaraan").length;
  const countKonferensi = parsedList.filter((a) => a.category === "konferensi").length;
  const countJurnal = parsedList.filter((a) => a.category === "jurnal").length;

  const filtered = parsedList.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchYear = selectedYear === "all" || item.year === selectedYear;
    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchYear && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-zinc-900 pb-20 selection:bg-teal-900 selection:text-white">
      {/* Editorial Header */}
      <section className="border-b border-zinc-200 bg-white pt-24 pb-10 sm:pt-28 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-teal-200 bg-teal-50 text-[11px] font-semibold text-teal-800 tracking-wider uppercase mb-3">
                <CrownIcon className="w-3.5 h-3.5 text-teal-700" />
                Registri Kehormatan & Mahasiswa Berprestasi
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 tracking-tight leading-tight">
                Rekam Jejak Prestasi Akademik
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
                Kompilasi raihan kejuaraan nasional, terpilihnya delegasi Call for Papers tingkat peradilan & universitas, serta publikasi jurnal ilmiah terindeks SINTA oleh mahasiswa dan kader FKHK.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#FAF7F2] p-3 rounded-lg border border-zinc-200 text-center shrink-0">
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-bold font-serif text-teal-900 leading-none">
                  {countKejuaraan}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-500 font-medium mt-1">Kejuaraan</div>
              </div>
              <div className="px-2 border-x border-zinc-200">
                <div className="text-xl sm:text-2xl font-bold font-serif text-teal-900 leading-none">
                  {countKonferensi}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-500 font-medium mt-1">Call for Papers</div>
              </div>
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-bold font-serif text-teal-900 leading-none">
                  {countJurnal}
                </div>
                <div className="text-[10px] sm:text-xs text-zinc-500 font-medium mt-1">Jurnal SINTA</div>
              </div>
            </div>
          </div>

          {/* Varied Category Tabs */}
          <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Semua Prestasi ({countAll})
              </button>
              <button
                onClick={() => setSelectedCategory("kejuaraan")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === "kejuaraan"
                    ? "bg-amber-700 text-white shadow-sm"
                    : "bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100"
                }`}
              >
                <TrophyIcon className="w-3.5 h-3.5 text-amber-500" />
                Juara & Podium ({countKejuaraan})
              </button>
              <button
                onClick={() => setSelectedCategory("konferensi")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === "konferensi"
                    ? "bg-teal-800 text-white shadow-sm"
                    : "bg-teal-50 text-teal-900 border border-teal-200/60 hover:bg-teal-100"
                }`}
              >
                <FileTextIcon className="w-3.5 h-3.5 text-teal-600" />
                Call for Papers ({countKonferensi})
              </button>
              <button
                onClick={() => setSelectedCategory("jurnal")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === "jurnal"
                    ? "bg-blue-800 text-white shadow-sm"
                    : "bg-blue-50 text-blue-900 border border-blue-200/60 hover:bg-blue-100"
                }`}
              >
                <BookOpenIcon className="w-3.5 h-3.5 text-blue-600" />
                Publikasi Jurnal ({countJurnal})
              </button>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500">Tahun:</span>
              <button
                onClick={() => setSelectedYear("all")}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedYear === "all"
                    ? "bg-zinc-800 text-white font-medium"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Semua
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedYear === y
                      ? "bg-zinc-800 text-white font-medium"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama peraih, penyelenggara, atau judul penelitian..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {loading ? (
          <div className="py-20 text-center text-sm text-zinc-500">
            Memuat arsip pencapaian resmi...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-white border border-zinc-200 rounded-lg p-8">
            <GraduationCapIcon className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-zinc-800 text-base">Tidak ada catatan prestasi ditemukan</h3>
            <p className="text-xs text-zinc-500 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter kategori di atas.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* VARIATION 1: Section Kejuaraan & Podium */}
            {filtered.some((x) => x.category === "kejuaraan") && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-200">
                  <TrophyIcon className="w-5 h-5 text-amber-600" />
                  <h2 className="font-serif font-bold text-lg text-zinc-900">
                    Podium & Juara Kompetisi Ilmiah
                  </h2>
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    Kompetisi Nasional
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered
                    .filter((x) => x.category === "kejuaraan")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="relative bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 border-2 border-amber-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-600 text-white font-bold text-xs tracking-wide uppercase shadow-sm">
                              <MedalIcon className="w-3.5 h-3.5" />
                              {item.rankLabel}
                            </span>
                            <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                              Tahun {item.year}
                            </span>
                          </div>

                          {/* Competition Title */}
                          <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-950 leading-snug">
                            {item.mainTitle}
                          </h3>

                          {/* Organizer */}
                          {item.institution && (
                            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-zinc-700 bg-white/90 p-2 rounded border border-amber-200">
                              <BuildingIcon className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                              <span className="font-medium">{item.institution}</span>
                            </div>
                          )}
                        </div>

                        {/* Recipient Profile Ribbon */}
                        <div className="mt-5 pt-3 border-t border-amber-200/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {item.photo ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                                <Image
                                  src={item.photo}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 font-bold font-serif text-sm flex items-center justify-center border-2 border-amber-400 shrink-0">
                                {item.initials || item.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-zinc-900 text-sm">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-amber-800 font-medium">
                                Delegasi Mahasiswa FKHK
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-semibold uppercase tracking-wider">
                              <CheckCircleIcon className="w-3 h-3 text-amber-600" /> Terverifikasi
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* VARIATION 2: Section Call for Papers / Konferensi */}
            {filtered.some((x) => x.category === "konferensi") && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-teal-200">
                  <FileTextIcon className="w-5 h-5 text-teal-700" />
                  <h2 className="font-serif font-bold text-lg text-zinc-900">
                    Call for Papers & Konferensi Nasional
                  </h2>
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-200">
                    Penulis Terpilih
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {filtered
                    .filter((x) => x.category === "konferensi")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-zinc-200 rounded-lg p-4 hover:border-teal-700/60 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                              <MedalIcon className="w-3 h-3 text-teal-600" />
                              Penulis Terpilih
                            </span>
                            <span className="text-[11px] text-zinc-500 font-medium">
                              Tahun {item.year}
                            </span>
                          </div>

                          <h3 className="font-serif font-semibold text-zinc-900 text-sm sm:text-base leading-snug">
                            {item.mainTitle}
                          </h3>

                          {item.institution && (
                            <div className="mt-2 text-xs text-zinc-600 flex items-start gap-1.5">
                              <BuildingIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                              <span>{item.institution}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2.5">
                          {item.photo ? (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shrink-0">
                              <Image
                                src={item.photo}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-semibold text-xs flex items-center justify-center shrink-0">
                              {item.initials || item.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-zinc-900 truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              Kader Peneliti FKHK
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* VARIATION 3: Section Publikasi Jurnal Ilmiah */}
            {filtered.some((x) => x.category === "jurnal") && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-200">
                  <BookOpenIcon className="w-5 h-5 text-blue-700" />
                  <h2 className="font-serif font-bold text-lg text-zinc-900">
                    Publikasi Jurnal Ilmiah Terakreditasi
                  </h2>
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                    SINTA Indexed
                  </span>
                </div>

                <div className="space-y-3">
                  {filtered
                    .filter((x) => x.category === "jurnal")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border-2 border-blue-200 rounded-xl p-5 sm:p-6 shadow-sm hover:border-blue-400 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
                      >
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded bg-blue-700 text-white font-bold text-xs uppercase tracking-wide">
                              SINTA 4
                            </span>
                            <span className="text-xs font-medium text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Jurnal Nasional Terakreditasi
                            </span>
                            <span className="text-xs text-zinc-500">
                              Tahun {item.year}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-900 leading-snug">
                            {item.mainTitle}
                          </h3>

                          {item.institution && (
                            <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 font-medium">
                              Volume & Terbitan: {item.institution}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 shrink-0">
                          {item.photo ? (
                            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-blue-300 shrink-0">
                              <Image
                                src={item.photo}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-900 font-bold font-serif text-sm flex items-center justify-center border-2 border-blue-200 shrink-0">
                              {item.initials || item.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-zinc-900 text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Penulis / Peneliti Mahasiswa
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
