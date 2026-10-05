"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminSettingsPage() {
  const { member } = useAuth();
  const [rateLimitDisabled, setRateLimitDisabled] = useState<boolean | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1];

  useEffect(() => {
    if (member?.role !== "superadmin") return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/rate-limit`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setRateLimitDisabled(Boolean(d.disabled));
        setUpdatedAt(d.updatedAt || "");
      })
      .catch(() => setError("Gagal memuat pengaturan"));
  }, [member]);

  const toggleRateLimit = async () => {
    if (rateLimitDisabled === null) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/rate-limit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ disabled: !rateLimitDisabled }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Gagal menyimpan");
      setRateLimitDisabled(Boolean(d.disabled));
      setUpdatedAt(d.updatedAt || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (member?.role !== "superadmin") {
    return (
      <div className="p-6 text-sm text-gray-500">
        Halaman ini hanya dapat diakses oleh superadmin.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Pengaturan</h1>
      <p className="text-sm text-gray-500 mb-6">Konfigurasi sistem website FKHK.</p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Rate Limit API</h2>
            <p className="text-sm text-gray-500 mt-1">
              Batas jumlah request API per 15 menit untuk mencegah spam dan brute force.
              Nonaktifkan sementara jika ada banyak pengguna mencoba login bersamaan (misal saat
              sosialisasi), lalu aktifkan kembali setelahnya.
            </p>
            {rateLimitDisabled && (
              <p className="text-xs text-red-600 mt-2 font-medium">
                Peringatan: rate limit sedang nonaktif — API terbuka terhadap spam dan brute force.
              </p>
            )}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(rateLimitDisabled)}
            disabled={saving || rateLimitDisabled === null}
            onClick={toggleRateLimit}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 disabled:opacity-50 ${
              rateLimitDisabled ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                rateLimitDisabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500">
          <span>
            Status:{" "}
            <span className={`font-medium ${rateLimitDisabled ? "text-red-600" : "text-emerald-600"}`}>
              {rateLimitDisabled === null ? "Memuat..." : rateLimitDisabled ? "Nonaktif" : "Aktif"}
            </span>
          </span>
          {updatedAt && (
            <span>Terakhir diubah: {new Date(updatedAt).toLocaleString("id-ID")}</span>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Catatan: superadmin selalu lolos rate limit meskipun fitur ini aktif, agar tidak terkunci
        saat perlu memperbaiki sistem.
      </p>
    </div>
  );
}
