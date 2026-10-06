import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/buttonStyles";

export default async function NotFound() {
  const t = await getTranslations("common");
  const nav = await getTranslations("nav");

  return (
    <main id="main" className="mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col justify-center px-4 pt-28">
      <p className="text-[11px] tracking-[0.18em] text-signal uppercase">404</p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight text-white">My Tech Stop</h1>
      <p className="mt-4 text-muted">{t("errorGeneric")}</p>
      <Link href="/" className={`${buttonClass("primary")} mt-8 w-fit`}>
        {nav("home")}
      </Link>
    </main>
  );
}
