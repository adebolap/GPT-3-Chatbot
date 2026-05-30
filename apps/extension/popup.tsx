import { useEffect, useMemo, useState } from "react"
import type { ConversationMemory, Persona } from "@contxt/shared"
import { DEFAULT_PERSONA } from "./src/lib/context"

const sendMessage = async <T,>(message: unknown): Promise<T> => {
  const response = await chrome.runtime.sendMessage(message)
  if (!response?.ok) throw new Error(response?.error || "Contxt extension message failed")
  return response.data as T
}

export default function Popup() {
  const [persona, setPersona] = useState<Persona>(DEFAULT_PERSONA)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ConversationMemory[]>([])
  const [status, setStatus] = useState("Ready")
  const webUrl = process.env.PLASMO_PUBLIC_WEB_URL || "http://localhost:3000"

  useEffect(() => {
    void sendMessage<Persona>({ type: "contxt:get-persona" }).then(setPersona)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      void sendMessage<ConversationMemory[]>({ type: "contxt:search", payload: { query } }).then(setResults)
    }, 150)
    return () => clearTimeout(timeout)
  }, [query])

  const canSave = useMemo(() => persona.role.trim() && persona.context.trim(), [persona])

  const savePersona = async () => {
    if (!canSave) return
    const saved = await sendMessage<Persona>({
      type: "contxt:save-persona",
      payload: {
        name: persona.name,
        role: persona.role,
        context: persona.context,
        responseStyle: persona.responseStyle
      }
    })
    setPersona(saved)
    setStatus("Persona saved")
  }

  return (
    <main style={{ width: 380, padding: 16, fontFamily: "Inter, system-ui, sans-serif", color: "#111827" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Contxt</h1>
        <p style={{ color: "#6b7280", margin: "6px 0 0" }}>Your AI memory layer.</p>
        <button onClick={() => chrome.tabs.create({ url: webUrl })} style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, marginTop: 10, padding: "8px 10px" }}>
          Sign in / manage Pro sync
        </button>
      </header>

      <section style={{ display: "grid", gap: 8 }}>
        <label>
          <span>Persona name</span>
          <input value={persona.name} onChange={(event) => setPersona({ ...persona, name: event.target.value })} style={{ width: "100%" }} />
        </label>
        <label>
          <span>Role</span>
          <input value={persona.role} onChange={(event) => setPersona({ ...persona, role: event.target.value })} style={{ width: "100%" }} />
        </label>
        <label>
          <span>Context</span>
          <textarea value={persona.context} onChange={(event) => setPersona({ ...persona, context: event.target.value })} rows={4} style={{ width: "100%" }} />
        </label>
        <label>
          <span>Response style</span>
          <textarea value={persona.responseStyle} onChange={(event) => setPersona({ ...persona, responseStyle: event.target.value })} rows={3} style={{ width: "100%" }} />
        </label>
        <button onClick={savePersona} disabled={!canSave} style={{ background: "#111827", color: "#fff", border: 0, borderRadius: 8, padding: "10px 12px" }}>
          Save persona
        </button>
        <small style={{ color: "#6b7280" }}>{status}</small>
      </section>

      <section style={{ borderTop: "1px solid #e5e7eb", marginTop: 18, paddingTop: 14 }}>
        <h2 style={{ fontSize: 16 }}>Search local memory</h2>
        <input placeholder="Search conversations..." value={query} onChange={(event) => setQuery(event.target.value)} style={{ width: "100%" }} />
        <div style={{ display: "grid", gap: 8, marginTop: 12, maxHeight: 260, overflow: "auto" }}>
          {results.map((item) => (
            <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 10 }}>
              <strong>{item.site}</strong>
              <p style={{ color: "#4b5563", margin: "6px 0" }}>{item.firstUserMessage.slice(0, 180)}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
