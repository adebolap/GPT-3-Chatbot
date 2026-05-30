"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"

const LS_CHECKOUT_URL = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL ?? ""

const FREE_FEATURES = ["3 personas", "90-day local history", "Context injection on all LLMs", "Chrome & Edge support"]
const PRO_FEATURES = ["Unlimited personas", "Full history + cloud sync", "Search all conversations", "Works on Chrome & Edge", "Priority support"]

export default function BillingPage() {
  const { user, isLoaded } = useUser()
  const isPro = (user?.publicMetadata as any)?.plan === "pro"

  const handleCheckout = () => {
    const url = user?.id
      ? `${LS_CHECKOUT_URL}?checkout[custom][clerk_user_id]=${user.id}`
      : LS_CHECKOUT_URL
    window.location.href = url
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "#f9fafb", fontFamily: "system-ui,sans-serif" }}>
      <div className="billing-card">
        <Link href="/" style={{ textDecoration: "none", color: "#111827", display: "inline-block", marginBottom: 24, fontWeight: 700 }}>
          ✦ Contxt
        </Link>

        {!isLoaded ? (
          <p style={{ color: "#9ca3af" }}>Loading…</p>
        ) : isPro ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>You're on Pro ✓</h1>
            <p style={{ color: "#6b7280", lineHeight: 1.6 }}>Unlimited personas, full history, and cloud sync are active.</p>

            <div style={{ margin: "24px 0 0", padding: "16px", background: "#f9fafb", borderRadius: 12 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>What's included</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {PRO_FEATURES.map((f) => (
                  <li key={f} style={{ fontSize: 13, color: "#374151", display: "flex", gap: 8 }}>
                    <span style={{ color: "#7c3aed" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Plan comparison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ padding: "12px", background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Free</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>€0</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                  {FREE_FEATURES.map((f) => (
                    <li key={f} style={{ fontSize: 12, color: "#6b7280", display: "flex", gap: 6 }}>
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: "12px", background: "#111827", borderRadius: 12, color: "#fff", position: "relative" }}>
                <div style={{ position: "absolute", top: -8, right: 8, background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>Early-bird</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Pro</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>€49</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>/year · later €79</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                  {PRO_FEATURES.map((f) => (
                    <li key={f} style={{ fontSize: 12, color: "#d1d5db", display: "flex", gap: 6 }}>
                      <span style={{ color: "#a78bfa" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {!user && (
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                <Link href="/sign-in" style={{ color: "#7c3aed" }}>Sign in</Link> to link your subscription.
              </p>
            )}

            <button
              onClick={handleCheckout}
              style={{ width: "100%", padding: 14, background: "#111827", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              Upgrade to Pro — €49/year
            </button>
            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 12 }}>Secure checkout via Lemon Squeezy. Cancel anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}
