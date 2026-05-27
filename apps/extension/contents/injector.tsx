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

// ── Model detection ───────────────────────────────────────────────────────────
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

// ── Persona cache ─────────────────────────────────────────────────────────────
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
@keyframes cx-in { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
`

function injectStyles() {
  if (document.getElementById("cx-styles")) return
  const s = document.createElement("style")
  s.id = "cx-styles"
  s.textContent = CSS
  document.head?.appendChild(s)
}

// ── Badge ─────────────────────────────────────────────────────────────────────
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

function showToast(msg: string) {
  document.getElementById("cx-toast")?.remove()
  const t = document.createElement("div")
  t.id = "cx-toast"
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 2500)
}

// ── Core: handle a send action ────────────────────────────────────────────────
function handleSend(input: HTMLElement) {
  const text = adapter.getPromptText(input)
  if (!text.trim()) return

  // 1. Always save the conversation on first send for this URL
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

  // 2. Inject persona context (only once per URL, only if persona has content)
  if (injectedForUrl === location.href) return
  if (!cachedPersona) return
  const { role, context, tone } = cachedPersona
  if (!role && !context && !tone) return

  const enriched = buildContextBlock(cachedPersona) + text
  adapter.setPromptText(input, enriched)
  injectedForUrl = location.href
  showToast(`✦ ${cachedPersona.name} context active`)
}

// ── Submit hooks ──────────────────────────────────────────────────────────────
function watchInput(input: HTMLElement) {
  if ((input as any).__cx_watched) return
  ;(input as any).__cx_watched = true

  input.addEventListener(
    "keydown",
    (e) => {
      if ((e as KeyboardEvent).key === "Enter" && !(e as KeyboardEvent).shiftKey) {
        handleSend(input)
      }
    },
    { capture: true }
  )
}

function watchSendButton() {
  const btn = document.querySelector<HTMLElement>(
    // ChatGPT
    '[data-testid="send-button"],' +
    // Claude
    '[aria-label="Send message"],[aria-label="Send Message"],' +
    // Gemini
    '[aria-label="Send"],.send-button,[mattooltip="Send message"],' +
    // Generic fallback
    'button[type="submit"]'
  )
  if (!btn || (btn as any).__cx_watched) return
  ;(btn as any).__cx_watched = true
  btn.addEventListener("click", () => activeInput && handleSend(activeInput), {
    capture: true,
  })
}

// ── URL change detection (SPA) ────────────────────────────────────────────────
function checkUrlChange() {
  if (location.href !== currentUrl) {
    currentUrl = location.href
    injectedForUrl = ""
    savedForUrl = ""
    // Re-watch new inputs on URL change
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
