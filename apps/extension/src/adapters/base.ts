import type { SiteAdapter } from "./types"

/**
 * Set a value on a React-controlled input/textarea without losing the React
 * synthetic-event binding.  Mirrors what react-testing-library does internally.
 */
function setNativeValue(el: HTMLTextAreaElement, value: string) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set
  if (nativeSetter) {
    nativeSetter.call(el, value)
  } else {
    el.value = value
  }
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))
}

/**
 * Set text inside a React-controlled contenteditable element.
 * Uses execCommand so React's synthetic SyntheticEvent and
 * the browser's selection/undo stack stay intact.
 */
function setContentEditableValue(el: HTMLElement, value: string) {
  el.focus()
  // Select all existing content
  const sel = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(el)
  sel?.removeAllRanges()
  sel?.addRange(range)
  // Replace with new text (keeps undo history + triggers React's onChange)
  document.execCommand("insertText", false, value)
  // Fallback if execCommand is unsupported (e.g., Firefox nightly)
  if (!el.textContent?.includes(value.slice(0, 10))) {
    el.textContent = value
    el.dispatchEvent(new Event("input", { bubbles: true }))
  }
}

export class GenericTextboxAdapter implements SiteAdapter {
  detectInput(): HTMLTextAreaElement | HTMLElement | null {
    return (
      (document.querySelector("textarea") as HTMLTextAreaElement | null) ||
      (document.querySelector('[contenteditable="true"]') as HTMLElement | null)
    )
  }

  getPromptText(input: HTMLTextAreaElement | HTMLElement): string {
    if (input instanceof HTMLTextAreaElement) return input.value
    return input.innerText || input.textContent || ""
  }

  setPromptText(input: HTMLTextAreaElement | HTMLElement, text: string): void {
    if (input instanceof HTMLTextAreaElement) {
      setNativeValue(input, text)
    } else {
      setContentEditableValue(input as HTMLElement, text)
    }
  }

  injectButton(
    input: HTMLTextAreaElement | HTMLElement,
    onClick: () => void
  ): HTMLButtonElement {
    const btn = document.createElement("button")
    btn.textContent = "✨ Refine"
    btn.setAttribute("data-promptrefiner", "1")
    btn.style.cssText = [
      "position:fixed",
      "z-index:9999",
      "padding:6px 12px",
      "border-radius:8px",
      "border:none",
      "cursor:pointer",
      "background:#111827",
      "color:#fff",
      "font-size:13px",
      "font-family:sans-serif",
      "box-shadow:0 2px 8px rgba(0,0,0,.35)",
      "transition:opacity .15s",
    ].join(";")

    const position = () => {
      const rect = input.getBoundingClientRect()
      if (rect.width === 0) return // input not visible yet
      btn.style.top = `${Math.max(4, rect.top - 42)}px`
      btn.style.left = `${rect.right - 110}px`
    }

    position()
    btn.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      onClick()
    }

    // Re-position on scroll / resize so the button tracks the input
    const reposition = () => position()
    window.addEventListener("scroll", reposition, { passive: true })
    window.addEventListener("resize", reposition, { passive: true })
    // Expose cleanup so the content script can call it later
    ;(btn as any)._cleanup = () => {
      window.removeEventListener("scroll", reposition)
      window.removeEventListener("resize", reposition)
    }

    document.body.appendChild(btn)
    return btn
  }
}
