import type { RefineResponse, RefinementMode, UsageInfo, UserProfile } from "@promptrefiner/shared/src/types"
import { getDeviceId, getAuthToken } from "./storage"

const getBaseUrl = () =>
  process.env.PLASMO_PUBLIC_API_BASE_URL || "http://localhost:8787"

async function buildHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const token = await getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  } else {
    const deviceId = await getDeviceId()
    headers["x-user-id"] = deviceId
  }
  return headers
}

export async function refinePrompt(
  prompt: string,
  mode: RefinementMode
): Promise<RefineResponse> {
  const headers = await buildHeaders()
  const res = await fetch(`${getBaseUrl()}/api/refine`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt, mode }),
  })
  if (res.status === 429) {
    const body = await res.json().catch(() => ({}))
    throw new Error(
      body.error || "Free tier limit reached. Upgrade to Pro for unlimited refinements."
    )
  }
  if (!res.ok) throw new Error("Failed to refine prompt. Check your connection and try again.")
  return res.json()
}

export async function fetchUsage(): Promise<UsageInfo> {
  const headers = await buildHeaders()
  const res = await fetch(`${getBaseUrl()}/api/usage`, { headers })
  if (!res.ok) throw new Error("Failed to fetch usage")
  return res.json()
}

export async function fetchMe(): Promise<UserProfile> {
  const headers = await buildHeaders()
  const res = await fetch(`${getBaseUrl()}/api/me`, { headers })
  if (!res.ok) throw new Error("Failed to fetch profile")
  return res.json()
}
