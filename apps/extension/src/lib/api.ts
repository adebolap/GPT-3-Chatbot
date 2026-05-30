const getWebUrl = () => process.env.PLASMO_PUBLIC_WEB_URL || "http://localhost:3000"

const SYNC_TOKEN_KEY = "contxt_sync_token"

export function getSyncToken(): Promise<string | null> {
  return new Promise((resolve) =>
    chrome.storage.local.get([SYNC_TOKEN_KEY], (r) => resolve(r[SYNC_TOKEN_KEY] ?? null))
  )
}

export function setSyncToken(token: string): Promise<void> {
  return new Promise((resolve) =>
    chrome.storage.local.set({ [SYNC_TOKEN_KEY]: token }, resolve)
  )
}

export function clearSyncToken(): Promise<void> {
  return new Promise((resolve) =>
    chrome.storage.local.remove(SYNC_TOKEN_KEY, resolve)
  )
}

export async function syncConversations(
  conversations: Array<{
    model: string
    url: string
    title: string
    personaName: string
    startedAt: number
  }>
): Promise<{ synced: number } | null> {
  const token = await getSyncToken()
  if (!token || conversations.length === 0) return null

  try {
    const res = await fetch(`${getWebUrl()}/api/sync/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ conversations }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
