'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<'visi' | 'misi'>('visi');
  const t = useTranslations('home.about');

  const checklist = [
    t('check1'),
    t('check2'),
    t('check3'),
    t('check4'),
  ];

  const misiList = [
    t('misi1'),
    t('misi2'),
    t('misi3'),
    t('misi4'),
    t('misi5'),
  ];

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
                  {t('badge')}
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">
                  {t('title')}{' '}
                  <span className="text-[#2C5857] italic">{t('titleHighlight')}</span>
                </h2>
                <blockquote className="mt-4 pl-4 border-l-4 border-[#D99B00] text-sm sm:text-base italic text-stone-800">
                  &ldquo;{t('quote')}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm sm:text-base text-stone-700 leading-relaxed">
                  {t('desc')}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {checklist.map((item, i) => (
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
                    {t('btnVisiMisi')}
                  </a>
                  <span className="text-xs text-stone-600 font-medium">
                    {t('faculty')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          <div id="visi-misi" className="bg-white/80 rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-white/60">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="text-xs font-bold tracking-widest text-[#D99B00] uppercase">
                {t('btnVisiMisi')}
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-stone-900">
                {t('visiTitle')} &amp; {t('misiTitle')}
              </h3>
              <div className="inline-flex mt-6 p-1.5 rounded-2xl bg-white/70 border border-white/50 shadow-sm">
                <button
                  onClick={() => setActiveTab('visi')}
                  className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'visi'
                      ? 'bg-[#2C5857] text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  {t('visiTitle')}
                </button>
                <button
                  onClick={() => setActiveTab('misi')}
                  className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'misi'
                      ? 'bg-[#2C5857] text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  {t('misiTitle')}
                </button>
              </div>
            </div>

            {activeTab === 'visi' ? (
              <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-white/70 border border-white/50 shadow-sm text-center">
                <div className="inline-block px-3 py-1 rounded-full bg-[#2C5857]/10 text-[#2C5857] text-xs font-bold uppercase tracking-wider mb-4">
                  {t('visiTitle')}
                </div>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-stone-900 leading-relaxed italic">
                  &ldquo;{t('visiText')}&rdquo;
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-3">
                {misiList.map((m, idx) => (
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

      <div className="relative z-10 w-full bg-[#FCFAF8] border-t border-stone-200 py-4" />
    </section>
  );
}
