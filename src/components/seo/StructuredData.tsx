import { siteConfig } from "@/config/site";

type Props = {
  locale: string;
  description: string;
};

export function StructuredData({ locale, description }: Props) {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      description,
      knowsLanguage: ["en", "es"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: `${siteConfig.url}/${locale}`,
      inLanguage: locale,
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
