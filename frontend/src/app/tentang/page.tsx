"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TentangPage() {
  return (
    <div className="pt-[68px]">
      {/* ===== HERO ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white to-[#fcfaf8]">
        {/* subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.07,
        }} />
        {/* corner glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#7EF8F6] opacity-25 blur-[250px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#7EF8F6] opacity-20 blur-[250px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#7EF8F6] opacity-20 blur-[250px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#7EF8F6] opacity-25 blur-[250px] pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-[1240px] text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-accent text-sm font-semibold uppercase tracking-[0.2em]"
          >
            Tentang Kami
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6 leading-[1.1] text-gray-900"
          >
            Forum Kajian Hukum Keluarga
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto"
          >
            Wadah mahasiswa untuk berkarya, berdiskusi, dan berkontribusi dalam
            pengembangan Hukum Keluarga Islam yang berdampak nyata.
          </motion.p>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex justify-center gap-8 md:gap-12 mt-10 pt-10 border-t border-gray-200 max-w-lg mx-auto"
          >
            {[
              { angka: "50+", label: "Anggota Aktif" },
              { angka: "30+", label: "Publikasi" },
              { angka: "20+", label: "Kegiatan" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-primary">{s.angka}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section className="bg-[#fcfaf8] py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.15]">
                Mendorong{" "}
                <span className="text-primary">Perubahan Hukum</span> yang Bermakna
              </h2>
              <blockquote className="border-l-4 border-accent pl-5 italic text-gray-500 mb-6 text-lg leading-relaxed">
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

              <ul className="space-y-3 mt-8">
                {[
                  "Kajian mendalam isu Hukum Keluarga Islam kontemporer",
                  "Publikasi karya tulis anggota ke ranah publik",
                  "Program kegiatan reguler: seminar, diskusi, workshop",
                  "Jejaring mahasiswa lintas angkatan dan lintas kampus",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#2C5857" className="w-5 h-5 shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                  alt="Anggota FKHK berdiskusi"
                  className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full -z-10" />
            </div>
          </div>

          {/* visi-misi */}
          <div className="grid md:grid-cols-2 gap-8 mt-20">
            <Reveal>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2C5857" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Visi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi forum kajian hukum keluarga Islam yang unggul, inovatif, dan
                  berdampak dalam pengembangan keilmuan serta kontribusi nyata bagi masyarakat.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FDBB0B" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Misi</h3>
                <ul className="space-y-3 text-gray-600 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FDBB0B" className="w-5 h-5 shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Mendorong budaya akademik melalui kajian dan diskusi rutin
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FDBB0B" className="w-5 h-5 shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Memfasilitasi publikasi dan pengembangan karya tulis anggota
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FDBB0B" className="w-5 h-5 shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Membangun jejaring dengan institusi akademik dan profesional
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FDBB0B" className="w-5 h-5 shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Memberikan kontribusi nyata pada pengembangan hukum keluarga Islam
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== SEJARAH ===== */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Perjalanan</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">Sejarah FKHK</h2>
            <p className="text-gray-500">Dari awal berdiri hingga menjadi forum kajian terdepan</p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent" />

            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-0">
              {sejarah.map((s) => (
                <motion.div key={s.tahun} variants={itemAnim} className="relative pl-16 pb-12 last:pb-0">
                  <div className="absolute left-[1.35rem] top-1.5 w-3 h-3 rounded-full bg-accent border-[3px] border-white shadow-md" />
                  <span className="inline-block px-3 py-1 text-xs font-bold text-accent bg-accent/10 rounded-full mb-2">{s.tahun}</span>
                  <div className="bg-[#fcfaf8] rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
                    <p className="text-gray-700 leading-relaxed">{s.event}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STRUKTUR ===== */}
      <section className="bg-[#fcfaf8] py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Organisasi</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">Struktur Organisasi</h2>
            <p className="text-gray-500">Pengurus FKHK periode 2025/2026</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {struktur.map((p) => (
              <motion.div
                key={p.nama}
                variants={itemAnim}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <span className="text-lg font-bold text-white">{p.initials}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{p.nama}</p>
                <p className="text-xs text-accent font-semibold mt-1.5">{p.jabatan}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
