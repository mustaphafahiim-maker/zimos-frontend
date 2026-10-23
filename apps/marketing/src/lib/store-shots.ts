/**
 * Real captures of the ZIMOS storefront wearing templates from its library
 * (public/stores): the demo store's home page on a 1280px screen — its top
 * 1200px, shrunk to 960x900 — and the same store on a 390px phone, its top
 * 1600px. Taken from the local stack, each template's published site with
 * its shell file applied to the store and the store in English. Below that
 * the demo store's shared catalogue shows the same clothes in every template,
 * so the captures stop there.
 */
const LOOKS = ["13", "08", "11", "07", "04", "10"] as const;

export const STORE_SHOTS: Record<string, { desk: string; phone: string }> = Object.fromEntries(
  LOOKS.map((look) => [look, { desk: `/stores/look-${look}-desk.webp`, phone: `/stores/look-${look}-phone.webp` }]),
);

/** The stores the hero cycles through, one after the other. */
export const HERO_LOOKS = ["13", "08", "11"] as const;

/** The template gallery, best first. */
export const GALLERY_LOOKS = LOOKS;
