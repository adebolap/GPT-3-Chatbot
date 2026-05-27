export interface Persona {
  id: string
  name: string
  role: string
  context: string
  tone: string
  isDefault: boolean
  createdAt: number
}

const PERSONAS_KEY = "contxt_personas"
const ACTIVE_KEY = "contxt_active_persona"

function get<T>(key: string): Promise<T | null> {
  return new Promise((resolve) =>
    chrome.storage.local.get([key], (r) => resolve(r[key] ?? null))
  )
}
function set(key: string, value: unknown): Promise<void> {
  return new Promise((resolve) =>
    chrome.storage.local.set({ [key]: value }, resolve)
  )
}

export const getPersonas = (): Promise<Persona[]> =>
  get<Persona[]>(PERSONAS_KEY).then((v) => v ?? [])

export const savePersonas = (p: Persona[]) => set(PERSONAS_KEY, p)

export const getActivePersonaId = () => get<string>(ACTIVE_KEY)

export const setActivePersonaId = (id: string) => set(ACTIVE_KEY, id)

export async function getActivePersona(): Promise<Persona | null> {
  const [personas, activeId] = await Promise.all([
    getPersonas(),
    getActivePersonaId(),
  ])
  if (!personas.length) return null
  return (
    personas.find((p) => p.id === activeId) ??
    personas.find((p) => p.isDefault) ??
    personas[0]
  )
}

export function buildContextBlock(p: Persona): string {
  const lines = ["[Contxt Context]"]
  if (p.role) lines.push(`Role: ${p.role}`)
  if (p.context) lines.push(`Context: ${p.context}`)
  if (p.tone) lines.push(`Response style: ${p.tone}`)
  lines.push("[/Contxt Context]", "")
  return lines.join("\n")
}

export function makePersona(overrides: Partial<Persona> = {}): Persona {
  return {
    id: crypto.randomUUID(),
    name: "Default",
    role: "",
    context: "",
    tone: "",
    isDefault: true,
    createdAt: Date.now(),
    ...overrides,
  }
}
