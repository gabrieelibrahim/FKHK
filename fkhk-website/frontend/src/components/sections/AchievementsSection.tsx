"use client";

import { useState, useEffect } from "react";
import Reveal from "../Reveal";
import StaggerContainer from "../StaggerContainer";

interface Achievement {
  id: number;
  name: string;
  title: string;
  year: string;
  initials: string;
}

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((res) => {
        if (res?.data) setAchievements(res.data);
        else setAchievements([
          { id: 1, name: "M. Riziq Fauzi", title: "Juara 1 Lomba Esai Hukum Nasional", year: "2026", initials: "MR" },
          { id: 2, name: "Aulia Eka Salsabila", title: "Publikasi di Jurnal Terakreditasi Sinta 3", year: "2026", initials: "AE" },
          { id: 3, name: "Najma Ulya I.", title: "Pembicara Seminar Regional Hukum Islam", year: "2025", initials: "NU" },
          { id: 4, name: "Nabila Febryanti", title: "Juara 2 Debat Hukum Antar Kampus", year: "2025", initials: "NF" },
        ]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return (
    <section className="py-16 sm:py-24" id="prestasi">
      <div className="container mx-auto px-4 max-w-[1240px]">
        <div className="flex items-end justify-between mb-10">
          <Reveal variant="fade-left">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              Prestasi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-2">
              Kebanggaan Anggota<br />FKHK
            </h2>
          </Reveal>
          <Reveal variant="fade-right">
            <a
              href="/prestasi"
              className="inline-flex px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition no-underline"
            >
              Lihat Semua
            </a>
          </Reveal>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5" staggerDelay={0.07}>
            {achievements.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">{a.initials}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{a.name}</p>
                <h4 className="text-xs text-gray-600 mb-2 leading-relaxed">{a.title}</h4>
                <span className="text-[0.65rem] font-semibold text-gray-400">{a.year}</span>
              </div>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
