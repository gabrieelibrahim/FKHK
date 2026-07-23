"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NewsletterSignup from "../NewsletterSignup";
import Reveal from "../Reveal";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/fkhkuinsuka",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@fkhkuinsuka",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@fkhkuinsuka",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a2e2e] text-white py-16">
      <div className="container mx-auto px-4 max-w-[1240px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Col 1: Brand */}
          <Reveal variant="fade-up">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-[150px] h-11">
                  <img
                    src="/assets/logo/logo-fkhk-putih-brand.png"
                    alt="Logo FKHK"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Forum Kajian Hukum Keluarga — wadah mahasiswa untuk berkarya,
                berdiskusi, dan berkontribusi dalam pengembangan Hukum Keluarga Islam.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition"
                    aria-label={s.label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d={s.path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Col 2: Newsletter */}
          <Reveal variant="fade-up" delay={0.1}>
            <NewsletterSignup />
          </Reveal>

          {/* Col 3: Kontak */}
          <Reveal variant="fade-up" delay={0.2}>
            <div>
              <h4 className="text-sm font-semibold mb-4">Kontak</h4>
              <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>fkhk@uin-suka.ac.id</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Fakultas Syariah & Hukum,<br />UIN Sunan Kalijaga, Yogyakarta</span>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-white/10 h-[140px]">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=110.3881%2C-7.7889%2C110.3981%2C-7.7809&layer=mapnik&marker=-7.784912%2C110.393110"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(40%) contrast(1.05) brightness(0.7)" }}
                  allowFullScreen
                  loading="lazy"
                  title="Peta lokasi FKHK"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal variant="fade-up" delay={0.3}>
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>&copy; 2026 FKHK — Forum Kajian Hukum Keluarga. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white/60 transition">Privasi</Link>
              <Link href="#" className="hover:text-white/60 transition">Ketentuan</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
