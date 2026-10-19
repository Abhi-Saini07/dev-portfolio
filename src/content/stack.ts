/**
 * The toolkit, grouped by layer. No percentages or proficiency bars.
 * Trim anything you don't want to be asked about in an interview.
 */
export type Layer = "frontend" | "backend" | "data" | "delivery";

export const layers: { key: Layer; label: string; color: string }[] = [
  { key: "frontend", label: "Frontend", color: "var(--c-lime)" },
  { key: "backend", label: "Backend", color: "var(--c-violet)" },
  { key: "data", label: "Data", color: "var(--c-cyan)" },
  { key: "delivery", label: "Tools & delivery", color: "var(--c-amber)" },
];

export const tools: { name: string; layer: Layer }[] = [
  { name: "TypeScript", layer: "frontend" },
  { name: "JavaScript (ES2024)", layer: "frontend" },
  { name: "React 19", layer: "frontend" },
  { name: "Next.js 16", layer: "frontend" },
  { name: "Tailwind CSS v4", layer: "frontend" },
  { name: "Motion", layer: "frontend" },
  { name: "HTML5 & CSS3", layer: "frontend" },

  { name: "Node.js", layer: "backend" },
  { name: "Express.js", layer: "backend" },
  { name: "REST APIs", layer: "backend" },
  { name: "PHP", layer: "backend" },
  { name: "CodeIgniter", layer: "backend" },
  { name: "Auth · JWT · RBAC", layer: "backend" },
  { name: "Zod", layer: "backend" },

  { name: "PostgreSQL", layer: "data" },
  { name: "Neon", layer: "data" },
  { name: "MySQL", layer: "data" },
  { name: "Prisma ORM", layer: "data" },
  { name: "SQL", layer: "data" },

  { name: "Git & GitHub", layer: "delivery" },
  { name: "GitHub Actions", layer: "delivery" },
  { name: "Docker", layer: "delivery" },
  { name: "Vercel", layer: "delivery" },
  { name: "Railway", layer: "delivery" },
  { name: "Postman", layer: "delivery" },
  { name: "AI-assisted dev", layer: "delivery" },
];
