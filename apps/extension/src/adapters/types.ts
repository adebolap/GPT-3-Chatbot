export type SupportedSite = "chatgpt" | "claude" | "gemini" | "generic"

export interface SiteAdapter {
  detectInput(): HTMLTextAreaElement | HTMLElement | null
  getPromptText(input: HTMLTextAreaElement | HTMLElement): string
  setPromptText(input: HTMLTextAreaElement | HTMLElement, text: string): void
}
