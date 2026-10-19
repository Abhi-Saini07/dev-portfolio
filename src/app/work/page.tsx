import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { NextPage, PageHeader } from "@/components/site/ui";
import { CrmMockup, HrMockup, TransportMockup } from "@/components/work/Mockups";
import { caseStudies, type CaseStudy, type Status } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "An HR & recruitment platform, a CRM & business process application, and a transport company website.",
};

const MOCKUPS = { "hr-platform": HrMockup, "crm-workflows": CrmMockup, "transport-website": TransportMockup };

const STATUS: Record<Status, { label: string; cls: string }> = {
  contributed: { label: "Contributed", cls: "border-lime/35 text-lime" },
  planned: { label: "Planned", cls: "border-dashed border-violet/50 text-violet" },
  design: { label: "Design", cls: "border-cyan/35 text-cyan" },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        label="Selected work"
        title="The story behind the software."
        lead="Three projects, described by what they are and the problems they solve. The interfaces are original illustrations — not screenshots of private systems."
      />
      <div className="container-x divide-y divide-line">
        {caseStudies.map((c) => (
          <CaseStudyBlock key={c.id} study={c} />
        ))}
      </div>
      <NextPage href="/about" label="About me" />
    </>
  );
}

function CaseStudyBlock({ study: c }: { study: CaseStudy }) {
  const Mockup = MOCKUPS[c.id];
  const hasStatus = c.scope.some((g) => g.items.some((it) => it.status));

  return (
    <article id={c.id} aria-labelledby={`${c.id}-title`} className="py-20 md:py-28">
      <Reveal className="grid gap-5 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="t-label flex items-center gap-3">
            <span className="text-lime">{c.index}</span>
            {c.type}
          </p>
          <h2 id={`${c.id}-title`} className="t-section mt-4">
            {c.title}
          </h2>
        </div>
        <p className="t-body md:col-span-5 md:self-end">{c.summary}</p>
      </Reveal>

      <Reveal delay={0.05} className="mt-10">
        <div
          data-cursor="Look"
          className="theme-dark group bg-dots overflow-hidden rounded-2xl border border-line bg-ink px-4 py-6 sm:px-10 sm:pt-10 sm:pb-16 md:px-16"
        >
          <div className="mx-auto max-w-3xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.015]">
            <Mockup />
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-5">
          <h3 className="t-label">The challenge</h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-bone/90">{c.challenge}</p>
        </Reveal>
        <Reveal delay={0.05} className="space-y-7 md:col-span-6 md:col-start-7">
          {c.scope.map((group) => (
            <div key={group.label}>
              <h3 className="t-label">{group.label}</h3>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {group.items.map((it) => (
                  <li key={it.text} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5 text-[0.9375rem]">
                    <span>{it.text}</span>
                    {it.status && (
                      <span className={`rounded-full border px-2 py-0.5 font-mono text-[0.625rem] tracking-wider uppercase ${STATUS[it.status].cls}`}>
                        {STATUS[it.status].label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {hasStatus && <p className="text-xs text-dim">Planned items are not presented as live.</p>}
        </Reveal>
      </div>
    </article>
  );
}
