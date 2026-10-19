"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A trailing ring that grows over interactive elements and shows a short
 * label (from `data-cursor`). The native cursor stays; touch devices and
 * reduced-motion users never see this.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [shown, setShown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const ok =
      window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setEnabled(true);
      setShown(true);
      const el = (e.target as Element | null)?.closest?.("a, button, [data-cursor], input, textarea, select, label");
      setHover(Boolean(el));
      setLabel(el?.getAttribute("data-cursor") ?? null);
    };
    const onLeave = () => setShown(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const big = Boolean(label);
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
    >
      <motion.div
        animate={{
          width: big ? 64 : hover ? 40 : 22,
          height: big ? 64 : hover ? 40 : 22,
          opacity: shown ? 1 : 0,
          backgroundColor: big ? "rgb(255 255 255 / 1)" : "rgb(255 255 255 / 0)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full border border-white"
      >
        {big && <span className="font-mono text-[0.625rem] tracking-wider text-black uppercase">{label}</span>}
      </motion.div>
    </motion.div>
  );
}
