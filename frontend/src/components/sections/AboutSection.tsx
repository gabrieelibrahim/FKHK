'use client';

import { useState } from 'react';
import Image from 'next/image';

const CHECKLIST = [
  'Kajian mendalam isu Hukum Keluarga Islam kontemporer',
  'Publikasi karya ilmiah dan opini hukum di media bereputasi',
  'Simulasi peradilan semu dan pelatihan advokasi praktis',
  'Pengabdian masyarakat dan penyuluhan hukum keluarga',
];

const MISI = [
  'Menyelenggarakan forum diskusi, kajian rutin, dan bedah kasus hukum keluarga Islam secara kritis dan komprehensif.',
  'Mendorong produktivitas riset dan penulisan ilmiah anggota di jurnal terakreditasi nasional maupun internasional.',
  'Memfasilitasi pelatihan kemahiran hukum praktis, termasuk mediasi, perancangan kontrak, dan peradilan semu.',
  'Membangun jejaring kolaborasi dengan lembaga peradilan, praktisi hukum, akademisi, dan organisasi kemasyarakatan.',
  'Memberikan edukasi dan advokasi hukum keluarga kepada masyarakat luas sebagai wujud pengabdian sosial.',
];

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<'visi' | 'misi'>('visi');

  return (
    <section id="tentang" className="relative w-full overflow-hidden bg-[#f7f2ed]">
      <div className="relative z-10 pt-20 md:pt-28 pb-16 sm:pb-24">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-14">

          {/* Latar Belakang */}
          <div className="bg-white/80 rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-white/60">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="/assets/images/about-fkhk.webp"
                  alt="Dokumentasi Forum Kajian Hukum Keluarga"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest text-[#D99B00] uppercase">
                  Latar Belakang
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">
                  Wadah Pengembangan{' '}
                  <span className="text-[#2C5857] italic">Hukum Keluarga Islam</span>
                </h2>
                <blockquote className="mt-4 pl-4 border-l-4 border-[#D99B00] text-sm sm:text-base italic text-stone-800">
                  &ldquo;Memastikan cinta, keadilan, dan tanggung jawab berjalan beriringan melalui penguatan keilmuan dan kemaslahatan keluarga.&rdquo;
                </blockquote>
                <p className="mt-4 text-sm sm:text-base text-stone-700 leading-relaxed">
                  Forum Kajian Hukum Keluarga (FKHK) hadir sebagai ruang kolaboratif mahasiswa untuk mengkaji isu-isu kontemporer hukum keluarga, mengasah kecakapan advokasi dan mediasi, serta mendorong riset aplikatif yang solutif bagi masyarakat.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {CHECKLIST.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800">
                      <span className="text-[#2C5857] font-bold text-base mt-[-2px]">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <a
                    href="#visi-misi"
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-[#2C5857] text-white font-semibold text-sm hover:bg-[#1e3e3d] transition-colors shadow-sm"
                  >
                    Visi & Misi FKHK
                  </a>
                  <span className="text-xs text-stone-600 font-medium">
                    Fakultas Syariah & Hukum UIN Sunan Kalijaga
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          <div id="visi-misi" className="bg-white/80 rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-white/60">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="text-xs font-bold tracking-widest text-[#D99B00] uppercase">
                Arah & Tujuan
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900">
                Visi & Misi Kami
              </h3>
              <p className="mt-3 text-sm text-stone-700">
                Landasan pijak dan langkah strategis FKHK dalam membentuk kader akademisi dan praktisi hukum keluarga yang progresif.
              </p>
              <div className="inline-flex mt-6 p-1.5 rounded-2xl bg-white/70 border border-white/50 shadow-sm">
                <button
                  onClick={() => setActiveTab('visi')}
                  className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'visi'
                      ? 'bg-[#2C5857] text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Visi
                </button>
                <button
                  onClick={() => setActiveTab('misi')}
                  className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'misi'
                      ? 'bg-[#2C5857] text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Misi
                </button>
              </div>
            </div>

            {activeTab === 'visi' ? (
              <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-white/70 border border-white/50 shadow-sm text-center">
                <div className="inline-block px-3 py-1 rounded-full bg-[#2C5857]/10 text-[#2C5857] text-xs font-bold uppercase tracking-wider mb-4">
                  Visi FKHK
                </div>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-stone-900 leading-relaxed italic">
                  &ldquo;Menjadi pusat kajian hukum keluarga Islam terkemuka yang melahirkan akademisi dan praktisi berintegritas, berwawasan progresif, dan berdedikasi bagi kemaslahatan umat dan bangsa.&rdquo;
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-3">
                {MISI.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/70 border border-white/50 shadow-sm"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#2C5857] text-white font-bold text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed pt-1">
                      {m}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Divider transisi ke Artikel */}
      <div className="relative z-10 w-full bg-[#FCFAF8] border-t border-stone-200 py-4" />
    </section>
  );
}
