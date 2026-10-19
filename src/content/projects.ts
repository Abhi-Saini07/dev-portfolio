/**
 * Case studies, described by project type only — no client or product names.
 *
 * Status labels on the HR platform separate work that was contributed from
 * work that is planned or still in design. Review them before publishing.
 */
export type Status = "contributed" | "planned" | "design";

export type CaseStudy = {
  id: "hr-platform" | "crm-workflows" | "transport-website";
  index: string;
  type: string;
  title: string;
  summary: string;
  challenge: string;
  scope: { label: string; items: { text: string; status?: Status }[] }[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "hr-platform",
    index: "01",
    type: "HR & recruitment platform",
    title: "Growing a recruitment tool into an HR platform",
    summary:
      "Contributed to the development and expansion of an HR and recruitment product — the hiring pipeline first, then the groundwork for broader HR management.",
    challenge:
      "Recruitment is a workflow with many hands: postings, applications, reviews, interviews and decisions. The challenge was modelling that flow cleanly, in a way that can later stretch from “candidate” to “employee” without starting over.",
    scope: [
      {
        label: "Recruitment foundation",
        items: [
          { text: "Job posting and recruitment workflows", status: "contributed" },
          { text: "Candidate application management", status: "contributed" },
          { text: "Candidate review and interview coordination", status: "contributed" },
          { text: "Hiring workflow management", status: "contributed" },
        ],
      },
      {
        label: "Platform expansion",
        items: [
          { text: "Candidate-to-employee lifecycle", status: "planned" },
          { text: "Employee onboarding and HR workflows", status: "planned" },
          { text: "Attendance and payroll-related features", status: "planned" },
        ],
      },
      {
        label: "Access",
        items: [{ text: "Authentication and role-based access", status: "design" }],
      },
    ],
  },
  {
    id: "crm-workflows",
    index: "02",
    type: "CRM & business process application",
    title: "Software shaped around how the business runs",
    summary:
      "CRM development and business process workflows — translating operational requirements into application features, then refining them through iteration.",
    challenge:
      "Business software succeeds when it mirrors the process behind it. The work was about structure: understanding the workflow, expressing it as data and application logic, and building interfaces that make the process easier to follow.",
    scope: [
      {
        label: "What I worked on",
        items: [
          { text: "Structuring and improving operational workflows" },
          { text: "Translating requirements into application features" },
          { text: "Maintainable interfaces and application logic" },
          { text: "Iterating on feedback through to deployment" },
        ],
      },
    ],
  },
  {
    id: "transport-website",
    index: "03",
    type: "Transport & logistics website",
    title: "A dependable commercial site, built server-side",
    summary:
      "Developed and maintained a transport company’s website with CodeIgniter and PHP — database-backed content and a responsive frontend.",
    challenge:
      "A commercial website has to be dependable before anything else. The work combined server-side development in a PHP MVC architecture with the parts that keep a site healthy: debugging, maintenance and performance.",
    scope: [
      {
        label: "What I worked on",
        items: [
          { text: "Server-side PHP with CodeIgniter's MVC structure" },
          { text: "Database integration and backend-driven content" },
          { text: "Responsive frontend implementation" },
          { text: "Debugging, maintenance and performance" },
        ],
      },
    ],
  },
];
