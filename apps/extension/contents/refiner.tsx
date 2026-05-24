import type { PlasmoCSConfig } from "plasmo"
import { refinePrompt } from "../src/lib/api"
import { resolveAdapter } from "../src/adapters/sites"
import { getDefaultMode } from "../src/lib/storage"
import type { RefinementMode } from "@promptrefiner/shared/src/types"

export const config: PlasmoCSConfig = {
  matches: [
    "https://chatgpt.com/*",
    "https://claude.ai/*",
    "https://gemini.google.com/*",
    "<all_urls>",
  ],
  run_at: "document_idle",
}

const MODES: Array<{ value: RefinementMode; label: string }> = [
  { value: "default", label: "Default" },
  { value: "professional", label: "Professional" },
  { value: "accuracy-first", label: "Accuracy-first" },
  { value: "technical-coding", label: "Technical/Coding" },
  { value: "marketing", label: "Marketing" },
  { value: "shorter", label: "Shorter" },
  { value: "deep-research", label: "Deep Research" },
]

// ── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
#pr-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);z-index:2147483647;display:flex;align-items:center;justify-content:center;animation:pr-fadein .15s ease}
@keyframes pr-fadein{from{opacity:0}to{opacity:1}}
#pr-modal{background:#fff;border-radius:16px;width:min(820px,95vw);max-height:90vh;overflow-y:auto;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.3);font-family:system-ui,-apple-system,sans-serif;animation:pr-slideup .15s ease}
@keyframes pr-slideup{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
#pr-modal h2{margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;display:flex;align-items:center;gap:8px}
.pr-sub{font-size:13px;color:#6b7280;margin:0 0 16px}
.pr-modes{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.pr-chip{padding:4px 12px;border-radius:20px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;font-size:12px;font-weight:500;cursor:pointer;transition:all .1s;font-family:inherit}
.pr-chip:hover{border-color:#111827}
.pr-chip.on{background:#111827;color:#fff;border-color:#111827}
.pr-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px}
.pr-col label{display:block;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.pr-col textarea{width:100%;height:220px;padding:12px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;font-family:inherit;line-height:1.5;color:#1f2937;resize:vertical;box-sizing:border-box;background:#f9fafb}
.pr-col textarea:focus{outline:none;border-color:#111827;background:#fff}
.pr-col textarea[readonly]{color:#6b7280}
.pr-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.pr-badge{background:#f3f4f6;padding:3px 10px;border-radius:20px;font-size:12px;color:#6b7280}
.pr-note{font-size:12px;color:#9ca3af;margin:0 0 16px}
.pr-actions{display:flex;gap:8px;justify-content:flex-end;align-items:center}
.pr-btn{padding:9px 18px;border-radius:10px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s;border:1px solid transparent}
.pr-cancel{background:transparent;border-color:#e5e7eb;color:#6b7280}
.pr-cancel:hover{background:#f9fafb}
.pr-copy{background:transparent;border-color:#e5e7eb;color:#374151}
.pr-copy:hover{background:#f9fafb}
.pr-replace{background:#111827;color:#fff;border-color:#111827;padding:9px 22px}
.pr-replace:hover{background:#1f2937}
.pr-replace:disabled{opacity:.5;cursor:not-allowed}
.pr-error{background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:12px 16px;color:#dc2626;font-size:14px;margin-bottom:16px}
.pr-loading{text-align:center;padding:52px 0;color:#6b7280;font-size:14px}
.pr-spinner{width:32px;height:32px;border:3px solid #e5e7eb;border-top-color:#111827;border-radius:50%;animation:pr-spin .7s linear infinite;margin:0 auto 14px}
@keyframes pr-spin{to{transform:rotate(360deg)}}
.pr-upgrade{display:inline-block;margin-top:8px;color:#7c3aed;font-size:13px;text-decoration:underline;cursor:pointer}
@media(max-width:580px){.pr-cols{grid-template-columns:1fr}}
`

// ── State ─────────────────────────────────────────────────────────────────────

const adapter = resolveAdapter()
let activeButton: HTMLButtonElement | null = null
let activeInput: HTMLElement | null = null

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function injectStyles() {
  if (document.getElementById("pr-styles")) return
  const el = document.createElement("style")
  el.id = "pr-styles"
  el.textContent = CSS
  document.head?.appendChild(el)
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function buildModalHTML(
  original: string,
  mode: RefinementMode,
  loading: boolean,
  refined: string,
  error: string,
  intent: string,
  confidence: string,
  missing: string[]
): string {
  const chips = MODES.map(
    (m) =>
      `<button class="pr-chip${m.value === mode ? " on" : ""}" data-mode="${m.value}">${m.label}</button>`
  ).join("")

  let body: string
  if (loading) {
    body = `<div class="pr-loading"><div class="pr-spinner"></div>Refining your prompt…</div>`
  } else if (error) {
    const isLimit = error.toLowerCase().includes("limit")
    body = `
      <div class="pr-error">
        ${esc(error)}
        ${isLimit ? `<br><a class="pr-upgrade" href="${process.env.PLASMO_PUBLIC_WEB_URL || "http://localhost:3000"}/billing" target="_blank" rel="noreferrer">Upgrade to Pro →</a>` : ""}
      </div>
      <div class="pr-cols">
        <div class="pr-col"><label>Original</label><textarea readonly>${esc(original)}</textarea></div>
        <div class="pr-col"><label>Refined</label><textarea id="pr-refined" disabled placeholder="Refinement failed"></textarea></div>
      </div>`
  } else {
    const meta =
      intent || confidence
        ? `<div class="pr-meta">
            ${intent ? `<span class="pr-badge">Intent: ${esc(intent)}</span>` : ""}
            ${confidence ? `<span class="pr-badge">Confidence: ${esc(confidence)}</span>` : ""}
            ${missing.length ? `<span class="pr-badge">${missing.length} suggestion${missing.length > 1 ? "s" : ""}</span>` : ""}
          </div>`
        : ""
    body = `
      <div class="pr-cols">
        <div class="pr-col"><label>Original</label><textarea readonly>${esc(original)}</textarea></div>
        <div class="pr-col"><label>Refined</label><textarea id="pr-refined">${esc(refined)}</textarea></div>
      </div>
      ${meta}`
  }

  const hasRefined = !loading && !error
  const actions = hasRefined
    ? `<button class="pr-btn pr-cancel" id="pr-cancel">Cancel</button>
       <button class="pr-btn pr-copy" id="pr-copy">Copy refined</button>
       <button class="pr-btn pr-replace" id="pr-replace">Replace prompt ↵</button>`
    : `<button class="pr-btn pr-cancel" id="pr-cancel">${loading ? "Cancel" : "Close"}</button>`

  return `
    <div id="pr-modal">
      <h2>✦ PromptRefiner</h2>
      <p class="pr-sub">Choose a mode, review the improved prompt, then replace or copy.</p>
      <div class="pr-modes">${chips}</div>
      ${body}
      <p class="pr-note">Review before sending. The refined text is editable.</p>
      <div class="pr-actions">${actions}</div>
    </div>`
}

async function openModal(draft: string, input: HTMLElement) {
  document.getElementById("pr-modal-bg")?.remove()

  let mode: RefinementMode = (await getDefaultMode()) as RefinementMode
  let loading = true
  let refined = ""
  let error = ""
  let intent = ""
  let confidence = ""
  let missing: string[] = []

  const bg = document.createElement("div")
  bg.id = "pr-modal-bg"

  const render = () => {
    bg.innerHTML = buildModalHTML(draft, mode, loading, refined, error, intent, confidence, missing)

    // Mode chips
    bg.querySelectorAll<HTMLButtonElement>(".pr-chip").forEach((chip) => {
      chip.addEventListener("click", async () => {
        const next = chip.dataset.mode as RefinementMode
        if (next === mode || loading) return
        mode = next
        loading = true
        error = ""
        refined = ""
        render()
        await runRefinement()
      })
    })

    bg.querySelector("#pr-cancel")?.addEventListener("click", () => bg.remove())
    bg.addEventListener("click", (e) => { if (e.target === bg) bg.remove() })

    bg.querySelector("#pr-copy")?.addEventListener("click", async () => {
      const ta = bg.querySelector<HTMLTextAreaElement>("#pr-refined")
      const text = ta?.value || refined
      await navigator.clipboard.writeText(text)
      const btn = bg.querySelector<HTMLButtonElement>("#pr-copy")!
      btn.textContent = "Copied!"
      setTimeout(() => { btn.textContent = "Copy refined" }, 1500)
    })

    bg.querySelector("#pr-replace")?.addEventListener("click", () => {
      const ta = bg.querySelector<HTMLTextAreaElement>("#pr-refined")
      adapter.setPromptText(input, ta?.value || refined)
      bg.remove()
    })
  }

  const runRefinement = async () => {
    try {
      const data = await refinePrompt(draft, mode)
      refined = data.refinedPrompt
      intent = data.detectedIntent
      confidence = data.confidence
      missing = data.missingContext || []
      loading = false
      error = ""
    } catch (e: any) {
      loading = false
      error = e.message || "Something went wrong. Please try again."
    }
    render()
  }

  // Escape key closes modal
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { bg.remove(); document.removeEventListener("keydown", onKey) }
  }
  document.addEventListener("keydown", onKey)
  bg.addEventListener("remove", () => document.removeEventListener("keydown", onKey))

  render()
  document.body.appendChild(bg)
  await runRefinement()
}

// ── Button injection loop ─────────────────────────────────────────────────────

function setButtonState(btn: HTMLButtonElement, busy: boolean) {
  btn.textContent = busy ? "Refining…" : "✦ Refine"
  btn.style.opacity = busy ? "0.65" : "1"
  ;(btn as HTMLButtonElement & { disabled: boolean }).disabled = busy
}

function init() {
  injectStyles()

  // Clean up button if input disappeared
  if (activeButton && activeInput && !document.body.contains(activeInput)) {
    adapter.cleanupButton(activeButton)
    activeButton = null
    activeInput = null
  }

  if (activeButton) return

  const input = adapter.detectInput()
  if (!input) return

  activeInput = input
  activeButton = adapter.injectButton(input, async () => {
    const draft = adapter.getPromptText(input)
    if (!draft.trim()) return
    setButtonState(activeButton!, true)
    await openModal(draft, input)
    setButtonState(activeButton!, false)
  })
}

setInterval(init, 1500)
