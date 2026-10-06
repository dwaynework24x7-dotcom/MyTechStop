import "server-only";

import { catalog, catalogItemBySlug, activeHeroProduct, type CatalogItem, type HeroProduct } from "@/content/fallback/catalog";

export type ContentSource = "fallback" | "cms";

/**
 * Inventory boundary.
 * Launch source: typed fallback content.
 * Availability is intentionally unavailable until a real inventory feed exists.
 */
export interface InventoryService {
  source: ContentSource;
  getFeaturedProducts(): CatalogItem[];
  getProducts(): CatalogItem[];
  getCategories(): CatalogItem[];
  getAvailability(): null;
  getProductBySlug(slug: string): CatalogItem | null;
  getHeroProduct(): HeroProduct | null;
}

export function getInventoryService(): InventoryService {
  return {
    source: "fallback",
    getFeaturedProducts: () => [...catalog],
    getProducts: () => [...catalog],
    getCategories: () => [...catalog],
    getAvailability: () => null,
    getProductBySlug: catalogItemBySlug,
    getHeroProduct: activeHeroProduct,
  };
}
