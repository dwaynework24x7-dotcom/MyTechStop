import type { Localized } from "@/config/locale";

/**
 * FALLBACK CONTENT
 * Source: local typed content. A CMS is not connected.
 * Photographs in public/images are free Unsplash photos of device types.
 * They are not a photo of current stock and not a photo of a company facility.
 * Do not add prices, stock counts, delivery promises, or reviews here.
 */

export type HeroProduct = {
  id: string;
  manufacturer: string;
  title: string;
  active: boolean;
  /** Public image path. Null renders the built-in line drawing. */
  image: string | null;
  imageAlt: Localized;
  facts: { id: string; label: Localized; value: Localized }[];
};

export type CatalogItem = {
  id: string;
  slug: string;
  manufacturer: string;
  name: Localized;
  conditions: Localized;
  image: string | null;
  imageAlt: Localized;
};

export const heroProduct: HeroProduct = {
  id: "iphone-18-pro-max",
  manufacturer: "Apple",
  title: "iPhone 18 Pro Max",
  active: true,
  image: "/images/phone-hero.jpg",
  imageAlt: {
    en: "Photograph of a smartphone shown with the featured wholesale model",
    es: "Fotografía de un teléfono mostrada con el modelo destacado de mayoreo",
  },
  facts: [
    {
      id: "supply",
      label: { en: "Supply", es: "Suministro" },
      value: { en: "Wholesale", es: "Al por mayor" },
    },
    {
      id: "conditions",
      label: { en: "Conditions", es: "Condiciones" },
      value: { en: "New through graded", es: "Nuevos y con grado" },
    },
    {
      id: "price",
      label: { en: "Price", es: "Precio" },
      value: { en: "On request", es: "A solicitud" },
    },
  ],
};

export const catalog: readonly CatalogItem[] = [
  {
    id: "iphone",
    slug: "iphone",
    manufacturer: "Apple",
    name: { en: "iPhone", es: "iPhone" },
    conditions: {
      en: "New, sealed, open box, activated, and graded units.",
      es: "Unidades nuevas, selladas, de caja abierta, activadas y con grado.",
    },
    image: "/images/iphone.jpg",
    imageAlt: {
      en: "Photograph of an iPhone",
      es: "Fotografía de un iPhone",
    },
  },
  {
    id: "samsung",
    slug: "samsung",
    manufacturer: "Samsung",
    name: { en: "Samsung", es: "Samsung" },
    conditions: {
      en: "Galaxy phones across current wholesale conditions.",
      es: "Teléfonos Galaxy en las condiciones de mayoreo disponibles.",
    },
    image: "/images/samsung.jpg",
    imageAlt: {
      en: "Photograph of a Samsung phone",
      es: "Fotografía de un teléfono Samsung",
    },
  },
  {
    id: "ipad",
    slug: "ipad",
    manufacturer: "Apple",
    name: { en: "iPad", es: "iPad" },
    conditions: {
      en: "Tablets in new, open box, and used grades.",
      es: "Tablets nuevas, de caja abierta y usadas, según el grado.",
    },
    image: "/images/ipad.jpg",
    imageAlt: {
      en: "Photograph of an iPad",
      es: "Fotografía de un iPad",
    },
  },
  {
    id: "macbook",
    slug: "macbook",
    manufacturer: "Apple",
    name: { en: "MacBook", es: "MacBook" },
    conditions: {
      en: "Laptops offered by model and condition on request.",
      es: "Portátiles por modelo y condición, a solicitud.",
    },
    image: "/images/macbook.jpg",
    imageAlt: {
      en: "Photograph of a MacBook",
      es: "Fotografía de un MacBook",
    },
  },
  {
    id: "apple-watch",
    slug: "apple-watch",
    manufacturer: "Apple",
    name: { en: "Apple Watch", es: "Apple Watch" },
    conditions: {
      en: "Watches in multiple conditions. Ask for the current mix.",
      es: "Relojes en varias condiciones. Consulte la mezcla actual.",
    },
    image: "/images/watch.jpg",
    imageAlt: {
      en: "Photograph of an Apple Watch",
      es: "Fotografía de un Apple Watch",
    },
  },
];

export function activeHeroProduct(): HeroProduct | null {
  return heroProduct.active ? heroProduct : null;
}

export function catalogItemBySlug(slug: string): CatalogItem | null {
  return catalog.find((item) => item.slug === slug) ?? null;
}
