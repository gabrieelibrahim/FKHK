import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi situs Forum Kajian Hukum Keluarga (FKHK) UIN Sunan Kalijaga.",
  alternates: { canonical: `${getSiteUrl()}/privasi` },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-primary mb-2">Kebijakan Privasi</h1>
          <p className="text-sm text-gray-400 mb-8">
            Terakhir diperbarui: Januari 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. Data yang Kami Kumpulkan</h2>
              <p>
                Situs Forum Kajian Hukum Keluarga (FKHK) mengumpulkan data yang
                kamu berikan secara langsung, seperti nama, email, dan afiliasi
                saat mendaftar sebagai anggota, mengirim artikel, mendaftar
                kegiatan, atau berlangganan buletin.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">2. Penggunaan Data</h2>
              <p>Data yang dikumpulkan digunakan untuk:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mengelola keanggotaan dan kontribusi artikel</li>
                <li>Mengirim informasi kegiatan dan buletin (bila kamu berlangganan)</li>
                <li>Menjaga keamanan dan kualitas layanan situs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">3. Pembagian Data</h2>
              <p>
                Kami tidak menjual, menyewakan, atau membagikan data pribadimu
                kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh
                hukum yang berlaku.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">4. Hak Kamu</h2>
              <p>
                Kamu berhak meminta akses, koreksi, atau penghapusan data
                pribadimu dengan menghubungi kami melalui email{" "}
                <a href="mailto:fkhk@uin-suka.ac.id" className="text-primary hover:underline">
                  fkhk@uin-suka.ac.id
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">5. Perubahan Kebijakan</h2>
              <p>
                Kebijakan privasi ini dapat diperbarui dari waktu ke waktu.
                Perubahan akan dipublikasikan di halaman ini.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
