"use client";

import { useState } from "react";
import Link from "next/link";

const sejarah = [
  { tahun: "2020", event: "FKHK didirikan oleh sekelompok mahasiswa Hukum Keluarga Islam UIN Sunan Kalijaga" },
  { tahun: "2021", event: "Diskusi perdana dengan tema 'Reformasi Hukum Keluarga di Indonesia'" },
  { tahun: "2022", event: "Publikasi jurnal internal dan kerja sama dengan pusat studi hukum" },
  { tahun: "2023", event: "Seminar nasional pertama menghadirkan akademisi dari 5 universitas" },
  { tahun: "2024", event: "Anggota FKHK meraih prestasi di lomba esai dan debat nasional" },
  { tahun: "2025", event: "Program mentoring dan workshop penulisan ilmiah berjalan rutin" },
  { tahun: "2026", event: "FKHK menjadi forum kajian terdepan di bidang Hukum Keluarga Islam" },
];

const struktur = [
  { nama: "M. Riziq Fauzi", jabatan: "Ketua", initials: "MR" },
  { nama: "Ela Nur Hidayati", jabatan: "Sekretaris", initials: "EN" },
  { nama: "Najma Ulya I.", jabatan: "Bendahara", initials: "NU" },
  { nama: "Aulia Eka Salsabila", jabatan: "Kepala Divisi Kajian", initials: "AE" },
  { nama: "Nabila Febryanti", jabatan: "Kepala Divisi Publikasi", initials: "NF" },
  { nama: "Ahmad Fauzi", jabatan: "Kepala Divisi Humas", initials: "AF" },
];

export default function TentangPage() {
  const [aktifTab, setAktifTab] = useState<"tentang" | "sejarah" | "struktur">("tentang");

  return (
    <div className="pt-[68px]">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-[#0f1f1f] text-white">
        <div className="container mx-auto px-4 max-w-[1240px] py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="text-accent text-sm font-semibold uppercase tracking-[0.2em]">Tentang Kami</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6">
              Forum Kajian Hukum<br />
              <span className="text-accent">Keluarga</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Wadah mahasiswa untuk berkarya, berdiskusi, dan berkontribusi dalam
              pengembangan Hukum Keluarga Islam yang berdampak nyata.
            </p>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-accent via-accent-dark to-transparent" />
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-[68px] z-10">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="flex gap-0">
            {[
              { key: "tentang", label: "Tentang" },
              { key: "sejarah", label: "Sejarah" },
              { key: "struktur", label: "Struktur" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setAktifTab(tab.key as typeof aktifTab)}
                className={`px-6 py-4 text-sm font-semibold transition border-b-2 ${
                  aktifTab === tab.key
                    ? "text-primary border-primary"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="bg-[#fcfaf8]">
        <div className="container mx-auto px-4 max-w-[1240px] py-16">
          {aktifTab === "tentang" && (
            <div className="reveal grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                  Mendorong{" "}
                  <span className="text-primary">Perubahan Hukum</span> yang Bermakna
                </h2>
                <blockquote className="border-l-4 border-accent pl-5 italic text-gray-500 mb-6 text-lg">
                  &ldquo;Ilmu tanpa amal adalah pohon tanpa buah. FKHK hadir untuk
                  menjembatani kajian akademik dengan realitas hukum keluarga
                  di masyarakat.&rdquo;
                </blockquote>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Forum Kajian Hukum Keluarga (FKHK) adalah organisasi kemahasiswaan
                  yang bergerak di bidang kajian dan penelitian Hukum Keluarga Islam.
                  Kami mendorong anggota untuk aktif berkarya, berpikir kritis, dan
                  memberikan kontribusi nyata dalam pengembangan ilmu hukum.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { angka: "50+", label: "Anggota Aktif" },
                    { angka: "30+", label: "Publikasi" },
                    { angka: "20+", label: "Kegiatan" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-4 bg-white rounded-xl border border-gray-100">
                      <div className="text-2xl font-bold text-primary">{s.angka}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                    alt="Anggota FKHK berdiskusi"
                    className="w-full h-[450px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full -z-10" />
              </div>
            </div>
          )}

          {aktifTab === "sejarah" && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Perjalanan FKHK
              </h2>
              <p className="text-gray-500 mb-12">
                Dari awal berdiri hingga menjadi forum kajian terdepan
              </p>
              <div className="relative pl-8 border-l-2 border-accent/30">
                {sejarah.map((s, i) => (
                  <div key={s.tahun} className="relative pb-12 last:pb-0">
                    <div className="absolute -left-[calc(1rem+5px)] top-1 w-4 h-4 rounded-full bg-accent border-2 border-white shadow" />
                    <span className="text-sm font-bold text-accent">{s.tahun}</span>
                    <p className="text-gray-700 mt-1 leading-relaxed">{s.event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aktifTab === "struktur" && (
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Struktur Organisasi
              </h2>
              <p className="text-gray-500 mb-12">
                Pengurus FKHK periode 2025/2026
              </p>
              <div className="stagger grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {struktur.map((p) => (
                  <div
                    key={p.nama}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-lg font-bold text-primary">{p.initials}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 text-center">{p.nama}</p>
                    <p className="text-xs text-accent font-semibold text-center mt-1">{p.jabatan}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 max-w-[1240px] text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bergabung dengan FKHK
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Jadilah bagian dari komunitas akademik yang aktif, kritis, dan penuh semangat.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
