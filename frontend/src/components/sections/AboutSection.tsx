"use client";

import Image from "next/image";
import Reveal from "../Reveal";

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#f7f2ed]" id="tentang">
      <div className="container mx-auto px-4 max-w-[1240px]">
        {/* Latar Belakang */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center mb-20">
          <Reveal variant="fade-left">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg h-[280px] sm:h-[400px]">
                <Image
                  src="/assets/images/about-fkhk.webp"
                  alt="Anggota FKHK berdiskusi"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-2xl -z-10" />
            </div>
          </Reveal>

          <Reveal variant="fade-right">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-3 block">
              Latar Belakang
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-5 leading-tight">
              Wadah Pengembangan{" "}
              <em className="text-primary not-italic">Hukum Keluarga Islam</em>
            </h2>
            <blockquote className="border-l-4 border-accent pl-4 italic text-sm sm:text-base text-gray-600 mb-5">
              &ldquo;Memastikan cinta, keadilan, dan tanggung jawab berjalan beriringan melalui penguatan keilmuan dan kemaslahatan keluarga.&rdquo;
            </blockquote>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              Forum Kajian Hukum Keluarga (FKHK) hadir sebagai ruang kolaboratif mahasiswa untuk mengkaji isu-isu kontemporer hukum keluarga, mengasah kecakapan advokasi dan mediasi, serta mendorong riset aplikatif yang solutif bagi masyarakat.
            </p>
            <ul className="space-y-2.5 mb-7">
              {[
                "Kajian mendalam isu Hukum Keluarga Islam kontemporer",
                "Publikasi karya ilmiah dan opini hukum berkala",
                "Program reguler: seminar, diskusi publik, dan workshop mediasi",
                "Jejaring akademik dan praktisi hukum nasional",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#2C5857" className="w-4 h-4 shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#visi-misi"
              className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition no-underline"
            >
              Visi & Misi FKHK
            </a>
          </Reveal>
        </div>

        {/* Visi & Misi */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12" id="visi-misi">
          {/* Visi */}
          <Reveal variant="fade-up">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#D99B00" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Visi FKHK</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Menjadi forum keilmuan yang unggul dalam pengembangan wawasan,
                pengetahuan, dan keterampilan mahasiswa Hukum Keluarga Islam, untuk
                mewujudkan peradaban yang berlandaskan ilmu integratif dan aplikatif.
              </p>
            </div>
          </Reveal>

          {/* Misi */}
          <Reveal variant="fade-up" delay={0.1}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#D99B00" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Misi FKHK</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Meningkatkan pemahaman mahasiswa melalui pendidikan, pelatihan, dan diskusi yang bersifat integratif dan interkonektif.",
                  "Mendorong budaya riset dan kajian ilmiah multidisipliner dan aplikatif.",
                  "Memberdayakan mahasiswa untuk berperan aktif dalam pengabdian masyarakat berbasis Hukum Keluarga Islam.",
                  "Mengembangkan jejaring kerja sama dengan akademisi, praktisi, dan lembaga terkait untuk Tri Dharma Perguruan Tinggi.",
                  "Mewujudkan forum sebagai wadah aspirasi dan pengembangan keterampilan praktis mahasiswa.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-accent font-bold text-xs mt-1 shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
