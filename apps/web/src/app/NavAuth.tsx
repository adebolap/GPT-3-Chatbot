"use client"

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export function NavAuth() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <SignedOut>
        <SignInButton mode="redirect">
          <button style={{ background: "none", border: "none", color: "#6b7280", fontSize: 14, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="redirect">
          <button style={{ background: "#111827", color: "#fff", padding: "8px 18px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Sign up free
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <Link href="/dashboard" style={{ color: "#6b7280", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          Dashboard
        </Link>
        <UserButton />
      </SignedIn>
      <Link href="/billing" style={{ background: "#7c3aed", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
        Get Pro
      </Link>
    </div>
  )
}
