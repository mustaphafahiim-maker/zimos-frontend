import { fetchPublicPlatformSettings, type PublicPlatformSettings } from "@store-builder/ui/platform-info";
import { API_BASE_URL } from "./urls";

/**
 * The platform's details saved in the console (contact, social links,
 * company, footer), from the API's public GET /platform-settings/public.
 *
 * Off unless PLATFORM_SETTINGS_ENABLED is exactly "true" in this service's
 * environment (read on the server, never sent to the browser): off, nothing
 * is fetched and every page shows the values in this repo, exactly as before.
 *
 * On, the pages that show them are regenerated at most this often, and a
 * slow or failing API never holds a page up: after the timeout, or on any
 * error (the API down at build time included), each value falls back to the
 * one in this repo.
 */
export const PLATFORM_SETTINGS_REVALIDATE_SECONDS = 120;
const TIMEOUT_MS = 3000;

export function platformSettingsEnabled(): boolean {
  return process.env.PLATFORM_SETTINGS_ENABLED === "true";
}

export async function getPlatformSettings(): Promise<PublicPlatformSettings | null> {
  if (!platformSettingsEnabled()) return null;
  return fetchPublicPlatformSettings(API_BASE_URL, {
    timeoutMs: TIMEOUT_MS,
    init: { next: { revalidate: PLATFORM_SETTINGS_REVALIDATE_SECONDS } },
  });
}
