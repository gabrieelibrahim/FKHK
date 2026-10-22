"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f2ed] px-4 text-center">
      <div className="mb-6 select-none">
        <span className="block text-[7rem] sm:text-[9rem] font-bold leading-none tracking-tight text-[#2C5857]/15">
          500
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2C5857]">
        Terjadi Kesalahan
      </h1>
      <p className="mt-3 max-w-md text-sm sm:text-base text-gray-500 leading-relaxed">
        Maaf, terjadi kesalahan tak terduga di server kami. Silakan coba lagi
        beberapa saat.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-[#2C5857] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#234746]"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="rounded-xl border border-[#2C5857]/20 bg-white px-6 py-3 text-sm font-semibold text-[#2C5857] shadow-sm transition hover:bg-[#2C5857]/5"
        >
          Kembali ke Beranda
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-gray-400">Kode error: {error.digest}</p>
      )}
    </div>
  );
}
