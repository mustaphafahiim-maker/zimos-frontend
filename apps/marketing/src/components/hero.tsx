/* eslint-disable @next/next/no-img-element -- the captures are already sized and compressed for the page. */
import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { REGISTER_URL } from "@/lib/urls";
import { HERO_LOOKS, STORE_SHOTS } from "@/lib/store-shots";
import { Backdrop } from "./backdrop";
import { ColorIcon } from "./color-icon";
import { Arrow } from "./duo-icons";

const turn = (i: number) => ({ "--k": i }) as CSSProperties;

/**
 * The slogan, and real stores built on the template library: the home page on
 * a computer and the same store on a phone, crossfading from one template to
 * the next, over a soft blue ground that moves (components/backdrop.tsx).
 * Two glass layers sit behind the frame, and the three steps — template
 * applied, store published, a new order — stand in one column beside it. On a
 * phone screen the computer frame steps aside and the phone takes the stage,
 * so the store is shown at a size that can be read. The cards over them are
 * decoration (aria-hidden); the first picture's alt says what they are.
 */
export function Hero({ copy }: { copy: Dictionary["hero"] }) {
  const { chips } = copy;

  return (
    <section className="lz-hero" aria-labelledby="lz-h1">
      <Backdrop id="lz-wave-hero" grid />
      <div className="lz-in lz-hero__grid">
        <div className="lz-hero__copy">
          <h1 className="lz-h1" id="lz-h1">
            {copy.lines.map((line) => (
              <span key={line} className="lz-line">
                {line}
              </span>
            ))}
            <span className="lz-line">
              <span className="lz-accent">{copy.accent}</span>
            </span>
          </h1>
          <p className="lz-hero__body">{copy.body}</p>

          <div className="lz-ctas">
            <a className="lz-btn" href={REGISTER_URL}>
              {copy.primaryCta}
              <Arrow size={18} className="lz-arrow" />
            </a>
            <a className="lz-link" href="#templates">
              {copy.secondaryCta}
              <Arrow size={18} className="lz-arrow" />
            </a>
          </div>

          <ul className="lz-ticks">
            {copy.ticks.map((tick) => (
              <li key={tick}>
                <ColorIcon name="check" size={19} />
                {tick}
              </li>
            ))}
          </ul>
        </div>

        <div className="lz-hero__visual">
          <span className="lz-stack" aria-hidden>
            <i />
            <i />
          </span>
          <figure className="lz-frame">
            <div className="lz-frame__bar" aria-hidden>
              <i />
              <i />
              <i />
              <span>{copy.frameLabel}</span>
            </div>
            <div className="lz-cycle lz-frame__store">
              {HERO_LOOKS.map((look, i) => (
                <img
                  key={look}
                  src={STORE_SHOTS[look].desk}
                  width={960}
                  height={900}
                  alt={i === 0 ? copy.imageAlt : ""}
                  fetchPriority={i === 0 ? "high" : "low"}
                  decoding="async"
                  style={turn(i)}
                />
              ))}
            </div>
          </figure>

          <div className="lz-phone" aria-hidden>
            <div className="lz-cycle lz-phone__screen">
              {HERO_LOOKS.map((look, i) => (
                <img key={look} src={STORE_SHOTS[look].phone} width={390} height={1600} alt="" decoding="async" style={turn(i)} />
              ))}
            </div>
          </div>

          <div className="lz-floats" aria-hidden>
            <div className="lz-float lz-float--order">
              <span className="lz-float__ico lz-float__ico--blue">
                <ColorIcon name="brush" size={22} />
              </span>
              <span>
                <b>{chips.template.title}</b>
                <small>{chips.template.detail}</small>
              </span>
            </div>
            <div className="lz-float lz-float--ship">
              <span className="lz-float__ico lz-float__ico--blue">
                <ColorIcon name="globe" size={22} />
              </span>
              <span>
                <b>{chips.published.title}</b>
                <small className="ltr">{chips.published.detail}</small>
              </span>
            </div>
            <div className="lz-float lz-float--ok">
              <span className="lz-float__ico lz-float__ico--green">
                <ColorIcon name="receipt" size={22} />
              </span>
              <span>
                <b>{chips.order.title}</b>
                <small>{chips.order.detail}</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
