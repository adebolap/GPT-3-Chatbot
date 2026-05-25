import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  const { userId } = await getAuthContext()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: conversations } = await supabaseAdmin
    .from("conversations")
    .select("id, model, url, title, persona_name, started_at, synced_at")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(100)

  return NextResponse.json({ conversations: conversations ?? [] })
}
