import Link from "next/link"

const ZIP_URL = "https://raw.githubusercontent.com/adebolap/GPT-3-Chatbot/main/apps/extension/build/chrome-mv3-prod.zip"

const STEPS = [
  {
    n: "1",
    title: "Download the extension",
    desc: "Download the ZIP file below and unzip it. You'll get a folder called chrome-mv3-prod.",
    action: { label: "Download Contxt.zip", href: ZIP_URL },
  },
  {
    n: "2",
    title: "Open your browser extensions",
    desc: 'In Chrome: go to chrome://extensions — In Edge: go to edge://extensions',
    mono: ["chrome://extensions", "edge://extensions"],
  },
  {
    n: "3",
    title: "Enable Developer mode",
    desc: "Toggle the Developer mode switch in the top-right corner of the extensions page.",
  },
  {
    n: "4",
    title: 'Click "Load unpacked"',
    desc: 'Click the "Load unpacked" button and select the chrome-mv3-prod folder you unzipped in step 1.',
  },
  {
    n: "5",
    title: "You're done!",
    desc: "The ✦ Contxt icon will appear in your browser toolbar. Click it to set up your first persona.",
  },
]

export default function InstallPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 16, textDecoration: "none", color: "#111827" }}>✦ Contxt</Link>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
          <h1 style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Install Contxt
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            Works on Chrome and Edge. Takes about 60 seconds.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              style={{
                display: "flex",
                gap: 20,
                padding: "24px 0",
                borderBottom: i < STEPS.length - 1 ? "1px solid #e5e7eb" : "none",
              }}
            >
              {/* Number bubble */}
              <div style={{ flex: "0 0 40px" }}>
                <div style={{
                  width: 40, height: 40,
                  background: i === STEPS.length - 1 ? "#7c3aed" : "#111827",
                  color: "#fff", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 16,
                }}>
                  {i === STEPS.length - 1 ? "✓" : step.n}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 8 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 600 }}>{step.title}</h2>
                <p style={{ margin: "0 0 12px", color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>

                {step.mono && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {step.mono.map((m) => (
                      <code
                        key={m}
                        style={{
                          background: "#f3f4f6", padding: "4px 10px", borderRadius: 6,
                          fontSize: 13, color: "#374151", fontFamily: "ui-monospace,monospace",
                        }}
                      >
                        {m}
                      </code>
                    ))}
                  </div>
                )}

                {step.action && (
                  <a
                    href={step.action.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "#111827", color: "#fff",
                      padding: "10px 20px", borderRadius: 10,
                      textDecoration: "none", fontSize: 14, fontWeight: 700,
                    }}
                  >
                    ↓ {step.action.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pro CTA */}
        <div style={{
          marginTop: 40, background: "#fff",
          borderRadius: 16, padding: 28,
          border: "1px solid #e5e7eb",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15 }}>Want unlimited personas + cloud sync?</p>
            <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Upgrade to Pro for €49/year — early-bird price.</p>
          </div>
          <Link
            href="/billing"
            style={{
              background: "#111827", color: "#fff",
              padding: "10px 22px", borderRadius: 10,
              textDecoration: "none", fontSize: 14, fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Get Pro →
          </Link>
        </div>

        {/* Troubleshoot */}
        <details style={{ marginTop: 24 }}>
          <summary style={{ cursor: "pointer", fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
            Having trouble installing?
          </summary>
          <div style={{ marginTop: 12, padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
            <p style={{ margin: "0 0 8px" }}><strong>The extension doesn't appear after loading:</strong> Make sure you selected the <em>chrome-mv3-prod</em> folder (the one containing manifest.json), not the ZIP file itself.</p>
            <p style={{ margin: "0 0 8px" }}><strong>Developer mode toggle is missing:</strong> You may be on a managed/enterprise device. Try a personal Chrome profile.</p>
            <p style={{ margin: 0 }}><strong>Still stuck?</strong> <a href="mailto:support@contxt.app" style={{ color: "#7c3aed" }}>Email support</a> and we'll help you out.</p>
          </div>
        </details>
      </div>
    </div>
  )
}
