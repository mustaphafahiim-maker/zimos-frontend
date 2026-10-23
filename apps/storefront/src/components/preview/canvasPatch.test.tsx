// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { applyPatch, readPatch } from "./canvasPatch";

function page(html: string) {
  document.body.innerHTML = html;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.head.querySelectorAll("style[data-own-patch]").forEach((s) => s.remove());
});

const BAND = `<div data-zimos-el="e1" class="contents"><section class="xs-banners" data-xs-look="05">
  <h2>New arrivals</h2>
  <a><picture class="xs-pic"><source srcset="/xs/05/a.1600.avif" type="image/avif"><img data-xs-pic="items.0.image" src="/xs/05/a.jpg" srcset="/xs/05/a.jpg 1x"></picture><span> Shirts </span></a>
  <div class="xs-banners__bg" data-xs-bg="image" style="background-image:url(/xs/05/bg.jpg)"></div>
</section></div>`;

describe("patches on an imported template's band", () => {
  it("drops what is not well-formed", () => {
    const [op] = readPatch([{ elementId: "e1", own: { headingSize: 40, onclick: "x" }, words: [["", "x"], ["a", "b"], ["c"]], pictures: { "items.0.image": "javascript:alert(1)", "../x": "/xs/05/b.jpg", image: "/xs/05/b.jpg" } }]);
    expect(op).toEqual({ elementId: "e1", own: { headingSize: 40 }, words: [["a", "b"]], pictures: { image: "/xs/05/b.jpg" } });
  });

  it("lays the band's own look over the page, every screen, in a stylesheet of its own", () => {
    page(BAND);
    expect(applyPatch(readPatch([{ elementId: "e1", own: { headingSize: { base: 48, mobile: 28 } } }]))).toBe(true);
    const css = document.head.querySelector('style[data-own-patch="e1"]')!.textContent!;
    expect(css).toContain('[data-zimos-el="e1"]:not(#\\#)>[data-xs-look] :is(h1,h2){font-size:48px!important');
    expect(css).toContain("@media (max-width: 639px){");
    expect(css).toContain("font-size:28px!important");
    // The next patch for the band replaces it.
    applyPatch(readPatch([{ elementId: "e1", own: {} }]));
    expect(document.head.querySelectorAll('style[data-own-patch="e1"]')).toHaveLength(1);
    expect(document.head.querySelector('style[data-own-patch="e1"]')!.textContent).toBe("");
  });

  it("changes the words that showed, keeping the spaces round them", () => {
    page(BAND);
    applyPatch(readPatch([{ elementId: "e1", words: [["New arrivals", "Just in"], ["Shirts", "Tees"]] }]));
    expect(document.querySelector("h2")!.textContent).toBe("Just in");
    expect(document.querySelector("span")!.textContent).toBe(" Tees ");
  });

  it("swaps a picture and a painted ground by their place", () => {
    page(BAND);
    applyPatch(readPatch([{ elementId: "e1", pictures: { "items.0.image": "/xs/05/b.jpg", image: "/xs/05/bg2.jpg" } }]));
    const img = document.querySelector("img")!;
    expect(img.getAttribute("src")).toBe("/xs/05/b.jpg");
    expect(img.hasAttribute("srcset")).toBe(false);
    expect(document.querySelectorAll("source")).toHaveLength(0);
    expect((document.querySelector("[data-xs-bg]") as HTMLElement).style.backgroundImage).toContain("/xs/05/bg2.jpg");
  });

  it("colours one entry by itself, and takes its colours away again", () => {
    page(`<div data-zimos-el="e1"><div class="xs-slider" data-xs-look="05">
      <div data-xs-item="slides.0" style="background-image:url(/a.jpg)"><h2>One</h2></div>
      <div data-xs-item="slides.1"><h2>Two</h2></div>
    </div></div>`);
    const [op] = readPatch([{ elementId: "e1", itemOwn: { "slides.0": { titleColor: "#FF0000", buttonColor: "red", onclick: "x" }, "../x": { titleColor: "#00ff00" } } }]);
    expect(op.itemOwn).toEqual({ "slides.0": { titleColor: "#FF0000", buttonColor: "red" } });
    expect(applyPatch([op])).toBe(true);
    const first = document.querySelector<HTMLElement>('[data-xs-item="slides.0"]')!;
    expect(first.getAttribute("data-xs-own-item")).toBe("title");
    expect(first.style.getPropertyValue("--xs-item-title")).toBe("#ff0000");
    expect(first.style.getPropertyValue("--xs-item-button")).toBe("");
    expect(first.style.backgroundImage).toContain("/a.jpg");
    expect(document.querySelector('[data-xs-item="slides.1"]')!.hasAttribute("data-xs-own-item")).toBe(false);
    applyPatch(readPatch([{ elementId: "e1", itemOwn: { "slides.0": {} } }]));
    expect(first.hasAttribute("data-xs-own-item")).toBe(false);
    expect(first.style.getPropertyValue("--xs-item-title")).toBe("");
  });
});
