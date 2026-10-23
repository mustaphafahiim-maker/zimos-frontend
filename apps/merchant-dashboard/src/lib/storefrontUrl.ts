/** Base URL of the storefront app, without a trailing slash. Used by the live preview. */
export const STOREFRONT_URL = (import.meta.env.VITE_STOREFRONT_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

/**
 * A picture's address as the dashboard can show it. An imported template's own pictures are
 * paths on the storefront ("/xs/05/banner-2.jpg", "/template-art/…"): shown from there, not from
 * the dashboard's own address where they don't exist. Anything else — an upload, a full address —
 * is shown as it is. Only for showing: the value saved stays the path.
 */
export function shownPicture(src: string): string {
  return src.startsWith("/xs/") || src.startsWith("/template-art/") ? `${STOREFRONT_URL}${src}` : src;
}
