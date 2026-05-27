"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"

const MODEL_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT", claude: "Claude", gemini: "Gemini", other: "Other",
}

interface Conversation {
  id: string
  model: string
  url: string
  title: string
  persona_name: string
  started_at: number
  synced_at: string
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const isPro = (user?.publicMetadata as any)?.plan === "pro"
  const [token, setToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const [tokenRes, convsRes] = await Promise.all([
      fetch("/api/sync-token").then((r) => r.json()),
      fetch("/api/conversations").then((r) => r.json()),
    ])
    setToken(tokenRes.token ?? null)
    setConversations(convsRes.conversations ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isLoaded && isPro) loadData()
    else if (isLoaded) setLoading(false)
  }, [isLoaded, isPro, loadData])

  const copyToken = () => {
    if (!token) return
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isLoaded) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
      <p style={{ color: "#9ca3af" }}>Loading…</p>
    </div>
  )

  if (!user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>Sign in to access your dashboard.</p>
        <Link href="/sign-in" style={{ background: "#111827", color: "#fff", padding: "10px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Sign in</Link>
      </div>
    </div>
  )

  if (!isPro) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Dashboard is Pro-only</h1>
        <p style={{ color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>Cloud sync, full history, and cross-device search are available on Contxt Pro.</p>
        <Link href="/billing" style={{ background: "#111827", color: "#fff", padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Upgrade to Pro — €49/yr</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,sans-serif" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #f3f4f6", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111827" }}>✦ Contxt</Link>
        <span style={{ fontSize: 12, background: "#f0fdf4", color: "#166534", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>Pro ✓</span>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 32px", letterSpacing: "-0.02em" }}>Dashboard</h1>

        {/* Sync token */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 28, marginBottom: 24, border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>Extension Sync Token</h2>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 16px", lineHeight: 1.5 }}>
            Paste this token in your Contxt extension (Memory tab → sync token field) to enable cloud backup.
          </p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <code style={{ flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontFamily: "monospace", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {loading ? "Loading…" : (token ?? "—")}
            </code>
            <button
              onClick={copyToken}
              disabled={!token}
              style={{ padding: "10px 20px", background: copied ? "#166534" : "#111827", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>

        {/* Conversation history */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Conversation History</h2>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>{conversations.length} conversations</span>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Loading…</div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 8px" }}>No conversations synced yet.</p>
              <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Add your sync token to the extension to start backing up your chats.</p>
            </div>
          ) : (
            <div>
              {conversations.map((conv, i) => (
                <a
                  key={conv.id}
                  href={conv.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 28px", borderBottom: i < conversations.length - 1 ? "1px solid #f3f4f6" : "none", textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: "#111827", fontWeight: 500, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.title || "Untitled conversation"}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                      {MODEL_LABELS[conv.model] ?? conv.model} · {conv.persona_name}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 16, flexShrink: 0 }}>{timeAgo(conv.started_at)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
