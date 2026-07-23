"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "../Reveal";

const features = [
  {
    id: "feature-publikasi",
    title: "Publikasi & Artikel",
    desc: "Baca karya tulis ilmiah, esai hukum, dan analisis mendalam dari anggota FKHK tentang berbagai isu Hukum Keluarga Islam kontemporer.",
    link: "/articles",
    linkLabel: "Lihat Semua Artikel",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
  },
  {
    id: "feature-kegiatan",
    title: "Kegiatan & Event",
    desc: "Ikuti kajian rutin, seminar, diskusi publik, dan berbagai program kegiatan yang dirancang untuk memperluas wawasan hukum anggota.",
    link: "/events",
    linkLabel: "Lihat Semua Kegiatan",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    ),
  },
  {
    id: "feature-bergabung",
    title: "Bergabung & Berkontribusi",
    desc: "Daftarkan diri sebagai member, submit tulisanmu, dan jadilah bagian dari komunitas akademik Hukum Keluarga Islam yang aktif dan produktif.",
    link: "/auth/login",
    linkLabel: "Masuk",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24" id="features">
      <div className="container mx-auto px-4 max-w-[1240px]">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Reveal key={f.id} variant="fade-up" delay={i * 0.08} className="h-full">
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col"
                whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(44, 88, 87, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#2C5857" className="w-6 h-6">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">{f.desc}</p>
                <Link href={f.link} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition no-underline mt-auto">
                  {f.linkLabel}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
