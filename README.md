# Abhi Saini — Portfolio

A four-page portfolio for a full-stack developer and freelance development partner:
**Home**, **Work**, **About** and **Contact**.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lucide · Geist.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Before you publish — fill these in

| What | Where |
| --- | --- |
| Name, email, LinkedIn, GitHub | `src/content/site.ts` |
| Case-study copy and the HR-platform status labels (Contributed / Planned / Design) | `src/content/projects.ts` |
| Toolkit chips — trim anything you don't want to be asked about | `src/content/stack.ts` |
| Site URL for canonical + Open Graph | `NEXT_PUBLIC_SITE_URL` |
| Contact-form delivery | `CONTACT_WEBHOOK_URL` (see below) |

Projects are described by type only — no client or product names.

## Contact form — integration required

`src/app/api/contact/route.ts` validates every submission (same rules as the client, from
`src/lib/contact.ts`) and has a honeypot for bots. To deliver messages, set
`CONTACT_WEBHOOK_URL` to any endpoint that accepts a JSON `POST` — a Formspree/Basin form
endpoint, a Zapier/Make webhook, or your own email function (Resend, SES, etc.).

Until it's set, the API returns `503 not_configured` and the form tells the visitor plainly that
the message was **not** sent.

## Design system

- One type family (Geist + Geist Mono for labels) on a six-step scale defined in
  `src/app/globals.css`: `t-display`, `t-title`, `t-section`, `t-card`, `t-lead` / `t-body`, `t-label`.
- One accent colour, used for small signals only; surfaces use `surface` / `surface-raised`.

## Structure

```
src/
  app/            layout, / (home), /work, /about, /contact, OG image, icon, /api/contact
  content/        site.ts · projects.ts · stack.ts  ← all copy and personal data
  lib/contact.ts  shared validation
  components/
    site/         Header, Footer, Cursor, Magnetic, shared UI (Button, PageHeader, NextPage)
    home/         HeroTerminal (commands + bug-squash game), Toolkit (draggable stack)
    work/         Mockups (CSS/SVG product illustrations)
    about/        Process (interactive stages + storytelling terminal)
    contact/      ContactForm
```

Page transitions live in `src/app/template.tsx`. Everything respects `prefers-reduced-motion`;
the trailing cursor and magnetic buttons only run on fine pointers.
