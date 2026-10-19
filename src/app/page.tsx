import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { HeroTerminal } from "@/components/home/HeroTerminal";
import { Toolkit } from "@/components/home/Toolkit";
import { Reveal } from "@/components/Reveal";
import { Button, NextPage, SectionHeading } from "@/components/site/ui";
import { caseStudies } from "@/content/projects";
import { site } from "@/content/site";

const SERVICES = [
  "Custom web apps",
  "CRM development",
  "Workflow automation",
  "REST APIs & integrations",
  "Startup MVPs",
  "Maintenance & performance",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  description: site.description,
  knowsAbout: ["Node.js", "TypeScript", "React", "Next.js", "PostgreSQL", "PHP", "CRM systems"],
  sameAs: [site.linkedin, site.github].filter(Boolean),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="relative isolate">
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid mask-fade opacity-60" />
        <div className="container-x grid items-center gap-14 pt-12 pb-20 md:pt-20 md:pb-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-2 py-1 pr-3 pl-2 text-[0.8125rem] text-mute">
              <span className="size-1.5 rounded-full bg-lime animate-pulse-dot" aria-hidden />
              Available for select opportunities
            </p>
            <p className="mt-8 text-sm text-mute">
              <span className="font-medium text-bone">{site.name}</span>
              <span className="mx-2 text-dim">/</span>
              {site.role}
            </p>
            <h1 className="t-display mt-4">
              <span className="sr-only">{site.name} — </span>
              I build software that <span className="text-mute">moves businesses forward.</span>
            </h1>
            <p className="t-lead mt-6 max-w-lg">
              Node.js, React and Next.js — CRM systems, business workflows and web apps, from
              requirements to production.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact">Let&apos;s build something</Button>
              <Button href="/work" variant="secondary">
                See my work
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <HeroTerminal />
          </div>
        </div>
      </section>

      {/* Services marquee */}
      <section aria-label="What I can help with" className="group overflow-hidden border-y border-line py-6">
        <ul className="sr-only">
          {SERVICES.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div aria-hidden className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {SERVICES.map((s) => (
                <span key={s} className="flex items-center text-2xl font-medium tracking-tight text-mute md:text-3xl">
                  <span className="px-6 transition-colors hover:text-bone md:px-10">{s}</span>
                  <span className="text-lime">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Toolkit */}
      <section aria-labelledby="toolkit-title" className="container-x py-24 md:py-32">
        <SectionHeading
          id="toolkit-title"
          label="Toolkit"
          title={
            <>
              The tools I build with. <span className="text-mute">Go on, throw them around.</span>
            </>
          }
          intro="Pick a layer to see what lives where, or drag the chips anywhere."
        />
        <Reveal className="mt-10">
          <Toolkit />
        </Reveal>
      </section>

      {/* Selected work */}
      <section aria-labelledby="work-title" className="border-t border-line">
        <div className="container-x py-24 md:py-32">
          <SectionHeading id="work-title" label="Selected work" title="Three projects, by the problems they solve." />
          <ul className="mt-12 border-t border-line">
            {caseStudies.map((c, i) => (
              <Reveal as="li" key={c.id} delay={i * 0.05} className="border-b border-line">
                <Link
                  href={`/work#${c.id}`}
                  data-cursor="View"
                  className="group relative isolate grid gap-2 py-7 md:grid-cols-12 md:items-center md:gap-6 md:py-9"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-tint/[0.03] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  />
                  <span className="font-mono text-xs text-dim md:col-span-1">{c.index}</span>
                  <span className="text-xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:col-span-7 md:text-2xl">
                    {c.title}
                  </span>
                  <span className="t-label md:col-span-3">{c.type}</span>
                  <ArrowUpRight
                    className="hidden size-5 text-dim transition-all duration-500 group-hover:rotate-45 group-hover:text-lime md:col-span-1 md:block md:justify-self-end"
                    aria-hidden
                  />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <NextPage href="/contact" label="Let's talk" />
    </>
  );
}
