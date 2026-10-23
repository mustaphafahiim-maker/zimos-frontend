/* eslint-disable @next/next/no-img-element -- the platforms' own small marks, drawn as-is. */
import type { Dictionary } from "@/i18n/dictionary";

/**
 * Each platform with its own mark (public/integrations): the official files
 * from each company's site, Wikimedia Commons for the Aramex and J&T
 * wordmarks, and Simple Icons (CC0) for WhatsApp, Facebook, TikTok and
 * Snapchat. `full` marks are a filled square already; `word` marks are the
 * name itself, so no name is written beside them.
 */
const PLATFORMS: { name: string; src: string; kind?: "full" | "word" }[] = [
  { name: "WhatsApp", src: "whatsapp.svg" },
  { name: "Facebook", src: "facebook.svg" },
  { name: "TikTok", src: "tiktok.svg" },
  { name: "Snapchat", src: "snapchat.svg", kind: "full" },
  { name: "Google", src: "google.png" },
  { name: "Bosta", src: "bosta.png", kind: "full" },
  { name: "J&T Express", src: "jt-express.png", kind: "full" },
  { name: "Aramex", src: "aramex.svg", kind: "word" },
  { name: "Paymob", src: "paymob.png" },
  { name: "InstaPay", src: "instapay.png", kind: "word" },
];

/**
 * The strip under the hero. The list is written twice and the track moves
 * by half its width, so it loops without a jump; the copy is hidden from
 * screen readers, and without motion it is not shown at all.
 */
export function WorksWith({ copy }: { copy: Dictionary["integrations"] }) {
  const items = (duplicate: boolean) =>
    PLATFORMS.map(({ name, src, kind }) => (
      <li key={`${name}-${duplicate}`} aria-hidden={duplicate || undefined}>
        <span className={kind ? `lz-logo lz-logo--${kind}` : "lz-logo"}>
          <img src={`/integrations/${src}`} alt={kind === "word" ? name : ""} loading="lazy" decoding="async" />
        </span>
        {kind === "word" ? null : (
          <span lang="en" dir="ltr">
            {name}
          </span>
        )}
      </li>
    ));

  return (
    <div className="lz-strip" role="region" aria-label={copy.label}>
      <div className="lz-in lz-strip__in">
        <span className="lz-strip__t">{copy.label}</span>
        <div className="lz-marquee">
          <ul className="lz-marquee__track">
            {items(false)}
            {items(true)}
          </ul>
        </div>
      </div>
      <p className="lz-strip__note">{copy.note}</p>
    </div>
  );
}
