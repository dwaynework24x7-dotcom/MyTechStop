import type { Localized } from "@/config/locale";

/** FALLBACK CONTENT. Topics only. These are not published articles. */

export type InsightTopic = {
  id: string;
  title: Localized;
  body: Localized;
};

export const insightTopics: readonly InsightTopic[] = [
  {
    id: "usa-spec",
    title: {
      en: "USA-spec devices",
      es: "Equipos con especificación de EE. UU.",
    },
    body: {
      en: "Model, carrier, and lock status should be confirmed before a cross-border order.",
      es: "El modelo, el operador y el estado de bloqueo deben confirmarse antes de un pedido internacional.",
    },
  },
  {
    id: "carrier-unlocked",
    title: {
      en: "Carrier and unlocked",
      es: "Operador y liberado",
    },
    body: {
      en: "Unlocked and carrier-locked units serve different resale markets. Ask which mix is available.",
      es: "Las unidades liberadas y las bloqueadas por operador sirven a mercados distintos. Pregunte qué mezcla hay disponible.",
    },
  },
  {
    id: "buying-safely",
    title: {
      en: "Buying wholesale",
      es: "Comprar al por mayor",
    },
    body: {
      en: "Pricing, quantity, and condition are confirmed by a sales representative. They are not fixed on this site.",
      es: "El precio, la cantidad y la condición los confirma un representante. No están fijos en este sitio.",
    },
  },
];

export type TrustPoint = {
  id: string;
  title: Localized;
  body: Localized;
};

export const trustPoints: readonly TrustPoint[] = [
  {
    id: "us",
    title: { en: "U.S.-based company", es: "Empresa en Estados Unidos" },
    body: {
      en: "A United States wholesale electronics business.",
      es: "Una empresa de electrónica al por mayor con base en Estados Unidos.",
    },
  },
  {
    id: "wholesale",
    title: { en: "Wholesale focused", es: "Enfocada en mayoreo" },
    body: {
      en: "Built for retailers, resellers, distributors, and exporters.",
      es: "Pensada para tiendas, revendedores, distribuidores y exportadores.",
    },
  },
  {
    id: "bulk",
    title: { en: "Bulk purchasing", es: "Compra en volumen" },
    body: {
      en: "We buy devices in volume from businesses and high-volume sellers.",
      es: "Compramos dispositivos en volumen a empresas y vendedores de alto volumen.",
    },
  },
  {
    id: "international",
    title: { en: "International buyers welcome", es: "Compradores internacionales" },
    body: {
      en: "Export inquiries are welcome from resellers and businesses.",
      es: "Recibimos consultas de exportación de revendedores y empresas.",
    },
  },
  {
    id: "languages",
    title: { en: "English and Spanish", es: "Inglés y español" },
    body: {
      en: "The website and sales conversations are available in both languages.",
      es: "El sitio y las conversaciones de ventas están disponibles en ambos idiomas.",
    },
  },
  {
    id: "verification",
    title: { en: "Device verification", es: "Verificación de equipos" },
    body: {
      en: "Condition and configuration are confirmed with the sales team before you buy.",
      es: "La condición y la configuración se confirman con el equipo de ventas antes de comprar.",
    },
  },
  {
    id: "repeat",
    title: { en: "Repeat relationships", es: "Relaciones continuas" },
    body: {
      en: "The process is set up for ongoing wholesale buying and selling.",
      es: "El proceso está pensado para compras y ventas mayoristas continuas.",
    },
  },
  {
    id: "conditions",
    title: { en: "Multiple conditions", es: "Varias condiciones" },
    body: {
      en: "New, sealed, open box, used, and graded devices, subject to current stock.",
      es: "Equipos nuevos, sellados, de caja abierta, usados y con grado, según el inventario del momento.",
    },
  },
];

export type OperationSlot = {
  id: string;
  title: Localized;
  body: Localized;
  /** Future photo or video. Null keeps the original graphic. */
  media: string | null;
  mediaAlt: Localized;
};

export const operationSlots: readonly OperationSlot[] = [
  {
    id: "inventory",
    title: { en: "Recent inventory", es: "Inventario reciente" },
    body: {
      en: "Inbound devices are grouped by model and condition before a price is given.",
      es: "Los equipos que llegan se agrupan por modelo y condición antes de dar un precio.",
    },
    media: null,
    mediaAlt: {
      en: "Graphic for recent inventory",
      es: "Gráfico de inventario reciente",
    },
  },
  {
    id: "shipments",
    title: { en: "Recent shipments", es: "Envíos recientes" },
    body: {
      en: "Orders are prepared after the sales team confirms the terms.",
      es: "Los pedidos se preparan después de que el equipo de ventas confirma las condiciones.",
    },
    media: null,
    mediaAlt: {
      en: "Graphic for shipment preparation",
      es: "Gráfico de preparación de envíos",
    },
  },
  {
    id: "operations",
    title: { en: "From our operations", es: "De la operación" },
    body: {
      en: "Device checks are part of preparing inventory for a buyer or a bid.",
      es: "La revisión del equipo forma parte de preparar el inventario para un comprador o una oferta.",
    },
    media: null,
    mediaAlt: {
      en: "Graphic for device inspection",
      es: "Gráfico de revisión de equipos",
    },
  },
];
