'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

const TOTAL_FRAMES = 56;

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<'visi' | 'misi'>('visi');
  const [isPinned, setIsPinned] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameIndexRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = framesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = cw / scale;
    const sh = ch / scale;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    currentFrameIndexRef.current = frameIdx;
  }, []);

  // Preload frames dan sync canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameIndexRef.current);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });

    const loadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/assets/images/about-sequence/frame_${numStr}.webp`;
      if (i === 1) {
        img.onload = () => {
          drawFrame(0);
        };
      }
      loadedImages.push(img);
    }
    framesRef.current = loadedImages;

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [drawFrame]);

  // Scroll listener: frame video HANYA bergerak saat di-scroll!
  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameIdRef.current) return;

      animationFrameIdRef.current = requestAnimationFrame(() => {
        animationFrameIdRef.current = null;
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Pin canvas saat section #tentang sedang melewati viewport
        const pinned = rect.top <= 0 && rect.bottom > 0;
        setIsPinned(pinned);

        // Progress scroll dihitung dari awal section sampai akhir section
        const scrollDistance = rect.height - windowHeight;
        if (scrollDistance <= 0) return;

        const scrolled = Math.max(0, -rect.top);
        const progress = Math.min(1, scrolled / scrollDistance);

        const targetIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * TOTAL_FRAMES)
        );

        if (targetIndex !== currentFrameIndexRef.current) {
          drawFrame(targetIndex);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [drawFrame]);

  return (
    <section ref={sectionRef} id="tentang" className="relative w-full">
      {/*
        Background Video/Canvas Layer
        - Fixed ke viewport saat section #tentang sedang di-scroll (pinned).
        - Absolute di awal/akhir section agar tidak mengganggu layout di luar section.
        - Frame berubah mengikuti scroll progress.
        - Warna asli tanpa overlay/tint tambahan.
      */}
      <div
        className={`${
          isPinned ? 'fixed' : 'absolute'
        } top-0 left-0 w-full h-screen z-0 overflow-hidden pointer-events-none`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block"
        />
      </div>

      {/*
        Foreground Content Layer
        - Meluncur di atas background video saat di-scroll.
        - Mencakup Latar Belakang sampai Visi & Misi.
      */}
      <div className="relative z-10 pt-20 md:pt-28 pb-[400px] sm:pb-[500px]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">

          {/* Section 1: Latar Belakang */}
          <div className="bg-white/60 backdrop-blur-[6px] rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/40 ring-1 ring-black/5">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Foto Dokumentasi Asli */}
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

              {/* Teks Latar Belakang */}
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

          {/* Section 2: Visi & Misi */}
          <div id="visi-misi" className="bg-white/60 backdrop-blur-[6px] rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/40 ring-1 ring-black/5">
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

              {/* Tab Selector */}
              <div className="inline-flex mt-6 p-1.5 rounded-2xl bg-white/70 backdrop-blur-[6px] border border-white/50 shadow-sm">
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

            {/* Konten Tab */}
            {activeTab === 'visi' ? (
              <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-white/60 backdrop-blur-[6px] border border-white/50 shadow-sm text-center">
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
                    className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/60 backdrop-blur-[6px] border border-white/50 shadow-sm"
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
    </section>
  );
}
