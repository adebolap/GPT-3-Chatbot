import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const { userId, isPro } = await getAuthContext()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isPro) return NextResponse.json({ error: "Pro required" }, { status: 403 })

    const { data: existing } = await getSupabaseAdmin()
      .from("sync_tokens")
      .select("token")
      .eq("user_id", userId)
      .single()

    if (existing) return NextResponse.json({ token: existing.token })

    const token = randomUUID()
    await getSupabaseAdmin().from("sync_tokens").insert({ user_id: userId, token })
    return NextResponse.json({ token })
  } catch (err) {
    console.error("sync-token error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
