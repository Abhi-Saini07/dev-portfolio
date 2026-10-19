import { ArrowUpRight, Mail } from "lucide-react";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { PageHeader } from "@/components/site/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Abhi Saini about a freelance project or an employment opportunity.",
};

type Channel = { label: string; value: string; href: string | null; icon: ComponentType<{ className?: string }> };

const handle = (url: string | null) => (url ? url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : "Not linked yet");

const channels: Channel[] = [
  { label: "LinkedIn", value: handle(site.linkedin), href: site.linkedin, icon: LinkedinIcon },
  { label: "GitHub", value: handle(site.github), href: site.github, icon: GithubIcon },
  { label: "Email", value: site.email ?? "Not linked yet", href: site.email ? `mailto:${site.email}` : null, icon: Mail },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Your next great product starts with a conversation."
        lead="Freelance project or a role on your team — tell me what you're working on."
      />
      <section className="container-x py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <h2 className="t-label">Find me</h2>
            <ul className="mt-4 border-t border-line">
              {channels.map(({ label, value, href, icon: Icon }) => (
                <li key={label} className="border-b border-line">
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      data-cursor="Open"
                      className="group flex items-center gap-4 py-5"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{label}</span>
                        <span className="block truncate text-sm text-mute">{value}</span>
                      </span>
                      <ArrowUpRight
                        className="size-4 text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                        aria-hidden
                      />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 py-5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-dim">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-mute">{label}</span>
                        <span className="block text-sm text-dim">{value}</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
