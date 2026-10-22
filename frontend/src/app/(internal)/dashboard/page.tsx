"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const cards = [
  {
    href: "/dashboard/submit",
    title: "Tulis Artikel",
    desc: "Kirim artikel baru untuk ditinjau",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/my-articles",
    title: "Artikel Saya",
    desc: "Lihat status artikel yang sudah dikirim",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    href: "/",
    title: "Lihat Website",
    desc: "Kembali ke beranda utama FKHK",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const { member } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
          Selamat Datang, {member?.name}!
        </h1>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
          <span>{member?.email}</span>
          <span className="text-gray-300">·</span>
          <span className="capitalize font-medium text-primary">{member?.role}</span>
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group block bg-white rounded-xl p-4 lg:p-5 border border-gray-200/80 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all no-underline"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
              {c.icon}
            </div>
            <h2 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{c.title}</h2>
            <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
