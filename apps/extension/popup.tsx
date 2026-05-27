import { useState, useEffect, useCallback } from "react"
import { ClerkProvider, SignInButton, UserButton, useUser } from "@clerk/chrome-extension"
import {
  getPersonas,
  savePersonas,
  getActivePersonaId,
  setActivePersonaId,
  makePersona,
  type Persona,
} from "./src/lib/personas"
import { getRecent, searchConversations, getCount, type StoredConversation } from "./src/lib/db"
import { getSyncToken, setSyncToken, clearSyncToken, syncConversations } from "./src/lib/api"

const WEB = process.env.PLASMO_PUBLIC_WEB_URL || "http://localhost:3000"
const CLERK_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""
const FREE_PERSONA_LIMIT = 3

// ── Styles ────────────────────────────────────────────────────────────────────
const c = {
  wrap: { width: 360, minHeight: 480, fontFamily: "system-ui,-apple-system,sans-serif", color: "#111827", fontSize: 14 } as React.CSSProperties,
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #f3f4f6" } as React.CSSProperties,
  logo: { fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 } as React.CSSProperties,
  pill: (active: boolean) => ({ padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: active ? "#111827" : "transparent", color: active ? "#fff" : "#6b7280", fontFamily: "inherit" }) as React.CSSProperties,
  tabs: { display: "flex", gap: 4, background: "#f9fafb", padding: "8px 16px", borderBottom: "1px solid #f3f4f6" } as React.CSSProperties,
  body: { padding: 16 } as React.CSSProperties,
  label: { display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 5 },
  input: { width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#111827", background: "#fff", boxSizing: "border-box" as const, outline: "none" } as React.CSSProperties,
  textarea: { width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#111827", background: "#fff", boxSizing: "border-box" as const, outline: "none", resize: "vertical" as const, minHeight: 72 } as React.CSSProperties,
  btn: (variant: "primary" | "ghost") => ({ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: "1px solid", background: variant === "primary" ? "#111827" : "transparent", color: variant === "primary" ? "#fff" : "#6b7280", borderColor: variant === "primary" ? "#111827" : "#e5e7eb" }) as React.CSSProperties,
  select: { width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#111827", background: "#fff", boxSizing: "border-box" as const } as React.CSSProperties,
  card: { background: "#f9fafb", borderRadius: 10, padding: "10px 12px", marginBottom: 8, cursor: "pointer" } as React.CSSProperties,
  row: { display: "flex", gap: 8, alignItems: "center" } as React.CSSProperties,
  footer: { borderTop: "1px solid #f3f4f6", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#9ca3af" } as React.CSSProperties,
}

// ── Persona Tab ───────────────────────────────────────────────────────────────
function PersonaTab() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Persona | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([getPersonas(), getActivePersonaId()]).then(([ps, id]) => {
      setPersonas(ps)
      const active = id ?? ps.find((p) => p.isDefault)?.id ?? ps[0]?.id ?? null
      setActiveId(active)
      setEditing(ps.find((p) => p.id === active) ?? ps[0] ?? null)
    })
  }, [])

  const atLimit = personas.length >= FREE_PERSONA_LIMIT

  const selectPersona = async (id: string) => {
    setActiveId(id)
    await setActivePersonaId(id)
    setEditing(personas.find((p) => p.id === id) ?? null)
  }

  const handleSave = async () => {
    if (!editing) return
    const updated = personas.map((p) => (p.id === editing.id ? editing : p))
    await savePersonas(updated)
    setPersonas(updated)
    if (editing.id) await setActivePersonaId(editing.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleNew = async () => {
    if (atLimit) return
    const p = makePersona({ name: "New Persona", isDefault: false })
    const updated = [...personas, p]
    await savePersonas(updated)
    setPersonas(updated)
    setEditing(p)
    setActiveId(p.id)
    await setActivePersonaId(p.id)
  }

  const handleDelete = async () => {
    if (!editing || personas.length <= 1) return
    const updated = personas.filter((p) => p.id !== editing.id)
    await savePersonas(updated)
    setPersonas(updated)
    const next = updated[0]
    setEditing(next)
    setActiveId(next.id)
    await setActivePersonaId(next.id)
  }

  const set = (field: keyof Persona) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditing((prev) => prev ? { ...prev, [field]: e.target.value } : prev)

  if (!editing) {
    return (
      <div style={c.body}>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>No personas yet.</p>
        <button style={c.btn("primary")} onClick={handleNew}>+ Create your first persona</button>
      </div>
    )
  }

  return (
    <div style={c.body}>
      {personas.length > 1 && (
        <div style={{ marginBottom: 14 }}>
          <label style={c.label}>Active persona</label>
          <select style={c.select} value={activeId ?? ""} onChange={(e) => selectPersona(e.target.value)}>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label style={c.label}>Persona name</label>
          <input style={c.input} value={editing.name} onChange={set("name")} placeholder="e.g. Developer, Analyst" />
        </div>
        <div>
          <label style={c.label}>Your role</label>
          <input style={c.input} value={editing.role} onChange={set("role")} placeholder="e.g. Senior React developer at a B2B SaaS startup" />
        </div>
        <div>
          <label style={c.label}>Context</label>
          <textarea style={c.textarea} value={editing.context} onChange={set("context")} placeholder="What you're working on, tech stack, constraints, goals…" />
        </div>
        <div>
          <label style={c.label}>Preferred response style</label>
          <input style={c.input} value={editing.tone} onChange={set("tone")} placeholder="e.g. Concise, with TypeScript code examples" />
        </div>
      </div>

      <div style={{ ...c.row, justifyContent: "space-between", marginTop: 14 }}>
        <button style={c.btn("ghost")} onClick={handleDelete} disabled={personas.length <= 1}>Delete</button>
        <div style={c.row}>
          {atLimit ? (
            <a
              href={`${WEB}/billing`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "#7c3aed", textDecoration: "none", fontWeight: 600, padding: "8px 12px", background: "#f5f3ff", borderRadius: 8 }}
            >
              Upgrade for more →
            </a>
          ) : (
            <button style={c.btn("ghost")} onClick={handleNew}>+ New</button>
          )}
          <button style={c.btn("primary")} onClick={handleSave}>{saved ? "Saved ✓" : "Save"}</button>
        </div>
      </div>

      {atLimit && (
        <div style={{ marginTop: 10, padding: "8px 12px", background: "#faf5ff", borderRadius: 8, fontSize: 12, color: "#7c3aed", border: "1px solid #e9d5ff" }}>
          Free plan: {FREE_PERSONA_LIMIT} personas max. <a href={`${WEB}/billing`} target="_blank" rel="noreferrer" style={{ color: "#7c3aed", fontWeight: 700 }}>Upgrade to Pro</a> for unlimited.
        </div>
      )}

      <div style={{ marginTop: 10, padding: "10px 12px", background: "#f0fdf4", borderRadius: 8, fontSize: 12, color: "#166534" }}>
        <strong>How it works:</strong> When you start a new chat on ChatGPT, Claude, or Gemini, Contxt silently prepends this context to your first message.
      </div>
    </div>
  )
}

// ── Memory Tab ────────────────────────────────────────────────────────────────
const MODEL_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT", claude: "Claude", gemini: "Gemini", other: "Other",
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function MemoryTab() {
  const [conversations, setConversations] = useState<StoredConversation[]>([])
  const [query, setQuery] = useState("")
  const [count, setCount] = useState(0)
  const [syncToken, setSyncTokenState] = useState<string | null>(null)
  const [tokenInput, setTokenInput] = useState("")
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done" | "error">("idle")

  const load = useCallback(async (q: string) => {
    const results = q.trim() ? await searchConversations(q) : await getRecent()
    setConversations(results)
  }, [])

  const doSync = useCallback(async () => {
    setSyncStatus("syncing")
    const convs = await getRecent(200)
    const result = await syncConversations(convs)
    setSyncStatus(result ? "done" : "error")
  }, [])

  useEffect(() => {
    load("")
    getCount().then(setCount)
    getSyncToken().then((t) => {
      setSyncTokenState(t)
      if (t) doSync()
    })
  }, [load, doSync])

  useEffect(() => {
    const t = setTimeout(() => load(query), 200)
    return () => clearTimeout(t)
  }, [query, load])

  const handleSaveToken = async () => {
    const t = tokenInput.trim()
    if (!t) return
    await setSyncToken(t)
    setSyncTokenState(t)
    setTokenInput("")
    doSync()
  }

  const handleRemoveToken = async () => {
    await clearSyncToken()
    setSyncTokenState(null)
    setSyncStatus("idle")
  }

  const syncLabel = syncStatus === "syncing" ? "Syncing…" : syncStatus === "done" ? "Synced ✓" : syncStatus === "error" ? "Sync failed" : ""

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6" }}>
        <input
          style={{ ...c.input, background: "#f9fafb" }}
          placeholder="Search your conversations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px" }}>
        {conversations.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", marginTop: 24 }}>
            {query ? "No results found." : "No conversations yet. Start chatting on any LLM!"}
          </p>
        ) : (
          conversations.map((conv) => (
            <a
              key={conv.id}
              href={conv.url}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", display: "block" }}
            >
              <div style={{ ...c.card, borderLeft: "3px solid #e5e7eb" }}>
                <div style={{ ...c.row, justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>
                    {MODEL_LABELS[conv.model]}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>{timeAgo(conv.startedAt)}</span>
                </div>
                <div style={{ fontSize: 13, color: "#111827", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                  {conv.title}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>✦ {conv.personaName}</div>
              </div>
            </a>
          ))
        )}
      </div>

      {/* Cloud sync section */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
        {syncToken ? (
          <div style={{ ...c.row, justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: syncStatus === "error" ? "#dc2626" : "#166534" }}>
              ☁ {syncLabel || "Cloud sync active"}
            </span>
            <div style={c.row}>
              <button onClick={doSync} style={{ fontSize: 11, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Sync now</button>
              <button onClick={handleRemoveToken} style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 6 }}>
            <input
              style={{ ...c.input, fontSize: 12, flex: 1 }}
              placeholder="Paste sync token from dashboard…"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveToken()}
            />
            <button style={{ ...c.btn("primary"), padding: "6px 12px", fontSize: 12 }} onClick={handleSaveToken}>Save</button>
          </div>
        )}
      </div>

      <div style={c.footer}>
        <span>{count} conversation{count !== 1 ? "s" : ""} saved locally</span>
        <a href={`${WEB}/dashboard`} target="_blank" rel="noreferrer" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
          Dashboard →
        </a>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
function HeaderAuthClerk() {
  const { isSignedIn } = useUser()
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="redirect">
          <button style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "none", border: "1px solid #e5e7eb", padding: "3px 10px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit" }}>
            Sign in
          </button>
        </SignInButton>
      )}
      <a
        href={`${WEB}/billing`}
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", textDecoration: "none", background: "#f5f3ff", padding: "3px 10px", borderRadius: 20 }}
      >
        Get Pro
      </a>
    </div>
  )
}

function HeaderAuth() {
  if (!CLERK_KEY) return null
  return <HeaderAuthClerk />
}

function PopupInner() {
  const [tab, setTab] = useState<"persona" | "memory">("persona")

  return (
    <div style={c.wrap}>
      <div style={c.header}>
        <div style={c.logo}>✦ Contxt</div>
        <HeaderAuth /></div>

      <div style={c.tabs}>
        <button style={c.pill(tab === "persona")} onClick={() => setTab("persona")}>Persona</button>
        <button style={c.pill(tab === "memory")} onClick={() => setTab("memory")}>Memory</button>
      </div>

      {tab === "persona" ? <PersonaTab /> : <MemoryTab />}
    </div>
  )
}

export default function Popup() {
  if (!CLERK_KEY) {
    return <PopupInner />
  }
  return (
    <ClerkProvider publishableKey={CLERK_KEY} routerPush={(to) => { window.location.href = to }} routerReplace={(to) => { window.location.replace(to) }}>
      <PopupInner />
    </ClerkProvider>
  )
}
