import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presensi Mandiri — FKHK UIN Sunan Kalijaga",
  description: "Portal check-in presensi mandiri kegiatan Forum Kajian Hukum Keluarga",
};

export default function PresensiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] fixed inset-0 z-[9999] overflow-y-auto">
      {children}
    </div>
  );
}
