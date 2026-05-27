import type { PlasmoCSConfig } from "plasmo"
import {
  getActivePersona,
  buildContextBlock,
  type Persona,
} from "../src/lib/personas"
import { saveConversation } from "../src/lib/db"
import { resolveAdapter } from "../src/adapters/sites"

export const config: PlasmoCSConfig = {
  matches: [
    "https://chatgpt.com/*",
    "https://claude.ai/*",
    "https://gemini.google.com/*",
  ],
  run_at: "document_idle",
}

type Model = "chatgpt" | "claude" | "gemini" | "other"
function getModel(): Model {
  const h = location.hostname
  if (h.includes("chatgpt.com")) return "chatgpt"
  if (h.includes("claude.ai")) return "claude"
  if (h.includes("gemini.google.com")) return "gemini"
  return "other"
}

// ── State ─────────────────────────────────────────────────────────────────────
const adapter = resolveAdapter()
let cachedPersona: Persona | null = null
let activeInput: HTMLElement | null = null
let badgeEl: HTMLDivElement | null = null
let injectedForUrl = ""
let savedForUrl = ""
let currentUrl = location.href

// Prevents our re-dispatched Enter from recursing back into handleSend
const submitting = new WeakSet<HTMLElement>()

async function refreshPersona() {
  cachedPersona = await getActivePersona()
  updateBadge()
}
refreshPersona()
chrome.storage.onChanged.addListener(refreshPersona)

// ── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
#cx-badge {
  position: fixed; bottom: 72px; right: 16px; z-index: 2147483646;
  background: #111827; color: #f9fafb;
  font-family: system-ui,-apple-system,sans-serif;
  font-size: 12px; font-weight: 500;
  padding: 5px 12px; border-radius: 20px;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,.25);
  cursor: default; user-select: none; transition: opacity .2s;
}
#cx-badge .dot { width:6px;height:6px;background:#4ade80;border-radius:50%; }
#cx-toast {
  position: fixed; bottom: 116px; right: 16px; z-index: 2147483647;
  background: #111827; color: #f9fafb;
  font-family: system-ui,-apple-system,sans-serif;
  font-size: 12px; padding: 7px 14px; border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
  animation: cx-in .2s ease;
}
#cx-toast.warn { background: #92400e; }
@keyframes cx-in { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
`

function injectStyles() {
  if (document.getElementById("cx-styles")) return
  const s = document.createElement("style")
  s.id = "cx-styles"
  s.textContent = CSS
  document.head?.appendChild(s)
}

function updateBadge() {
  if (!badgeEl) return
  const name = cachedPersona?.name ?? "No persona"
  badgeEl.innerHTML = `<span class="dot"></span><span>✦ ${name}</span>`
}

function ensureBadge() {
  if (badgeEl) return
  const div = document.createElement("div")
  div.id = "cx-badge"
  document.body.appendChild(div)
  badgeEl = div
  updateBadge()
}

function showToast(msg: string, warn = false) {
  document.getElementById("cx-toast")?.remove()
  const t = document.createElement("div")
  t.id = "cx-toast"
  t.className = warn ? "warn" : ""
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), warn ? 4000 : 2500)
}

// ── Verify the text was actually accepted by the editor ───────────────────────
async function verifyText(input: HTMLElement, expected: string): Promise<boolean> {
  // Give editor one microtask to process the input event
  await new Promise<void>((r) => setTimeout(r, 0))
  const actual = adapter.getPromptText(input)
  return actual.includes("[Contxt Context]") || actual === expected
}

// ── Re-fire Enter to actually submit the message ──────────────────────────────
function reSubmit(input: HTMLElement) {
  // Try KeyboardEvent first (works for most React/Vue editors)
  input.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter", code: "Enter", keyCode: 13, which: 13,
      bubbles: true, cancelable: true, composed: true,
    })
  )

  // Also try clicking the send button as a belt-and-suspenders fallback
  const btn = document.querySelector<HTMLElement>(
    '[data-testid="send-button"],[aria-label="Send message"],[aria-label="Send Message"],' +
    '[aria-label="Send"],[mattooltip="Send message"],.send-button'
  )
  btn?.click()
}

// ── Core send handler (async — intercept → inject → verify → resubmit) ───────
async function handleSend(input: HTMLElement, fromKeydown = false, originalEvent?: KeyboardEvent) {
  const text = adapter.getPromptText(input)
  if (!text.trim()) return

  // If called from keydown, intercept before the editor processes it
  if (fromKeydown && originalEvent) {
    originalEvent.preventDefault()
    originalEvent.stopImmediatePropagation()
  }

  try {
    // 1. Always record the conversation regardless of persona state
    if (savedForUrl !== location.href) {
      savedForUrl = location.href
      saveConversation({
        url: location.href,
        model: getModel(),
        title: text.slice(0, 100),
        firstMessage: text.slice(0, 500),
        personaName: cachedPersona?.name ?? "—",
        startedAt: Date.now(),
      }).catch(console.error)
    }

    // 2. Attempt persona context injection
    if (
      injectedForUrl !== location.href &&
      cachedPersona &&
      (cachedPersona.role || cachedPersona.context || cachedPersona.tone)
    ) {
      const enriched = buildContextBlock(cachedPersona) + text
      adapter.setPromptText(input, enriched)

      const ok = await verifyText(input, enriched)
      if (ok) {
        injectedForUrl = location.href
        showToast(`✦ ${cachedPersona.name} context active`)
      } else {
        // Injection was rejected by the editor — restore original text and warn
        adapter.setPromptText(input, text)
        showToast("⚠ Context blocked — sending original message", true)
      }
    }
  } finally {
    // 3. Always resubmit — message goes through regardless of injection outcome
    if (fromKeydown) {
      submitting.add(input)
      reSubmit(input)
      // Brief delay then clear the flag so future Enter presses work normally
      setTimeout(() => submitting.delete(input), 300)
    }
  }
}

// ── Submit hooks ──────────────────────────────────────────────────────────────
function watchInput(input: HTMLElement) {
  if ((input as any).__cx_watched) return
  ;(input as any).__cx_watched = true

  input.addEventListener(
    "keydown",
    (e) => {
      const ke = e as KeyboardEvent
      if (ke.key !== "Enter" || ke.shiftKey) return
      if (submitting.has(input)) return // our own re-dispatch — pass through
      handleSend(input, true, ke)
    },
    { capture: true }
  )
}

function watchSendButton() {
  const btn = document.querySelector<HTMLElement>(
    '[data-testid="send-button"],[aria-label="Send message"],[aria-label="Send Message"],' +
    '[aria-label="Send"],[mattooltip="Send message"],.send-button,button[type="submit"]'
  )
  if (!btn || (btn as any).__cx_watched) return
  ;(btn as any).__cx_watched = true
  // Button clicks don't need intercept/resubmit — injection is best-effort
  btn.addEventListener("click", () => activeInput && handleSend(activeInput), { capture: true })
}

// ── URL change detection (SPA) ────────────────────────────────────────────────
function checkUrlChange() {
  if (location.href !== currentUrl) {
    currentUrl = location.href
    injectedForUrl = ""
    savedForUrl = ""
    activeInput = null
  }
}

// ── Main loop ─────────────────────────────────────────────────────────────────
function init() {
  injectStyles()
  checkUrlChange()

  const input = adapter.detectInput()
  if (!input) return

  ensureBadge()

  if (input !== activeInput) {
    activeInput = input
    watchInput(input)
  }
  watchSendButton()
}

setInterval(init, 1500)
