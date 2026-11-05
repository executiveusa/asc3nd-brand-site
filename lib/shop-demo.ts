/**
 * Concept products for the shop preview. These are design renders, not items for sale.
 * Images live in /public/images/shop/demo as 640 px and 1254 px WebP.
 * When the real store opens, this file is no longer used.
 */
export type DemoProduct = {
  id: string;
  name: { en: string; es: string };
  alt: { en: string; es: string };
};

export const shopDemoProducts: DemoProduct[] = [
  {
    id: "hoodie",
    name: { en: "Hoodie", es: "Sudadera con capucha" },
    alt: {
      en: "Black pullover hoodie with a gold A3 mark and crown on the chest. Concept render.",
      es: "Sudadera negra con capucha y una marca A3 dorada con corona en el pecho. Imagen conceptual.",
    },
  },
  {
    id: "tshirt",
    name: { en: "T-shirt", es: "Camiseta" },
    alt: {
      en: "Black t-shirt with a small gold A3 mark and crown on the left chest. Concept render.",
      es: "Camiseta negra con una pequeña marca A3 dorada con corona en el lado izquierdo del pecho. Imagen conceptual.",
    },
  },
  {
    id: "tote",
    name: { en: "Tote bag", es: "Bolsa de tela" },
    alt: {
      en: "Natural canvas tote bag with a gold A3 mark and crown. Concept render.",
      es: "Bolsa de tela de lona natural con una marca A3 dorada con corona. Imagen conceptual.",
    },
  },
  {
    id: "cap",
    name: { en: "Cap", es: "Gorra" },
    alt: {
      en: "Black baseball cap with a gold crown on the front. Concept render.",
      es: "Gorra de béisbol negra con una corona dorada al frente. Imagen conceptual.",
    },
  },
  {
    id: "bottle",
    name: { en: "Water bottle", es: "Botella de agua" },
    alt: {
      en: "Black insulated water bottle with a gold A3 mark and crown. Concept render.",
      es: "Botella de agua negra con aislamiento y una marca A3 dorada con corona. Imagen conceptual.",
    },
  },
  {
    id: "stickers",
    name: { en: "Sticker sheet", es: "Hoja de calcomanías" },
    alt: {
      en: "Sheet of gold, black and white A3 and crown stickers. Concept render.",
      es: "Hoja de calcomanías A3 y corona en dorado, negro y blanco. Imagen conceptual.",
    },
  },
];
