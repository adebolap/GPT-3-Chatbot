import { useState, useEffect } from "react"
import { fetchUsage, fetchMe } from "./src/lib/api"
import { getDefaultMode, setDefaultMode } from "./src/lib/storage"
import type { UsageInfo, UserProfile, RefinementMode } from "@promptrefiner/shared/src/types"

const MODES: Array<{ value: RefinementMode; label: string }> = [
  { value: "default", label: "Default" },
  { value: "professional", label: "Professional" },
  { value: "accuracy-first", label: "Accuracy-first" },
  { value: "technical-coding", label: "Technical/Coding" },
  { value: "marketing", label: "Marketing" },
  { value: "shorter", label: "Shorter" },
  { value: "deep-research", label: "Deep Research" },
]

const WEB_URL = process.env.PLASMO_PUBLIC_WEB_URL || "http://localhost:3000"

const S = {
  wrap: {
    width: 300,
    padding: 20,
    fontFamily: "system-ui,-apple-system,sans-serif",
    color: "#111827",
  } as React.CSSProperties,
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
    paddingBottom: 14,
    borderBottom: "1px solid #f3f4f6",
  } as React.CSSProperties,
  logo: { fontSize: 22 } as React.CSSProperties,
  name: { fontWeight: 700, fontSize: 15, margin: 0 } as React.CSSProperties,
  plan: { fontSize: 11, color: "#6b7280", margin: 0 } as React.CSSProperties,
  card: {
    background: "#f9fafb",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 12,
  } as React.CSSProperties,
  cardLabel: { fontSize: 11, color: "#9ca3af", marginBottom: 4 } as React.CSSProperties,
  usageNum: { fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 8 } as React.CSSProperties,
  bar: { height: 4, background: "#e5e7eb", borderRadius: 2 } as React.CSSProperties,
  barFill: (pct: number) =>
    ({
      height: "100%",
      width: `${pct}%`,
      background: pct >= 90 ? "#ef4444" : "#111827",
      borderRadius: 2,
      transition: "width 0.3s",
    }) as React.CSSProperties,
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: 6,
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#111827",
    background: "#fff",
    marginBottom: 14,
  } as React.CSSProperties,
  cta: {
    display: "block",
    width: "100%",
    padding: "11px 16px",
    background: "#111827",
    color: "#fff",
    borderRadius: 10,
    textAlign: "center" as const,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  footer: {
    textAlign: "center" as const,
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  } as React.CSSProperties,
}

export default function Popup() {
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [defaultMode, setMode] = useState<string>("default")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchUsage().catch(() => null),
      fetchMe().catch(() => null),
      getDefaultMode(),
    ]).then(([u, me, mode]) => {
      setUsage(u)
      setUser(me)
      setMode(mode)
      setLoading(false)
    })
  }, [])

  const handleModeChange = async (mode: string) => {
    setMode(mode)
    setSaving(true)
    await setDefaultMode(mode)
    setSaving(false)
  }

  const isPro = user?.plan === "pro"
  const count = usage?.refinement_count ?? 0
  const limit = usage?.free_limit ?? 10
  const pct = isPro ? 0 : Math.min(100, (count / limit) * 100)

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={S.logo}>✦</div>
        <div>
          <p style={S.name}>PromptRefiner</p>
          <p style={S.plan}>{loading ? "Loading…" : isPro ? "Pro Plan ✓" : "Free Plan"}</p>
        </div>
      </div>

      {!loading && (
        <>
          <div style={S.card}>
            <div style={S.cardLabel}>Refinements this month</div>
            <div style={S.usageNum}>
              {count}
              {!isPro && (
                <span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 400 }}> / {limit}</span>
              )}
              {isPro && (
                <span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 400 }}> (unlimited)</span>
              )}
            </div>
            {!isPro && (
              <div style={S.bar}>
                <div style={S.barFill(pct)} />
              </div>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Default refinement mode</label>
            <select
              style={S.select}
              value={defaultMode}
              onChange={(e) => handleModeChange(e.target.value)}
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {saving && (
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: -10 }}>Saved.</div>
            )}
          </div>

          {!isPro && (
            <a style={S.cta} href={`${WEB_URL}/billing`} target="_blank" rel="noreferrer">
              Upgrade to Pro →
            </a>
          )}
        </>
      )}

      <div style={S.footer}>
        {user?.email ? (
          <span>{user.email}</span>
        ) : (
          <a
            href={`${WEB_URL}/login`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#6b7280" }}
          >
            Sign in for Pro features
          </a>
        )}
      </div>
    </div>
  )
}
