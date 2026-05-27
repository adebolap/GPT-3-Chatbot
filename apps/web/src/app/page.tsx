import Link from "next/link"
import { NavAuth } from "./NavAuth"

const STEPS = [
  { n: "1", title: "Define yourself once", desc: "Tell Contxt your role, what you're working on, and how you like responses." },
  { n: "2", title: "Chat normally", desc: "Open ChatGPT, Claude, or Gemini and type as usual. Contxt is watching." },
  { n: "3", title: "Context auto-applied", desc: "Your first message gets your context silently prepended. The AI knows who you are." },
]

const FEATURES = [
  { icon: "⚡", title: "Zero friction", desc: "No copy-pasting. No system prompts. One click and your context travels with you across every LLM." },
  { icon: "🧠", title: "Conversation memory", desc: "Every chat you have is saved locally. Search across months of conversations in seconds." },
  { icon: "🔒", title: "Private by default", desc: "Conversations are stored on your device. Nothing leaves without your permission." },
  { icon: "✦", title: "Works everywhere", desc: "ChatGPT, Claude, Gemini, and any LLM chat interface. One extension, every model." },
]

export default function Home() {
  return (
    <>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid #f3f4f6", position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>✦ Contxt</span>
        <NavAuth />
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "#f3f4f6", borderRadius: 20, padding: "4px 14px", fontSize: 13, color: "#374151", marginBottom: 24 }}>
          ChatGPT · Claude · Gemini · Any LLM
        </div>
        <h1 style={{ fontSize: "clamp(38px,6vw,64px)", fontWeight: 800, lineHeight: 1.08, margin: "0 0 20px", letterSpacing: "-0.03em" }}>
          Never re-explain<br />yourself to an AI.
        </h1>
        <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.65, margin: "0 0 36px" }}>
          Contxt is a browser extension that injects your context into every new LLM conversation automatically — and remembers everything you've ever discussed.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#" style={{ background: "#111827", color: "#fff", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 700 }}>
            Install free — Chrome
          </a>
          <Link href="/billing" style={{ background: "#f3f4f6", color: "#111827", padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 700 }}>
            Get Pro — €49/yr
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#f9fafb", padding: "72px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, margin: "0 0 48px", letterSpacing: "-0.02em" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 32 }}>
            {STEPS.map((s) => (
              <div key={s.n}>
                <div style={{ width: 40, height: 40, background: "#111827", color: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, marginBottom: 14 }}>{s.n}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 600 }}>{s.title}</h3>
                <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6, fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, margin: "0 0 48px", letterSpacing: "-0.02em" }}>Built around your memory</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: "#f9fafb", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600 }}>{f.title}</h3>
              <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6, fontSize: 13 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: "#f9fafb", padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Simple pricing</h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 16, margin: "0 0 48px" }}>Local-first. Private. Upgrade when you need more.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {[
              { name: "Free", price: "€0", features: ["3 personas", "90-day local history", "Context injection", "Works on all LLMs"], cta: "Install extension", href: "#", highlight: false },
              { name: "Pro", price: "€49", period: "/year", badge: "Early-bird", features: ["Unlimited personas", "Full history + cloud sync", "Search across all conversations", "Priority support", "Team sharing (coming soon)"], cta: "Get Pro", href: "/billing", highlight: true },
            ].map((p) => (
              <div key={p.name} style={{ background: p.highlight ? "#111827" : "#fff", color: p.highlight ? "#fff" : "#111827", borderRadius: 20, padding: 32, border: p.highlight ? "none" : "1px solid #e5e7eb", position: "relative" }}>
                {p.badge && <div style={{ position: "absolute", top: 16, right: 16, background: "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>{p.badge}</div>}
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.6, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>
                  {p.price}
                  {"period" in p && <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}> {p.period}</span>}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: 14, opacity: 0.85, display: "flex", gap: 8 }}>
                      <span style={{ opacity: 0.6 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} style={{ display: "block", textAlign: "center", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", background: p.highlight ? "#fff" : "#111827", color: p.highlight ? "#111827" : "#fff" }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "32px 24px", fontSize: 13, color: "#9ca3af", borderTop: "1px solid #f3f4f6" }}>
        © {new Date().getFullYear()} Contxt ·{" "}
        <Link href="/sign-in" style={{ color: "#6b7280" }}>Sign in</Link>
      </footer>
    </>
  )
}
