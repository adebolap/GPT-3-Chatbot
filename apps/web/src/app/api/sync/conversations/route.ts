import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim()
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401, headers: CORS })

  const { data: tokenRow } = await getSupabaseAdmin()
    .from("sync_tokens")
    .select("user_id")
    .eq("token", token)
    .single()

  if (!tokenRow) return NextResponse.json({ error: "Invalid token" }, { status: 401, headers: CORS })

  const body = await req.json()
  const conversations: any[] = body.conversations ?? []
  if (conversations.length === 0) return NextResponse.json({ synced: 0 }, { headers: CORS })

  const rows = conversations.map((c) => ({
    user_id: tokenRow.user_id,
    model: c.model ?? "other",
    url: c.url ?? "",
    title: c.title ?? "",
    persona_name: c.personaName ?? "",
    started_at: c.startedAt,
  }))

  const { error } = await getSupabaseAdmin()
    .from("conversations")
    .upsert(rows, { onConflict: "user_id,url,started_at", ignoreDuplicates: true })

  if (error) {
    console.error("sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500, headers: CORS })
  }

  return NextResponse.json({ synced: rows.length }, { headers: CORS })
}
