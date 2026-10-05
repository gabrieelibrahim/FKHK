import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const titles: Record<string, string> = {
    id: "Kebijakan Privasi | FKHK",
    en: "Privacy Policy | FKHK",
    ar: "سياسة الخصوصية | منتدى دراسات قانون الأسرة",
  };
  const descriptions: Record<string, string> = {
    id: "Kebijakan privasi situs Forum Kajian Hukum Keluarga (FKHK).",
    en: "Privacy policy for the Forum Kajian Hukum Keluarga (FKHK) website.",
    ar: "سياسة الخصوصية وحماية البيانات في موقع منتدى دراسات قانون الأسرة.",
  };

  return {
    title: titles[locale] || titles.id,
    description: descriptions[locale] || descriptions.id,
    alternates: { canonical: `${getSiteUrl()}/privasi` },
  };
}

export default function PrivacyPage({ params: { locale } }: Props) {
  if (locale === "en") {
    return (
      <main className="min-h-screen bg-gray-50 pt-[90px] pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-[#2C5857] mb-2 font-serif">Privacy Policy</h1>
            <p className="text-sm text-gray-400 mb-8">Last updated: January 2026</p>

            <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
                <p>
                  Forum Kajian Hukum Keluarga (FKHK) collects information you provide directly, such as your name,
                  email address, student ID (NIM), and academic affiliation when registering as a member, submitting articles,
                  or checking in to activities.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">2. How We Use Information</h2>
                <p>The collected information is used to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Administer membership and article submissions</li>
                  <li>Verify event attendance and issue certificates where applicable</li>
                  <li>Maintain site security and operational integrity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">3. Information Sharing</h2>
                <p>
                  We do not sell, rent, or distribute personal information to third parties without consent, except where mandated by law.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">4. Your Rights</h2>
                <p>
                  You may request access to, correction of, or deletion of your personal records by contacting us at{" "}
                  <a href="mailto:fkhk@uin-suka.ac.id" className="text-[#2C5857] hover:underline font-medium">
                    fkhk@uin-suka.ac.id
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">5. Policy Updates</h2>
                <p>
                  This privacy policy may be revised periodically. Any changes will be posted on this page.
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
            <h1 className="text-3xl font-bold text-[#2C5857] mb-2 font-serif">سياسة الخصوصية</h1>
            <p className="text-sm text-gray-400 mb-8">آخر تحديث: يناير ٢٠٢٦</p>

            <div className="space-y-6 text-sm text-gray-600 leading-relaxed text-right">
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">١. البيانات التي نجمعها</h2>
                <p>
                  يقوم موقع منتدى دراسات قانون الأسرة (FKHK) بجمع البيانات المقدمة منكم طوعاً، مثل الاسم والبريد الإلكتروني ورقم القيد الجامعي (NIM) والجهة الأكاديمية عند التسجيل أو تقديم الأوراق العلمية أو تسجيل الحضور في الفعاليات.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٢. استخدام البيانات</h2>
                <p>تُستخدم البيانات المجمعة في الأغراض التالية:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>إدارة العضويات ومراجعة المقالات والمنشورات العلمية</li>
                  <li>توثيق الحضور وإصدار الشهادات للمشاركين في الندوات</li>
                  <li>الحفاظ على أمن وجودة الخدمات الأكاديمية للموقع</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٣. مشاركة البيانات مع الغير</h2>
                <p>
                  نلتزم بعدم بيع أو تأجير أو مشاركة بياناتكم الشخصية مع أي أطراف ثالثة دون موافقتكم المسبقة، إلا إذا استلزم ذلك القانون.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٤. حقوق المستخدم</h2>
                <p>
                  يحق لكم طلب تصحيح أو تحديث بياناتكم الشخصية عبر مراسلتنا على:{" "}
                  <a href="mailto:fkhk@uin-suka.ac.id" className="text-[#2C5857] hover:underline font-medium">
                    fkhk@uin-suka.ac.id
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">٥. تحديثات سياسة الخصوصية</h2>
                <p>
                  يجوز تحديث هذه السياسة من حين لآخر، وسيتم الإعلان عن أي تغيير في هذه الصفحة.
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
          <h1 className="text-3xl font-bold text-[#2C5857] mb-2 font-serif">Kebijakan Privasi</h1>
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
                <a href="mailto:fkhk@uin-suka.ac.id" className="text-[#2C5857] hover:underline font-medium">
                  fkhk@uin-suka.ac.id
                </a>.
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
