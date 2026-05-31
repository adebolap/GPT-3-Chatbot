export interface SiteAdapter {
  detectInput(): HTMLElement | null
  getPromptText(input: HTMLElement): string
  setPromptText(input: HTMLElement, text: string): boolean
}
