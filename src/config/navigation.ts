export type NavItem = {
  id: "home" | "wholesale" | "sell" | "products" | "international" | "insights" | "about" | "contact";
  href: "/" | "/wholesale" | "/sell-to-us" | "/products" | "/international" | "/insights" | "/about" | "/contact";
};

export const primaryNav: readonly NavItem[] = [
  { id: "home", href: "/" },
  { id: "wholesale", href: "/wholesale" },
  { id: "sell", href: "/sell-to-us" },
  { id: "products", href: "/products" },
  { id: "international", href: "/international" },
  { id: "insights", href: "/insights" },
  { id: "about", href: "/about" },
  { id: "contact", href: "/contact" },
] as const;

export function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const legalPaths = [
  { id: "privacy", href: "/legal/privacy" },
  { id: "terms", href: "/legal/terms" },
  { id: "sale", href: "/legal/sale" },
  { id: "shipping", href: "/legal/shipping" },
  { id: "returns", href: "/legal/returns" },
] as const;
