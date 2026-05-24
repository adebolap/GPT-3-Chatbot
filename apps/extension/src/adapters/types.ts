export interface SiteAdapter {
  detectInput(): HTMLElement | null
  getPromptText(input: HTMLElement): string
  setPromptText(input: HTMLElement, text: string): void
  injectButton(input: HTMLElement, onClick: () => void): HTMLButtonElement
  cleanupButton(btn: HTMLButtonElement): void
}
