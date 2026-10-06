import { getTranslations } from "next-intl/server";

import { legalPaths, primaryNav } from "@/config/navigation";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("home.footer");
  const nav = await getTranslations("nav");
  const legal = await getTranslations("pages.legal");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-signal pb-28">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:px-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="flex items-center gap-2 text-[12px] font-medium tracking-[0.16em] text-white">
            <span aria-hidden="true" className="size-2.5 bg-signal" />
            MY TECH STOP
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">{t("summary")}</p>
          <div className="mt-6">
            <LanguageSwitcher />
          </div>
        </div>
        <nav aria-label={nav("primary")}>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {primaryNav.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="text-white/75 hover:text-signal">
                  {nav(item.id)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-xs text-white/40 md:px-8">
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {legalPaths.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="hover:text-signal">
                {legal(item.id)}
              </Link>
            </li>
          ))}
        </ul>
        <p>
          © {year} My Tech Stop. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
