"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, member } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (member) {
      router.push(member.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [member, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.token, data.member);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f4f7f7] px-4 py-8">
      {/* Ambient background — subtle, not loud */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#2C5857]/8 blur-[100px]" />
        <div className="absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-[#3a6e6d]/10 blur-[120px]" />
      </div>

      {/* Back button — top-left, subtle, blends in */}
      <Link
        href="/"
        className="group absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-medium text-[#2C5857] shadow-sm ring-1 ring-[#2C5857]/10 backdrop-blur-md transition-all duration-200 hover:bg-white hover:ring-[#2C5857]/25 hover:shadow-md sm:left-8 sm:top-8"
        aria-label="Kembali ke beranda"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="hidden sm:inline">Beranda</span>
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[26rem]"
      >
        <div className="rounded-[20px] border border-[#2C5857]/10 bg-white/95 p-7 shadow-[0_16px_48px_rgba(44,88,87,0.10),0_4px_16px_rgba(44,88,87,0.06)] backdrop-blur-sm sm:p-9">
          {/* Brand */}
          <div className="mb-7 flex flex-col items-center text-center">
            <h1 className="text-[1.75rem] font-bold tracking-tight text-[#2C5857] leading-tight">
              FKHK
            </h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Forum Kajian Hukum Keluarga
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75v.008M5.683 19.5h12.634a1.5 1.5 0 001.305-2.242l-6.317-11.4a1.5 1.5 0 00-2.61 0L4.378 17.258A1.5 1.5 0 005.683 19.5z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#374151]"
              >
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

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#374151]"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-[#2C5857]/70 hover:text-[#2C5857] hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 pr-12 text-[15px] text-[#1a1a1a] placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-[#2C5857] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-400 transition hover:text-[#2C5857]"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.494 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.506 0 8.774 3.162 10.066 7.5a10.523 10.523 0 01-4.157 5.345M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.945 7.945L21 21m-3.272-3.272l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.12 12.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C5857] px-4 py-2.5 text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1e3e3d] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2C5857]/40 focus:ring-offset-2 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Memuat...</span>
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
