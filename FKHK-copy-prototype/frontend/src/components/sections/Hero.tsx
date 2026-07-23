"use client";

import { useEffect, useState } from "react";

const HERO_IMAGES = [
  "https://files.catbox.moe/yrbt1y.jpg",
  "https://files.catbox.moe/t59nfd.jpg",
  "https://files.catbox.moe/i9ua6x.jpg",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // preload first hero image
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = HERO_IMAGES[0];
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
      id="beranda"
    >
      {/* Background images */}
      {HERO_IMAGES.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover"
            style={{ transform: "translateY(0)" }}
            {...(i === 0 ? { fetchPriority: "high", loading: "eager" } : { loading: "lazy" })}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e2322]/90 via-[#1c3a39]/80 to-[#2c5857]/60" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 max-w-[1240px] mx-auto">
        <div className="max-w-2xl">
          <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white mb-6" style={{ animationDelay: "0.05s", textShadow: "0 4px 40px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.5)" }}>
            Pioneering Research,<br />
            <span className="text-white/90">Inspiring Insight</span>
          </h1>

          <p className="animate-fade-up text-base sm:text-lg text-white/90 max-w-2xl mb-10 leading-relaxed" style={{ animationDelay: "0.05s", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            FKHK adalah forum mahasiswa yang berkomitmen dalam kajian, penelitian,
            dan pengembangan keilmuan di bidang Hukum Keluarga Islam.
            Bersama kami, gagasan bertumbuh menjadi perubahan nyata.
          </p>

          <div className="animate-fade-up flex flex-col sm:flex-row gap-4" style={{ animationDelay: "0.05s" }}>
            <a
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition shadow-xl shadow-black/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Jelajahi Artikel
            </a>
            <a
              href="/#tentang"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white hover:text-[#1a2e2e] transition shadow-xl shadow-black/40"
            >
              Tentang Kami
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-white w-6" : "bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
