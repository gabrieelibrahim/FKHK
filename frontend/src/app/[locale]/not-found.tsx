import Link from "next/link";

// 404 untuk halaman publik — dirender di dalam [locale] layout
// (ada navbar + footer). Fase 1: diterjemahkan via useTranslations.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f2ed] px-4 text-center">
      <div className="mb-6 select-none">
        <span className="block text-[7rem] sm:text-[9rem] font-bold leading-none tracking-tight text-[#2C5857]/15">
          404
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2C5857]">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-3 max-w-md text-sm sm:text-base text-gray-500 leading-relaxed">
        Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau memang
        tidak pernah ada.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-[#2C5857] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#234746]"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/articles"
          className="rounded-xl border border-[#2C5857]/20 bg-white px-6 py-3 text-sm font-semibold text-[#2C5857] shadow-sm transition hover:bg-[#2C5857]/5"
        >
          Lihat Artikel
        </Link>
      </div>
    </div>
  );
}
