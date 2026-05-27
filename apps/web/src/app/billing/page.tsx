"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"

const LS_CHECKOUT_URL = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL ?? ""

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "#f9fafb", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#111827", display: "inline-block", marginBottom: 24, fontWeight: 700 }}>
          ✦ Contxt
        </Link>

        {!isLoaded ? (
          <p style={{ color: "#9ca3af" }}>Loading…</p>
        ) : isPro ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>You're on Pro ✓</h1>
            <p style={{ color: "#6b7280", lineHeight: 1.6 }}>Unlimited personas, full history, and cloud sync are active.</p>
          </>
        ) : (
          <>
            <div style={{ display: "inline-block", background: "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, marginBottom: 16 }}>
              Early-bird
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Contxt Pro</h1>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", margin: "8px 0 4px" }}>
              €49 <span style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>/year</span>
            </div>
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24 }}>Later €79/year</p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Unlimited personas", "Full history + cloud sync", "Search across all conversations", "Works on all LLMs", "Priority support"].map((f) => (
                <li key={f} style={{ fontSize: 14, display: "flex", gap: 8, color: "#374151" }}>
                  <span style={{ color: "#7c3aed" }}>✓</span> {f}
                </li>
              ))}
            </ul>

            {!user && (
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                <Link href="/sign-in" style={{ color: "#7c3aed" }}>Sign in</Link> to link your subscription.
              </p>
            )}

            <button
              onClick={handleCheckout}
              style={{ width: "100%", padding: 14, background: "#111827", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              Subscribe — €49/year
            </button>
            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 12 }}>Secure checkout via Lemon Squeezy. Cancel anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}
