/**
 * Personal details live here and only here.
 * Anything set to `null` renders as an honest "not linked yet" state.
 */
export const site = {
  name: "Abhi Saini",
  initials: "AS",
  role: "Full-Stack Software Developer",
  email: "sainiabhias18@gmail.com" as string | null,
  linkedin: "https://www.linkedin.com/in/abhi-saini-1804891b4" as string | null,
  github: "https://github.com/Abhi-Saini07" as string | null,
  /** Used for canonical URLs and Open Graph. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "Full-Stack Developer & Freelance Development Partner",
  description:
    "Abhi Saini — full-stack developer building web applications, CRM systems and business workflows with Node.js, React and Next.js.",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
