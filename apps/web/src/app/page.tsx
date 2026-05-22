import Link from "next/link"

const FEATURES = [
  {
    icon: "✦",
    title: "One-click refinement",
    desc: "A floating Refine button appears in ChatGPT, Claude, Gemini, and more.",
  },
  {
    icon: "⚡",
    title: "7 refinement modes",
    desc: "Professional, technical, marketing, shorter, deep research — pick the right lens.",
  },
  {
    icon: "🔒",
    title: "Privacy-first",
    desc: "Prompts are never stored by default. Secrets are masked before any API call.",
  },
]

const PLANS = [
  {
    name: "Free",
    price: "€0",
    period: "",
    features: ["10 refinements / month", "All 7 modes", "ChatGPT, Claude, Gemini"],
    cta: "Install extension",
    ctaHref: "#install",
    highlight: false,
  },
  {
    name: "Pro",
    price: "€29",
    period: "/ year",
    badge: "Early-bird",
    features: [
      "Unlimited refinements",
      "All 7 modes",
      "Saved prompt styles",
      "Custom default mode",
      "Priority support",
    ],
    cta: "Get Pro",
    ctaHref: "/billing",
    highlight: true,
  },
]

const STEPS = [
  { n: "1", title: "Type your rough prompt", desc: "Start typing as you normally would in any LLM chat." },
  { n: "2", title: "Click Refine", desc: "The floating button reads your draft and sends it to the refinement engine." },
  { n: "3", title: "Review & send", desc: "Compare the original and refined prompts, then replace with one click." },
]

export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 40px",
          borderBottom: "1px solid #f3f4f6",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16 }}>✦ PromptRefiner</span>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/login" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>
            Sign in
          </Link>
          <Link
            href="/billing"
            style={{
              background: "#111827",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Get Pro
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "96px 24px 80px",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#f3f4f6",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: 13,
            color: "#374151",
            marginBottom: 24,
          }}
        >
          Manifest V3 · ChatGPT · Claude · Gemini
        </div>
        <h1
          style={{
            fontSize: "clamp(36px,6vw,60px)",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 20px",
            letterSpacing: "-0.02em",
          }}
        >
          Better prompts.
          <br />
          Better AI results.
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#6b7280",
            lineHeight: 1.6,
            margin: "0 0 36px",
          }}
        >
          PromptRefiner adds a one-click refine button to any LLM chat interface.
          Type rough, get polished — automatically.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            id="install"
            href="#"
            style={{
              background: "#111827",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Install free extension
          </a>
          <Link
            href="/billing"
            style={{
              background: "#f3f4f6",
              color: "#111827",
              padding: "14px 28px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Get Pro — €29/yr
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section
        style={{
          background: "#f9fafb",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: 700,
              margin: "0 0 48px",
              letterSpacing: "-0.01em",
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 32,
            }}
          >
            {STEPS.map((s) => (
              <div key={s.n}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "#111827",
                    color: "#fff",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 14,
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: 700,
            margin: "0 0 48px",
            letterSpacing: "-0.01em",
          }}
        >
          Built for clarity
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 32,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: "#f9fafb",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 600 }}>{f.title}</h3>
              <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: "#f9fafb", padding: "72px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: 700,
              margin: "0 0 8px",
              letterSpacing: "-0.01em",
            }}
          >
            Simple pricing
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: 16,
              margin: "0 0 48px",
            }}
          >
            Start free. Upgrade when you need more.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 24,
            }}
          >
            {PLANS.map((p) => (
              <div
                key={p.name}
                style={{
                  background: p.highlight ? "#111827" : "#fff",
                  color: p.highlight ? "#fff" : "#111827",
                  borderRadius: 20,
                  padding: 32,
                  border: p.highlight ? "none" : "1px solid #e5e7eb",
                  position: "relative",
                }}
              >
                {p.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "#7c3aed",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    opacity: 0.7,
                    marginBottom: 8,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {p.price}
                  {p.period && (
                    <span style={{ fontSize: 18, fontWeight: 400, opacity: 0.6 }}>
                      {" "}
                      {p.period}
                    </span>
                  )}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "24px 0 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {p.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontSize: 14,
                        opacity: 0.85,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ opacity: 0.6 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.ctaHref}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "12px 24px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: "none",
                    background: p.highlight ? "#fff" : "#111827",
                    color: p.highlight ? "#111827" : "#fff",
                  }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px 24px",
          fontSize: 13,
          color: "#9ca3af",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        © {new Date().getFullYear()} PromptRefiner ·{" "}
        <Link href="/login" style={{ color: "#6b7280" }}>
          Sign in
        </Link>
      </footer>
    </>
  )
}
