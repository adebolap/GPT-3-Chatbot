import Dexie, { type Table } from "dexie"
import type { ConversationMemory, Persona } from "@contxt/shared"
import { DEFAULT_PERSONA } from "./context"

class ContxtDatabase extends Dexie {
  personas!: Table<Persona, string>
  conversations!: Table<ConversationMemory, string>

  constructor() {
    super("contxt-memory")
    this.version(1).stores({
      personas: "id, updatedAt",
      conversations: "id, site, createdAt, updatedAt, firstUserMessage, title"
    })
  }
}

export const db = new ContxtDatabase()

const FREE_LOCAL_HISTORY_DAYS = 90
const FREE_PERSONA_LIMIT = 3

const pruneExpiredConversations = async () => {
  const cutoff = new Date(Date.now() - FREE_LOCAL_HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString()
  await db.conversations.where("updatedAt").below(cutoff).delete()
}


export const getDefaultPersona = async () => {
  const persona = await db.personas.get("default")
  if (persona) return persona
  await db.personas.put(DEFAULT_PERSONA)
  return DEFAULT_PERSONA
}

export const saveDefaultPersona = async (persona: Omit<Persona, "id" | "createdAt" | "updatedAt">) => {
  const personaCount = await db.personas.count()
  if (personaCount >= FREE_PERSONA_LIMIT && !(await db.personas.get("default"))) {
    throw new Error("Free plan supports up to 3 personas")
  }

  const current = await getDefaultPersona()
  const now = new Date().toISOString()
  const next: Persona = {
    ...current,
    ...persona,
    id: "default",
    createdAt: current.createdAt || now,
    updatedAt: now
  }
  await db.personas.put(next)
  return next
}

export const saveConversation = async (conversation: ConversationMemory) => {
  await pruneExpiredConversations()
  await db.conversations.put(conversation)
  return conversation
}

export const searchConversations = async (query: string) => {
  await pruneExpiredConversations()
  const normalized = query.trim().toLowerCase()
  const rows = await db.conversations.orderBy("updatedAt").reverse().toArray()
  if (!normalized) return rows

  return rows.filter((row) =>
    [row.title, row.firstUserMessage, row.injectedPrompt, row.site, row.url]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  )
}
