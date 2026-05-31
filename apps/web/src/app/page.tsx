import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { webEnv } from "../lib/env"

const features = [
  "Define one persona with role, context, and response style",
  "Auto-prepend that context to new LLM conversations",
  "Save every conversation locally with Dexie.js / IndexedDB",
  "Search your AI history from the extension popup"
]

export default function HomePage() {
  const checkoutUrl = webEnv.lemonSqueezyCheckoutUrl

  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", margin: "0 auto", maxWidth: 980, padding: "72px 24px", color: "#111827" }}>
      <nav style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 48 }}>
        <strong>Contxt</strong>
        <SignedOut>
          <SignInButton mode="modal">
            <button style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px" }}>Sign in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>

      <p style={{ color: "#4f46e5", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Contxt</p>
      <h1 style={{ fontSize: 58, lineHeight: 1, margin: "16px 0" }}>Your AI memory layer.</h1>
      <p style={{ color: "#4b5563", fontSize: 20, lineHeight: 1.6, maxWidth: 760 }}>
        A browser extension that injects your context into every new LLM conversation and remembers what you have discussed across ChatGPT, Claude, Gemini, and more.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        <a href={checkoutUrl || "#pricing"} aria-disabled={!checkoutUrl} style={{ background: "#111827", borderRadius: 10, color: "#fff", padding: "12px 16px", textDecoration: "none" }}>
          Upgrade to Pro
        </a>
        <a href="/api/health" style={{ border: "1px solid #d1d5db", borderRadius: 10, color: "#111827", padding: "12px 16px", textDecoration: "none" }}>
          Health check
        </a>
      </div>
      {!checkoutUrl && <p style={{ color: "#92400e", marginTop: 10 }}>Set NEXT_PUBLIC_LS_CHECKOUT_URL to enable live Pro checkout.</p>}

      <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 44 }}>
        {features.map((feature) => (
          <div key={feature} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
            {feature}
          </div>
        ))}
      </section>

      <section id="pricing" style={{ marginTop: 56 }}>
        <h2>Free vs Pro</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
            <h3>Free</h3>
            <p>3 personas, 90 days of local history, local search.</p>
            <strong>€0</strong>
          </div>
          <div style={{ border: "2px solid #4f46e5", borderRadius: 14, padding: 18 }}>
            <h3>Pro</h3>
            <p>Unlimited personas, full history, cloud sync across devices.</p>
            <strong>€49/year</strong>
          </div>
        </div>
      </section>
    </main>
  )
}
