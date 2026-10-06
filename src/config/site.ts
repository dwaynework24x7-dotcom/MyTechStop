export const siteConfig = {
  name: "My Tech Stop",
  domain: "mytechstop.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://mytechstop.com").replace(/\/$/, ""),
} as const;
