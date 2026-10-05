import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan penggunaan situs Forum Kajian Hukum Keluarga (FKHK).",
  alternates: { canonical: `${getSiteUrl()}/ketentuan` },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-primary mb-2">Syarat & Ketentuan</h1>
          <p className="text-sm text-gray-400 mb-8">
            Terakhir diperbarui: Januari 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. Penerimaan Ketentuan</h2>
              <p>
                Dengan mengakses dan menggunakan situs Forum Kajian Hukum
                Keluarga (FKHK), kamu menyetujui Syarat & Ketentuan ini. Jika
                kamu tidak menyetujuinya, mohon untuk tidak menggunakan situs
                kami.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">2. Kontribusi Konten</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Artikel yang dikirim akan melalui proses tinjauan admin sebelum dipublikasikan</li>
                <li>Kamu bertanggung jawab memastikan konten yang dikirim adalah karya sendiri atau memiliki izin</li>
                <li>Konten yang mengandung plagiarisme, SARA, atau melanggar hukum akan ditolak/dihapus</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">3. Komentar</h2>
              <p>
                Komentar tampil setelah dimoderasi. Kami berhak menghapus
                komentar yang mengandung spam, ujaran kebencian, atau tidak
                relevan.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">4. Pendaftaran Kegiatan</h2>
              <p>
                Pendaftaran kegiatan bersifat terbuka bagi anggota terdaftar.
                Kapasitas terbatas dan dilayani sesuai urutan pendaftaran.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">5. Perubahan Ketentuan</h2>
              <p>
                FKHK dapat memperbarui ketentuan ini sewaktu-waktu. Penggunaan
                situs secara berkelanjutan dianggap sebagai persetujuan atas
                perubahan tersebut.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">6. Kontak</h2>
              <p>
                Pertanyaan mengenai ketentuan ini dapat disampaikan ke{" "}
                <a href="mailto:fkhk@uin-suka.ac.id" className="text-primary hover:underline">
                  fkhk@uin-suka.ac.id
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
