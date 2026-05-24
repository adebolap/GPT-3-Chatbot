import { supabaseAdmin } from "./supabase-admin"

export interface AuthContext {
  userId: string
  userPlan: "free" | "pro"
  isAuthenticated: boolean
}

export async function getAuthContext(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get("authorization")

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (!error && user) {
      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .single()

      return {
        userId: user.id,
        userPlan: profile?.plan === "pro" ? "pro" : "free",
        isAuthenticated: true,
      }
    }
  }

  const deviceId = req.headers.get("x-user-id") || "anon"
  return { userId: deviceId, userPlan: "free", isAuthenticated: false }
}
