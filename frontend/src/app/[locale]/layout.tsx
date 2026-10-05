import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import PageTransition from "@/components/PageTransition";
import LocaleHtmlSetter from "@/components/LocaleHtmlSetter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fkhk-uinsuka.web.id";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      absolute: t("title"),
      template: "%s | FKHK",
    },
    description: t("description"),
    alternates: {
      canonical: "./",
      languages: {
        "id-ID": siteUrl,
        "en-US": `${siteUrl}/en`,
        "ar-SA": `${siteUrl}/ar`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: locale === "id" ? siteUrl : `${siteUrl}/${locale}`,
      type: "website",
      locale: locale === "en" ? "en_US" : locale === "ar" ? "ar_SA" : "id_ID",
      siteName: "FKHK",
      images: [
        {
          url: "/og-image.jpg",
          secureUrl: "https://fkhk-uinsuka.web.id/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlSetter />
      <NavbarWrapper />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <FooterWrapper />
    </NextIntlClientProvider>
  );
}
