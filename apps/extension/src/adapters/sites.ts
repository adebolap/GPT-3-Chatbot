import { GenericTextboxAdapter } from "./base"
import type { SupportedSite } from "./types"

export class ChatGPTAdapter extends GenericTextboxAdapter {
  detectInput() {
    return (document.querySelector("#prompt-textarea") || super.detectInput()) as HTMLTextAreaElement | HTMLElement | null
  }
}

export class ClaudeAdapter extends GenericTextboxAdapter {
  detectInput() {
    return (document.querySelector('[contenteditable="true"][role="textbox"]') || super.detectInput()) as HTMLTextAreaElement | HTMLElement | null
  }
}

export class GeminiAdapter extends GenericTextboxAdapter {
  detectInput() {
    return (document.querySelector('[contenteditable="true"]') || super.detectInput()) as HTMLTextAreaElement | HTMLElement | null
  }
}

export const resolveSite = (): SupportedSite => {
  const host = window.location.hostname
  if (host.includes("chatgpt.com")) return "chatgpt"
  if (host.includes("claude.ai")) return "claude"
  if (host.includes("gemini.google.com")) return "gemini"
  return "generic"
}

export const resolveAdapter = () => {
  const site = resolveSite()
  if (site === "chatgpt") return new ChatGPTAdapter()
  if (site === "claude") return new ClaudeAdapter()
  if (site === "gemini") return new GeminiAdapter()
  return new GenericTextboxAdapter()
}
