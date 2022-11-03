// @flow

const ELEMENT_NODE = 1;
export default function ensureElement(el: Element | Text | null): ?Element {
  if (!el || el.nodeType !== ELEMENT_NODE) {
    return;
  }
  let element: any = el;
  return (element: Element);
}
