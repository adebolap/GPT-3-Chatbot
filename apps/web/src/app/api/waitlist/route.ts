import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email = typeof (body as any)?.email === "string" ? (body as any).email.trim().toLowerCase() : ""
  if (!email || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const { error } = await getSupabaseAdmin()
    .from("waitlist_emails")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true })

  if (error) {
    console.error("waitlist error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
