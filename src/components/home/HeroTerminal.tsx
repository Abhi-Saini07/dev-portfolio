"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";
import { layers, tools } from "@/content/stack";

type Entry = { id: number; cmd?: string; out: ReactNode };

const COMMANDS = ["help", "whoami", "stack", "work", "hire", "play", "ls", "clear"] as const;
const SUGGESTED = ["help", "whoami", "stack", "work", "play", "hire"];
const GAME_SECONDS = 12;

let uid = 0;

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    className="text-bone underline decoration-line-strong underline-offset-4 hover:decoration-lime"
  >
    {children}
  </a>
);

/**
 * A small shell for exploring the site: real commands, real navigation, and a
 * bug-squashing mini-game. It runs nothing beyond this page.
 */
export function HeroTerminal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: uid++,
      out: (
        <>
          <span className="text-bone">Hi, I&apos;m {site.name.split(" ")[0]}.</span> This terminal actually works — type a
          command or tap one below. Try <span className="text-lime">play</span>.
        </>
      ),
    },
  ]);
  const [game, setGame] = useState<{
    score: number;
    endsAt: number;
    over: boolean;
    bugs: { id: number; x: number; y: number }[];
  } | null>(null);
  const [best, setBest] = useState(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  // Game loop: one interval spawns bugs and checks the deadline, so throttled
  // timers can delay a round but never stretch it.
  const playing = game !== null;
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setGame((g) => {
        if (!g || g.over) return g;
        if (Date.now() >= g.endsAt) return { ...g, over: true, bugs: [] };
        return { ...g, bugs: [...g.bugs.slice(-5), { id: uid++, x: 6 + Math.random() * 82, y: 14 + Math.random() * 68 }] };
      });
    }, 600);
    return () => window.clearInterval(id);
  }, [playing]);

  const over = game?.over ?? false;
  const finalScore = game?.score ?? 0;
  useEffect(() => {
    if (!over) return;
    const t = window.setTimeout(() => {
      setBest((b) => Math.max(b, finalScore));
      setGame(null);
      print(
        "play",
        <>
          Time! You squashed <span className="text-lime">{finalScore}</span> {finalScore === 1 ? "bug" : "bugs"}.{" "}
          {finalScore >= 10 ? "That's production-grade debugging." : finalScore >= 5 ? "Solid QA instincts." : "Even seniors ship bugs. Again?"}{" "}
          <span className="text-dim">(type play to retry)</span>
        </>,
      );
      inputRef.current?.focus();
    }, 350);
    return () => window.clearTimeout(t);
  }, [over, finalScore]);

  function print(cmd: string | undefined, out: ReactNode) {
    setEntries((e) => [...e.slice(-14), { id: uid++, cmd, out }]);
  }

  function run(raw: string) {
    const input = raw.trim();
    const [cmd, ...args] = input.toLowerCase().split(/\s+/);
    if (!cmd) return;
    setHistory((h) => [...h, input]);
    setCursor(-1);

    switch (cmd) {
      case "help":
        return print(
          input,
          <ul className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-0.5">
            {[
              ["whoami", "who's behind this site"],
              ["stack", "the tools I build with"],
              ["work", "projects · work 1–3 opens one"],
              ["hire", "how to reach me"],
              ["play", `squash bugs for ${GAME_SECONDS}s`],
              ["ls", "list pages"],
              ["clear", "clean the screen"],
            ].map(([c, d]) => (
              <li key={c} className="contents">
                <span className="text-lime">{c}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>,
        );
      case "whoami":
        return print(
          input,
          <>
            <span className="text-bone">{site.name}</span> — {site.role.toLowerCase()}. I build web apps, CRM systems and
            business workflows with Node.js, React and Next.js, from requirements to production.
          </>,
        );
      case "stack":
        return print(
          input,
          <ul className="space-y-1">
            {layers.map((l) => (
              <li key={l.key}>
                <span style={{ color: l.color }}>{l.label.toLowerCase()}</span>{" "}
                <span className="text-dim">→</span>{" "}
                {tools
                  .filter((t) => t.layer === l.key)
                  .map((t) => t.name)
                  .join(", ")}
              </li>
            ))}
          </ul>,
        );
      case "work": {
        const n = Number(args[0]);
        if (n >= 1 && n <= caseStudies.length) {
          const c = caseStudies[n - 1];
          print(input, <>Opening {c.type.toLowerCase()}…</>);
          return router.push(`/work#${c.id}`);
        }
        return print(
          input,
          <ul className="space-y-0.5">
            {caseStudies.map((c, i) => (
              <li key={c.id}>
                <span className="text-lime">{i + 1}</span> {c.type} <span className="text-dim">— {c.title}</span>
              </li>
            ))}
            <li className="pt-1 text-dim">type work 1, work 2 or work 3 to open one</li>
          </ul>,
        );
      }
      case "hire":
      case "contact":
        return print(
          input,
          <ul className="space-y-0.5">
            {site.email && (
              <li>
                email <span className="text-dim">→</span> <A href={`mailto:${site.email}`}>{site.email}</A>
              </li>
            )}
            {site.linkedin && (
              <li>
                linkedin <span className="text-dim">→</span> <A href={site.linkedin}>abhi-saini</A>
              </li>
            )}
            {site.github && (
              <li>
                github <span className="text-dim">→</span> <A href={site.github}>Abhi-Saini07</A>
              </li>
            )}
            <li className="pt-1 text-dim">
              or <A href="/contact">open the contact form</A>
            </li>
          </ul>,
        );
      case "ls":
        return print(
          input,
          <span className="flex flex-wrap gap-x-5">
            {[
              ["home/", "/"],
              ["work/", "/work"],
              ["about.md", "/about"],
              ["contact.md", "/contact"],
            ].map(([n, h]) => (
              <A key={n} href={h}>
                {n}
              </A>
            ))}
          </span>,
        );
      case "cd":
      case "open": {
        const page = (args[0] ?? "").replace(/[/.]|md$/g, "");
        const map: Record<string, string> = { home: "/", "": "/", "~": "/", work: "/work", about: "/about", contact: "/contact" };
        if (page in map) {
          print(input, <>Opening {page || "home"}…</>);
          return router.push(map[page]);
        }
        return print(input, <>No such page: {args[0]}. Try ls.</>);
      }
      case "play":
        print(input, <>Bugs incoming. Click them before they ship.</>);
        return setGame({ score: 0, endsAt: Date.now() + GAME_SECONDS * 1000, over: false, bugs: [] });
      case "clear":
        return setEntries([]);
      case "sudo":
        if (input.toLowerCase().includes("hire")) {
          print(input, <span className="text-lime">Permission granted. Taking you to the contact form…</span>);
          return window.setTimeout(() => router.push("/contact"), 700);
        }
        return print(input, <>Nice try.</>);
      case "rm":
        return print(input, <>Let&apos;s not. I like this site.</>);
      default:
        return print(
          input,
          <>
            command not found: <span className="text-bone">{cmd}</span>. Type <span className="text-lime">help</span>.
          </>,
        );
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(value);
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown" && cursor !== -1) {
      e.preventDefault();
      const i = cursor + 1;
      if (i >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(i);
        setValue(history[i]);
      }
    } else if (e.key === "Tab" && value) {
      const match = COMMANDS.find((c) => c.startsWith(value.toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    }
  };

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(161_150_255/0.16),transparent)] blur-2xl" />
      <div className="theme-dark surface-raised overflow-hidden rounded-2xl" onClick={() => !game && inputRef.current?.focus()}>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="size-2.5 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="font-mono text-[0.6875rem] text-dim">abhi@portfolio: ~</span>
          <span className="font-mono text-[0.625rem] text-dim">{best ? `best ${best}` : "zsh"}</span>
        </div>

        <div className="relative h-[21rem] font-mono text-[0.8125rem] leading-relaxed">
          <div ref={scrollRef} className="h-full overflow-y-auto px-4 pt-4 pb-14 text-mute [scrollbar-width:thin]" role="log" aria-live="polite">
            {entries.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-3"
              >
                {e.cmd !== undefined && (
                  <p className="text-bone">
                    <span className="text-lime">❯</span> {e.cmd}
                  </p>
                )}
                <div className={e.cmd !== undefined ? "mt-1" : ""}>{e.out}</div>
              </motion.div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="absolute inset-x-0 bottom-0 flex items-center gap-2 border-t border-line bg-ink-3 px-4 py-3">
            <label htmlFor="term-input" className="text-lime">
              ❯<span className="sr-only">Terminal command</span>
            </label>
            <input
              id="term-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKey}
              disabled={Boolean(game)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={game ? "squash!" : "type a command…"}
              className="min-w-0 flex-1 bg-transparent text-bone caret-lime outline-none placeholder:text-dim"
            />
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[0.625rem] text-dim sm:inline">↵</kbd>
          </form>

          {/* bug squash */}
          <AnimatePresence>
            {game && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-ink/90"
                role="application"
                aria-label="Bug squash game"
              >
                <div className="flex items-center justify-between px-4 pt-3 text-xs">
                  <span className="text-mute">
                    squashed <span className="text-lime">{game.score}</span>
                  </span>
                  <span className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="block h-full rounded-full bg-lime"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: GAME_SECONDS, ease: "linear" }}
                    />
                  </span>
                  <button type="button" onClick={() => setGame((g) => (g ? { ...g, over: true, bugs: [] } : g))} className="text-dim hover:text-bone">
                    quit
                  </button>
                </div>
                <AnimatePresence>
                  {game.bugs.map((b) => (
                    <motion.button
                      key={b.id}
                      type="button"
                      aria-label="Squash bug"
                      data-cursor="Squash"
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 1.6, opacity: 0, pointerEvents: "none" }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      onClick={() =>
                        setGame((g) => (g && !g.over ? { ...g, score: g.score + 1, bugs: g.bugs.filter((x) => x.id !== b.id) } : g))
                      }
                      className="absolute grid size-11 place-items-center rounded-full border border-[#ff9f8a]/40 bg-[#ff9f8a]/10 text-[#ff9f8a] hover:bg-[#ff9f8a]/20"
                      style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    >
                      <Bug className="size-5" aria-hidden />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="t-label mr-1">Try</span>
        {SUGGESTED.map((c) => (
          <button
            key={c}
            type="button"
            disabled={Boolean(game)}
            onClick={() => run(c)}
            className="rounded-full border border-line px-3 py-1 font-mono text-xs text-mute transition-colors hover:border-lime/50 hover:text-lime disabled:opacity-40"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
