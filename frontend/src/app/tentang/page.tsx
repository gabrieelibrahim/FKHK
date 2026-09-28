"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

/* ===== Data dari Booklet FKHK 2026 ===== */

const strukturBPH = [
  { nama: "Dr. Mansur, S.Ag., M.Ag., CM.", jabatan: "Pembina", initials: "DM" },
  { nama: "Tulus Mardiansyah", jabatan: "Ketua", initials: "TM" },
  { nama: "Hilma Elmumtaziya Adila", jabatan: "Wakil Ketua", initials: "HA" },
  { nama: "Najma Ulya Izzatunnisa'", jabatan: "Sekretaris", initials: "NI" },
  { nama: "Wanodya Pangarswari Husnussairi", jabatan: "Bendahara", initials: "WP" },
];

const divisi = [
  {
    nama: "Divisi Kajian dan Riset",
    icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
    anggota: [
      "Ashiil Naziyahil Enri Auni",
      "Saily Amalia",
      "Rihadatul 'Aisyi",
      "Fauzan Hafiz Razly",
      "Raezhard Rayhan Dio Akbari",
      "Nabila Febrianty",
    ],
  },
  {
    nama: "Divisi Advokasi",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    anggota: [
      "Azela Nafisa",
      "Zahwa Choirunnida",
      "Ghayda Zaneta",
      "Muhammad Fadhil Nurfatahilah",
      "Mhd. Zhairofi Nur",
      "Lutfiya Syauqi Akyas",
    ],
  },
  {
    nama: "Divisi Pengembangan SDM",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
    anggota: [
      "Muhammad Fikriyyatullah",
      "Irfan Brian Nur Adyatma",
      "Hasna Sa'diyah Zulfa",
      "Ahmad Devaky Raset Dananjaya",
      "Ardeliani",
      "Ela Nur Hidayati",
    ],
  },
  {
    nama: "Divisi Publikasi dan Relasi",
    icon: "M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5",
    anggota: [
      "Muhammad Riziq Fauzi",
      "Putri Nafidah Chumairo'",
      "Muhamad Rivan Syahir",
      "Muhammad Agung Zakiyuddin",
      "Muhammad Nauval Zabidy",
      "Aulia Eka Salsabilla",
    ],
  },
];

