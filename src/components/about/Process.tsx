"use client";

import { motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const STAGES = [
  {
    name: "Discover",
    body: "Before code, I learn the business: who uses this, what slows them down, and what success looks like. Assumptions get written down and confirmed.",
    log: ["Analyzing the business requirements…", "Listing assumptions to confirm with stakeholders…"],
  },
  {
    name: "Architect",
    body: "I design the shape of the system — data model, boundaries, roles and permissions — so the hard decisions happen early, while they're cheap.",
    log: ["Designing the application architecture…", "Drawing role and permission boundaries…"],
  },
  {
    name: "Build",
    body: "Interfaces and server logic built in small, reviewable slices. Readable code over clever code.",
    log: ["Building interfaces and server logic in small slices…", "Keeping the boring parts boring — on purpose…"],
  },
  {
    name: "Integrate",
    body: "Frontend, backend, database and authentication connected end to end, with clear contracts between them.",
    log: ["Connecting frontend and backend…", "Wiring authentication into every route that needs it…"],
  },
  {
    name: "Test",
    body: "I try to break it: edge cases, empty states, bad input, and the wrong role clicking the wrong button.",
    log: ["Validating edge cases…", "Trying empty states, long names and double-clicks…"],
  },
  {
    name: "Deploy",
    body: "Releases prepared with environment config, data changes and rollback in mind — and no secrets in the repository.",
    log: ["Preparing a production-ready release…", "Checking environment config — secrets stay out of the repo…"],
  },
  {
    name: "Improve",
    body: "Real usage tells the truth. I gather feedback, fix what hurts, and ship the next iteration.",
    log: ["Reading feedback from real usage…", "Queuing the next iteration…"],
  },
] as const;

type Line = { id: number; kind: "cmd" | "out" | "ok"; text: string };
let uid = 0;

function linesFor(i: number): Line[] {
  const s = STAGES[i];
  return [
    { id: uid++, kind: "cmd", text: `process ${s.name.toLowerCase()}` },
    ...s.log.map((t) => ({ id: uid++, kind: "out" as const, text: t })),
    { id: uid++, kind: "ok", text: `${s.name} complete` },
  ];
}

export function Process() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState<Line[]>([]);
  const [queue, setQueue] = useState<Line[]>([]);
  const [chars, setChars] = useState(0);

  const run = useCallback(
    (i: number) => {
      setStage(i);
      const next = linesFor(i);
      if (reduce) {
        setDone((d) => [...d, ...next].slice(-12));
        setQueue([]);
      } else {
        setQueue(next);
      }
      setChars(0);
    },
    [reduce],
  );

  const select = (i: number) => {
    setPlaying(false);
    if (i !== stage || !started) run(i);
    setStarted(true);
  };

  // Typewriter: drain the queue a couple of characters at a time.
  useEffect(() => {
    if (!queue.length) return;
    const head = queue[0];
    if (chars < head.text.length) {
      const t = window.setTimeout(() => setChars((c) => c + 2), 16);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(
      () => {
        setDone((d) => [...d, head].slice(-12));
        setQueue((q) => q.slice(1));
        setChars(0);
      },
      head.kind === "cmd" ? 160 : 280,
    );
    return () => window.clearTimeout(t);
  }, [queue, chars]);

  // Autoplay steps through once, then stops.
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      if (stage >= STAGES.length - 1) setPlaying(false);
      else run(stage + 1);
    }, 3200);
    return () => window.clearTimeout(t);
  }, [playing, stage, run]);

  const togglePlay = () => {
    if (playing) return setPlaying(false);
    setStarted(true);
    run(stage >= STAGES.length - 1 ? 0 : stage);
    setPlaying(true);
  };

  const head = queue[0];
  const s = STAGES[stage];

  return (
    <motion.div
      onViewportEnter={() => {
        if (!started) {
          setStarted(true);
          run(0);
        }
      }}
      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ol className="flex flex-wrap gap-1.5" aria-label="Process stages">
          {STAGES.map((st, i) => {
            const on = i === stage;
            return (
              <li key={st.name}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={on}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    on
                      ? "border-lime/50 bg-lime/[0.08] text-bone"
                      : i < stage
                        ? "border-line-strong text-mute hover:text-bone"
                        : "border-line text-dim hover:border-line-strong hover:text-bone"
                  }`}
                >
                  <span className={`font-mono text-[0.6875rem] ${on ? "text-lime" : ""}`}>{i + 1}</span>
                  {st.name}
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-mute transition-colors hover:text-bone"
        >
          {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
          {playing ? "Pause" : "Play sequence"}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="surface rounded-2xl p-6 md:p-8 lg:col-span-5">
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-live="polite"
          >
            <p className="t-label">
              Stage {stage + 1} of {STAGES.length}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">{s.name}</h3>
            <p className="t-body mt-3">{s.body}</p>
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          <div className="theme-dark surface-raised overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div className="flex gap-1.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-2 rounded-full bg-white/15" />
                ))}
              </div>
              <span className="font-mono text-[0.625rem] text-dim">process.log</span>
              <span className="font-mono text-[0.5625rem] tracking-wider text-dim uppercase">Illustrative</span>
            </div>
            <div
              className="flex h-64 flex-col justify-end overflow-hidden p-5 font-mono text-[0.75rem] leading-[1.9]"
              role="log"
              aria-live="off"
              aria-label="Prewritten process narrative"
            >
              {done.map((l) => (
                <LogLine key={l.id} line={l} />
              ))}
              {head && <LogLine line={{ ...head, text: head.text.slice(0, chars) }} typing />}
              {!head && (
                <p className="text-dim">
                  <span className="text-lime">❯</span>{" "}
                  <span className="inline-block h-3.5 w-1.5 translate-y-0.5 bg-bone/60 animate-blink" aria-hidden />
                </p>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-dim">
            A prewritten narrative of how I work — nothing here runs code or touches real infrastructure.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function LogLine({ line, typing }: { line: Line; typing?: boolean }) {
  const caret = typing ? <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-bone/60" aria-hidden /> : null;
  if (line.kind === "cmd")
    return (
      <p className="mt-2 text-bone first:mt-0">
        <span className="text-lime">❯</span> {line.text}
        {caret}
      </p>
    );
  if (line.kind === "ok")
    return (
      <p className="text-lime">
        ✓ {line.text}
        {caret}
      </p>
    );
  return (
    <p className="text-mute">
      {line.text}
      {caret}
    </p>
  );
}
