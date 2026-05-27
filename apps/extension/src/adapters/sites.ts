import { GenericTextboxAdapter } from "./base"

/**
 * ChatGPT uses a rich contenteditable div.
 * The prompt area is identified by the `data-id` or the ProseMirror class.
 */
export class ChatGPTAdapter extends GenericTextboxAdapter {
  detectInput(): HTMLElement | null {
    return (
      (document.querySelector(
        "#prompt-textarea, [data-id='root'] [contenteditable='true'], .ProseMirror[contenteditable='true']"
      ) as HTMLElement | null) || super.detectInput()
    )
  }
}

/**
 * Claude.ai uses a ProseMirror contenteditable.
 */
export class ClaudeAdapter extends GenericTextboxAdapter {
  detectInput(): HTMLElement | null {
    return (
      (document.querySelector(
        ".ProseMirror[contenteditable='true'], [contenteditable='true'][role='textbox']"
      ) as HTMLElement | null) || super.detectInput()
    )
  }
}

/**
 * Gemini uses a rich-text contenteditable input area.
 */
export class GeminiAdapter extends GenericTextboxAdapter {
  detectInput(): HTMLElement | null {
    return (
      (document.querySelector(
        "rich-textarea [contenteditable='true'], .ql-editor[contenteditable='true'], [contenteditable='true'].input-area"
      ) as HTMLElement | null) || super.detectInput()
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
