import type { RefineResponse, RefinementMode } from "@promptrefiner/shared/src/types"

export async function refinePrompt(prompt: string, mode: RefinementMode): Promise<RefineResponse> {
  const baseUrl = process.env.PLASMO_PUBLIC_API_BASE_URL || "http://localhost:8787"
  const res = await fetch(`${baseUrl}/api/refine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, mode })
  })
  if (!res.ok) throw new Error("Failed to refine prompt")
  return res.json()
}
