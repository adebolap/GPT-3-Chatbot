const DEVICE_ID_KEY = "pr_device_id"
const AUTH_TOKEN_KEY = "pr_auth_token"
const DEFAULT_MODE_KEY = "pr_default_mode"

function randomId(): string {
  return crypto.randomUUID()
}

export async function getDeviceId(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get([DEVICE_ID_KEY], (result) => {
      if (result[DEVICE_ID_KEY]) {
        resolve(result[DEVICE_ID_KEY] as string)
      } else {
        const id = randomId()
        chrome.storage.local.set({ [DEVICE_ID_KEY]: id })
        resolve(id)
      }
    })
  })
}

export async function getAuthToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get([AUTH_TOKEN_KEY], (result) => {
      resolve((result[AUTH_TOKEN_KEY] as string) ?? null)
    })
  })
}

export async function setAuthToken(token: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [AUTH_TOKEN_KEY]: token }, resolve)
  })
}

export async function clearAuthToken(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove([AUTH_TOKEN_KEY], resolve)
  })
}

export async function getDefaultMode(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get([DEFAULT_MODE_KEY], (result) => {
      resolve((result[DEFAULT_MODE_KEY] as string) ?? "default")
    })
  })
}

export async function setDefaultMode(mode: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [DEFAULT_MODE_KEY]: mode }, resolve)
  })
}