const misi = [
  "Meningkatkan pemahaman mahasiswa Hukum Keluarga Islam melalui kegiatan pendidikan, pelatihan, dan diskusi yang bersifat integratif dan interkonektif.",
  "Mendorong budaya riset dan kajian ilmiah dalam bidang Hukum Keluarga Islam secara multidisipliner dan aplikatif.",
  "Memberdayakan mahasiswa untuk berperan aktif dalam pengabdian masyarakat berbasis ilmu Hukum Keluarga Islam.",
  "Mengembangkan jejaring kerja sama dengan akademisi, praktisi, dan lembaga terkait untuk mendukung pengembangan Tri Dharma Perguruan Tinggi.",
  "Mewujudkan forum sebagai wadah aspirasi dan pengembangan keterampilan praktis mahasiswa Hukum Keluarga Islam dalam menyelesaikan isu-isu hukum keluarga.",
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
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.07,
        }} />
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
            Pioneering Research, Inspiring Insights — wadah mahasiswa untuk
            berkarya, berdiskusi, dan berkontribusi dalam pengembangan Hukum
            Keluarga Islam.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex justify-center gap-8 md:gap-12 mt-10 pt-10 border-t border-gray-200 max-w-lg mx-auto"
          >
            {[
              { angka: "4", label: "Divisi" },
              { angka: "29", label: "Pengurus" },
              { angka: "2026", label: "Periode" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-primary">{s.angka}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== LATAR BELAKANG ===== */}
      <section className="bg-[#fcfaf8] py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">
                Latar Belakang
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.15]">
                Wadah Pengembangan{" "}
                <span className="text-primary">Hukum Keluarga Islam</span>
              </h2>
              <blockquote className="border-l-4 border-accent pl-5 italic text-gray-500 mb-6 text-base sm:text-lg leading-relaxed">
                &ldquo;FKHK, sebuah organisasi yang didirikan untuk menjawab
                kebutuhan dan menjadi wadah bagi mahasiswa dalam memperdalam
                pengetahuan dan mengasah keterampilan untuk berkontribusi
                langsung dalam memecahkan permasalahan-permasalahan yang
                berkaitan dengan hukum keluarga. Forum ini bukan hanya sebagai
                tempat belajar, tetapi juga sebagai pusat kegiatan riset, diskusi
                dan pengabdian masyarakat.&rdquo;
                <footer className="mt-3 text-sm text-gray-400 not-italic">
                  — Dr. Mansur, S.Ag., M.Ag., CM. (Pembina FKHK)
                </footer>
              </blockquote>
              <p className="text-gray-600 leading-relaxed mb-4">
                Perkembangan kehidupan sosial masyarakat yang semakin kompleks
                memunculkan berbagai permasalahan dalam ranah hukum keluarga,
                seperti perceraian, sengketa hak asuh anak, pembagian warisan,
                serta persoalan lain yang memerlukan penyelesaian sesuai hukum
                positif dan nilai-nilai Islam.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Program Studi Hukum Keluarga Islam/Ahwal Syakhshiyyah (HKI/AS)
                di Universitas Islam Negeri Sunan Kalijaga Yogyakarta berkomitmen
                mencetak lulusan yang mampu menjawab tantangan tersebut. Namun,
                masih terdapat kendala dalam pengembangan kompetensi mahasiswa,
                khususnya belum tersedianya sarana pengembangan yang terintegrasi.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Forum Kajian Hukum Keluarga diharapkan dapat menjadi ruang bagi
                mahasiswa untuk meningkatkan kemampuan analisis, konsultasi, dan
                mediasi, sekaligus mendukung pelaksanaan Tridharma Perguruan
                Tinggi melalui kegiatan penelitian, diskusi akademik, serta
                pengabdian kepada masyarakat.
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

          {/* Visi & Misi */}
          <div className="grid md:grid-cols-2 gap-8 mt-20">
            <Reveal>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2C5857" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Visi FKHK</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi forum keilmuan yang unggul dalam pengembangan wawasan,
                  pengetahuan, dan keterampilan mahasiswa Hukum Keluarga Islam,
                  untuk mewujudkan peradaban yang berlandaskan ilmu integratif
                  dan aplikatif.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#D99B00" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Misi FKHK</h3>
                <ul className="space-y-3 text-gray-600 leading-relaxed">
                  {misi.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-accent font-bold text-xs mt-1 shrink-0">{i + 1}.</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== STRUKTUR ORGANISASI ===== */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1240px]">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">Organisasi</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">Struktur Organisasi</h2>
            <p className="text-gray-500">Susunan Pengurus FKHK Periode 2026</p>
          </div>

          {/* BPH */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
          >
            {strukturBPH.map((p) => (
              <motion.div
                key={p.nama}
                variants={itemAnim}
                className="group bg-gradient-to-b from-[#fcfaf8] to-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <span className="text-lg font-bold text-white">{p.initials}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{p.nama}</p>
                <p className="text-xs text-accent font-semibold mt-1.5">{p.jabatan}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Divisi */}
          <div className="grid md:grid-cols-2 gap-6">
            {divisi.map((d, idx) => (
              <Reveal key={d.nama} variant="fade-up" delay={idx * 0.1}>
                <div className="bg-[#fcfaf8] rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#D99B00" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d={d.icon} />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{d.nama}</h3>
                  </div>
                  <ul className="space-y-2">
                    {d.anggota.map((nama, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                        {nama}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUOTE / GALERI ===== */}
      <section className="bg-gradient-to-b from-[#fcfaf8] to-[#1a2e2e] py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-[1240px] text-center">
          <Reveal variant="fade-up">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#D99B00" className="w-12 h-12 mx-auto mb-6 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-white/90 leading-relaxed max-w-3xl mx-auto italic">
              &ldquo;Forum ini lahir dari keyakinan bahwa keluarga adalah tempat
              pertama cinta diajarkan. Maka melalui kajian hukum keluarga, kita
              berusaha memastikan bahwa cinta, keadilan, dan tanggung jawab dapat
              berjalan beriringan.&rdquo;
            </p>
            <p className="text-white/50 text-sm mt-8">
              Pioneering Research, Inspiring Insights
            </p>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
