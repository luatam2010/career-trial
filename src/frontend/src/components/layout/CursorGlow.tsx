import { useEffect, useRef } from "react";

/**
 * Fixed radial bloom that follows the pointer by updating only two CSS custom
 * properties (--cursor-x / --cursor-y) inside a requestAnimationFrame loop.
 * Hidden entirely under prefers-reduced-motion and on touch devices.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.3;

    const paint = () => {
      frame = 0;
      node.style.setProperty("--cursor-x", `${x}px`);
      node.style.setProperty("--cursor-y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      node.dataset.active = "true";
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onLeave = () => {
      node.dataset.active = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="cursor-glow" />;
}
