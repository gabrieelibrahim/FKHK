"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setNotice({ type: "err", text: "Konfirmasi password tidak sama" });
      return;
    }
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Terjadi kesalahan");
      setNotice({ type: "ok", text: data.message });
      setDone(true);
      setTimeout(() => router.push("/auth/login"), 2500);
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#2C5857]">
              Password Baru
            </h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Atur password baru untuk akunmu.
            </p>
          </div>

          {!token ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Token tidak ditemukan. Silakan minta tautan reset baru di{" "}
              <Link href="/auth/forgot-password" className="font-medium underline">
                lupa password
              </Link>
              .
            </div>
          ) : done ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 text-center">
              {notice?.text} Mengalihkan ke halaman login...
            </div>
          ) : (
            <>
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
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Minimal 6 karakter"
                      className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-[15px] text-[#1a1a1a] placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-[#2C5857] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "Sembunyikan" : "Lihat"}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Konfirmasi Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Ulangi password baru"
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-[15px] text-[#1a1a1a] placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:border-[#2C5857] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857]/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#2C5857] px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#234746] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#f4f7f7] px-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="skeleton h-7 w-2/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton mt-4 h-11 w-full rounded-xl" />
          </div>
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
