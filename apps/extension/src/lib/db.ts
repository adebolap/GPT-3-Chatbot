import Dexie, { type Table } from "dexie"

export interface StoredConversation {
  id?: number
  url: string
  model: "chatgpt" | "claude" | "gemini" | "other"
  title: string
  firstMessage: string
  personaName: string
  startedAt: number
}

class CortexDB extends Dexie {
  conversations!: Table<StoredConversation>

  constructor() {
    super("cortex-v1")
    this.version(1).stores({
      conversations: "++id, model, startedAt",
    })
  }
}

export const db = new CortexDB()

export const saveConversation = (c: Omit<StoredConversation, "id">) =>
  db.conversations.add(c)

export const getRecent = (limit = 30) =>
  db.conversations.orderBy("startedAt").reverse().limit(limit).toArray()

export const searchConversations = (q: string) => {
  const term = q.toLowerCase()
  return db.conversations
    .filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.firstMessage.toLowerCase().includes(term)
    )
    .limit(30)
    .toArray()
}

export const getCount = () => db.conversations.count()
