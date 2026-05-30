import type { SiteAdapter } from "./types"

export class GenericTextboxAdapter implements SiteAdapter {
  detectInput(): HTMLElement | null {
    return (
      document.querySelector<HTMLElement>("textarea") ||
      document.querySelector<HTMLElement>('[contenteditable="true"]')
    )
  }

  getPromptText(input: HTMLElement): string {
    return input instanceof HTMLTextAreaElement
      ? input.value
      : input.textContent || ""
  }

  setPromptText(input: HTMLElement, text: string): void {
    if (input instanceof HTMLTextAreaElement) {
      // Native setter triggers React/Vue controlled input detection
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set
      setter?.call(input, text)
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
      return
    }
    // contenteditable (ProseMirror / Quill)
    // Select all content via Selection API, then dispatch beforeinput which
    // ProseMirror and Quill both handle to replace the selection.
    input.focus()
    const sel = window.getSelection()
    if (sel) {
      const range = document.createRange()
      range.selectNodeContents(input)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    const dt = new DataTransfer()
    dt.setData("text/plain", text)
    const replaced = input.dispatchEvent(
      new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertReplacementText",
        dataTransfer: dt,
      })
    )
    // execCommand fallback for editors that don't handle beforeinput
    if (replaced) {
      document.execCommand("selectAll", false)
      document.execCommand("insertText", false, text)
    }
  }
}
