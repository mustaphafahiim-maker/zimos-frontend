"use client";

import { useEffect } from "react";

/**
 * The header's and footer's own words, edited where they stand: a menu link, a footer group's
 * title or link, the line under the store's name. Each carries where it is kept in the store's
 * settings (`data-shell-text`, lib/storeShell shellTextPath); a double-click — or two quick taps —
 * makes it editable in place, Enter or leaving it commits, Escape puts it back. The committed words
 * go to the editor as { type: "zimos:shell-text", path, text }, which changes the header or footer
 * the way its panel would, and the frame redraws it from there.
 *
 * Only the header and footer: the page's own words are useCanvasText's.
 */

const ATTR = "data-shell-text";
const SHELL = "[data-zimos-shell]";
/** Where a header or footer word is kept: a menu link, a footer group's title or link, the footer's line. */
const PATH = /^(?:header\.menu\.\d{1,2}\.label|footer\.groups\.\d{1,2}\.(?:title|links\.\d{1,2}\.label)|footer\.text)$/;
const STYLE_ID = "zimos-shell-text";
const NBSP = new RegExp(String.fromCharCode(160), "g");
const DOUBLE_TAP_MS = 400;
const TOUCH_CLICK_MS = 800;

function editableAt(target: EventTarget | null): { node: HTMLElement; path: string } | null {
  const node = (target as Element | null)?.closest?.<HTMLElement>(`[${ATTR}]`);
  if (!node || !node.closest(SHELL)) return null;
  const path = node.getAttribute(ATTR) ?? "";
  // A node with elements inside (an icon beside the words) is not edited as plain text.
  if (!PATH.test(path) || Array.from(node.children).some((child) => child.tagName !== "BR")) return null;
  return { node, path };
}

export function useShellText({
  editable,
  hint,
  post,
}: {
  editable: boolean;
  hint: string;
  post: (message: Record<string, unknown>) => void;
}) {
  // The words that can be edited show a text cursor and say so.
  useEffect(() => {
    if (!editable) return;
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `${SHELL} [${ATTR}]{cursor:text;touch-action:manipulation}${SHELL} [${ATTR}][contenteditable]{outline:2px solid #165dff!important;outline-offset:2px;box-shadow:0 0 0 5px rgb(255 255 255/.9);user-select:text;-webkit-user-select:text}`;
      document.head.appendChild(style);
    }
    const marked: HTMLElement[] = [];
    const mark = () => {
      for (const node of Array.from(document.querySelectorAll<HTMLElement>(`${SHELL} [${ATTR}]`))) {
        if (hint && !node.title) {
          node.title = hint;
          marked.push(node);
        }
      }
    };
    mark();
    // The header and footer re-render as their settings change: mark the new nodes too.
    const observer = new MutationObserver(mark);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      for (const node of marked) if (node.title === hint) node.removeAttribute("title");
    };
  }, [editable, hint]);

  useEffect(() => {
    if (!editable) return;

    function startEditing(node: HTMLElement, path: string, event: Event) {
      if (node.isContentEditable) return;
      event.preventDefault();
      event.stopPropagation();
      const before = node.textContent ?? "";
      let finished = false;
      const finish = (commit: boolean) => {
        if (finished) return;
        finished = true;
        node.removeEventListener("keydown", onKey);
        node.removeEventListener("blur", onBlur);
        node.removeAttribute("contenteditable");
        const multiline = path === "footer.text";
        const raw = (node.textContent ?? "").replace(NBSP, " ");
        const text = multiline ? raw.replace(/\n{3,}/g, "\n\n").trim() : raw.replace(/\s+/g, " ").trim();
        if (!commit || !text || text === before.trim()) {
          node.textContent = before;
          return;
        }
        post({ type: "zimos:shell-text", path, text: text.slice(0, 300) });
      };
      const onKey = (e: KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          e.preventDefault();
          finish(false);
          node.blur();
        } else if (e.key === "Enter" && (path !== "footer.text" || e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          finish(true);
          node.blur();
        }
      };
      const onBlur = () => finish(true);
      node.setAttribute("contenteditable", "plaintext-only");
      if (node.contentEditable !== "plaintext-only") node.setAttribute("contenteditable", "true");
      node.addEventListener("keydown", onKey);
      node.addEventListener("blur", onBlur);
      node.focus();
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    function onDoubleClick(event: MouseEvent) {
      const hit = editableAt(event.target);
      if (hit) startEditing(hit.node, hit.path, event);
    }

    // A link being typed in does not follow its address.
    function onClickWhileEditing(event: MouseEvent) {
      if ((event.target as Element | null)?.closest?.(`[${ATTR}][contenteditable]`)) event.preventDefault();
    }

    let touchEndedAt = 0;
    let lastTap = { path: "", at: 0 };
    function onTouchEnd() {
      touchEndedAt = Date.now();
    }
    function onTap(event: MouseEvent) {
      const now = Date.now();
      const fromTouch = (event as PointerEvent).pointerType === "touch" || now - touchEndedAt < TOUCH_CLICK_MS;
      if (!fromTouch) return;
      const hit = editableAt(event.target);
      if (!hit) {
        lastTap = { path: "", at: 0 };
        return;
      }
      if (lastTap.path === hit.path && now - lastTap.at < DOUBLE_TAP_MS) {
        lastTap = { path: "", at: 0 };
        startEditing(hit.node, hit.path, event);
      } else {
        lastTap = { path: hit.path, at: now };
      }
    }

    document.addEventListener("dblclick", onDoubleClick, true);
    document.addEventListener("click", onClickWhileEditing, true);
    document.addEventListener("click", onTap, true);
    document.addEventListener("touchend", onTouchEnd, { capture: true, passive: true });
    return () => {
      document.removeEventListener("dblclick", onDoubleClick, true);
      document.removeEventListener("click", onClickWhileEditing, true);
      document.removeEventListener("click", onTap, true);
      document.removeEventListener("touchend", onTouchEnd, true);
    };
  }, [editable, post]);
}
