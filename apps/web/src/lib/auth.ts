import { auth } from "@clerk/nextjs/server"

export interface AuthContext {
  userId: string | null
  isPro: boolean
  isAuthenticated: boolean
}

export async function getAuthContext(): Promise<AuthContext> {
  const { userId, sessionClaims } = await auth()
  if (!userId) return { userId: null, isPro: false, isAuthenticated: false }
  const isPro = (sessionClaims?.metadata as any)?.plan === "pro"
  return { userId, isPro, isAuthenticated: true }
}
