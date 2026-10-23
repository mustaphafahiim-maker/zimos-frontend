"use client";

import { StoreLink } from "@/components/StoreRoute";
import type { ResolvedShellLink } from "@/lib/storeShell";

/**
 * One of the merchant's header or footer links. Store pages go through
 * StoreLink (which adds the store's prefix); an address on another site opens
 * in a new tab, so the shopper keeps their place in the store.
 */
export function ShellLink({
  link,
  className,
  shellText,
}: {
  link: ResolvedShellLink;
  className: string;
  /** Where its words are kept (lib/storeShell shellTextPath), for the editor's preview to edit them in place. */
  shellText?: string;
}) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} data-shell-text={shellText}>
        {link.label}
      </a>
    );
  }
  return (
    <StoreLink href={link.href} className={className} data-shell-text={shellText}>
      {link.label}
    </StoreLink>
  );
}
