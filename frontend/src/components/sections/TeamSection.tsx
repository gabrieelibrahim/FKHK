"use client";

import { useTranslations } from "next-intl";
import { Link as LocaleLink } from "@/i18n/navigation";
import Link from "next/link";
import Image from "next/image";

export default function TeamSection() {
  const t = useTranslations("home.team");

  return (
    <section className="relative overflow-hidden" id="team">
      <div className="relative h-[400px] sm:h-[500px]">
        <Image
          src="/assets/images/team-fkhk.webp"
          alt="Tim FKHK bersama"
          fill
          priority={false}
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />
        {/* Fade ke background section (atas terang, bawah gelap) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fcfaf8] via-transparent to-[#1a2e2e]" />
        {/* Scrim gelap merata supaya teks putih selalu kontras di semua area foto */}
        <div className="absolute inset-0 bg-[#122a29]/55" />
        {/* Gradient ekstra dari kiri (belakang blok teks) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e2322]/85 via-[#0e2322]/35 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-[1240px]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-3 block [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
                  {t("badge")}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]">
                  {t("heading")}<br />
                  <em className="not-italic">{t("headingItalic")}</em>
                </h2>
                <p className="text-sm sm:text-base text-white/95 mt-3 leading-relaxed [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                  {t("desc")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth/login"
                  className="px-6 py-3 bg-[#E8A33D] text-white font-medium rounded-full text-sm hover:bg-[#d4922f] transition-colors shadow-lg no-underline"
                >
                  {t("btnRegister")}
                </Link>
                <LocaleLink
                  href="/tentang"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-full text-sm hover:bg-white/30 transition-colors border border-white/30 no-underline"
                >
                  {t("btnLearnMore")}
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
