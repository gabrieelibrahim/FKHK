import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const titles: Record<string, string> = {
    id: "Syarat & Ketentuan | FKHK",
    en: "Terms & Conditions | FKHK",
    ar: "الشروط والأحكام | منتدى دراسات قانون الأسرة",
  };
  const descriptions: Record<string, string> = {
    id: "Syarat dan ketentuan penggunaan situs Forum Kajian Hukum Keluarga (FKHK).",
    en: "Terms and conditions for using the Forum Kajian Hukum Keluarga (FKHK) website.",
    ar: "شروط وأحكام استخدام موقع منتدى دراسات قانون الأسرة الإسلامية.",
  };

  return {
    title: titles[locale] || titles.id,
    description: descriptions[locale] || descriptions.id,
    alternates: { canonical: `${getSiteUrl()}/ketentuan` },
  };
}

export default function TermsPage({ params: { locale } }: Props) {
  if (locale === "en") {
    return (
      <main className="min-h-screen bg-gray-50 pt-[90px] pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-[#2C5857] mb-2 font-serif">Terms & Conditions</h1>
            <p className="text-sm text-gray-400 mb-8">Last updated: January 2026</p>

            <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using the Forum Kajian Hukum Keluarga (FKHK) website, you agree to these Terms &amp; Conditions.
                  If you disagree, please discontinue your use of our site.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">2. Content Contribution</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Submitted articles undergo editorial review prior to publication.</li>
                  <li>You warrant that submitted material is original or appropriately authorized.</li>
                  <li>Submissions containing plagiarism, hate speech, or unlawful material will be rejected or removed.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">3. Comments & Community Discussion</h2>
                <p>
                  Comments appear after moderation. We reserve the right to remove spam, abusive language, or irrelevant content.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">4. Event Registration & Attendance</h2>
                <p>
                  Registration is open to registered participants and guests according to event terms. Capacity is limited and fulfilled on a first-come, first-served basis.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">5. Revisions</h2>
                <p>
                  FKHK may update these terms periodically. Continued platform use signifies acceptance of revised terms.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">6. Contact</h2>
                <p>
                  Questions regarding these terms may be sent to{" "}
                  <a href="mailto:fkhk@uin-suka.ac.id" className="text-[#2C5857] hover:underline font-medium">
                    fkhk@uin-suka.ac.id
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (locale === "ar") {
    return (
      <main className="min-h-screen bg-gray-50 pt-[90px] pb-16" dir="rtl">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-[#2C5857] mb-2 font-serif">الشروط والأحكام</h1>
            <p className="text-sm text-gray-400 mb-8">آخر تحديث: يناير ٢٠٢٦</p>

            <div className="space-y-6 text-sm text-gray-600 leading-relaxed text-right">
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">١. قبول الشروط</h2>
                <p>
                  بدخولك واستخدامك لموقع منتدى دراسات قانون الأسرة (FKHK)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم تكن موافقاً، يرجى التوقف عن استخدام الموقع.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٢. المساهمات والمقالات</h2>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>تخضع المقالات والأوراق العلمية المرسلة للتحكيم والمراجعة قبل نشرها.</li>
                  <li>يتحمل الكاتب المسؤولية الكاملة عن أصالة المحتوى وحقوق الملكية الفكرية.</li>
                  <li>يُحظر تماماً الانتحال العلمي أو الإساءة أو مخالفة الأنظمة والقوانين المعمول بها.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٣. التعليقات والنقاشات</h2>
                <p>
                  تخضع التعليقات للإشراف المسبق، وللمنتدى كامل الحق في حذف أي مشاركات غير لائقة أو مخالفة لمعايير الحوار الأكاديمي.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٤. التسجيل في الفعاليات والندوات</h2>
                <p>
                  التسجيل في الندوات وورش العمل متاح للطلاب والباحثين وفق شروط كل فعالية، وتكون الأولوية لأسبقية التسجيل مع مراعاة الطاقة الاستيعابية.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٥. تعديل الشروط</h2>
                <p>
                  يحتفظ المنتدى بحق تحديث وتعديل هذه الشروط في أي وقت. ويُعد استمرارك في استخدام الموقع موافقة على التحديثات الصادرة.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٦. التواصل والدعم</h2>
                <p>
                  لأي استفسار بخصوص الشروط والأحكام، يرجى مراسلتنا عبر البريد الإلكتروني:{" "}
                  <a href="mailto:fkhk@uin-suka.ac.id" className="text-[#2C5857] hover:underline font-medium">
                    fkhk@uin-suka.ac.id
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-[90px] pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-[#2C5857] mb-2 font-serif">Syarat & Ketentuan</h1>
          <p className="text-sm text-gray-400 mb-8">
            Terakhir diperbarui: Januari 2026
          </p>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. Penerimaan Ketentuan</h2>
              <p>
                Dengan mengakses dan menggunakan situs Forum Kajian Hukum
                Keluarga (FKHK), kamu menyetujui Syarat &amp; Ketentuan ini. Jika
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
                <a href="mailto:fkhk@uin-suka.ac.id" className="text-[#2C5857] hover:underline font-medium">
                  fkhk@uin-suka.ac.id
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
