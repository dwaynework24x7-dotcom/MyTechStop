import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { AttributionCapture } from "@/components/providers/AttributionCapture";
import { InquiryProvider } from "@/components/providers/InquiryProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AIWidget } from "@/components/ai/AIWidget";
import { WhatsAppFloatingButton } from "@/components/whatsapp/WhatsAppFloatingButton";
import type { Locale } from "@/config/locale";

import "../globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");
  const typedLocale = locale as Locale;

  return (
    <html lang={locale} className={geist.className}>
      <body className="min-h-svh bg-ink text-metal antialiased">
        <NextIntlClientProvider messages={messages}>
          <InquiryProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
              {t("skip")}
            </a>
            <AttributionCapture />
            <Header locale={typedLocale} />
            {children}
            <Footer />
            <WhatsAppFloatingButton locale={typedLocale} label={t("whatsapp")} />
            <AIWidget locale={typedLocale} />
          </InquiryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
