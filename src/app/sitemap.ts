import type { MetadataRoute } from "next";

import { legalPaths, primaryNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { catalog } from "@/content/fallback/catalog";

const locales = ["en", "es"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [
    ...primaryNav.map((item) => item.href),
    ...catalog.map((item) => `/products/${item.slug}`),
    ...legalPaths.map((item) => item.href),
  ];

  return paths.flatMap((path) =>
    locales.map((locale) => {
      const suffix = path === "/" ? "" : path;
      return {
        url: `${siteConfig.url}/${locale}${suffix}`,
        lastModified,
        alternates: {
          languages: {
            en: `${siteConfig.url}/en${suffix}`,
            es: `${siteConfig.url}/es${suffix}`,
          },
        },
      };
    }),
  );
}
