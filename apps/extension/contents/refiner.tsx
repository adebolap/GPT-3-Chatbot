import { refinePrompt } from "../src/lib/api"
import { resolveAdapter } from "../src/adapters/sites"
import type { RefinementMode } from "@promptrefiner/shared"

let button: HTMLButtonElement | null = null
const mode: RefinementMode = "default"

const renderModal = (original: string, refined: string, onReplace: () => void) => {
  const wrap = document.createElement("div")
  wrap.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:center;justify-content:center;"
  wrap.innerHTML = `<div style="background:#fff;border-radius:12px;width:min(760px,95vw);padding:16px;font-family:sans-serif;">
    <h3>PromptRefiner</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div><h4>Original</h4><textarea style="width:100%;height:220px;">${original}</textarea></div>
      <div><h4>Refined</h4><textarea id="refined" style="width:100%;height:220px;">${refined}</textarea></div>
    </div>
    <p style="font-size:12px;color:#666">Review before sending.</p>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button id="cancel">Cancel</button>
      <button id="copy">Copy refined prompt</button>
      <button id="replace" style="background:#111827;color:#fff;border:none;padding:8px 10px;border-radius:8px;">Replace prompt</button>
    </div></div>`
  document.body.appendChild(wrap)
  ;(wrap.querySelector("#cancel") as HTMLButtonElement).onclick = () => wrap.remove()
  ;(wrap.querySelector("#copy") as HTMLButtonElement).onclick = async () => {
    await navigator.clipboard.writeText(refined)
  }
  ;(wrap.querySelector("#replace") as HTMLButtonElement).onclick = () => {
    onReplace()
    wrap.remove()
  }
}

const init = () => {
  const adapter = resolveAdapter()
  const input = adapter.detectInput()
  if (!input || button) return
  button = adapter.injectButton(input, async () => {
    const draft = adapter.getPromptText(input)
    if (!draft.trim()) return
    const data = await refinePrompt(draft, mode)
    renderModal(draft, data.refinedPrompt, () => adapter.setPromptText(input, data.refinedPrompt))
  })
}

setInterval(init, 1500)
