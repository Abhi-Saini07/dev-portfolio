import { Briefcase, CalendarClock, Check, Clock, LayoutDashboard, Lock, Minus, UserRoundCheck, Users, Wallet } from "lucide-react";
import type { ReactNode } from "react";

/* Shared window frame for every mockup. */
function Frame({ title, children, light = false }: { title: string; children: ReactNode; light?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        light ? "border-white/20 bg-[#f4f4f2] text-[#18181b]" : "surface-raised"
      }`}
    >
      <div className={`flex items-center gap-3 border-b px-4 py-2.5 ${light ? "border-black/10" : "border-line"}`}>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`size-2 rounded-full ${light ? "bg-black/15" : "bg-white/15"}`} />
          ))}
        </div>
        <span className={`font-mono text-[0.625rem] ${light ? "text-black/45" : "text-dim"}`}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ——— HR & recruitment platform ——— */

const HR_NAV = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Jobs", icon: Briefcase },
  { label: "Candidates", icon: Users, active: true },
  { label: "Interviews", icon: CalendarClock },
  { label: "Employees", icon: UserRoundCheck, planned: true },
  { label: "Attendance", icon: Clock, planned: true },
  { label: "Payroll", icon: Wallet, planned: true },
];

const HR_COLUMNS = [
  { name: "Applied", cards: ["Frontend Engineer", "HR Generalist", "Sales Lead"] },
  { name: "Screening", cards: ["Frontend Engineer", "Accountant"] },
  { name: "Interview", cards: ["Product Designer", "HR Generalist"] },
  { name: "Offer", cards: ["Backend Engineer"] },
];

export function HrMockup() {
  return (
    <div className="relative" aria-hidden>
      <Frame title="hiring / pipeline">
        <div className="flex">
          <nav className="hidden w-36 shrink-0 border-r border-line p-2.5 sm:block">
            <ul className="space-y-0.5">
              {HR_NAV.map(({ label, icon: Icon, active, planned }) => (
                <li
                  key={label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.6875rem] ${
                    active ? "bg-white/[0.06] text-bone" : planned ? "text-dim" : "text-mute"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                  {planned && <span className="ml-auto size-1.5 rounded-full border border-violet/70" />}
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 flex-1 p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">Pipeline</p>
              <span className="h-5 w-16 rounded-md bg-white/[0.05]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
              {HR_COLUMNS.map((col) => (
                <div key={col.name} className="rounded-lg bg-white/[0.025] p-1.5">
                  <p className="mb-1.5 flex justify-between px-1 text-[0.625rem] text-mute">
                    {col.name}
                    <span className="font-mono text-dim">{col.cards.length}</span>
                  </p>
                  <div className="space-y-1.5">
                    {col.cards.map((role, i) => (
                      <div key={i} className="rounded-md border border-line bg-ink-2 p-2">
                        <div className="flex items-center gap-1.5">
                          <span className="size-4 rounded-full bg-white/10" />
                          <span className="h-1.5 w-10 rounded-full bg-white/10" />
                        </div>
                        <p className="mt-1.5 truncate text-[0.5625rem] text-mute">{role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>

      <div className="surface-raised absolute -right-2 -bottom-8 hidden w-56 rounded-lg p-3 sm:block md:-right-6">
        <p className="font-mono text-[0.5625rem] tracking-wider text-dim uppercase">Access by role · design</p>
        <table className="mt-2 w-full text-[0.5625rem]">
          <thead>
            <tr className="text-dim">
              <th className="text-left font-normal" />
              {["Admin", "HR", "Manager"].map((r) => (
                <th key={r} className="pb-1 font-normal">
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["Post jobs", [1, 1, 0]],
                ["Review candidates", [1, 1, 1]],
                ["Manage payroll", [1, 0, 0]],
              ] as const
            ).map(([perm, row]) => (
              <tr key={perm} className="border-t border-line">
                <td className="py-1.5 text-mute">{perm}</td>
                {row.map((ok, i) => (
                  <td key={i} className="text-center">
                    {ok ? <Check className="mx-auto size-3 text-lime" /> : <Minus className="mx-auto size-3 text-dim" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ——— CRM & business process application ——— */

const STAGES = ["Capture", "Qualify", "Act", "Review", "Close"];
const ROWS = [
  ["Record 1042", "Qualify", "62%"],
  ["Record 1043", "Act", "48%"],
  ["Record 1044", "Review", "80%"],
  ["Record 1045", "Capture", "22%"],
] as const;

export function CrmMockup() {
  return (
    <div className="relative" aria-hidden>
      <Frame title="workflow / process board" light>
        <div className="px-4 pt-4">
          <ol className="flex items-center">
            {STAGES.map((s, i) => (
              <li key={s} className="flex flex-1 items-center last:flex-none">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[0.5625rem] font-medium ${
                    i < 3 ? "border-[#18181b] bg-[#18181b] text-white" : "border-black/20 text-black/55"
                  }`}
                >
                  {s}
                </span>
                {i < STAGES.length - 1 && <span className={`mx-1 h-px flex-1 ${i < 2 ? "bg-[#18181b]" : "bg-black/15"}`} />}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-5">
          <div className="rounded-lg border border-black/10 bg-white md:col-span-3">
            <div className="grid grid-cols-[1.2fr_0.8fr_1fr] gap-2 border-b border-black/10 px-3 py-2 font-mono text-[0.5rem] tracking-wider text-black/45 uppercase">
              <span>Record</span>
              <span>Stage</span>
              <span>Progress</span>
            </div>
            {ROWS.map(([name, stage, w]) => (
              <div key={name} className="grid grid-cols-[1.2fr_0.8fr_1fr] items-center gap-2 border-b border-black/5 px-3 py-2 text-[0.625rem] last:border-0">
                <span className="font-medium">{name}</span>
                <span className="w-fit rounded bg-black/[0.06] px-1.5 py-0.5 text-[0.5625rem]">{stage}</span>
                <span className="h-1 rounded-full bg-black/[0.07]">
                  <span className="block h-full rounded-full bg-[#18181b]" style={{ width: w }} />
                </span>
              </div>
            ))}
          </div>
          <div className="relative grid min-h-40 grid-cols-2 gap-2 rounded-lg border border-black/10 bg-[radial-gradient(rgb(0_0_0/0.08)_1px,transparent_1px)] [background-size:12px_12px] p-2 md:col-span-2">
            {[
              ["Account", "id · name · owner"],
              ["Contact", "id · account_id"],
              ["Activity", "id · record_id"],
              ["Workflow", "id · stage"],
            ].map(([name, f]) => (
              <div key={name} className="self-center rounded-md border border-black/15 bg-white shadow-sm">
                <p className="border-b border-black/10 px-1.5 py-1 text-[0.5625rem] font-semibold">{name}</p>
                <p className="px-1.5 py-1 font-mono text-[0.5rem] text-black/50">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </Frame>
      <div className="surface-raised absolute -bottom-7 -left-2 hidden rounded-lg px-3 py-2.5 sm:block md:-left-6">
        <div className="flex items-center gap-1.5 text-[0.5625rem]">
          {["Requirement", "Feature", "Feedback", "Refine"].map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={`rounded px-1.5 py-0.5 ${i === 3 ? "bg-lime/15 text-lime" : "bg-white/[0.06] text-mute"}`}>{s}</span>
              {i < 3 && <span className="text-dim">→</span>}
            </span>
          ))}
          <span className="text-lime">↺</span>
        </div>
      </div>
    </div>
  );
}

