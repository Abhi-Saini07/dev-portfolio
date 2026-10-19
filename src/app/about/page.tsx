import type { Metadata } from "next";
import { Process } from "@/components/about/Process";
import { Reveal } from "@/components/Reveal";
import { NextPage, PageHeader, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "About",
  description: "How Abhi Saini works — the process and the principles behind the code.",
};

const PRINCIPLES = [
  "Solve the actual problem.",
  "Build for maintainability.",
  "Treat security as a design requirement.",
  "Make complex workflows feel simple.",
  "Prefer reliable over unnecessarily complex.",
  "Ship, measure, learn, improve.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title={
          <>
            I turn complex business problems into <span className="text-mute">software that works.</span>
          </>
        }
      />

      <section className="container-x py-20 md:py-24">
        <Reveal className="grid gap-8 md:grid-cols-12">
          <p className="text-xl leading-relaxed tracking-tight text-bone md:col-span-7 md:text-2xl md:leading-snug">
            Part engineer, part problem-solver. I work where engineering meets business operations —
            and I build the whole thing: interface, server logic, data model and access rules.
          </p>
          <p className="t-body md:col-span-4 md:col-start-9">
            Then I stay with it: debugging, tightening and shipping the next improvement. I work
            independently, but never in isolation — requirements get refined with the people who use
            the software.
          </p>
        </Reveal>
      </section>

      <section aria-labelledby="process-title" className="border-t border-line">
        <div className="container-x py-20 md:py-28">
          <SectionHeading
            id="process-title"
            label="Behind the magic"
            title="There's no spell — just a process I trust."
            intro="Pick a stage, or play the whole sequence."
          />
          <div className="mt-10">
            <Process />
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-t border-line">
        <div className="container-x py-20 md:py-28">
          <SectionHeading id="principles-title" label="Principles" title="Good software is more than code." />
          <ol className="mt-10 grid border-t border-line sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                as="li"
                key={p}
                delay={(i % 2) * 0.05}
                className="group flex items-baseline gap-5 border-b border-line py-6 sm:odd:pr-8"
              >
                <span className="font-mono text-xs text-dim transition-colors group-hover:text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-1.5 md:text-xl">
                  {p}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <NextPage href="/contact" label="Let's talk" />
    </>
  );
}
