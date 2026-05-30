import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import { webEnv } from "../../../../lib/env"

const getSupabase = () => {
  if (!webEnv.supabaseUrl || !webEnv.supabaseServiceRoleKey) return null
  return createClient(webEnv.supabaseUrl, webEnv.supabaseServiceRoleKey)
}

const getProfile = async () => {
  const { userId } = await auth()
  if (!userId) return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) }

  const supabase = getSupabase()
  if (!supabase) return { error: Response.json({ error: "Supabase is not configured" }, { status: 503 }) }

  const { data: profile, error } = await supabase
    .from("profiles")
    .upsert({ clerk_user_id: userId, updated_at: new Date().toISOString() }, { onConflict: "clerk_user_id" })
    .select("id, plan")
    .single()

  if (error) return { error: Response.json({ error: error.message }, { status: 500 }) }
  if (profile.plan !== "pro") return { error: Response.json({ error: "Cloud sync requires Contxt Pro" }, { status: 402 }) }

  return { supabase, profile }
}

export async function GET() {
  const context = await getProfile()
  if (context.error) return context.error

  const { data, error } = await context.supabase
    .from("conversations")
    .select("*")
    .eq("user_id", context.profile.id)
    .order("updated_at", { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ conversations: data })
}

export async function POST(request: Request) {
  const context = await getProfile()
  if (context.error) return context.error

  const body = await request.json()
  const now = new Date().toISOString()
  const { error } = await context.supabase.from("conversations").upsert({
    id: body.id,
    user_id: context.profile.id,
    site: body.site,
    url: body.url,
    title: body.title,
    first_user_message: body.firstUserMessage,
    injected_prompt: body.injectedPrompt,
    created_at: body.createdAt || now,
    updated_at: body.updatedAt || now
  })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