/* ——— Transport & logistics website ——— */

const MVC = ["Request", "Router", "Controller", "Model", "View", "Response"];

export function TransportMockup() {
  return (
    <div className="relative" aria-hidden>
      <div className="surface-raised overflow-hidden rounded-xl">
        <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rounded-full bg-white/15" />
            ))}
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2.5 py-1">
            <Lock className="size-3 text-dim" />
            <span className="h-1.5 w-24 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <span className="h-2 w-14 rounded-full bg-bone/70" />
          <span className="hidden gap-3 sm:flex">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-9 rounded-full bg-white/15" />
            ))}
            <span className="h-4 w-12 rounded bg-lime" />
          </span>
        </div>
        <div className="grid items-center gap-4 px-5 pt-2 pb-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[0.5625rem] tracking-[0.18em] text-lime uppercase">Transport & logistics</p>
            <p className="mt-2 text-2xl leading-[1.05] font-semibold tracking-tight">Moving what matters.</p>
            <div className="mt-3 space-y-1.5">
              <span className="block h-1.5 w-40 rounded-full bg-white/10" />
              <span className="block h-1.5 w-28 rounded-full bg-white/10" />
            </div>
          </div>
          <svg viewBox="0 0 260 150" className="w-full">
            <defs>
              <pattern id="tgrid" width="13" height="13" patternUnits="userSpaceOnUse">
                <path d="M13 0H0V13" fill="none" stroke="rgb(255 255 255 / 0.05)" />
              </pattern>
            </defs>
            <rect width="260" height="150" rx="8" fill="url(#tgrid)" />
            <path d="M20 125 C 70 118, 62 62, 120 60 S 200 32, 238 22" fill="none" stroke="#c5f04a" strokeWidth="1.5" strokeDasharray="5 6" />
            <path d="M20 125 C 90 136, 150 108, 200 100 S 236 76, 244 70" fill="none" stroke="rgb(255 255 255 / 0.3)" strokeDasharray="3 5" />
            {[
              [20, 125],
              [120, 60],
              [200, 100],
              [238, 22],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="6" fill="rgb(197 240 74 / 0.12)" />
                <circle cx={x} cy={y} r="2.5" fill={i % 3 === 0 ? "#c5f04a" : "#f4f4f5"} />
              </g>
            ))}
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
          {["Services", "Coverage", "About"].map((t) => (
            <div key={t} className="bg-ink-3 p-3">
              <p className="text-[0.625rem] font-medium">{t}</p>
              <span className="mt-2 block h-1 w-12 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
      <div className="surface-raised absolute -right-2 -bottom-8 hidden rounded-lg p-3 sm:block md:-right-6">
        <p className="font-mono text-[0.5625rem] tracking-wider text-dim uppercase">Request lifecycle · MVC</p>
        <ol className="mt-2 flex items-center gap-1 text-[0.5625rem]">
          {MVC.map((s, i) => (
            <li key={s} className="flex items-center gap-1">
              <span className={`rounded px-1.5 py-0.5 font-mono ${s === "Model" ? "bg-lime/15 text-lime" : "bg-white/[0.06] text-mute"}`}>{s}</span>
              {i < MVC.length - 1 && <span className="text-dim">→</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
