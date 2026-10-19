"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { layers, tools, type Layer } from "@/content/stack";

const COLOR = Object.fromEntries(layers.map((l) => [l.key, l.color])) as Record<Layer, string>;

// Deterministic tilt so server and client render the same thing.
const tilt = (i: number) => ((i * 37) % 11) - 5;

/** The stack as a pile of draggable chips. Filter by layer, fling things around, reset. */
export function Toolkit() {
  const area = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<Layer | null>(null);
  const [round, setRound] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Highlight a layer">
          {layers.map((l) => {
            const on = focus === l.key;
            return (
              <button
                key={l.key}
                type="button"
                aria-pressed={on}
                onClick={() => setFocus(on ? null : l.key)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  on ? "border-tint/30 bg-tint/[0.06] text-bone" : "border-line text-mute hover:text-bone"
                }`}
              >
                <span className="size-2 rounded-full" style={{ background: l.color }} aria-hidden />
                {l.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            setRound((r) => r + 1);
            setFocus(null);
          }}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-mute transition-colors hover:text-bone"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Tidy up
        </button>
      </div>

      <div
        ref={area}
        className="bg-dots surface relative mt-5 overflow-hidden rounded-2xl px-4 py-12 sm:px-10 sm:py-16"
      >
        <ul key={round} className="relative mx-auto flex max-w-4xl flex-wrap justify-center gap-2.5 sm:gap-3">
          {tools.map((t, i) => {
            const dim = focus !== null && focus !== t.layer;
            return (
              <motion.li
                key={t.name}
                drag
                dragConstraints={area}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
                initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
                animate={{
                  opacity: dim ? 0.18 : 1,
                  rotate: tilt(i) * 0.6,
                  scale: dim ? 0.94 : focus === t.layer ? 1.06 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: round === 0 ? i * 0.025 : 0 }}
                whileHover={{ scale: 1.08, rotate: 0 }}
                whileDrag={{ scale: 1.12, rotate: tilt(i) * 2, zIndex: 10, cursor: "grabbing" }}
                data-cursor="Drag"
                className="relative cursor-grab touch-none list-none rounded-full border border-line-strong bg-ink-3 px-4 py-2 text-sm font-medium whitespace-nowrap shadow-[0_8px_24px_-12px_rgb(0_0_0/0.9)] select-none sm:px-5 sm:py-2.5 sm:text-[0.9375rem]"
              >
                <span className="mr-2 inline-block size-2 rounded-full align-middle" style={{ background: COLOR[t.layer] }} aria-hidden />
                {t.name}
              </motion.li>
            );
          })}
        </ul>
        <p className="pointer-events-none absolute right-4 bottom-3 font-mono text-[0.625rem] text-dim">drag · fling · reset</p>
      </div>
    </div>
  );
}
