import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07080a",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          color: "#ecebe4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#8d929b" }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#c8ff4d" }} />
          Available for select opportunities
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>
            {site.name}
            <span style={{ color: "#c8ff4d" }}>.</span>
          </div>
          <div style={{ fontSize: 46, marginTop: 24, color: "#ecebe4", maxWidth: 900, lineHeight: 1.15 }}>
            I build software that moves businesses forward.
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 22, color: "#5b6069", letterSpacing: 3, textTransform: "uppercase" }}>
          <span>Full-stack</span>
          <span>·</span>
          <span>CRM & workflows</span>
          <span>·</span>
          <span>Web applications</span>
        </div>
      </div>
    ),
    size,
  );
}
