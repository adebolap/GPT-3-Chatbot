import { NextResponse } from "next/server"
import { getAuthContext } from "@/lib/auth"
import { getAuthUserUsage, getDeviceUsage, currentMonth, FREE_LIMIT } from "@/lib/usage"

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
    const month = currentMonth()
    const isPro = auth.userPlan === "pro"

    const count = auth.isAuthenticated
      ? await getAuthUserUsage(auth.userId, month)
      : await getDeviceUsage(auth.userId, month)

    return NextResponse.json(
      { month, refinement_count: count, free_limit: isPro ? null : FREE_LIMIT },
      { headers: CORS }
    )
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: CORS })
  }
}
