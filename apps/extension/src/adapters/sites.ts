import { GenericTextboxAdapter } from "./base"

export class ChatGPTAdapter extends GenericTextboxAdapter {}
export class ClaudeAdapter extends GenericTextboxAdapter {}
export class GeminiAdapter extends GenericTextboxAdapter {}

export const resolveAdapter = () => {
  const host = window.location.hostname
  if (host.includes("chatgpt.com")) return new ChatGPTAdapter()
  if (host.includes("claude.ai")) return new ClaudeAdapter()
  if (host.includes("gemini.google.com")) return new GeminiAdapter()
  return new GenericTextboxAdapter()
}
