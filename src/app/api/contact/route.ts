import { NextResponse } from "next/server";
import { normalize, validate } from "@/lib/contact";

/**
 * Contact endpoint.
 *
 * INTEGRATION REQUIRED: set CONTACT_WEBHOOK_URL to an endpoint that accepts a
 * JSON POST (e.g. a Formspree/Basin form endpoint, a Slack/Discord webhook
 * relay, Zapier/Make, or your own email-sending function). Until it is set,
 * the route validates submissions and responds 503 `not_configured` — it
 * never pretends a message was delivered.
 */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  const data = normalize(raw as Record<string, unknown>);

  // Bots fill the hidden field; accept quietly and drop.
  if (data.website) return NextResponse.json({ ok: true });

  const errors = validate(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, code: "invalid", errors }, { status: 422 });
  }

  const target = process.env.CONTACT_WEBHOOK_URL;
  if (!target) {
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message: "Message delivery is not configured on this site yet.",
      },
      { status: 503 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { website, ...payload } = data;
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
  } catch (err) {
    console.error("[contact] delivery failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
