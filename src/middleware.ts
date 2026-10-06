import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { isLocale } from "@/config/locale";
import { routing } from "@/i18n/routing";
import { LOCALE_COOKIE } from "@/lib/locale/localeCookie";
import { detectCountry } from "@/lib/locale/detectCountry";
import { resolveLocale } from "@/lib/locale/resolveLocale";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathLocale = pathname.split("/")[1];

  if (!isLocale(pathLocale)) {
    const locale = resolveLocale({
      cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value ?? null,
      country: detectCountry(request.headers),
      acceptLanguage: request.headers.get("accept-language"),
    });
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
