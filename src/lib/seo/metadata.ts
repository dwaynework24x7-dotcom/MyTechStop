import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export function pageMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        es: `${siteConfig.url}/es${path}`,
        "x-default": `${siteConfig.url}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: locale === "es" ? "es_419" : "en_US",
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}
