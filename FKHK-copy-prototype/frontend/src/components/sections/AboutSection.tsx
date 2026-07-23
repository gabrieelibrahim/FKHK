"use client";

import Reveal from "../Reveal";

export default function AboutSection() {
  return (
    <section className="py-24 bg-[#f7f2ed]" id="tentang">
      <div className="container mx-auto px-4 max-w-[1240px]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal variant="fade-left">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
                  alt="Anggota FKHK berdiskusi"
                  className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
            </div>
          </Reveal>

          <Reveal variant="fade-right">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">
              Tentang Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
              Kami Hadir untuk Mendorong{" "}
              <em className="text-primary not-italic">Perubahan Hukum</em> yang Bermakna
            </h2>
            <blockquote className="border-l-4 border-accent pl-5 italic text-gray-500 mb-6">
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
            <ul className="space-y-3 mb-8">
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
            <a
              href="/tentang"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition no-underline"
            >
              Selengkapnya tentang FKHK
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
