export interface Persona {
  id: string
  name: string
  role: string
  context: string
  responseStyle: string
  createdAt: string
  updatedAt: string
}

export interface ConversationMemory {
  id: string
  site: "chatgpt" | "claude" | "gemini" | "generic"
  url: string
  title?: string
  firstUserMessage: string
  injectedPrompt: string
  createdAt: string
  updatedAt: string
}

export interface MemorySearchResult extends ConversationMemory {
  matchedText: string
}

export interface SubscriptionEntitlements {
  plan: "free" | "pro"
  personaLimit: number | "unlimited"
  localHistoryDays: number | "unlimited"
  cloudSync: boolean
}
