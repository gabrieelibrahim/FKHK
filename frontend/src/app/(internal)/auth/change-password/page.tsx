"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { member, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = searchParams.get("forced") === "1";

  useEffect(() => {
    if (!authLoading && !member) {
      router.push("/auth/login");
    }
  }, [member, authLoading, router]);

  const rules = [
    { label: "Minimal 6 karakter", ok: newPassword.length >= 6 },
    { label: "Tidak sama dengan password lama", ok: newPassword.length > 0 && newPassword !== currentPassword },
    { label: "Konfirmasi password cocok", ok: newPassword.length > 0 && newPassword === confirmPassword },
  ];

  const allValid = rules.every((r) => r.ok);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!allValid) {
      setError("Periksa kembali syarat password di bawah.");
      return;
    }
    setLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("fkhk_token="))
        ?.split("=")[1] || localStorage.getItem("fkhk_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengganti password");

      // Update localStorage member — flag mustChangePassword sudah false
      if (member) {
        localStorage.setItem("fkhk_member", JSON.stringify({ ...member, mustChangePassword: false }));
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f4f7f7] px-4 py-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#2C5857]/8 blur-[100px]" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#3a6e6d]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-[#2C5857] flex items-center justify-center text-white font-bold">
            FK
          </div>
          <div>
            <div className="text-sm font-bold text-[#1A1A1A]">FKHK</div>
            <div className="text-[11px] text-[#6B7280]">Forum Kajian Hukum Keluarga</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-[#2C5857]/10">
          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-[#1A1A1A]">Password Berhasil Diganti</h1>
              <p className="mt-2 text-sm text-[#6B7280]">
                Akun kamu sekarang lebih aman. Kamu akan diarahkan ke dashboard.
              </p>
              <button
                onClick={() => {
                  window.location.href = member && (member.role === "admin" || member.role === "superadmin" || member.role === "admin_kaset" || member.role === "admin_psdm" || member.role === "admin_bph")
                    ? "/admin"
                    : "/dashboard";
                }}
                className="mt-6 w-full rounded-xl bg-[#2C5857] py-3 text-sm font-semibold text-white transition hover:bg-[#1e3e3d]"
              >
                Lanjut ke Dashboard
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-bold text-[#1A1A1A]">
                {forced ? "Wajib Ganti Password" : "Ganti Password"}
              </h1>
              <p className="mt-1.5 text-sm text-[#6B7280]">
                {forced
                  ? "Karena kamu login dengan password default dari admin, buat password baru yang hanya kamu ketahui."
                  : "Buat password baru untuk akun kamu."}
              </p>

              {member && (
                <div className="mt-4 rounded-xl bg-[#2C5857]/5 px-4 py-3 text-xs text-[#2C5857]">
                  Akun: <span className="font-semibold">{member.email}</span>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                    Password Lama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#1A1A1A] transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                    Password Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#1A1A1A] transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                    Konfirmasi Password Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#1A1A1A] transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C5857]"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2C5857] focus:ring-[#2C5857]"
                  />
                  Tampilkan password
                </label>

                <div className="space-y-1.5 rounded-xl bg-[#F9FAFB] p-3.5">
                  {rules.map((r) => (
                    <div key={r.label} className="flex items-center gap-2 text-xs">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${
                          r.ok ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className={r.ok ? "text-emerald-700" : "text-[#6B7280]"}>{r.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || !allValid}
                  className="w-full rounded-xl bg-[#2C5857] py-3 text-sm font-semibold text-white transition hover:bg-[#1e3e3d] disabled:bg-gray-300"
                >
                  {loading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>

                {!forced && (
                  <Link
                    href="/dashboard"
                    className="block text-center text-xs font-medium text-[#6B7280] transition hover:text-[#2C5857]"
                  >
                    Batal, kembali ke dashboard
                  </Link>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
