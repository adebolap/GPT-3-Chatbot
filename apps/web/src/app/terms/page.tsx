import Link from "next/link"

export const metadata = { title: "Terms of Service — Contxt" }

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px", fontFamily: "system-ui,sans-serif", color: "#111827", lineHeight: 1.7 }}>
      <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontSize: 14 }}>← Back</Link>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "24px 0 8px", letterSpacing: "-0.02em" }}>Terms of Service</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>Last updated: June 2025</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>1. Acceptance of Terms</h2>
      <p>By accessing or using Contxt ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>2. Description of Service</h2>
      <p>Contxt is a browser extension and web application that injects user-defined persona context into AI chat interfaces (ChatGPT, Claude, Gemini, and others) and stores conversation memory locally. A Pro subscription adds cloud sync and cross-device history.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>3. Subscriptions and Billing</h2>
      <p>The Contxt Pro plan is billed annually at €49/year. Payments are processed by Lemon Squeezy. You may cancel at any time; access continues until the end of the paid period. No refunds are issued for partial periods unless required by applicable law.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>4. Acceptable Use</h2>
      <p>You may not use Contxt to violate any law, infringe third-party rights, or interfere with the operation of AI platforms in ways that violate their own terms of service. You are responsible for the persona content you configure.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>5. Intellectual Property</h2>
      <p>Contxt and its original content, features, and functionality are owned by the operator and protected by applicable intellectual property laws. You retain ownership of any persona or content you create.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>6. Disclaimer of Warranties</h2>
      <p>The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability or that the extension will work with all AI platforms at all times, as those platforms may change their interfaces.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>7. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, Contxt shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>8. Changes to Terms</h2>
      <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "32px 0 8px" }}>9. Contact</h2>
      <p>For questions about these terms, contact us at <a href="mailto:seunfemiadebola@gmail.com" style={{ color: "#7c3aed" }}>seunfemiadebola@gmail.com</a>.</p>
    </div>
  )
}
