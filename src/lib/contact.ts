/** Shared by the contact form and the /api/contact route so both enforce the same rules. */

export const INTENTS = ["freelance", "employment"] as const;
export type Intent = (typeof INTENTS)[number];

export const PROJECT_TYPES = [
  "Custom web application",
  "CRM development or enhancement",
  "Workflow automation",
  "API integration",
  "Improving an existing application",
  "Bug fixing / maintenance",
  "Startup MVP",
  "Something else",
] as const;

export const TIMELINES = ["Flexible", "Within a month", "1–3 months", "3+ months"] as const;
export const EMPLOYMENT_TYPES = ["Full-time", "Contract", "Part-time"] as const;

export type ContactInput = {
  intent: Intent;
  name: string;
  email: string;
  organization: string;
  projectType: string;
  timeline: string;
  role: string;
  employmentType: string;
  message: string;
  /** Honeypot — real visitors never see or fill this. */
  website: string;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export const emptyContact: ContactInput = {
  intent: "freelance",
  name: "",
  email: "",
  organization: "",
  projectType: "",
  timeline: "",
  role: "",
  employmentType: "",
  message: "",
  website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function normalize(raw: Record<string, unknown>): ContactInput {
  const intent = INTENTS.includes(raw.intent as Intent) ? (raw.intent as Intent) : "freelance";
  return {
    intent,
    name: str(raw.name, 120),
    email: str(raw.email, 200),
    organization: str(raw.organization, 160),
    projectType: str(raw.projectType, 80),
    timeline: str(raw.timeline, 40),
    role: str(raw.role, 160),
    employmentType: str(raw.employmentType, 40),
    message: str(raw.message, 5000),
    website: str(raw.website, 200),
  };
}

export function validate(d: ContactInput): FieldErrors {
  const e: FieldErrors = {};
  if (d.name.length < 2) e.name = "Please enter your name.";
  if (!EMAIL.test(d.email)) e.email = "Please enter a valid email address.";
  if (d.intent === "freelance") {
    if (!PROJECT_TYPES.includes(d.projectType as (typeof PROJECT_TYPES)[number]))
      e.projectType = "Choose the type of project.";
    if (d.timeline && !TIMELINES.includes(d.timeline as (typeof TIMELINES)[number]))
      e.timeline = "Choose a timeline from the list.";
  } else {
    if (d.role.length < 2) e.role = "Tell me which role this is about.";
    if (!EMPLOYMENT_TYPES.includes(d.employmentType as (typeof EMPLOYMENT_TYPES)[number]))
      e.employmentType = "Choose an employment type.";
  }
  if (d.message.length < 20) e.message = "A few more details help — at least 20 characters.";
  if (d.message.length > 4000) e.message = "Please keep the message under 4,000 characters.";
  return e;
}
