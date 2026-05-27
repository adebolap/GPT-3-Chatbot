import { GenericTextboxAdapter } from "./base"

export class ChatGPTAdapter extends GenericTextboxAdapter {
  detectInput(): HTMLElement | null {
    return (
      document.querySelector<HTMLElement>("#prompt-textarea") ||
      document.querySelector<HTMLElement>('[data-testid="prompt-textarea"]') ||
      document.querySelector<HTMLElement>("div.ProseMirror[contenteditable='true']") ||
      super.detectInput()
    )
  }
}

export class ClaudeAdapter extends GenericTextboxAdapter {
  detectInput(): HTMLElement | null {
    return (
      document.querySelector<HTMLElement>('[data-testid="chat-input"]') ||
      document.querySelector<HTMLElement>("div.ProseMirror[contenteditable='true']") ||
      document.querySelector<HTMLElement>("[contenteditable='true'][spellcheck]") ||
      super.detectInput()
    )
  }
}

export class GeminiAdapter extends GenericTextboxAdapter {
  detectInput(): HTMLElement | null {
    return (
      document.querySelector<HTMLElement>("div.ql-editor[contenteditable='true']") ||
      document.querySelector<HTMLElement>("rich-textarea [contenteditable='true']") ||
      document.querySelector<HTMLElement>("textarea.message-input") ||
      super.detectInput()
    )
  }
}

export const resolveAdapter = () => {
  const host = window.location.hostname
  if (host.includes("chatgpt.com")) return new ChatGPTAdapter()
  if (host.includes("claude.ai")) return new ClaudeAdapter()
  if (host.includes("gemini.google.com")) return new GeminiAdapter()
  return new GenericTextboxAdapter()
}
