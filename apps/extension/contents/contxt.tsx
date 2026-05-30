import type { ConversationMemory, Persona } from "@contxt/shared"
import { DEFAULT_PERSONA, buildContextPrompt, hasInjectedContext } from "../src/lib/context"
import { resolveAdapter, resolveSite } from "../src/adapters/sites"

export const config = {
  matches: ["https://chatgpt.com/*", "https://claude.ai/*", "https://gemini.google.com/*"]
}

let activeInput: HTMLTextAreaElement | HTMLElement | null = null
let statusBadge: HTMLDivElement | null = null
let lastSavedPrompt = ""
let personaCache: Persona = DEFAULT_PERSONA
let documentClickBound = false
const watchedInputs = new WeakSet<HTMLTextAreaElement | HTMLElement>()

const sendMessage = async <T,>(message: unknown): Promise<T> => {
  const response = await chrome.runtime.sendMessage(message)
  if (!response?.ok) throw new Error(response?.error || "Contxt extension message failed")
  return response.data as T
}

const refreshPersona = async () => {
  personaCache = await sendMessage<Persona>({ type: "contxt:get-persona" })
}

const renderStatusBadge = (input: HTMLTextAreaElement | HTMLElement) => {
  statusBadge?.remove()
  const rect = input.getBoundingClientRect()
  statusBadge = document.createElement("div")
  statusBadge.textContent = "Contxt on"
  statusBadge.style.cssText = [
    "position:absolute",
    "z-index:9999",
    "font:12px/1.2 system-ui,sans-serif",
    "background:#111827",
    "color:#fff",
    "padding:6px 8px",
    "border-radius:999px",
    "box-shadow:0 6px 18px rgba(0,0,0,.18)",
    "pointer-events:none"
  ].join(";")
  statusBadge.style.top = `${window.scrollY + rect.top - 34}px`
  statusBadge.style.left = `${window.scrollX + rect.right - 82}px`
  document.body.appendChild(statusBadge)
}

const makeConversation = (firstUserMessage: string, injectedPrompt: string): ConversationMemory => {
  const now = new Date().toISOString()
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    site: resolveSite(),
    url: window.location.href,
    title: document.title,
    firstUserMessage,
    injectedPrompt,
    createdAt: now,
    updatedAt: now
  }
}

const injectContext = () => {
  const adapter = resolveAdapter()
  const input = adapter.detectInput()
  if (!input) return

  const draft = adapter.getPromptText(input).trim()
  if (!draft || hasInjectedContext(draft) || draft === lastSavedPrompt) return

  const injectedPrompt = buildContextPrompt(personaCache, draft)
  adapter.setPromptText(input, injectedPrompt)
  lastSavedPrompt = injectedPrompt

  void sendMessage({
    type: "contxt:save-conversation",
    payload: makeConversation(draft, injectedPrompt)
  })
}

const bindSubmitWatcher = (input: HTMLTextAreaElement | HTMLElement) => {
  if (!watchedInputs.has(input)) {
    watchedInputs.add(input)
    input.addEventListener(
      "keydown",
      (event) => {
        const keyboardEvent = event as KeyboardEvent
        if (keyboardEvent.key === "Enter" && !keyboardEvent.shiftKey) {
          injectContext()
        }
      },
      true
    )
  }

  if (!documentClickBound) {
    documentClickBound = true
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement | null
        if (target?.closest('button[type="submit"], button[aria-label*="Send" i], button[data-testid*="send" i]')) {
          injectContext()
        }
      },
      true
    )
  }
}

const init = () => {
  const adapter = resolveAdapter()
  const input = adapter.detectInput()
  if (!input) return

  if (activeInput !== input) {
    activeInput = input
    bindSubmitWatcher(input)
    renderStatusBadge(input)
  }
}

chrome.runtime.onMessage.addListener((message: { type?: string; payload?: Persona }) => {
  if (message.type === "contxt:persona-updated" && message.payload) {
    personaCache = message.payload
  }
})

void refreshPersona().catch((error) => console.warn("Contxt persona load failed", error))
setInterval(init, 1500)
