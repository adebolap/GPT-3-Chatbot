import type { ConversationMemory, Persona } from "@contxt/shared"
import { getDefaultPersona, saveConversation, saveDefaultPersona, searchConversations } from "./src/lib/db"


const broadcastPersonaUpdate = async (persona: Persona) => {
  const tabs = await chrome.tabs.query({ url: ["https://chatgpt.com/*", "https://claude.ai/*", "https://gemini.google.com/*"] })
  await Promise.allSettled(
    tabs
      .filter((tab) => typeof tab.id === "number")
      .map((tab) => chrome.tabs.sendMessage(tab.id!, { type: "contxt:persona-updated", payload: persona }))
  )
}

type RuntimeMessage =
  | { type: "contxt:get-persona" }
  | { type: "contxt:save-persona"; payload: { name: string; role: string; context: string; responseStyle: string } }
  | { type: "contxt:save-conversation"; payload: ConversationMemory }
  | { type: "contxt:search"; payload: { query: string } }

chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
  const run = async () => {
    switch (message.type) {
      case "contxt:get-persona":
        return getDefaultPersona()
      case "contxt:save-persona": {
        const persona = await saveDefaultPersona(message.payload)
        await broadcastPersonaUpdate(persona)
        return persona
      }
      case "contxt:save-conversation":
        return saveConversation(message.payload)
      case "contxt:search":
        return searchConversations(message.payload.query)
      default:
        throw new Error("Unknown Contxt message")
    }
  }

  run()
    .then((data) => sendResponse({ ok: true, data }))
    .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }))

  return true
})
