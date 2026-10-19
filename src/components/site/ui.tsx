import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { Magnetic } from "./Magnetic";

type ButtonProps = { href: string; children: ReactNode; variant?: "primary" | "secondary"; className?: string };

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base =
    "group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-bone text-ink hover:bg-lime"
      : "border border-line-strong text-bone hover:border-tint/25 hover:bg-tint/[0.04]";
  return (
    <Magnetic>
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </Magnetic>
  );
}

/** Small mono label with a leading accent tick. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`t-label flex items-center gap-2 ${className}`}>
      <span aria-hidden className="h-px w-4 bg-lime" />
      {children}
    </p>
  );
}

export function PageHeader({ label, title, lead }: { label: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <section className="relative isolate border-b border-line">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid mask-fade opacity-60" />
      <div className="container-x pt-16 pb-14 md:pt-24 md:pb-16">
        <Label>{label}</Label>
        <h1 className="t-title mt-5 max-w-3xl">{title}</h1>
        {lead ? <p className="t-lead mt-5 max-w-2xl">{lead}</p> : null}
      </div>
    </section>
  );
}

export function SectionHeading({ label, title, intro, id }: { label: string; title: ReactNode; intro?: ReactNode; id?: string }) {
  return (
    <Reveal className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
      <div className="md:col-span-7">
        <Label>{label}</Label>
        <h2 id={id} className="t-section mt-4">
          {title}
        </h2>
      </div>
      {intro ? <p className="t-body md:col-span-5">{intro}</p> : null}
    </Reveal>
  );
}

/** The big "next page" link that closes every inner page. */
export function NextPage({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} data-cursor="Go" className="group block border-t border-line">
      <div className="container-x flex items-end justify-between gap-6 py-16 md:py-24">
        <div>
          <p className="t-label">Next</p>
          <p className="t-display mt-4 transition-colors duration-500 group-hover:text-lime">{label}</p>
        </div>
        <span className="mb-2 grid size-14 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-ink md:size-20">
          <ArrowUpRight className="size-6" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
