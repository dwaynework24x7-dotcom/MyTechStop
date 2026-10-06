import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const [common, nav, home, forms, ai, pages] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/nav.json`),
    import(`../../messages/${locale}/home.json`),
    import(`../../messages/${locale}/forms.json`),
    import(`../../messages/${locale}/ai.json`),
    import(`../../messages/${locale}/pages.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      nav: nav.default,
      home: home.default,
      forms: forms.default,
      ai: ai.default,
      pages: pages.default,
    },
  };
});
