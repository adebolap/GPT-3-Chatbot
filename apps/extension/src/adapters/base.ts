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
      // Use native setter so React/Vue controlled inputs detect the change
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set
      setter?.call(input, text)
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
      return
    }
    // contenteditable
    input.focus()
    document.execCommand("selectAll", false)
    document.execCommand("insertText", false, text)
  }

  injectButton(input: HTMLElement, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement("button")
    btn.id = "pr-refine-btn"
    btn.textContent = "✦ Refine"
    Object.assign(btn.style, {
      position: "fixed",
      zIndex: "2147483646",
      padding: "6px 14px",
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.15)",
      cursor: "pointer",
      background: "linear-gradient(135deg,#111827 0%,#1f2937 100%)",
      color: "#f9fafb",
      fontSize: "13px",
      fontWeight: "600",
      fontFamily: "system-ui,-apple-system,sans-serif",
      letterSpacing: "0.01em",
      boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      transition: "opacity 0.15s,transform 0.1s",
      lineHeight: "1",
    } as Partial<CSSStyleDeclaration>)

    btn.onmouseenter = () => {
      btn.style.opacity = "0.85"
      btn.style.transform = "scale(1.03)"
    }
    btn.onmouseleave = () => {
      btn.style.opacity = "1"
      btn.style.transform = "scale(1)"
    }

    const reposition = () => {
      const rect = input.getBoundingClientRect()
      if (rect.width === 0) return
      btn.style.top = `${rect.top + 8}px`
      btn.style.left = `${rect.right - 116}px`
    }
    reposition()

    const obs = new ResizeObserver(reposition)
    obs.observe(input)
    ;(btn as any)._obs = obs

    window.addEventListener("scroll", reposition, { passive: true })
    window.addEventListener("resize", reposition, { passive: true })
    ;(btn as any)._reposition = reposition

    btn.onclick = onClick
    document.body.appendChild(btn)
    return btn
  }

  cleanupButton(btn: HTMLButtonElement): void {
    const obs = (btn as any)._obs as ResizeObserver | undefined
    obs?.disconnect()
    const reposition = (btn as any)._reposition as (() => void) | undefined
    if (reposition) {
      window.removeEventListener("scroll", reposition)
      window.removeEventListener("resize", reposition)
    }
    btn.remove()
  }
}
