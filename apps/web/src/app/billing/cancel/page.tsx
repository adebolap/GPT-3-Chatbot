import Link from "next/link"

export default function BillingCancel() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#f9fafb",
        fontFamily: "system-ui,sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 16 }}>✕</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
        Checkout cancelled
      </h1>
      <p style={{ color: "#6b7280", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 32px" }}>
        No charge was made. You can upgrade any time from the extension popup or the billing page.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link
          href="/billing"
          style={{
            background: "#111827",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          Try again
        </Link>
        <Link
          href="/"
          style={{
            background: "#f3f4f6",
            color: "#111827",
            padding: "12px 24px",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
