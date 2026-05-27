export interface SiteAdapter {
  detectInput(): HTMLTextAreaElement | HTMLElement | null
  getPromptText(input: HTMLTextAreaElement | HTMLElement): string
  setPromptText(input: HTMLTextAreaElement | HTMLElement, text: string): void
  injectButton(input: HTMLTextAreaElement | HTMLElement, onClick: () => void): HTMLButtonElement
}
