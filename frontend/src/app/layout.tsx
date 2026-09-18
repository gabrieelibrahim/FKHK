import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import NavbarWrapper from "../components/layout/NavbarWrapper";
import FooterWrapper from "../components/layout/FooterWrapper";
import PageTransition from "../components/PageTransition";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fkhk.id"),
  title: {
    default: "FKHK — Forum Kajian Hukum Keluarga",
    template: "%s | FKHK",
  },
  description:
    "Forum Kajian Hukum Keluarga (FKHK) — Wadah kajian, penelitian, dan pengembangan keilmuan di bidang Hukum Keluarga Islam.",
  keywords: [
    "FKHK",
    "Hukum Keluarga Islam",
    "Kajian Hukum",
    "Forum Akademik",
    "HKI",
    "UIN Sunan Kalijaga",
  ],
  openGraph: {
    title: "FKHK — Forum Kajian Hukum Keluarga",
    description:
      "Wadah kajian, penelitian, dan pengembangan keilmuan di bidang Hukum Keluarga Islam.",
    type: "website",
    locale: "id_ID",
    siteName: "FKHK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${bricolageGrotesque.variable} font-body bg-[#fcfaf8] text-[#1a1a1a] overflow-x-hidden`}>
        <AuthProvider>
          <NavbarWrapper />
          <main><PageTransition>{children}</PageTransition></main>
          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
