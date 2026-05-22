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
      return
    }
    input.textContent = text
    input.dispatchEvent(new Event("input", { bubbles: true }))
  }

  injectButton(input: HTMLTextAreaElement | HTMLElement, onClick: () => void) {
    const btn = document.createElement("button")
    btn.textContent = "Refine"
    btn.style.position = "absolute"
    btn.style.zIndex = "9999"
    btn.style.padding = "8px 12px"
    btn.style.borderRadius = "8px"
    btn.style.border = "none"
    btn.style.cursor = "pointer"
    btn.style.background = "#111827"
    btn.style.color = "#fff"
    const rect = input.getBoundingClientRect()
    btn.style.top = `${window.scrollY + rect.top - 42}px`
    btn.style.left = `${window.scrollX + rect.right - 72}px`
    btn.onclick = onClick
    document.body.appendChild(btn)
    return btn
  }
}
