import Link from "next/link"

export default function BillingSuccess() {
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
      <div style={{ fontSize: 52, marginBottom: 16 }}>✦</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
        Welcome to Pro!
      </h1>
      <p style={{ color: "#6b7280", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 32px" }}>
        Your subscription is active. Reload the extension popup to see your updated plan.
      </p>
      <Link
        href="/"
        style={{
          background: "#111827",
          color: "#fff",
          padding: "12px 28px",
          borderRadius: 10,
          textDecoration: "none",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        Back to home
      </Link>
    </div>
  )
}
