import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id",
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET(req: Request) {
  try {
    const auth = await getAuthContext(req)

    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { id: auth.userId, subscription_status: "free", plan: "free" },
        { headers: CORS }
      )
    }

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, email, subscription_status, plan")
      .eq("id", auth.userId)
      .single()

    return NextResponse.json(
      user ?? { id: auth.userId, subscription_status: "free", plan: "free" },
      { headers: CORS }
    )
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: CORS })
  }
}
