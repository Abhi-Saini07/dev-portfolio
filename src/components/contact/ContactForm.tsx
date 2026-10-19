"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowRight, Briefcase, CheckCircle2, Loader2, Plug, Rocket } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  EMPLOYMENT_TYPES,
  PROJECT_TYPES,
  TIMELINES,
  emptyContact,
  validate,
  type ContactInput,
  type FieldErrors,
  type Intent,
} from "@/lib/contact";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "not_configured" | "error";

const ORDER: (keyof ContactInput)[] = ["name", "email", "projectType", "timeline", "role", "employmentType", "message"];

export function ContactForm() {
  const [data, setData] = useState<ContactInput>(emptyContact);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    const next = { ...data, [k]: v };
    setData(next);
    if (touched) setErrors(validate(next));
  };

  const setIntent = (intent: Intent) => {
    const next = { ...data, intent };
    setData(next);
    if (touched) setErrors(validate(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(data);
    setErrors(errs);
    const first = ORDER.find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { code?: string; errors?: FieldErrors };
      if (res.ok) {
        setStatus("sent");
        setData({ ...emptyContact, intent: data.intent });
        setTouched(false);
      } else if (body.code === "not_configured") {
        setStatus("not_configured");
      } else if (body.code === "invalid" && body.errors) {
        setErrors(body.errors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const freelance = data.intent === "freelance";
  const errorCount = Object.keys(errors).length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="surface relative rounded-2xl p-5 sm:p-8" aria-describedby="form-note">
      <fieldset>
        <legend className="t-label">What&apos;s this about?</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <IntentOption
            checked={freelance}
            onChange={() => setIntent("freelance")}
            icon={<Rocket className="size-4" aria-hidden />}
            title="Freelance project"
            sub="Build, improve or fix something"
          />
          <IntentOption
            checked={!freelance}
            onChange={() => setIntent("employment")}
            icon={<Briefcase className="size-4" aria-hidden />}
            title="Employment opportunity"
            sub="A full-time, contract or part-time role"
          />
        </div>
      </fieldset>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls(errors.name)}
            {...aria("name", errors.name)}
          />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls(errors.email)}
            {...aria("email", errors.email)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label={freelance ? "Company or project" : "Company"} name="organization" optional>
            <input
              id="organization"
              name="organization"
              autoComplete="organization"
              value={data.organization}
              onChange={(e) => set("organization", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>

        {freelance ? (
          <>
            <Field label="Project type" name="projectType" error={errors.projectType}>
              <select
                id="projectType"
                name="projectType"
                value={data.projectType}
                onChange={(e) => set("projectType", e.target.value)}
                className={inputCls(errors.projectType)}
                {...aria("projectType", errors.projectType)}
              >
                <option value="">Select…</option>
                {PROJECT_TYPES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Timeline" name="timeline" optional error={errors.timeline}>
              <select
                id="timeline"
                name="timeline"
                value={data.timeline}
                onChange={(e) => set("timeline", e.target.value)}
                className={inputCls(errors.timeline)}
                {...aria("timeline", errors.timeline)}
              >
                <option value="">Not sure yet</option>
                {TIMELINES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </>
        ) : (
          <>
            <Field label="Role title" name="role" error={errors.role}>
              <input
                id="role"
                name="role"
                value={data.role}
                onChange={(e) => set("role", e.target.value)}
                className={inputCls(errors.role)}
                {...aria("role", errors.role)}
              />
            </Field>
            <Field label="Employment type" name="employmentType" error={errors.employmentType}>
              <select
                id="employmentType"
                name="employmentType"
                value={data.employmentType}
                onChange={(e) => set("employmentType", e.target.value)}
                className={inputCls(errors.employmentType)}
                {...aria("employmentType", errors.employmentType)}
              >
                <option value="">Select…</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </>
        )}

        <div className="sm:col-span-2">
          <Field
            label={freelance ? "What problem are you trying to solve?" : "Tell me about the role and team"}
            name="message"
            error={errors.message}
            hint={`${data.message.trim().length} / 4000`}
          >
            <textarea
              id="message"
              name="message"
              rows={6}
              value={data.message}
              onChange={(e) => set("message", e.target.value)}
              className={`${inputCls(errors.message)} resize-y`}
              {...aria("message", errors.message)}
            />
          </Field>
        </div>
      </div>

      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" value={data.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p id="form-note" className="max-w-sm text-sm text-dim">
          Your details are only used to reply to your message.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-11 items-center gap-2 rounded-full bg-bone px-5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-lime disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              {freelance ? "Send project inquiry" : "Send opportunity"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </div>

      <div aria-live="polite" role="status" className="mt-6 empty:hidden">
        {touched && errorCount > 0 && status === "idle" && (
          <p className="flex items-center gap-2 text-sm text-danger">
            <AlertTriangle className="size-4" aria-hidden />
            Please fix {errorCount === 1 ? "1 field" : `${errorCount} fields`} above.
          </p>
        )}
        <AnimatePresence>
          {status === "sent" && (
            <Notice key="sent" tone="ok" icon={<CheckCircle2 className="size-5" aria-hidden />} title="Message sent.">
              Thanks for reaching out — I&apos;ll reply to the email you provided.
            </Notice>
          )}
          {status === "not_configured" && (
            <Notice key="nc" tone="warn" icon={<Plug className="size-5" aria-hidden />} title="Your message was not sent.">
              The form works and your details passed validation, but message delivery isn&apos;t
              connected on this site yet (site owner: set <code className="font-mono text-bone">CONTACT_WEBHOOK_URL</code>).{" "}
              {site.email ? (
                <>
                  Please email{" "}
                  <a className="text-bone underline underline-offset-4" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>{" "}
                  instead — your draft is still in the form.
                </>
              ) : (
                <>Your draft is still in the form.</>
              )}
            </Notice>
          )}
          {status === "error" && (
            <Notice key="err" tone="warn" icon={<AlertTriangle className="size-5" aria-hidden />} title="Something went wrong.">
              The message couldn&apos;t be delivered. Your draft is still here — please try again in a moment.
            </Notice>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function aria(name: string, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
  } as const;
}

function inputCls(error?: string) {
  return `w-full rounded-lg border bg-ink px-3.5 py-2.5 text-[0.9375rem] text-bone placeholder:text-dim transition-colors outline-none focus:border-lime/70 focus:ring-2 focus:ring-lime/20 ${
    error ? "border-danger/70" : "border-line-strong hover:border-tint/25"
  }`;
}

function Field({
  label,
  name,
  error,
  optional,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {optional && <span className="ml-1.5 font-normal text-dim">(optional)</span>}
        </label>
        {hint && <span className="font-mono text-[0.65rem] text-dim">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function IntentOption({
  checked,
  onChange,
  icon,
  title,
  sub,
}: {
  checked: boolean;
  onChange: () => void;
  icon: ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lime ${
        checked ? "border-lime/60 bg-lime/[0.06]" : "border-line-strong hover:border-tint/25"
      }`}
    >
      <input type="radio" name="intent" aria-label={title} checked={checked} onChange={onChange} className="sr-only" />
      <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${checked ? "bg-lime text-ink" : "bg-tint/[0.06] text-mute"}`}>
        {icon}
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="mt-0.5 block text-sm text-mute">{sub}</span>
      </span>
    </label>
  );
}

function Notice({
  tone,
  icon,
  title,
  children,
}: {
  tone: "ok" | "warn";
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${
        tone === "ok" ? "border-lime/40 bg-lime/[0.06] text-bone" : "border-warn/40 bg-warn/[0.06] text-mute"
      }`}
    >
      <span className={tone === "ok" ? "text-lime" : "text-warn"}>{icon}</span>
      <div>
        <p className="font-medium text-bone">{title}</p>
        <p className="mt-1">{children}</p>
      </div>
    </motion.div>
  );
}
