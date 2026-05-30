import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const { userId } = await getAuthContext()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: conversations } = await getSupabaseAdmin()
      .from("conversations")
      .select("id, model, url, title, persona_name, started_at, synced_at")
      .eq("user_id", userId)
      .order("started_at", { ascending: false })
      .limit(100)

    return NextResponse.json({ conversations: conversations ?? [] })
  } catch (err) {
    console.error("conversations error:", err)
    return NextResponse.json({ conversations: [] }, { status: 500 })
  }
}
