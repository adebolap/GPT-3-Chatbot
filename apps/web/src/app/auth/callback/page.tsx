"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState("Completing sign-in…")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Upsert user row so the API can find them
        supabase.from("users").upsert({
          id: session.user.id,
          email: session.user.email,
        }, { onConflict: "id" }).then(() => {
          router.replace("/")
        })
      } else {
        setStatus("Sign-in failed. Please try again.")
      }
    })
  }, [router])

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui,sans-serif",
        color: "#6b7280",
      }}
    >
      {status}
    </div>
  )
}
