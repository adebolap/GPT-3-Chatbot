import type { Persona } from "@contxt/shared"

export const DEFAULT_PERSONA: Persona = {
  id: "default",
  name: "Default persona",
  role: "Helpful collaborator",
  context: "Use the user's known preferences and project context when relevant.",
  responseStyle: "Clear, concise, practical, and explicit about assumptions.",
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString()
}

export const buildContextPrompt = (persona: Persona, userMessage: string) => {
  const parts = [
    "[Contxt persona memory]",
    `Role: ${persona.role || DEFAULT_PERSONA.role}`,
    `Context: ${persona.context || DEFAULT_PERSONA.context}`,
    `Response style: ${persona.responseStyle || DEFAULT_PERSONA.responseStyle}`,
    "[/Contxt persona memory]",
    "",
    userMessage
  ]

  return parts.join("\n")
}

export const hasInjectedContext = (message: string) => message.includes("[Contxt persona memory]")
