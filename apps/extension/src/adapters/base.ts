import type { SiteAdapter } from "./types"

export class GenericTextboxAdapter implements SiteAdapter {
  detectInput() {
    return (document.querySelector("textarea") ||
      document.querySelector('[contenteditable="true"]')) as HTMLTextAreaElement | HTMLElement | null
  }

  getPromptText(input: HTMLTextAreaElement | HTMLElement) {
    return input instanceof HTMLTextAreaElement ? input.value : input.textContent || ""
  }

  setPromptText(input: HTMLTextAreaElement | HTMLElement, text: string) {
    if (input instanceof HTMLTextAreaElement) {
      input.value = text
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
      return
    }

    input.textContent = text
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }))
  }
}
