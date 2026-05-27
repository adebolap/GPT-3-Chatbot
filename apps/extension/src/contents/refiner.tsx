import { refinePrompt } from "../lib/api"
import { resolveAdapter } from "../adapters/sites"
import type { RefinementMode } from "@promptrefiner/shared"

export const config = {
  matches: ["https://chatgpt.com/*", "https://claude.ai/*", "https://gemini.google.com/*"]
}

let button: HTMLButtonElement | null = null
let activeInput: HTMLTextAreaElement | HTMLElement | null = null
const mode: RefinementMode = "default"

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

const renderModal = (original: string, refined: string, onReplace: () => void) => {
  const wrap = document.createElement("div")
  wrap.setAttribute("data-promptrefiner-modal", "1")
  wrap.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:center;justify-content:center;"
  wrap.innerHTML = `
    <div style="background:#fff;border-radius:12px;width:min(760px,95vw);padding:20px;font-family:sans-serif;box-shadow:0 8px 32px rgba(0,0,0,.3);">
      <h3 style="margin:0 0 12px;font-size:16px;">✨ PromptRefiner</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div><h4 style="margin:0 0 6px;font-size:13px;color:#666;">Original</h4>
          <textarea readonly style="width:100%;height:220px;resize:vertical;border:1px solid #ddd;border-radius:6px;padding:8px;font-size:13px;box-sizing:border-box;">${escapeHtml(original)}</textarea>
        </div>
        <div><h4 style="margin:0 0 6px;font-size:13px;color:#666;">Refined</h4>
          <textarea id="pr-refined" style="width:100%;height:220px;resize:vertical;border:1px solid #ddd;border-radius:6px;padding:8px;font-size:13px;box-sizing:border-box;">${escapeHtml(refined)}</textarea>
        </div>
      </div>
      <p style="font-size:11px;color:#999;margin:8px 0;">Review the refined prompt before sending.</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;">
        <button id="pr-cancel" style="padding:8px 14px;border:1px solid #ddd;border-radius:8px;cursor:pointer;background:#fff;">Cancel</button>
        <button id="pr-copy" style="padding:8px 14px;border:1px solid #ddd;border-radius:8px;cursor:pointer;background:#fff;">Copy refined</button>
        <button id="pr-replace" style="padding:8px 14px;border:none;border-radius:8px;cursor:pointer;background:#111827;color:#fff;">Replace &amp; keep editing</button>
      </div>
    </div>`
  document.body.appendChild(wrap)

  const refined$ = wrap.querySelector("#pr-refined") as HTMLTextAreaElement
  ;(wrap.querySelector("#pr-cancel") as HTMLButtonElement).onclick = () => wrap.remove()
  ;(wrap.querySelector("#pr-copy") as HTMLButtonElement).onclick = async () => {
    await navigator.clipboard.writeText(refined$.value)
    const btn = wrap.querySelector("#pr-copy") as HTMLButtonElement
    btn.textContent = "Copied!"
    setTimeout(() => (btn.textContent = "Copy refined"), 1500)
  }
  ;(wrap.querySelector("#pr-replace") as HTMLButtonElement).onclick = () => {
    onReplace()
    wrap.remove()
  }
  // Close on backdrop click
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap) wrap.remove()
  })
}

const removeButton = () => {
  if (button) {
    ;(button as any)._cleanup?.()
    button.remove()
    button = null
  }
}

const init = () => {
  const adapter = resolveAdapter()
  const input = adapter.detectInput()

  // Input disappeared — clean up
  if (!input) {
    removeButton()
    activeInput = null
    return
  }

  // Input changed — remove old button and re-inject
  if (activeInput !== input) {
    removeButton()
    activeInput = input
  }

  // Button already injected for this input
  if (button && document.body.contains(button)) return

  // Inject new button
  button = adapter.injectButton(input, async () => {
    const draft = adapter.getPromptText(input)
    if (!draft.trim()) return

    // Disable button while refining
    button!.disabled = true
    button!.textContent = "Refining…"

    try {
      const data = await refinePrompt(draft, mode)
      renderModal(draft, data.refinedPrompt, () =>
        adapter.setPromptText(input, data.refinedPrompt)
      )
    } catch (err) {
      console.error("[PromptRefiner] refinement error:", err)
      alert("PromptRefiner: refinement failed.\n\nIs the API server running at http://localhost:8787?")
    } finally {
      if (button) {
        button.disabled = false
        button.textContent = "✨ Refine"
      }
    }
  })
}

setInterval(init, 1500)
