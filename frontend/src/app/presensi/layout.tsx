import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presensi FKHK — Absensi Kegiatan Online",
  description:
    "Halaman presensi online FKHK UIN Sunan Kalijaga. Isi kehadiran kegiatan, seminar, dan kajian FKHK langsung dari HP — cepat, tanpa ribet.",
  keywords: [
    "presensi FKHK",
    "absensi FKHK",
    "presensi online FKHK",
    "Presensi FKHK UIN Sunan Kalijaga",
    "absensi kegiatan FKHK",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Presensi FKHK — Absensi Kegiatan Online",
    description:
      "Isi kehadiran kegiatan, seminar, dan kajian FKHK UIN Sunan Kalijaga langsung dari HP.",
    url: "/presensi",
    type: "website",
    locale: "id_ID",
    siteName: "FKHK",
    images: ["/og-image.jpg"],
  },
};

export default function PresensiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
