import type { SiteAdapter } from "./types"

export class GenericTextboxAdapter implements SiteAdapter {
  detectInput(): HTMLElement | null {
    return (
      document.querySelector<HTMLElement>("textarea") ||
      document.querySelector<HTMLElement>('[contenteditable="true"]')
    )
  }

  getPromptText(input: HTMLElement): string {
    if (input instanceof HTMLTextAreaElement) return input.value
    // innerText respects line breaks; fall back to textContent
    return (input as HTMLElement).innerText || input.textContent || ""
  }

  setPromptText(input: HTMLElement, text: string): boolean {
    if (input instanceof HTMLTextAreaElement) {
      return this._setTextarea(input, text)
    }
    return this._setContentEditable(input, text)
  }

  private _setTextarea(input: HTMLTextAreaElement, text: string): boolean {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set
    if (!setter) return false
    setter.call(input, text)
    input.dispatchEvent(new Event("input", { bubbles: true }))
    input.dispatchEvent(new Event("change", { bubbles: true }))
    return true
  }

  private _setContentEditable(input: HTMLElement, text: string): boolean {
    input.focus()

    // 1. Select all existing content
    const sel = window.getSelection()
    if (sel) {
      const range = document.createRange()
      range.selectNodeContents(input)
      sel.removeAllRanges()
      sel.addRange(range)
    }

    // 2. Try beforeinput (ProseMirror / Quill intercept this)
    const dt = new DataTransfer()
    dt.setData("text/plain", text)
    const notCancelled = input.dispatchEvent(
      new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertReplacementText",
        dataTransfer: dt,
      })
    )

    // 3. execCommand fallback (when editor did not handle beforeinput)
    if (notCancelled) {
      document.execCommand("selectAll", false)
      const ok = document.execCommand("insertText", false, text)
      if (!ok) {
        // Last resort: write directly and fire input event
        input.innerText = text
        input.dispatchEvent(new Event("input", { bubbles: true }))
      }
    }

    // Cursor to end
    const sel2 = window.getSelection()
    if (sel2) {
      const r = document.createRange()
      r.selectNodeContents(input)
      r.collapse(false)
      sel2.removeAllRanges()
      sel2.addRange(r)
    }
    return true
  }
}
