import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import NavbarWrapper from "../components/layout/NavbarWrapper";
import FooterWrapper from "../components/layout/FooterWrapper";
import PageTransition from "../components/PageTransition";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} ${playfairDisplay.variable} font-body bg-[#fcfaf8] text-[#1a1a1a] overflow-x-hidden`}>
        <AuthProvider>
          <NavbarWrapper />
          <main><PageTransition>{children}</PageTransition></main>
          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
