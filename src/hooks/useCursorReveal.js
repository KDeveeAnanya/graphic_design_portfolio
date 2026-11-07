import { useEffect } from "react";

/** Sets --lx / --ly / --reveal on an element so CSS can paint a gradient inside its letters. */
export function useCursorReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ly", `${e.clientY - r.top}px`);
    };
    const on = () => el.style.setProperty("--reveal", "1");
    const off = () => el.style.setProperty("--reveal", "0");

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", on);
      el.removeEventListener("pointerleave", off);
    };
  }, [ref]);
}
