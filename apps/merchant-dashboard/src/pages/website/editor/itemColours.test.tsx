import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { ItemListField } from "./ItemListField";
import { XS_ELEMENT_SPECS } from "./xsBlocks";
import { renderWithProviders } from "@/test/renderWithProviders";

/**
 * One slide, one banner, one card coloured by itself (storefront xs/own.tsx
 * xsItemOwn): its title, its words and its button, folded under "Its own
 * colours" at the end of its card, and only the colours of what it has.
 */

type Entry = Record<string, unknown>;
const listOf = (type: keyof typeof XS_ELEMENT_SPECS) => {
  const list = XS_ELEMENT_SPECS[type].fields.find((field) => field.kind === "itemList");
  if (!list || list.kind !== "itemList") throw new Error(`${type} has no list`);
  return list;
};
const colourKeys = (type: keyof typeof XS_ELEMENT_SPECS) => listOf(type).fields.filter((sub) => sub.kind === "color").map((sub) => sub.key);

function Slides({ start, onChange }: { start: Entry[]; onChange: (next: Entry[]) => void }) {
  const list = listOf("xs_slider");
  const [value, setValue] = useState<Entry[]>(start);
  return (
    <ItemListField
      label={list.label}
      value={value}
      itemLabel={list.itemLabel}
      itemLabelAr={list.itemLabelAr}
      titleKey={list.titleKey}
      fields={list.fields}
      max={list.max}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

describe("an entry's own colours", () => {
  it("are offered for what each list's entries have", () => {
    expect(colourKeys("xs_slider")).toEqual(["titleColor", "textColor", "buttonColor"]);
    expect(colourKeys("xs_banners")).toEqual(["titleColor", "textColor", "buttonColor"]);
    expect(colourKeys("xs_features")).toEqual(["titleColor", "textColor"]);
    expect(colourKeys("xs_quotes")).toEqual(["titleColor", "textColor"]);
    expect(listOf("xs_banners").fields.find((sub) => sub.key === "buttonColor")?.label).toBe("Colour: link");
    // The contact band's cards are not marked one by one on the page.
    expect(colourKeys("xs_contact")).toEqual([]);
  });

  it("fold at the end of the card, store a colour and take it out again", async () => {
    const onChange = vi.fn<(next: Entry[]) => void>();
    const { user } = renderWithProviders(<Slides start={[{ heading: "Summer", image: "/xs/05/a.jpg" }]} onChange={onChange} />);
    const fold = document.querySelector<HTMLDetailsElement>('[data-slot="item-colours"]')!;
    expect(fold.open).toBe(false);
    await user.click(screen.getByText("Its own colours"));
    expect(fold.open).toBe(true);

    const code = screen.getByRole("textbox", { name: "Colour: title: colour code" });
    await user.clear(code);
    await user.type(code, "#ff0000");
    expect(onChange.mock.calls.at(-1)?.[0]).toEqual([{ heading: "Summer", image: "/xs/05/a.jpg", titleColor: "#FF0000" }]);

    await user.click(screen.getByRole("button", { name: "Back to the section's colour" }));
    expect(onChange.mock.calls.at(-1)?.[0]).toEqual([{ heading: "Summer", image: "/xs/05/a.jpg" }]);
    // Still open: taking a colour away does not fold it under the merchant's hand.
    expect(fold.open).toBe(true);
  });

  it("start open on an entry that has one", () => {
    renderWithProviders(<Slides start={[{ heading: "Summer", textColor: "#222222" }]} onChange={() => {}} />);
    expect(document.querySelector<HTMLDetailsElement>('[data-slot="item-colours"]')!.open).toBe(true);
  });
});
