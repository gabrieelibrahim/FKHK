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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fkhk-uinsuka.web.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FKHK — Forum Kajian Hukum Keluarga",
    template: "%s | FKHK",
  },
  description:
    "Forum Kajian Hukum Keluarga (FKHK) — Wadah kajian, penelitian, dan pengembangan keilmuan di bidang Hukum Keluarga Islam.",
  keywords: [
    "FKHK",
    "Forum Kajian Hukum Keluarga",
    "Hukum Keluarga Islam",
    "Kajian Hukum",
    "Forum Akademik",
    "HKI",
    "Keluarga Islam",
    "UIN Sunan Kalijaga",
  ],
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "googlee18fa4eec80fdf6b",
  },
  openGraph: {
    title: "FKHK — Forum Kajian Hukum Keluarga",
    description:
      "Wadah kajian, penelitian, dan pengembangan keilmuan di bidang Hukum Keluarga Islam.",
    url: siteUrl,
    type: "website",
    locale: "id_ID",
    siteName: "FKHK",
    images: [
      {
        url: "/og-image.jpg",
        secureUrl: "https://fkhk-uinsuka.web.id/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FKHK — Forum Kajian Hukum Keluarga",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FKHK — Forum Kajian Hukum Keluarga",
    description:
      "Wadah kajian, penelitian, dan pengembangan keilmuan di bidang Hukum Keluarga Islam.",
    images: ["/og-image.jpg"],
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Forum Kajian Hukum Keluarga",
      alternateName: ["FKHK", "Forum Kajian Hukum Keluarga UIN"],
      url: siteUrl,
      logo: `${siteUrl}/og-image.jpg`,
      description:
        "Wadah kajian, penelitian, dan pengembangan keilmuan di bidang Hukum Keluarga Islam.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "FKHK — Forum Kajian Hukum Keluarga",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/articles?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="image_src" href="https://fkhk-uinsuka.web.id/og-image.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
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
