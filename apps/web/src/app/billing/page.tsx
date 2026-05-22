"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"

export default function BillingPage() {
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setChecking(false); return }
      setUserEmail(session.user.email ?? null)
      const res = await fetch(`${API}/api/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(() => null)
      if (res?.ok) {
        const me = await res.json()
        setIsPro(me.plan === "pro")
      }
      setChecking(false)
    })
  }, [])

  const handleCheckout = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (session) headers["Authorization"] = `Bearer ${session.access_token}`

    const res = await fetch(`${API}/api/checkout`, {
      method: "POST",
      headers,
    }).catch(() => null)

    if (res?.ok) {
      const { url } = await res.json()
      window.location.href = url
    } else {
      setLoading(false)
      alert("Failed to open checkout. Please try again.")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#f9fafb",
        fontFamily: "system-ui,sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,.08)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "#111827", display: "inline-block", marginBottom: 24 }}>
          ✦ PromptRefiner
        </Link>

        {checking ? (
          <p style={{ color: "#9ca3af" }}>Loading…</p>
        ) : isPro ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>You're on Pro ✓</h1>
            <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
              You have unlimited refinements and all Pro features.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                display: "inline-block",
                background: "#7c3aed",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: 20,
                marginBottom: 16,
              }}
            >
              Early-bird
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              PromptRefiner Pro
            </h1>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", margin: "8px 0 4px" }}>
              €29{" "}
              <span style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>/ year</span>
            </div>
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24 }}>Later €49/year</p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 28px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                "Unlimited refinements",
                "All 7 refinement modes",
                "Saved prompt styles",
                "Custom default mode",
                "Works on ChatGPT, Claude, Gemini & more",
              ].map((f) => (
                <li key={f} style={{ fontSize: 14, display: "flex", gap: 8, color: "#374151" }}>
                  <span style={{ color: "#7c3aed" }}>✓</span> {f}
                </li>
              ))}
            </ul>

            {!userEmail && (
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                <Link href="/login" style={{ color: "#7c3aed" }}>Sign in</Link> first to link your subscription.
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Redirecting to checkout…" : "Subscribe — €29/year"}
            </button>
            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 12 }}>
              Secure checkout via Stripe. Cancel anytime.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
