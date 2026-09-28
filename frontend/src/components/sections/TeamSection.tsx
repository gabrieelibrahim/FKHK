"use client";

import Link from "next/link";

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden" id="team">
      <div className="relative h-[400px] sm:h-[500px]">
        <img
          src="/assets/images/team-fkhk.jpg"
          alt="Tim FKHK bersama"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcfaf8] via-transparent to-[#1a2e2e]" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-[1240px]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-3 block [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
                  Bergabung dengan Kami
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
                  Bersama Kita Wujudkan<br />
                  <em className="not-italic">Kajian yang Berdampak</em>
                </h2>
                <p className="text-sm sm:text-base text-white/80 mt-4 leading-relaxed max-w-lg [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
                  Jadilah bagian dari komunitas akademik yang aktif, kritis, dan penuh semangat.
                  Daftarkan diri dan mulai perjalananmu bersama FKHK hari ini.
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-6 py-3 bg-[#1a2e2e] text-white rounded-xl font-semibold hover:bg-red-700 transition no-underline text-center"
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
