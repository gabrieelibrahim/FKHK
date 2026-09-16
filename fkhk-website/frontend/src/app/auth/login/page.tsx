"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/common/Input";
import Reveal from "@/components/Reveal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, member } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
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
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#f4f7f7] py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <Reveal variant="scale-in" className="relative w-full max-w-md mx-4">
        <div className="relative rounded-2xl border border-primary/10 bg-white/95 p-8 shadow-[0_20px_50px_rgba(44,88,87,0.12)] backdrop-blur-sm space-y-6">
          <Link
            href="/"
            className="group absolute top-8 left-8 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/15 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 no-underline shadow-sm"
            aria-label="Kembali ke beranda"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary leading-tight">Masuk ke Akun</h2>
            <p className="text-sm text-gray-500 mt-1">Forum Kajian Hukum Keluarga</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl px-4 py-2 font-medium transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Memuat..." : "Masuk"}
            </button>
          </form>
        </div>
      </Reveal>
    </div>
  );
}
