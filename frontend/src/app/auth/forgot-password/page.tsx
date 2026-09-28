"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Terjadi kesalahan");
      setNotice({ type: "ok", text: data.message });
    } catch (err: any) {
      setNotice({ type: "err", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f4f7f7] px-4 py-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#2C5857]/8 blur-[100px]" />
        <div className="absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-[#3a6e6d]/10 blur-[120px]" />
      </div>

      <Link
        href="/auth/login"
        className="group absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-medium text-[#2C5857] shadow-sm ring-1 ring-[#2C5857]/10 backdrop-blur-md transition-all duration-200 hover:bg-white hover:ring-[#2C5857]/25 hover:shadow-md sm:left-8 sm:top-8"
        aria-label="Kembali ke halaman login"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="hidden sm:inline">Kembali</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[26rem]"
      >
        <div className="rounded-[20px] border border-[#2C5857]/10 bg-white/95 p-7 shadow-[0_16px_48px_rgba(44,88,87,0.10),0_4px_16px_rgba(44,88,87,0.06)] backdrop-blur-sm sm:p-9">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#2C5857]/10 flex items-center justify-center text-[#2C5857] mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.025-1.563.304L10.5 15.5l-2.25.75.75-2.25 3.034-2.658c.279-.404.401-1 .304-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#2C5857]">
              Lupa Password
            </h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Masukkan email akunmu, kami kirim tautan reset password.
            </p>
          </div>

          {notice && (
            <div
              className={`mb-5 rounded-xl border p-3 text-sm ${
                notice.type === "ok"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {notice.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#374151]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@email.com"
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-[15px] text-[#1a1a1a] placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-[#2C5857] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2C5857] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#234746] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Mengirim..." : "Kirim Tautan Reset"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            Ingat passwordnya?{" "}
            <Link href="/auth/login" className="font-medium text-[#2C5857] hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
