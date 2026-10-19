import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium">{site.name}</p>
          <p className="mt-1 text-sm text-dim">
            Part engineer. Part problem-solver. Building things that matter.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition-colors hover:text-bone">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-x border-t border-line py-5">
        <p className="font-mono text-[0.6875rem] text-dim">
          © {new Date().getFullYear()} {site.name}. Built with Next.js, TypeScript and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
