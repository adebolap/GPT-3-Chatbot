import type { Request, Response, NextFunction } from "express"
import { supabaseAdmin } from "../lib/supabase.js"

export interface AuthRequest extends Request {
  userId?: string
  userPlan?: "free" | "pro"
  isAuthenticated?: boolean
}

export async function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (!error && user) {
      req.userId = user.id
      req.isAuthenticated = true

      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("plan, subscription_status")
        .eq("id", user.id)
        .single()

      req.userPlan = profile?.plan === "pro" ? "pro" : "free"
      next()
      return
    }
  }

  req.userId = (req.headers["x-user-id"] as string) || "anon"
  req.userPlan = "free"
  req.isAuthenticated = false
  next()
}
