"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

type Step = "form" | "sent" | "error"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<Step>("form")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (error) {
      setErrorMsg(error.message)
      setStep("error")
    } else {
      setStep("sent")
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
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 24px rgba(0,0,0,.08)",
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", color: "#111827", display: "inline-block", marginBottom: 24 }}
        >
          ✦ PromptRefiner
        </Link>

        {step === "sent" ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>Check your email</h1>
            <p style={{ color: "#6b7280", margin: "0 0 24px", lineHeight: 1.6 }}>
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
            <button
              onClick={() => setStep("form")}
              style={{
                background: "transparent",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              Use a different email
            </button>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Sign in</h1>
            <p style={{ color: "#6b7280", margin: "0 0 24px", fontSize: 14 }}>
              We'll send you a magic link — no password needed.
            </p>

            {step === "error" && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: "#dc2626",
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                {errorMsg || "Something went wrong. Please try again."}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "inherit",
                  marginBottom: 16,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
