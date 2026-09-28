"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Achievement {
  id: number;
  name: string;
  title: string;
  year: string;
  initials: string;
  photo?: string | null;
}

const fallbackData: Achievement[] = [
  { id: 1, name: "M. Riziq Fauzi", title: "Juara 1 Lomba Esai Hukum Nasional", year: "2026", initials: "MR" },
  { id: 2, name: "Aulia Eka Salsabila", title: "Publikasi di Jurnal Terakreditasi Sinta 3", year: "2026", initials: "AE" },
  { id: 3, name: "Najma Ulya I.", title: "Pembicara Seminar Regional Hukum Islam", year: "2025", initials: "NU" },
  { id: 4, name: "Nabila Febryanti", title: "Juara 2 Debat Hukum Antar Kampus", year: "2025", initials: "NF" },
  { id: 5, name: "Ahmad Fauzi", title: "Peneliti Muda Bidang Hukum Keluarga", year: "2025", initials: "AF" },
  { id: 6, name: "Ela Nur Hidayati", title: "Best Presenter Konferensi Mahasiswa Nasional", year: "2024", initials: "EN" },
];

export default function PrestasiPage() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [tahunFilter, setTahunFilter] = useState<string>("semua");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements`)
      .then((r) => r.json())
      .then((res) => setData(res.data || fallbackData))
      .catch(() => setData(fallbackData))
      .finally(() => setLoading(false));
  }, []);

  const tahunSet = ["semua", ...Array.from(new Set(data.map((a) => a.year)))].sort();
  const filtered = tahunFilter === "semua" ? data : data.filter((a) => a.year === tahunFilter);

  return (
    <div className="pt-[68px]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 max-w-[1240px] py-12 md:py-16 text-center">
          <span className="text-accent text-sm font-semibold uppercase tracking-[0.2em]">Prestasi</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-4 mb-6">
            Kebanggaan{" "}
            <span className="text-accent">Kami</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Berbagai pencapaian membanggakan yang diraih oleh anggota FKHK
          </p>
        </div>
        <div className="h-16 bg-gradient-to-b from-primary to-[#fcfaf8]" />
      </section>

      {/* Content */}
      <section className="bg-[#fcfaf8] py-16">
        <div className="container mx-auto px-4 max-w-[1240px]">
          {/* Filter */}
          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
            <span className="text-sm font-semibold text-gray-500 shrink-0">Filter:</span>
            {tahunSet.map((t) => (
              <button
                key={t}
                onClick={() => setTahunFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0 ${
                  tahunFilter === t
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {t === "semua" ? "Semua" : t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a, i) => (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
                >
                  <div className="flex items-start gap-4">
                    {a.photo ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}${a.photo}`} alt={a.name} className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-primary/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-base font-bold text-primary">{a.initials}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                      <h3 className="text-gray-600 text-sm mt-1 leading-relaxed">{a.title}</h3>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[0.65rem] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                          {a.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              Belum ada prestasi untuk tahun ini
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
